import React from "react";
import cubejs from "@cubejs-client/core";
import { QueryRenderer } from "@cubejs-client/react";
import { Spin } from "antd";
import { Line, Bar, Pie } from "react-chartjs-2";

const COLORS_SERIES = ["#141446", "#FF6492", "#7A77FF"];

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
    title: { display: true, text: "Work Complete By Week Number", fontSize: 20 },
    scales: { xAxes: [{ stacked: true }] },
    legend: {display: false}
  };
  return <Bar data={data} options={options} />;
};

const API_URL = "http://localhost:4000"; // change to your actual endpoint

const cubejsApi = cubejs(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDc2NDIwNjcsImV4cCI6MTYwNzcyODQ2N30.ePO10niarzVA08444lqvJO4Br3NzRwXPSRvN5UV2V34",
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
        measures: ["Worksheet.valueComplete"],
        timeDimensions: [],
        order: {
          "Worksheet.isoDate": "asc",
        },
        dimensions: ["Worksheet.isoDate"],
        segments: [],
      }}
      cubejsApi={cubejsApi}
      render={renderChart(barRender, {
        x: ["Worksheet.isoDate"],
        y: ["measures"],
        fillMissingDates: true,
        joinDateRange: false,
      })}
    />
  );
};

export default ChartRenderer;
