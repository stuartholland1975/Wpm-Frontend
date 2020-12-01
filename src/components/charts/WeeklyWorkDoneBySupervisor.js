import React from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, } from "recharts";
import { WeeklyWorkBySupervisor } from "../../services/selectors";

const numFormatGrid = (value) => {
	return value.toLocaleString(undefined, {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	});
};

const WeeklyWorkDoneBySupervisor = () => {

	const data = useSelector(WeeklyWorkBySupervisor);
	const week_number = data.map(item => item.week)[0];

	return (
		<Card>
			<Card.Body>
				<Card.Title>
					<h5 style={ {textAlign: "center"} }>Work Done By Supervisor Week { week_number }</h5>
				</Card.Title>
				<ResponsiveContainer height={ 350 } width="100%">
					<BarChart
						data={ data }
						margin={ {
							top: 5,
							right: 30,
							left: 20,
							bottom: 5,
						} }
					>
						<CartesianGrid strokeDasharray="3 3"/>
						<XAxis dataKey="supervisor"/>
						<YAxis/>
						<Tooltip formatter={ (value, name, props) => numFormatGrid(value) }/>
						{/* <Legend /> */ }
						<Bar dataKey="value" fill="hsl(180, 20%, 50%)"/>

					</BarChart>
				</ResponsiveContainer>
			</Card.Body>
		</Card>
	);
};

export default WeeklyWorkDoneBySupervisor;
