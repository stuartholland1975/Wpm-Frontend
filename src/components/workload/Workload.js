import React, { useState } from "react";
import { Container, Row } from "react-bootstrap";
import Grid from "@material-ui/core/Grid";
import WorkDoneChart from "../charts/WeeklyWorkDoneByArea";
import WorkloadCharts from "./WorkloadCharts";
import WorkloadSummary from "./WorkloadSummary";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Button from "@material-ui/core/Button";
import moment from "moment";
import { BlueButton, GreyButton } from "../ui-components/Buttons";
import { workloadchartData } from "../../services/selectors";
import { useDispatch } from "react-redux";
import { fetchWeeklyWorksheets } from "../../services/thunks";
import WorkLoadCharts from "./WorkloadCharts";

const Workload = (props) => {
  const years = ["2019", "2020", "2021"];
  const weeks = [...Array(52).keys()].map((i) => (i + 1).toString());
  const dispatch = useDispatch();
  const [year, setYear] = useState(moment().format("YYYY"));
  const [week, setWeek] = useState(moment().format("W"));

  const handleRetrieveData = () => {
    dispatch(fetchWeeklyWorksheets(week));
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
            defaultValue={year}
            onChange={(event, newValue) => {
              setYear(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="filled"
                InputLabelProps={{ shrink: true }}
                label="Year"
                margin="normal"
              />
            )}
          />
        </Grid>
        <Grid item xs>
          <Autocomplete
            options={weeks}
            getOptionLabel={(option) => option}
            defaultValue={week}
            onChange={(event, newValue) => {
              setWeek(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="filled"
                InputLabelProps={{ shrink: true }}
                label="Week Number"
                margin="normal"
              />
            )}
          />
        </Grid>
        <Grid item xs>
          <BlueButton
            onClick={handleRetrieveData}
            fullWidth
            // style={{ width: 100 }}
          >
            RETRIEVE DATA
          </BlueButton>
        </Grid>
      </Grid>
      <hr />
      <WorkLoadCharts />
    </Container>
  );
};
export default Workload;
