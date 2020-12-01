import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { unwrapResult } from "@reduxjs/toolkit";
import moment from "moment";
import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useEffectOnce } from "react-use";
import { fetchWeeklyWorksheets, fetchWorkDoneWeeks } from "../../services/thunks";
import { BlueButton } from "../ui-components/Buttons";
import WorkLoadCharts from "./WorkloadCharts";
import WorkloadSummary from "./WorkloadSummary";

const Workload = (props) => {
		//	const years = ["2019", "2020", "2021"];
		//const weeks = [...Array(52).keys()].map((i) => (i + 1).toString());
		const dispatch = useDispatch();
		const [year, setYear] = useState(moment().format("YYYY"));
		const [week, setWeek] = useState(moment().format("W"));
		const [workDoneWeeks, setWorkDoneWeeks] = useState([]);

		useEffectOnce(() => {

			dispatch(fetchWorkDoneWeeks()).then(unwrapResult).then(result => setWorkDoneWeeks(result)).catch(error => console.log(error));
		});

		//const weeks = [...new Set(workDoneWeeks.map(item => item.iso_week.toString()))].reverse();
		const weeks = [...new Set(workDoneWeeks.filter(obj => obj.iso_year == year).map(item => item.iso_week.toString()))].reverse();
		const years = [...new Set(workDoneWeeks.map(item => item.iso_year.toString()))].sort().reverse();


		const handleRetrieveData = () => {
			dispatch(fetchWeeklyWorksheets({week: week, year: year}));
		};
		return (
			<Container fluid>
				<WorkloadSummary/>
				<hr/>
				<Grid
					container
					spacing={ 2 }
					direction="row"
					justify="center"
					alignItems="center"
				>
					<Grid item xs>
						<Autocomplete
							options={ years }
							getOptionLabel={ (option) => option }
							onChange={ (event, newValue) => {
								setYear(newValue);
							} }
							renderInput={ (params) => (
								<TextField
									{ ...params }
									variant="filled"
									InputLabelProps={ {shrink: true} }
									label="Year"
									margin="normal"
								/>
							) }
						/>
					</Grid>
					<Grid item xs>
						<Autocomplete
							options={ weeks }
							getOptionLabel={ (option) => option }
							onChange={ (event, newValue) => {
								setWeek(newValue);
							} }
							renderInput={ (params) => (
								<TextField
									{ ...params }
									variant="filled"
									InputLabelProps={ {shrink: true} }
									label="Week Number"
									margin="normal"
								/>
							) }
						/>
					</Grid>
					<Grid item xs>
						<BlueButton
							onClick={ handleRetrieveData }
							fullWidth
							// style={{ width: 100 }}
						>
							RETRIEVE DATA
						</BlueButton>
					</Grid>
				</Grid>
				<hr/>
				<WorkLoadCharts/>
			</Container>
		);
	}
;
export default Workload;
