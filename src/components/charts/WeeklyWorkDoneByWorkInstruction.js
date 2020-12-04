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
import { WeeklyWorkByWorkInstruction } from "../../services/selectors";

const numFormatGrid = (value) => {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const WeeklyWorkDoneByWorkInstruction = () => {
  const data = useSelector(WeeklyWorkByWorkInstruction);
  const week_number = data.map((item) => item.week)[0];
  const year_number = data.map((item) => item.year)[0];

  return (
    <Card>
      <Card.Body>
        <Card.Title style={{ textAlign: "center", fontWeight: "bold" }}>
          Weekly Value By Work Instruction
        </Card.Title>
        <ResponsiveContainer height={375} width="100%">
          <BarChart
             data={data}
             margin={{
               top: 0,
               right: 0,
               left: 0,
               bottom: 15,
             }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="work_instruction" label={{ value: 'Work Instruction', position: 'bottom', offset: 0 }} />
            <YAxis />
            <Tooltip formatter={(value, name, props) => numFormatGrid(value)} />
            {/* <Legend /> */}
            <Bar dataKey="value" fill="hsl(0, 0%, 25%)" />
          </BarChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
};

export default WeeklyWorkDoneByWorkInstruction;
