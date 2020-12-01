import React from "react";
import { Container } from "react-bootstrap";
import WorkDoneChart from "../charts/WorkDoneChart";
import WorkloadCharts from "./WorkloadCharts";
import WorkloadSummary from "./WorkloadSummary";


const Workload = (props) => {

	return (
		<Container fluid>
			<WorkloadSummary/>
			<hr/>
			<WorkloadCharts/>
			
			
		</Container>
		
	);
};
export default Workload;