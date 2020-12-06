import React from "react";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { CSVDownload } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffectOnce } from "react-use";
import { selectAllApplications } from "../../services/data/ApplicationData";
import { resetApplicationDetails, setApplicationDetailsToSubmitted } from "../../services/data/ApplicationDetailsData";
import { fetchAppDetails, fetchSavedApplicationDetail, submitApplication, } from "../../services/thunks";
import ApplicationBillItems from "./ApplicationBillItems";
import ApplicationInstructionList from "./ApplicationInstructionsList";
import ApplicationLocations from "./ApplicationLocations";

const numFormat = (num) => {
	return num.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};

const camelCase = (str) => {
	return str.substring(0, 1).toUpperCase() + str.substring(1);
};

const filterColumns = (data) => {
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
	const submittedApplication = useSelector((state) => state.applicationDetail);

	const {appId} = useParams();
	const exportDataFlag = useSelector(
		(state) => state.applicationDetail.exportData
	);

	const appValue = numFormat(
		applications
			.filter((obj) => obj.app_number == appId)
			.map((item) => item["application_value"])
			.reduce((acc, item) => acc + item, 0)
	);
	const dispatch = useDispatch();
	const params = useParams();

	useEffectOnce(() => {
		const selectedApp = applications.filter((obj) => obj.app_number == appId)[0]
		!selectedApp.app_submitted ? dispatch(fetchAppDetails(params["appId"])) : dispatch(setApplicationDetailsToSubmitted(selectedApp.submission_detail))
		return () => {
			dispatch(resetApplicationDetails());
		};
	});

	const saveApplicationData = () => {
		const app = applications.filter((obj) => obj.app_number == appId);
		dispatch(
			submitApplication({
				submission_detail: submittedApplication,
				application_id: app[0].id,

				app_submitted: true
			})
		);
	};

	const fetchApplicationData = () => {
		dispatch(fetchSavedApplicationDetail(params["appId"]));
	};

	return (
		<Container fluid>
			<div
				style={ {
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					marginTop: 10,
				} }
			>
				<h3 style={ {fontWeight: "bolder"} }>
					APPLICATION NUMBER &nbsp;&nbsp;{ params["appId"] }
				</h3>
				<h3 style={ {fontWeight: "bolder"} }>
					APPLICATION VALUE &nbsp;&nbsp; { appValue }{ " " }
				</h3>
			</div>

			<ApplicationInstructionList/>
			<ApplicationLocations/>
			<ApplicationBillItems/>
			{ exportDataFlag && (
				<CSVDownload
					data={ appItems }
					headers={ filterColumns(appItems) }
					filename={ "test.csv" }
				/>
			) }
			<Button onClick={ saveApplicationData }>Submit Application</Button>
			<Button onClick={ fetchApplicationData }>fetch Application</Button>
		</Container>
	);
};

export default ApplicationDetail;
