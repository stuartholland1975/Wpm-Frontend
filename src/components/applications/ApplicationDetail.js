import React from "react";
import Container from "react-bootstrap/Container";
import { CSVDownload } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffectOnce } from "react-use";
import { resetApplicationDetails } from "../../services/data/ApplicationDetailsData";
import { setSelectedInstruction } from "../../services/data/gridData";
import { fetchAppDetails, } from "../../services/thunks";
import ApplicationBillItems from "./ApplicationBillItems";
import ApplicationInstructionList from "./ApplicationInstructionsList";
import ApplicationLocations from "./ApplicationLocations";

const ApplicationDetail = () => {
	const appOrders = useSelector(state => state.applicationDetail.orders);
	const appItems = useSelector(state => state.applicationDetail.items);
	const exportDataFlag = useSelector(state => state.applicationDetail.exportData);
	const appExportData = useSelector(state => state.applicationDetail);

	const dispatch = useDispatch();
	const params = useParams();

	useEffectOnce(() => {
		dispatch(fetchAppDetails(params.appId));
		dispatch(setSelectedInstruction(false));
		return (() => dispatch(resetApplicationDetails()));
	});

	return (
		<Container fluid>
			<h2
				style={ {
					textAlign: "center",
					textDecoration: "underline",
					fontWeight: "bolder",
				} }
			>{ `APPLICATION NUMBER  ${ params.appId }` }</h2>
			<ApplicationInstructionList data={ appOrders }/>
			<ApplicationLocations/>
			<ApplicationBillItems/>
			{ exportDataFlag && <CSVDownload data={ appItems }/> }
		</Container>
	);
};

export default ApplicationDetail;
