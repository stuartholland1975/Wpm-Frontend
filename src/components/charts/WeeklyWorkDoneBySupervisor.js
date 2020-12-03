import React from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { WeeklyWorkBySupervisor } from "../../services/selectors";

const numFormatGrid = (value) => {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const WeeklyWorkDoneBySupervisor = () => {
  const data = useSelector(WeeklyWorkBySupervisor);
  const week_number = data.map((item) => item.week)[0];
  const year_number = data.map((item) => item.year)[0];

  return (
    <Card>
      <Card.Body>
        <Card.Title style={{ textAlign: "center", fontWeight: "bold" }}>
          Weekly Value By Supervisor
        </Card.Title>
        <ResponsiveContainer height={375} width="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 15,
            }} 
            scaleToFit={true}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="supervisor" label={{ value: 'Supervisor', position: 'bottom', offset: 0 }}/>
            <YAxis />
            <Tooltip formatter={(value, name, props) => numFormatGrid(value)} />
            {/* <Legend /> */}
            <Bar dataKey="value" fill="hsl(180, 50%, 15%)" />
          </BarChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
};

export default WeeklyWorkDoneBySupervisor;
