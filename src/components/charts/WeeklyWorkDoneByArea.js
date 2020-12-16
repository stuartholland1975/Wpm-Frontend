import React from "react";
import cubejs from "@cubejs-client/core";
import { QueryRenderer } from "@cubejs-client/react";
import { Spin } from "antd";
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
import { Card } from "react-bootstrap";

const CartesianChart = ({ resultSet, children, ChartComponent }) => (
  <ResponsiveContainer height={375} width="100%">
    <ChartComponent
      data={resultSet.chartPivot()}
      margin={{
        top: 0,
        right: 0,
        left: 0,
        bottom: 15,
      }}
    >
      <XAxis
        dataKey="x"
        label={{ value: "Area", position: "bottom", offset: 0 }}
      />
      <YAxis />
      <CartesianGrid />
      {children}
      {/* <Legend /> */}
      <Tooltip />
    </ChartComponent>
  </ResponsiveContainer>
);

const colors = ["#FF6492", "#141446", "#7A77FF"];

const barRender = ({ resultSet }) => (
  <CartesianChart resultSet={resultSet} ChartComponent={BarChart}>
    {resultSet.seriesNames().map((series, i) => (
      <Bar
        //  key={series.key}
        //  stackId="a"
        dataKey={series.key}
        //  name={series.title}
        fill="hsl(235, 94%, 25%)"
      />
    ))}
  </CartesianChart>
);

const API_URL = "http://localhost:4000"; // change to your actual endpoint

const cubejsApi = cubejs(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDc5MDQzMjcsImV4cCI6MTYwNzk5MDcyN30.7SoHaX1YSfn0-9mBTpSDy58VjrHcVj1yI8I-1KzowkA",
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

const ChartRenderer = (props) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title style={{ textAlign: "center", fontWeight: "bold" }}>
          Weekly Value By Area
        </Card.Title>
        <QueryRenderer
          query={{
            dimensions: ["Area.areaDescription"],
            timeDimensions: [],
            order: {},
            measures: ["Worksheet.valueComplete"],
            filters: [
              {
                dimension: "Worksheet.isoYear",
                operator: "equals",
                values: [props.year.toString()],
              },
              {
                dimension: "Worksheet.isoWeek",
                operator: "equals",
                values: [props.week.toString()],
              },
            ],
          }}
          cubejsApi={cubejsApi}
          render={renderChart(barRender, {
            x: [],
            y: ["Area.areaDescription", "measures"],
            fillMissingDates: true,
            joinDateRange: false,
          })}
        />
      </Card.Body>
    </Card>
  );
};

export default ChartRenderer;
