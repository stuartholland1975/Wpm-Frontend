import React, { Fragment } from "react";
import { CardDeck } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import SummaryCard from "../ui-components/SummaryCard";
import { selectAllInstructionDetails } from "./instructionDetailData";
import Loader from 'react-loader-spinner';


const numFormat = (num) => {
	return num.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};

const InstructionSummary = (props) => {
	const orderDetail = useSelector(selectAllInstructionDetails);
	const projectTitle = useLocation().state;

	const boqItems = orderDetail.filter(({item_type}) => item_type === "BOQ");
	const varnItems = orderDetail.filter(({item_type}) => item_type === "VARN");
	const totalLabourValue = orderDetail.map(item => item["labour_total"]).reduce((acc, item) => acc + item, 0);
	const totalMaterialsValue = orderDetail.map(item => item["materials_total_incl_other_materials"]).reduce((acc, item) => acc + item, 0);
	const boqLabourValue = boqItems.map(item => item["labour_total"]).reduce((acc, item) => acc + item, 0);
	const boqMaterialsValue = boqItems.map(item => item["materials_total_incl_other_materials"]).reduce((acc, item) => acc + item, 0);
	const boqTotalValue = boqLabourValue + boqMaterialsValue;
	const varnLabourValue = varnItems.map(item => item["labour_total"]).reduce((acc, item) => acc + item, 0);
	const varnMaterialsValue = varnItems.map(item => item["materials_total_incl_other_materials"]).reduce((acc, item) => acc + item, 0);
	const varnTotalValue = varnLabourValue + varnMaterialsValue;
	const completedValue = orderDetail.map(item => item["value_complete"]).reduce((acc, item) => acc + item, 0);
	const appliedValue = orderDetail.map(item => item["value_applied"]).reduce((acc, item) => acc + item, 0);
	const totalPayable = totalLabourValue + totalMaterialsValue;
	const valueToComplete = totalPayable + completedValue;
	const valueToApply = completedValue - appliedValue;


	return (
		<Fragment>
			<div className="grid-title">{ projectTitle }</div>
			<hr/>
			<CardDeck>
				<SummaryCard
					cardTitle="Original Order Value:"
					labelTop={ "Labour Value:" }
					labelMid={ "Materials Value:" }
					labelBot={ "Total Payable:" }
					valueTop={ numFormat(boqLabourValue) }
					valueMid={ numFormat(boqMaterialsValue) }
					valueBot={ numFormat(boqTotalValue) }
				/>
				<SummaryCard
					cardTitle="Variation Values:"
					labelTop={ "Labour Value:" }
					labelMid={ "Materials Value:" }
					labelBot={ "Total Payable:" }
					valueTop={ numFormat(varnLabourValue) }
					valueMid={ numFormat(varnMaterialsValue) }
					valueBot={ numFormat(varnTotalValue) }
				/>
				<SummaryCard
					cardTitle="Current Order Values:"
					labelTop={ "Labour Value:" }
					labelMid={ "Materials Value:" }
					labelBot={ "Total Payable:" }
					valueTop={ numFormat(totalLabourValue) }
					valueMid={ numFormat(totalMaterialsValue) }
					valueBot={ numFormat(totalPayable) }
				/>
				<SummaryCard
					cardTitle="Construction Progress Values:"
					labelTop={ "Current Value:" }
					labelBot={ "Value Complete:" }
					labelMid={ "To Complete:" }
					valueTop={ numFormat(totalPayable) }
					valueBot={ numFormat(completedValue) }
					valueMid={ numFormat(valueToComplete) }
				/>
				<SummaryCard
					cardTitle="Application Values:"
					labelBot={ "Value Applied:" }
					labelTop={ "Value Complete:" }
					labelMid={ "Not Applied:" }
					valueBot={ numFormat(appliedValue) }
					valueTop={ numFormat(completedValue) }
					valueMid={ numFormat(valueToApply) }
				/>
			</CardDeck>
			<hr/>
		</Fragment>
	);
};

export default InstructionSummary;
