import React, { Fragment } from "react";
import SummaryCard from "../ui-components/SummaryCard";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { CardDeck } from "react-bootstrap";
import { selectAllInstructionDetails } from "./instructionDetailData";
import { createSelector } from "reselect";

const numFormat = (num) => {
	return num.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};

const orderItems = state => state

const boqItems = createSelector(
	[orderItems],
	items => items.filter(({item_type}) => item_type === 'BOQ')
)

const varnItems = createSelector(
	[orderItems],
	items => items.filter(({item_type}) => item_type === 'VARN')
)

const totalLabourValue = createSelector(
	[orderItems],
	items => items.map(item => item['labour_total']).reduce((acc, item) => acc + item, 0)
)

const totalMaterialsValue = createSelector(
	[orderItems],
	items => items.map(item => item['materials_total_incl_other_materials']).reduce((acc, item) => acc + item, 0)
)

const boqLabourValue = createSelector(
	[boqItems],
	items => items.map(item => item['labour_total']).reduce((acc, item) => acc + item, 0)
)

const boqMaterialsValue = createSelector(
	[boqItems],
	items => items.map(item => item['materials_total_incl_other_materials']).reduce((acc, item) => acc + item, 0)
)

const boqTotalValue = createSelector(
	[boqLabourValue, boqMaterialsValue],
	(labour, materials) => labour + materials
)

const varnLabourValue = createSelector(
	[varnItems],
	items => items.map(item => item['labour_total']).reduce((acc, item) => acc + item, 0)
)

const varnMaterialsValue = createSelector(
	[varnItems],
	items => items.map(item => item['materials_total_incl_other_materials']).reduce((acc, item) => acc + item, 0)
)

const varnTotalValue = createSelector(
	[varnLabourValue, varnMaterialsValue],
	(labour, materials) => labour + materials
)

const completedValue = createSelector(
	[orderItems],
	items => items.map(item => item['value_complete']).reduce((acc, item) => acc + item, 0)
)

const appliedValue = createSelector(
	[orderItems],
	items => items.map(item => item['value_applied']).reduce((acc, item) => acc + item, 0)
)

const totalPayable = createSelector(
	[totalLabourValue, totalMaterialsValue],
	(labour, materials) => labour + materials
)

const valueToComplete = createSelector(
	[totalPayable, completedValue],
	(total, complete) => total - complete
)

const valueToApply = createSelector(
	[completedValue, appliedValue],
	(complete, applied) => complete - applied
)

const InstructionSummary = (props) => {
	const orderDetail = useSelector(selectAllInstructionDetails);
	const projectTitle = useLocation().state;

	return (
		<Fragment>
			<div className="grid-title">{ projectTitle }</div>
			<div className="grid-title">{ "" }</div>
			<CardDeck>
				<SummaryCard
					cardTitle="Original Order Value:"
					labelTop={ "Labour Value:" }
					labelMid={ "Materials Value:" }
					labelBot={ "Total Payable:" }
					valueTop={ numFormat(boqLabourValue(orderDetail)) }
					valueMid={ numFormat(boqMaterialsValue(orderDetail)) }
					valueBot={ numFormat(boqTotalValue(orderDetail)) }
				/>
				<SummaryCard
					cardTitle="Variation Values:"
					labelTop={ "Labour Value:" }
					labelMid={ "Materials Value:" }
					labelBot={ "Total Payable:" }
					valueTop={ numFormat(varnLabourValue(orderDetail)) }
					valueMid={ numFormat(varnMaterialsValue(orderDetail)) }
					valueBot={ numFormat(varnTotalValue(orderDetail)) }
				/>
				<SummaryCard
					cardTitle="Current Order Values:"
					labelTop={ "Labour Value:" }
					labelMid={ "Materials Value:" }
					labelBot={ "Total Payable:" }
					valueTop={ numFormat(totalLabourValue(orderDetail)) }
					valueMid={ numFormat(totalMaterialsValue(orderDetail)) }
					valueBot={ numFormat(totalPayable(orderDetail)) }
				/>
				<SummaryCard
					cardTitle="Construction Progress Values:"
					labelTop={ "Current Value:" }
					labelBot={ "Value Complete:" }
					labelMid={ "To Complete:" }
					valueTop={ numFormat(totalPayable(orderDetail)) }
					valueBot={ numFormat(completedValue(orderDetail)) }
					valueMid={ numFormat(valueToComplete(orderDetail)) }
				/>
				<SummaryCard
					cardTitle="Application Values:"
					labelBot={ "Value Applied:" }
					labelTop={ "Value Complete:" }
					labelMid={ "Not Applied:" }
					valueBot={ numFormat(appliedValue(orderDetail)) }
					valueTop={ numFormat(completedValue(orderDetail)) }
					valueMid={ numFormat(valueToApply(orderDetail)) }
				/>
			</CardDeck>
			<hr/>
		</Fragment>
	);
};

export default InstructionSummary;
