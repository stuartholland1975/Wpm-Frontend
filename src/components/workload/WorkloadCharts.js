import React from "react";
import { CardDeck } from "react-bootstrap";
import WeeklyWorkDoneByArea from "../charts/WeeklyWorkDoneByArea_copy";
import WeeklyWorkDoneBySupervisor from "../charts/WeeklyWorkDoneBySupervisor_copy";
import WeeklyWorkDoneByWorkInstruction from "../charts/WeeklyWorkDoneByWorkInstruction_copy";
import WeeklyWorkDoneByWorkType from "../charts/WeeklyWorkDoneByWorkType_copy";

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
