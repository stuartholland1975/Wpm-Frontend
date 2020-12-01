import React from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, } from "recharts";
import { WeeklyWorkByWorkType } from "../../services/selectors";

const numFormatGrid = (value) => {
	return value.toLocaleString(undefined, {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	});
};

const WeeklyWorkDoneByWorkType = () => {

	const data = useSelector(WeeklyWorkByWorkType);
	const week_number = data.map(item => item.week)[0];
	const year_number = data.map((item) => item.year)[0];

	return (
		<Card>
			<Card.Body>
				<Card.Title>
					<h6 style={ {textAlign: "center"} }>Work Done By Work Type Week { week_number } {year_number}</h6>
				</Card.Title>
				<ResponsiveContainer height={ 375 } width="100%">
					<BarChart
						data={ data }
						margin={ {
							top: 5,
							right: 30,
							left: 20,
							bottom: 5,
						} }
						scaleToFit={ true }
					>
						<CartesianGrid strokeDasharray="3 3"/>
						<XAxis dataKey="workType"/>
						<YAxis/>
						<Tooltip formatter={ (value, name, props) => numFormatGrid(value) }/>
						{/* <Legend /> */ }
						<Bar dataKey="value" fill="hsl(300, 79%, 11%)"/>

					</BarChart>
				</ResponsiveContainer>
			</Card.Body>
		</Card>
	);
};

export default WeeklyWorkDoneByWorkType;
