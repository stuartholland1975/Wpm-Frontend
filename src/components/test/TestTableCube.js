import cubejs from '@cubejs-client/core';
import { QueryRenderer } from '@cubejs-client/react';
import { Spin } from 'antd';
import React from 'react';
import { Bar } from 'react-chartjs-2';

const COLORS_SERIES = ['#7A77FF','#FF6492', '#141446' ];

const barRender = ({resultSet: {categories, series}}) => {
	const data = {
		labels: categories().map(c => c.category),
		datasets: series().map((s, index) => (
			{
				label: s.title,
				data: s.series.map(r => r.value),
				backgroundColor: COLORS_SERIES[index],
				fill: false
			}
		)),
	};
	const options = {
		scales: {xAxes: [{stacked: true}]},
		title: {display: true, text: "CHART"}
	};
	return <Bar data={ data } options={ options }/>;
};

const API_URL = "http://localhost:4000"; // change to your actual endpoint

const cubejsApi = cubejs(
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDc2MTIyNDUsImV4cCI6MTYwNzY5ODY0NX0.op1BZoM9r_LHGwKYl_xcUCXIKFvP7OpQQswcHQ_lEI0",
	{apiUrl: API_URL + "/cubejs-api/v1"}
);

const renderChart = (Component, pivotConfig) => ({resultSet, error}) => {
	return (
		(resultSet && (
			<Component
				resultSet={ resultSet }
				pivotConfig={ pivotConfig }
			/>
		)) ||
		(error && error.toString()) || <Spin/>
	);
};

const ChartRenderer = () => {

	return (
		<QueryRenderer
			query={ {
				"measures": [
					"WorkOrdersOrderheader.orderValue"
				],
				"timeDimensions": [],
				"order": {
					"WorkOrdersOrderheader.orderValue": "desc"
				},
				"dimensions": [
					"WorkOrdersOrderheader.projectTitle"
				],
				"filters": [
					{
						"dimension": "WorkOrdersArea.areaDescription",
						"operator": "equals",
						"values": [
							"North"
						]
					}
				]
			} }
			cubejsApi={ cubejsApi }
			render={ renderChart(
				barRender,
				{
					"x": [
						"WorkOrdersOrderheader.projectTitle"
					],
					"y": [
						"measures"
					],
					"fillMissingDates": true,
					"joinDateRange": false
				}
			) }
		/>
	);
};

export default ChartRenderer;
