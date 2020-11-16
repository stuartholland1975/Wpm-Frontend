import moment from "moment";
import React from "react";
import { CardDeck, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffectOnce } from "react-use";
import { fetchApplications, fetchAvailableWorksheets, fetchWorkInstructions } from "../../services/thunks";
import AvailableOrderList from "../commercial/AvailableOrderList";
import AvailableWorksheetsList from "../commercial/AvailableWorksheetsList";
import CommercialCard from "../ui-components/CommercialCard";
import { selectAllApplications } from "./ApplicationData";
import {useHistory} from "react-router-dom";
import {removeAllWorksheets}from "../worksheets/WorksheetData";
import {removeAllWorkInstructions} from "../work-instructions/InstructionData";
import { setSelectedInstruction } from "../grid/gridData";
import {GreyButton} from "../ui-components/Buttons"


function formatDate(date) {
	return moment(date).format("DD/MM/YYYY");
}

const numFormat = (num) => {
	return (
		num.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
	);
};

const ApplicationsSummary = () => {
	const history = useHistory()
	const dispatch = useDispatch();
	const applications = useSelector(selectAllApplications).sort(function (a, b) {
            return a["app_number"] - b["app_number"];
        });
	useEffectOnce(() => {
		dispatch(fetchApplications());
		dispatch(fetchAvailableWorksheets(`?applied=False`));
		dispatch(fetchWorkInstructions())
		dispatch(setSelectedInstruction(false))
	});

	function handleViewAppSummary({app_number}) {
		
		dispatch(removeAllWorksheets())
		dispatch(removeAllWorkInstructions())
        history.push({pathname: `/commercial/applications/detail/${app_number}`})
    }
	return (
		<Container fluid>

				<hr/>
				<h4 >APPLICATIONS:</h4>
				<hr/>
				<CardDeck>
					{ applications.map(item => {
						const {app_date, app_current, id, app_ref, application_value} = item;
						return (

							<CommercialCard
								key={id}
								title={ app_ref }
								textLabelTop="Date:"
								textValueTop={ formatDate(app_date) }
								textLabelMid="VALUE:"
								textValueMid={ numFormat(application_value) }
								textLabelBtm="STATUS:"
								textValueBtm={ app_current ? "OPEN" : "CLOSED" }
								footer={ <GreyButton onClick={() => handleViewAppSummary(item)} fullWidth>View Applcation</GreyButton> }
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
