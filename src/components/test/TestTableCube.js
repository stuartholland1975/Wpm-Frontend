import React from 'react';
import cubejs from '@cubejs-client/core';
import { QueryRenderer } from '@cubejs-client/react';
import { Spin } from 'antd';
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
  Line
} from "recharts";

const CartesianChart = ({ resultSet, children, ChartComponent }) => (
  <ResponsiveContainer width="100%" height={350}>
    <ChartComponent data={resultSet.chartPivot()}>
      <XAxis dataKey="x" />
      <YAxis />
      <CartesianGrid />
      { children }
      <Legend />
      <Tooltip />
    </ChartComponent>
  </ResponsiveContainer>
)

const colors = ['#FF6492', '#141446', '#7A77FF'];

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

const API_URL = "http://192.168.0.4:4000"; // change to your actual endpoint

const cubejsApi = cubejs(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDc0Mjk1NTQsImV4cCI6MTYwNzUxNTk1NH0.rNhp76ONr4Od7tgG9PYMyOilly69k6trk6iqX5Q4czk",
  { apiUrl: API_URL + "/cubejs-api/v1" }
);

const renderChart = (Component, pivotConfig) => ({ resultSet, error }) => {
  return (
    (resultSet && (
      <Component
        resultSet={resultSet}
        pivotConfig={pivotConfig}
      />
    )) ||
    (error && error.toString()) || <Spin />
  );
};

const ChartRenderer = () => {
  
  return (
    <QueryRenderer
      query={{
    "dimensions": [],
    "timeDimensions": [
      {
        "dimension": "WorkOrdersWorksheet.dateWorkDone",
        "granularity": "month",
        "dateRange": "This year"
      }
    ],
    "order": {},
    "measures": [
      "WorkOrdersWorksheet.count"
    ]
  }}
      cubejsApi={cubejsApi}
      render={renderChart(
        barRender,
        {
    "x": [
      "WorkOrdersWorksheet.dateWorkDone.month"
    ],
    "y": [
      "measures"
    ],
    "fillMissingDates": true,
    "joinDateRange": false
  }
      )}
    />
  );
};

export default ChartRenderer;
