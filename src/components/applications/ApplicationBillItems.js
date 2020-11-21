import { AgGridReact } from "ag-grid-react";
import { ChangeDetectionStrategyType } from "ag-grid-react/lib/changeDetectionService";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { appOrderItems } from "../../services/selectors";
import CustomNoRowsOverlay from "../grid/CustomNoRowsOverlay";

function numFormatGrid(params) {
	return params.value.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

export default function ApplicationBillItems() {
	const items = useSelector(appOrderItems);
	//const items = useSelector(state => state.applicationDetail.items)

	const columnDefs = [
		{
			headerName: "Item Ref",
			field: "item_number",
			sort: "asc",
			maxWidth: 120,
		},
		{headerName: "Item Type", field: "item_type", maxWidth: 120},
		{headerName: "Location", field: "site_location"},
		{
			headerName: "Qty Ordered",
			field: "qty_ordered",
			type: "numericColumn",
			maxWidth: 120,
			valueFormatter: numFormatGrid,
		},
		{
			headerName: "Qty Applied",
			field: "qty_applied",
			type: "numericColumn",
			maxWidth: 120,
			valueFormatter: numFormatGrid,
		},
		{headerName: "Activity Code", field: "activity_code", maxWidth: 150},
		{
			headerName: "Activity Description",
			field: "activity_description",
			minWidth: 250
		},
		{
			headerName: "Application Labour",
			type: "numericColumn",
			field: "labour_value",
			maxWidth: 180,
			valueFormatter: numFormatGrid,
		},
		{
			headerName: "Application Materials",
			type: "numericColumn",
			field: "materials_value",
			maxWidth: 180,
			valueFormatter: numFormatGrid,
		},
		{
			headerName: "Application Value",
			type: "numericColumn",
			field: "applied_value",
			maxWidth: 180,
			cellStyle: {fontWeight: "bold"},
			valueFormatter: numFormatGrid,
		},
	];

	let defaultColDef = {
		filter: true,
		sortable: true,
		resizable: true,
		flex: true,
	};

	let gridOptions = {
		columnDefs: columnDefs,
		defaultColDef: defaultColDef,
		pagination: true,
		paginationPageSize: 10,
		domLayout: "autoHeight",
		suppressRowClickSelection: true,
		frameworkComponents: {
			customNoRowsOverlay: CustomNoRowsOverlay,
		},
		noRowsOverlayComponent: "customNoRowsOverlay",
		noRowsOverlayComponentParams: {
			noRowsMessageFunc: function () {
				return "PLEASE SELECT A WORK INSTRUCTION";
			},
		},
	};

	return (
		<Fragment>
			<hr/>
			<div className="grid-title">APPLICATION ITEMS:</div>

			<div className="ag-theme-custom-react2">
				<AgGridReact
					gridOptions={ gridOptions }
					rowData={ items }
					immuntableData={ true }
					getRowNodeId={ (data) => data.id }
					onGridReady={ (params) => params.api.sizeColumnsToFit() }
					onGridSizeChanged={ (params) => params.api.sizeColumnsToFit() }
					rowDataChangeDetectionStrategy={
						ChangeDetectionStrategyType.IdentityCheck
					}
				/>
			</div>
		</Fragment>
	);
}
