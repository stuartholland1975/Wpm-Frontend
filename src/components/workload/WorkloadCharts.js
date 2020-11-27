import Box from "@material-ui/core/Box";
import moment from "moment";
import React from "react";
import { Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { useEffectOnce } from "react-use";
import { selectAllRecentWorksheets } from "../../services/data/WorksheetData";
import { fetchRecentWorksheets } from "../../services/thunks";

const WorkloadCharts = (props) => {
	const dispatch = useDispatch();

	const recentWorksheets = useSelector(selectAllRecentWorksheets);

	useEffectOnce(() => {
		dispatch(fetchRecentWorksheets(moment().add(-100, "days").format("YYYY-MM-DD")));

	});

	let weekNumbers = [...new Set(recentWorksheets.map(item => item["week_number"]).sort())];
	weekNumbers.pop();
	weekNumbers.shift();
	const weeklyValue = weekNumbers.map(item => recentWorksheets.filter(obj => obj["week_number"] === item).map(sheet => sheet.value_complete).reduce((acc, item) => acc + item, 0) / 1000);
	const data = {
		labels: weekNumbers,
		datasets: [
			{
				label: "Worksheet Value",
				data: weeklyValue,
				backgroundColor:
					"hsl(180, 20%, 50%)",
				borderColor:
					"hsl(180, 20%, 25%)",
				borderWidth: 2,
			},
		],
	};

	const options = {
		maintainAspectRatio: true,

		title: {
			display: true,
			text: "Work Done by Week Number",
			fontSize: 20,
		},
		scales: {
			yAxes: [
				{
					ticks: {
						beginAtZero: true,
					},
				},
			],
		},
	};
	return (
		<div>
			<Box display="flex" flexDirection="column" alignItems="stretch" padding={ 1 } width="33%">
				<Bar data={ data } options={ options }
				/>
			</Box>
		</div>);
};

export default WorkloadCharts;