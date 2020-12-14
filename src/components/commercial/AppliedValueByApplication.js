import React from "react";
import cubejs from "@cubejs-client/core";
import { QueryRenderer } from "@cubejs-client/react";
import { Spin } from "antd";
import { Line, Bar, Pie } from "react-chartjs-2";

const COLORS_SERIES = ["#366363", "#141446", "#7A77FF"];

const barRender = ({ resultSet }) => {
  const data = {
    labels: resultSet.categories().map((c) => c.category),
    datasets: resultSet.series().map((s, index) => ({
      label: s.title,
      data: s.series.map((r) => r.value),
      backgroundColor: COLORS_SERIES[index],
      fill: false,
    })),
  };
  const options = {
    scales: { xAxes: [{ stacked: true }] },
  };
  return <Bar data={data} options={options} />;
};

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

const ChartRenderer = () => {
  return (
    <QueryRenderer
      query={{
        dimensions: ["Application.appRef"],
        timeDimensions: [],
        order: {
          "Application.appRef": "asc",
        },
        measures: ["Application.appliedValue"],
        filters: [],
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

export default ChartRenderer;
