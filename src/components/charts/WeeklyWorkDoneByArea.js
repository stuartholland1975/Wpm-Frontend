import Box from "@material-ui/core/Box";
import moment from "moment";
import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffectOnce } from "react-use";
import { selectAllRecentWorksheets } from "../../services/data/WorksheetData";
import { selectAllAreas } from "../../services/data/areaData";
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
import { WeeklyWorkChartData } from "../../services/selectors";

const numFormatGrid = (value) => {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const WeeklyWorkDoneByArea = () => {
  
  const data = useSelector(WeeklyWorkChartData);
  const week_number = data.map(item => item.week)[0]

  return (
    <Card>
      <Card.Body>
        <Card.Title>
  <h5 style={{ textAlign: "center" }}>Work Done By Area Week {week_number}</h5>
        </Card.Title>
        <ResponsiveContainer height={350} width="100%">
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
            <XAxis dataKey="area_name" />
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

export default WeeklyWorkDoneByArea;
