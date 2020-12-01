import moment from "moment";
import React from "react";
import { CardDeck, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useEffectOnce } from "react-use";
import { selectAllApplications } from "../../services/data/ApplicationData";
import { setSelectedInstruction } from "../../services/data/gridData";
import { removeAllAvailableWorkInstructions, removeAllWorkInstructions } from "../../services/data/InstructionData";
import { removeAllWorksheets } from "../../services/data/WorksheetData";
import { fetchApplications, fetchAvailableInstructions } from "../../services/thunks";
import { GreyButton } from "../ui-components/Buttons";
import CommercialCard from "../ui-components/CommercialCard";
import AvailableOrderList from "./AvailableOrderList";
import AvailableWorksheetsList from "./AvailableWorksheetsList";


function formatDate(date) {
	return moment(date).format("DD/MM/YYYY");
}

const numFormat = (num) => {
	return (
		num.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
	);
};

const ApplicationsSummary = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const applications = useSelector(selectAllApplications).sort(function (a, b) {
		return a["app_number"] - b["app_number"];
	}).slice(-5);
	useEffectOnce(() => {
		dispatch(fetchApplications());
		//dispatch(fetchAvailableWorksheets(`?applied=False`));
		//dispatch(fetchWorkInstructions());
		dispatch(fetchAvailableInstructions());
		//dispatch(setSelectedInstruction(false));

		return (() => {
			dispatch(removeAllAvailableWorkInstructions());
			dispatch(setSelectedInstruction(false));
		});
	});

	function handleViewAppSummary({app_number}) {

		dispatch(removeAllWorksheets());
		dispatch(removeAllWorkInstructions());
		history.push({pathname: `/commercial/applications/detail/${ app_number }`, state: `${ app_number }`});
	}

	return (
		<Container fluid>


			<h4 style={ {textAlign: "center", fontWeight: "bolder", paddingTop: 5} }>APPLICATION SUMMARY</h4>
			<hr/>
			<CardDeck>
				{ applications.map(item => {
					const {app_date, app_current, id, app_ref, application_value} = item;
					return (

						<CommercialCard
							key={ id }
							title={ app_ref }
							textLabelTop="Date:"
							textValueTop={ formatDate(app_date) }
							textLabelMid="VALUE:"
							textValueMid={ numFormat(application_value) }
							textLabelBtm="STATUS:"
							textValueBtm={ app_current ? "OPEN" : "CLOSED" }
							footer={ <GreyButton onClick={ () => handleViewAppSummary(item) } fullWidth>View Applcation</GreyButton> }
							titleStyle={ app_current ? {color: "navy", textAlign: "center"} : {
								color: "",
								textAlign: "center"
							} }
						/>

					);
				}) }
			</CardDeck>

			<hr/>
			<AvailableOrderList/>

			<AvailableWorksheetsList/>
		</Container>
	);
};

export default ApplicationsSummary;
