import { AgGridReact } from "ag-grid-react";
import { ChangeDetectionStrategyType } from "ag-grid-react/lib/changeDetectionService";
import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { useUpdateEffect } from "react-use";
import { appOrderItems, selectedLocation } from "../../services/selectors";
import CustomNoRowsOverlay from "../grid/CustomNoRowsOverlay2";

function numFormatGrid(params) {
	return params.value.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

export default function ApplicationBillItems() {
	const allItems = useSelector(appOrderItems);
	const location = useSelector(selectedLocation);
	const [gridApi, setGridApi] = useState(null);
	const [gridColumnApi, setGridColumnApi] = useState(null);
	const items = location
		? allItems.filter((obj) => obj.location_ref === location.id)
		: allItems;

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
			minWidth: 250,
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

	const onGridReady = (params) => {
		setGridApi(params.api);
		setGridColumnApi(params.columnApi);
		params.api.sizeColumnsToFit();
	};

	useUpdateEffect(() => {
		const filterInstance = gridApi.getFilterInstance("site_location");
		if (location) {
			console.log(location.location_ref);
			filterInstance.setModel({
				filterType: "text",
				type: "equals",
				filter: location.location_ref
			});
			gridApi.onFilterChanged();
		} else {
			filterInstance.setModel(null);
			gridApi.onFilterChanged();
		}

	}, [location]);

	return (
		<Fragment>
			<hr/>
			<div className="grid-title">APPLICATION ITEMS:</div>

			<div className="ag-theme-custom-react2">
				<AgGridReact
					gridOptions={ gridOptions }
					rowData={ allItems }
					immuntableData={ true }
					getRowNodeId={ (data) => data.id }
					onGridReady={ onGridReady }
					onGridSizeChanged={ (params) => params.api.sizeColumnsToFit() }
					rowDataChangeDetectionStrategy={
						ChangeDetectionStrategyType.IdentityCheck
					}
				/>
			</div>
		</Fragment>
	);
}
