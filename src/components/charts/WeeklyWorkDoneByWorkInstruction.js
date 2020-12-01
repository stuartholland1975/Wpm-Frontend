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

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          <h6 style={{ textAlign: "center" }}>
            Work Done By Work Instruction Week {week_number}
          </h6>
        </Card.Title>
        <ResponsiveContainer height={375} width="100%">
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
            <XAxis dataKey="work_instruction" />
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