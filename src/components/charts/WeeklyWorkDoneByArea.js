import React from "react";
import cubejs from "@cubejs-client/core";
import { QueryRenderer } from "@cubejs-client/react";
import { Spin } from "antd";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Card } from "react-bootstrap";
import Color from "color";

function generateRandomColor() {
  var randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
  return randomColor;
  //random color will be freshly served
}

const barRender = ({ resultSet }) => {
  const data = {
    labels: resultSet.categories().map((c) => c.category),
    datasets: resultSet.series().map((s, index) => ({
      label: s.title,
      data: s.series.map((r) => r.value),
      //backgroundColor: s.series.map((element) => generateRandomColor()),
      backgroundColor: "#366363",
      fill: false,
    })),
  };
  const options = {
    scales: {
      xAxes: [{ stacked: true }],
      yAxes: [{ ticks: { beginAtZero: "true" } }],
    },
    maintainAspectRatio: false,
    legend: { display: false },
  };
  return <Bar data={data} options={options} height={400} />;
};

const API_URL = "http://192.168.0.4:4000"; // change to your actual endpoint

const cubejsApi = cubejs(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDgwODkwMjQsImV4cCI6MTYwODE3NTQyNH0.U0xOpvADZE0toX3alJs6naLFxeXYVc9DrdqdWUKNWwM",
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
      <Card.Title
        style={{ textAlign: "center", fontWeight: "bold", marginTop: 10 }}
      >
        Weekly Value By Area
      </Card.Title>
      <Card.Body>
        <QueryRenderer
          query={{
            dimensions: ["Area.areaDescription"],
            order: {
              "Area.areaDescription": "asc",
            },
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
          })}
        />
      </Card.Body>
    </Card>
  );
};

export default ChartRenderer;
