import React from "react";
import { CardDeck } from "react-bootstrap";
import WeeklyWorkDoneByArea from "../charts/WeeklyWorkDoneByArea";
import WeeklyWorkDoneBySupervisor from "../charts/WeeklyWorkDoneBySupervisor";
import WeeklyWorkDoneByWorkInstruction from "../charts/WeeklyWorkDoneByWorkInstruction";

const WorkLoadCharts = (props) => {
	return (
		<CardDeck>
			<WeeklyWorkDoneByArea/>
			<WeeklyWorkDoneBySupervisor/>
			<WeeklyWorkDoneByWorkInstruction/>
		</CardDeck>
	);
};

export default WorkLoadCharts;
