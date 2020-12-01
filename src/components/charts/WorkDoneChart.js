import Box from "@material-ui/core/Box";
import moment from "moment";
import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffectOnce } from "react-use";
import { selectAllRecentWorksheets } from "../../services/data/WorksheetData";
import { fetchRecentWorksheets } from "../../services/thunks";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  Label,
  ResponsiveContainer,
} from "recharts";
import { Card, Col, Row, CardDeck, Container } from "react-bootstrap";
import { createSelector } from "@reduxjs/toolkit";

function getDateOfWeek(w, y) {
  let date = new Date(y, 0, 1 + (w - 1) * 7); // Elle's method
  date.setDate(date.getDate() + (1 - date.getDay())); // 0 - Sunday, 1 - Monday etc
  return moment(date).format("DD/MM/YYYY");
}

const numFormatGrid = (value) => {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const chartData = createSelector([selectAllRecentWorksheets], (worksheets) => {
  let weekList = [
    ...new Set(worksheets.map((item) => item["iso_week_number"]).sort()),
  ];
  weekList.pop();
  weekList.shift();
  return weekList.map((item) => ({
    week: [item][0],
    date: getDateOfWeek(item, "2020"),
    value: worksheets
      .filter((obj) => obj["iso_week_number"] === item)
      .map((sheet) => sheet.value_complete)
      .reduce((acc, item) => acc + item, 0),
  }));
});

const WorkDoneChart = () => {
  const dispatch = useDispatch();

  const data = useSelector(chartData);

  useEffectOnce(() => {
    dispatch(
      fetchRecentWorksheets(moment().add(-120, "days").format("YYYY-MM-DD"))
    );
  });

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          <h5 style={{ textAlign: "center" }}>Work Done By Week number</h5>
        </Card.Title>
        <ResponsiveContainer height={400} width="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date"  />
            <YAxis />
            <Tooltip formatter={(value, name, props) => numFormatGrid(value)} />
            {/* <Legend /> */}
            <Bar dataKey="value" fill="hsl(180, 20%, 50%)" />
          </BarChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
};

export default WorkDoneChart;
