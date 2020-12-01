import React from "react";
import { Bar, Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { useEffectOnce } from "react-use";
import { selectAllRecentWorksheets } from "../../services/data/WorksheetData";
import { fetchRecentWorksheets } from "../../services/thunks";
import WorkDoneChart from "../charts/WorkDoneChart";
import { Card, Col, Row, CardDeck, Container } from "react-bootstrap";

const WorkLoadCharts = (props) => {
  return (
    <CardDeck>
      <WorkDoneChart />
      <WorkDoneChart />
    </CardDeck>
  );
};

export default WorkLoadCharts;
