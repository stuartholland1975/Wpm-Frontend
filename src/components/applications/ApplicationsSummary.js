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


function formatDate(date) {
	return moment(date).format("DD/MM/YYYY");
}

const numFormat = (num) => {
	return (
		num.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
	);
};

const ApplicationsSummary = () => {

	const dispatch = useDispatch();
	const applications = useSelector(selectAllApplications).sort(function (a, b) {
            return a["app_number"] - b["app_number"];
        });
	useEffectOnce(() => {
		dispatch(fetchApplications());
		dispatch(fetchAvailableWorksheets());
		dispatch(fetchWorkInstructions())
	});
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
								footer={ <a href="#" onClick={ (e) => console.log(e, item) }>View
									Application</a> }
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
