import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { unwrapResult } from "@reduxjs/toolkit";
import moment from "moment";
import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffectOnce } from "react-use";
import {
  fetchWeeklyWorksheets,
  fetchWorkDoneWeeks,
} from "../../services/thunks";
import { BlueButton } from "../ui-components/Buttons";
import WorkLoadCharts from "./WorkloadCharts";
import WorkloadSummary from "./WorkloadSummary";
import {
  removeAllRecentWorksheets,
  selectAllRecentWorksheets,
} from "../../services/data/WorksheetData";
import Loader from "react-loader-spinner";
import { useConfirm } from "material-ui-confirm";
import Slide from "@material-ui/core/Slide";

const Workload = (props) => {
  const dispatch = useDispatch();
  const [year, setYear] = useState(null);
  const [week, setWeek] = useState(null);
  const [workDoneWeeks, setWorkDoneWeeks] = useState([]);
  const worksheets = useSelector(selectAllRecentWorksheets);
  const isLoading = useSelector((state) => state.worksheetsRecent.loading);
  const confirm = useConfirm();

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
      <hr />
      <Grid
        container
        spacing={2}
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Grid item xs>
          <Autocomplete
            options={years}
            getOptionLabel={(option) => option}
            onChange={(event, newValue) => {
              setYear(newValue);
              setWeek(null);
            }}
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
        </Grid>
        <Grid item xs>
          <Autocomplete
            options={weeks}
            getOptionLabel={(option) => option}
            onChange={(event, newValue) => {
              setWeek(newValue);
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
        </Grid>
        <Grid item xs>
          <BlueButton
            onClick={handleRetrieveData}
            fullWidth
            style={{ height: 55 }}
          >
            RETRIEVE DATA
          </BlueButton>
        </Grid>
      </Grid>
      <hr />
      {worksheets.length > 0 && !isLoading && <WorkLoadCharts />}
      {isLoading && (
        <Loader
          style={{ textAlign: "center" }}
          type={"ThreeDots"}
          color="#366363"
        />
      )}
      {!worksheets.length > 0 && !isLoading && (
        <h1 style={{ textAlign: "center" }}>SELECT A TIME PERIOD</h1>
      )}
    </Container>
  );
};
export default Workload;
