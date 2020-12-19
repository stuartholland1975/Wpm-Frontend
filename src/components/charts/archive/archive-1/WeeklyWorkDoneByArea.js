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
import { WeeklyWorkByArea } from "../../../../services/selectors";

const numFormatGrid = (value) => {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const WeeklyWorkDoneByArea = () => {
  const data = useSelector(WeeklyWorkByArea);
  const week_number = data.map((item) => item.week)[0];
  const year_number = data.map((item) => item.year)[0];

  return (
    <Card>
      <Card.Body>
        <Card.Title style={{ textAlign: "center", fontWeight: "bold" }}>
          Weekly Value By Area
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
            <XAxis dataKey="area_name" label={{ value: 'Area', position: 'bottom', offset: 0 }} />
            <YAxis />
            <Tooltip formatter={(value, name, props) => numFormatGrid(value)} />
            {/* <Legend /> */}
            <Bar
              dataKey="value"
              fill="hsl(235, 94%, 25%)"
              
              //  onClick={(event) => alert(JSON.stringify(event.payload))}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
};

export default WeeklyWorkDoneByArea;
