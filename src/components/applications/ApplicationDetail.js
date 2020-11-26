import React from "react";
import Container from "react-bootstrap/Container";
import { CSVDownload } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffectOnce } from "react-use";
import { selectAllApplications } from "../../services/data/ApplicationData";
import { resetApplicationDetails, } from "../../services/data/ApplicationDetailsData";
import { fetchAppDetails } from "../../services/thunks";
import ApplicationBillItems from "./ApplicationBillItems";
import ApplicationInstructionList from "./ApplicationInstructionsList";
import ApplicationLocations from "./ApplicationLocations";

const numFormat = (num) => {
	return num.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};

const camelCase = str => {
	return str.substring(0, 1).toUpperCase() + str.substring(1);
};

const filterColumns = data => {
	// Get column names
	const columns = Object.keys(data[0]);
	let headers = [];
	columns.forEach((col) => {
		if (col !== "id") {
			// OR if (idx !== 0)
			headers.push({label: camelCase(col), key: col});
		}
	});
	return headers;
};


const ApplicationDetail = () => {
	const appItems = useSelector((state) => state.applicationDetail.items);
	const applications = useSelector(selectAllApplications);

	const {appId} = useParams();
	const exportDataFlag = useSelector(
		(state) => state.applicationDetail.exportData
	);
	const {orders} = useSelector(
		(state) => state.applicationDetail
	);
	const appValue = numFormat(
		applications
			.filter((obj) => obj.app_number == appId).map(item => item["application_value"])
			.reduce((acc, item) => acc + item, 0)
	);
	const dispatch = useDispatch();
	const params = useParams();

	useEffectOnce(() => {
		dispatch(fetchAppDetails(params["appId"]));

		return () => {
			dispatch(resetApplicationDetails());

		};
	});

	return (
		<Container fluid>
			<div style={ {display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 10} }>
				<h3 style={ {fontWeight: "bolder"} }>APPLICATION NUMBER &nbsp;&nbsp;{ params["appId"] }</h3>
				<h3 style={ {fontWeight: "bolder"} }>APPLICATION VALUE   &nbsp;&nbsp;    { appValue } </h3>
			</div>

			<ApplicationInstructionList data={ orders }/>
			<ApplicationLocations/>
			<ApplicationBillItems/>
			{ exportDataFlag && <CSVDownload data={ appItems } headers={ filterColumns(appItems) } filename={ "test.csv" }/> }
		</Container>
	);
};

export default ApplicationDetail;
