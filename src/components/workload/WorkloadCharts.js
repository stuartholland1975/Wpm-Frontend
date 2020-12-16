import React from "react";
import { CardDeck } from "react-bootstrap";
import WeeklyWorkDoneByArea from "../charts/WeeklyWorkDoneByArea2";
import WeeklyWorkDoneBySupervisor from "../charts/WeeklyWorkDoneBySupervisor2";
// import WeeklyWorkDoneByWorkInstruction from "../charts/WeeklyWorkDoneByWorkInstruction";
import WeeklyWorkDoneByWorkInstruction from "../charts/WeeklyWorkDoneByWorkInstruction2";
import WeeklyWorkDoneByWorkType from "../charts/WeeklyWorkDoneByWorkType2";

const WorkLoadCharts = (props) => {
	return (
    <CardDeck>
      <WeeklyWorkDoneByArea
        week={props.weekSelection}
        year={props.yearSelection}
      />
      <WeeklyWorkDoneBySupervisor
        week={props.weekSelection}
        year={props.yearSelection}
      />
      <WeeklyWorkDoneByWorkInstruction
        week={props.weekSelection}
        year={props.yearSelection}
      />
      <WeeklyWorkDoneByWorkType
        week={props.weekSelection}
        year={props.yearSelection}
      />
    </CardDeck>
  );
};

export default WorkLoadCharts;
