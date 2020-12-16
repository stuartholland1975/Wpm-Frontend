import Grid from "@material-ui/core/Grid";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { unwrapResult } from "@reduxjs/toolkit";
import { useConfirm } from "material-ui-confirm";
import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Loader from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useEffectOnce } from "react-use";
import {
  removeAllRecentWorksheets,
  selectAllRecentWorksheets,
} from "../../../services/data/WorksheetData";
import {
  fetchWeeklyWorksheets,
  fetchWorkDoneWeeks,
} from "../../../services/thunks";
import { BlueButton } from "../../ui-components/Buttons";
import WorkLoadCharts from "./WorkloadCharts";
import WorkloadSummary from "../WorkloadSummary";
import moment from "moment";
import { Divider } from "@react-md/divider";

function getFirstDateOfWeek(w, y) {
  let date = new Date(y, 0, 1 + (w - 1) * 7); // Elle's method
  date.setDate(date.getDate() + (1 - date.getDay())); // 0 - Sunday, 1 - Monday etc
  return moment(date).startOf("isoWeek").format("DD/MM/YYYY");
}

const Workload = (props) => {
  const dispatch = useDispatch();
  const [year, setYear] = useState(null);
  const [week, setWeek] = useState(null);
  const [workDoneWeeks, setWorkDoneWeeks] = useState([]);
  const worksheets = useSelector(selectAllRecentWorksheets);
  const isLoading = useSelector((state) => state.worksheetsRecent.loading);
  const confirm = useConfirm();

  const numFormatGrid = (value) => {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };
  useEffectOnce(() => {
    dispatch(fetchWorkDoneWeeks())
      .then(unwrapResult)
      .then((result) => setWorkDoneWeeks(result))
      .catch((error) => console.log(error));
    return () => dispatch(removeAllRecentWorksheets());
  });

  const totalValue = worksheets
    .map((item) => item.value_complete)
    .reduce((acc, item) => acc + item, 0);

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

  const weekCommencingDate = getFirstDateOfWeek(week, year);

  const handleRetrieveData = () => {
    if (week && year) {
      dispatch(fetchWeeklyWorksheets({ week: week, year: year }));
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
            }}
            onOpen={() => dispatch(removeAllRecentWorksheets())}
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
            onOpen={() => dispatch(removeAllRecentWorksheets())}
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
      {worksheets.length > 0 && !isLoading && <Divider />}

      {worksheets.length > 0 && !isLoading && (
        <Row>
          <Col
            style={{
              marginTop: "10px",
              textAlign: "center",
            }}
          >
            <h5
              style={{ fontWeight: "bold" }}
            >{`Week Commencing ${weekCommencingDate}`}</h5>
          </Col>
          <Col
            style={{
              marginTop: "10px",
              textAlign: "center",
            }}
          >
            <h5
              style={{ fontWeight: "bold" }}
            >{`Week ${week} Year ${year}`}</h5>
          </Col>
          <Col
            style={{
              marginTop: "10px",
              textAlign: "center",
            }}
          >
            <h5 style={{ fontWeight: "bold" }}>
              Weekly Value {numFormatGrid(totalValue)}
            </h5>
          </Col>
        </Row>
      )}
      {worksheets.length > 0 && !isLoading && <Divider />}
      {worksheets.length > 0 && !isLoading && <WorkLoadCharts yearSelection={year} weekSelection={week}/>}

      {!worksheets.length > 0 && !isLoading && (
        <>
          <Divider />
          <h1 style={{ textAlign: "center" }}>SELECT A TIME PERIOD</h1>
          <Divider />
        </>
      )}
      {isLoading && (
        <>
          <Divider />
          <Loader
            style={{ textAlign: "center" }}
            type={"Grid"}
            color="#660066"
            height={100}
            width={100}
          />
          <Divider />
        </>
      )}
    </Container>
  );
};
export default Workload;
