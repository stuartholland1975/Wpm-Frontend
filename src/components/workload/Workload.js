import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { unwrapResult } from "@reduxjs/toolkit";
import { useConfirm } from "material-ui-confirm";
import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffectOnce } from "react-use";
import {
  removeAllRecentWorksheets,
  selectAllRecentWorksheets,
} from "../../services/data/WorksheetData";
import { fetchWorkDoneWeeks } from "../../services/thunks";
import { BlueButton } from "../ui-components/Buttons";
import WorkLoadCharts from "./WorkloadCharts";
import WorkloadSummary from "./WorkloadSummary";
import moment from "moment";
import { Divider } from "@react-md/divider";
import cubejs from "@cubejs-client/core";
import { QueryRenderer } from "@cubejs-client/react";
import { Spin } from "antd";


const numberRender = ({ resultSet }) => (
    <Col style={{ marginTop: "10px", textAlign: "center" }}>
  <h5 style={{fontWeight: "bold"}}>
    {"Weekly Value "}{" "}
    {resultSet.seriesNames().map((s) => resultSet.totalRow()[s.key]).toLocaleString({minimumFractionDigits: 2})}
  </h5></Col>
);

const API_URL = "http://localhost:4000"; // change to your actual endpoint

const cubejsApi = cubejs(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDc5MTE5NTgsImV4cCI6MTYwNzk5ODM1OH0.00rOD0rbAnNQvJlPL32t5PIZtv1qXUWJA0f7H465zZE",
  { apiUrl: API_URL + "/cubejs-api/v1" }
);

const renderChart = (Component, pivotConfig) => ({ resultSet, error }) => {
  return (
    (resultSet && (
      <Component resultSet={resultSet} pivotConfig={pivotConfig} />
    )) ||
    (error && error.toString()) || <Spin />
  );
};



function getFirstDateOfWeek(w, y) {
  let date = new Date(y, 0, 1 + (w - 1) * 7); // Elle's method
  date.setDate(date.getDate() + (1 - date.getDay())); // 0 - Sunday, 1 - Monday etc
  return moment(date).startOf("isoWeek").format("DD/MM/YYYY");
}

const Workload = () => {
  const dispatch = useDispatch();
  const [year, setYear] = useState(null);
  const [week, setWeek] = useState(null);
  const [workDoneWeeks, setWorkDoneWeeks] = useState([]);
  const [cubeWeek, setCubeWeek] = useState(false);
  const [cubeYear, setCubeYear] = useState(false);
  const confirm = useConfirm();

  const WeeklyValue = () => {
    return (
      <QueryRenderer
        query={{
          measures: ["Worksheet.valueComplete"],
          timeDimensions: [],
          order: {},
          dimensions: [],
          filters: [
            {
              dimension: "Worksheet.isoYear",
              operator: "equals",
              values: [cubeYear.toString()],
            },
            {
              dimension: "Worksheet.isoWeek",
              operator: "equals",
              values: [cubeWeek.toString()],
            },
          ],
        }}
        cubejsApi={cubejsApi}
        render={renderChart(numberRender, {
          x: [],
          y: ["measures"],
          fillMissingDates: true,
          joinDateRange: false,
        })}
      />
    );
  };

  useEffectOnce(() => {
    dispatch(fetchWorkDoneWeeks())
      .then(unwrapResult)
      .then((result) => setWorkDoneWeeks(result))
      .catch((error) => console.log(error));
    return () => dispatch(removeAllRecentWorksheets());
  });

  const weeks = [
    ...new Set(
      workDoneWeeks
        .filter((obj) => obj["iso_year"] === Number(year))
        .map((item) => item["iso_week"].toString())
    ),
  ].reverse();
  const years = [
    ...new Set(workDoneWeeks.map((item) => item["iso_year"].toString())),
  ]
    .sort()
    .reverse();

  const weekCommencingDate = getFirstDateOfWeek(cubeWeek, cubeYear);

  const handleRetrieveData = () => {
    if (week && year) {
      setCubeWeek(week);
      setCubeYear(year);
    } else {
      confirm({
        title: "PLEASE SELECT A TIME PERIOD",
        confirmationButtonProps: {
          variant: "contained",
          autoFocus: true,
        },
        cancellationButtonProps: {
          disabled: true,
          hidden: true,
        },
        dialogProps: {
          TransitionComponent: Slide,
          disableBackdropClick: true,
        },
      }).then((r) => console.log(r));
    }
  };
  return (
    <Container fluid>
      <WorkloadSummary />
      <Divider />
      <Row className="justify-content-md-center">
        <Col item xs>
          <Autocomplete
            options={years}
            getOptionLabel={(option) => option}
            onChange={(event, newValue) => {
              setYear(newValue);
              setWeek(null);
              setCubeWeek(null);
            }}
            onOpen={() => {
              dispatch(removeAllRecentWorksheets());
              setCubeYear(null);
              setCubeWeek(null);
            }}
            disableClearable={true}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="filled"
                InputLabelProps={{ shrink: true }}
                label="Year"
                //margin="normal"
              />
            )}
          />
        </Col>
        <Col item xs>
          <Autocomplete
            options={weeks}
            getOptionLabel={(option) => option}
            onChange={(event, newValue) => {
              setWeek(newValue);
            }}
            disableClearable={true}
            onOpen={() => {
              dispatch(removeAllRecentWorksheets());
              setCubeWeek(null);
            }}
            value={week}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="filled"
                InputLabelProps={{ shrink: true }}
                label="Week Number"
                //margin="normal"
              />
            )}
          />
        </Col>
        <Col item xs>
          <BlueButton
            onClick={handleRetrieveData}
            fullWidth
            style={{ height: 55 }}
          >
            RETRIEVE DATA
          </BlueButton>
        </Col>
      </Row>
      {cubeWeek && cubeYear && <Divider />}
      {cubeWeek && cubeYear && (
        <Row>
          <Col style={{ marginTop: "10px", textAlign: "center" }}>
            <h5
              style={{ fontWeight: "bold" }}
            >{`Week Commencing ${weekCommencingDate}`}</h5>
          </Col>
          <Col style={{ marginTop: "10px", textAlign: "center" }}>
            <h5
              style={{ fontWeight: "bold" }}
            >{`Week ${cubeWeek} Year ${cubeYear}`}</h5>
          </Col>
          
            <WeeklyValue />
          
        </Row>
      )}
      {cubeWeek && cubeYear && <Divider />}
      {cubeWeek && cubeYear && (
        <WorkLoadCharts yearSelection={cubeYear} weekSelection={cubeWeek} />
      )}
      {!cubeWeek && (
        <>
          <Divider />
          <h1 style={{ textAlign: "center" }}>SELECT A TIME PERIOD</h1>
          <Divider />
        </>
      )}
    </Container>
  );
};
export default Workload;
