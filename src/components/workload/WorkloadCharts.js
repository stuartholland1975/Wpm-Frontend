import React from "react";
import { CardDeck } from "react-bootstrap";
import WeeklyWorkDoneByArea from "../charts/WeeklyWorkDoneByArea";
import WeeklyWorkDoneBySupervisor from "../charts/WeeklyWorkDoneBySupervisor";
import WeeklyWorkDoneByWorkInstruction from "../charts/WeeklyWorkDoneByWorkInstruction";
import WeeklyWorkDoneByWorkType from "../charts/WeeklyWorkDoneByWorkType";

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
