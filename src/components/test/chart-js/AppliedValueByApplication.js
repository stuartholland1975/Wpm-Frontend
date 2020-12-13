import React from "react";
import cubejs from "@cubejs-client/core";
import { QueryRenderer } from "@cubejs-client/react";
import { Spin } from "antd";
import {Card} from "react-bootstrap";
import {
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";

const CartesianChart = ({ resultSet, children, ChartComponent }) => (
  <ResponsiveContainer height={400} width={"50%"}>
    <ChartComponent data={resultSet.chartPivot()}>
      <XAxis dataKey="x" />
      <YAxis />
      <CartesianGrid />
      {children}
      <Legend />
      <Tooltip />
    </ChartComponent>
  </ResponsiveContainer>
);

const colors = ["#FF6492", "#141446", "#7A77FF"];

const barRender = ({ resultSet }) => (
  <CartesianChart resultSet={resultSet} ChartComponent={BarChart}>
    {resultSet.seriesNames().map((series, i) => (
      <Bar
        key={series.key}
        stackId="a"
        dataKey={series.key}
        name={series.title}
        fill={colors[i]}
      />
    ))}
  </CartesianChart>
);

const API_URL = "http://localhost:4000"; // change to your actual endpoint

const cubejsApi = cubejs(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDc2NjI1OTgsImV4cCI6MTYwNzc0ODk5OH0.WUAVdie3I1LgV-1ma6WNfec2BlHm7FkwzJuxhsKbThY",
  { apiUrl: API_URL + "/cubejs-api/v1" }
);

const renderChart = (Component, pivotConfig) => ({ resultSet, error }) => {
  return (
    (resultSet && (
      <Component resultSet={resultSet} pivotConfig={pivotConfig} />
    )) ||
    (error && error.toString()) || <Spin />
  );
};

const AppliedByApplication = () => {
  return (
    <QueryRenderer
      query={{
        measures: ["Application.appliedValue"],
        timeDimensions: [],
        order: {
          "Application.appRef": "asc",
        },
        dimensions: ["Application.appRef"],
        filters: [],
        segments: [],
      }}
      cubejsApi={cubejsApi}
      render={renderChart(barRender, {
        x: ["Application.appRef"],
        y: ["measures"],
        fillMissingDates: true,
        joinDateRange: false,
      })}
    />
  );
};

export default AppliedByApplication;
