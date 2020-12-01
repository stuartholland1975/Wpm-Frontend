import { AgGridReact } from "ag-grid-react";
import { ChangeDetectionStrategyType } from "ag-grid-react/lib/changeDetectionService";
import React from "react";
import Loader from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedInstruction } from "../../services/data/gridData";
import { getAvailableOrders } from "../../services/selectors";
import CustomNoRowsOverlay from "../grid/CustomNoRowsOverlay2";

const numFormatGrid = (params) => {
	return params.value.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};

const AvailableOrderList = () => {
	const dispatch = useDispatch();

	const availableOrders = useSelector(getAvailableOrders);

	const ColumnDefs = [
		{headerName: "ID", field: "id", hide: true},
		{
			headerName: "Select",
			colId: "select",
			checkboxSelection: true,
			maxWidth: 80,
		},
		{
			headerName: "Work Instruction",
			field: "work_instruction",
			editable: true,
			sort: "asc",
		},
		{
			headerName: "Project Title",
			field: "project_title",
			minWidth: 400,
			editable: true,
		},
		{
			headerName: "Date Issued",
			field: "issued_date_formatted",
			type: "dateColumn",
			editable: true,
		},
		{
			headerName: "Work Type",
			field: "work_type",
			editable: true,
			cellEditor: "agSelectCellEditor",
		},
		{
			headerName: "Area",
			field: "area_description",
			editable: true,
			maxWidth: 100,
			cellEditor: "agSelectCellEditor",
		},
		{
			headerName: "Available Value",
			// field: "available_value",
			sortable: false,
			cellStyle: {fontWeight: "bold"},
			type: "numericColumn",
			valueGetter: function (params) {
				return params.data.value_complete - params.data.value_applied;
			},
			valueFormatter: numFormatGrid,
		},
	];
	const defaultColDef = {
		filter: true,
		sortable: true,
		resizable: true,
		flex: true,
	};
	const columnTypes = {
		dateColumn: {
			filter: "agDateColumnFilter",
		},
	};
	const gridOptions = {
		columnDefs: ColumnDefs,
		defaultColDef: defaultColDef,
		columnTypes: columnTypes,
		pagination: true,
		paginationPageSize: 30,
		rowSelection: "single",
		suppressRowClickSelection: false,
		domLayout: "autoHeight",
		suppressClickEdit: true,
		onRowSelected: nodeSelected,
		suppressNoRowsOverlay: false,
		frameworkComponents: {
			//customLoadingOverlay: CustomLoadingOverlay,
			customNoRowsOverlay: CustomNoRowsOverlay,
		},
		noRowsOverlayComponent: "customNoRowsOverlay",
		noRowsOverlayComponentParams: {
			noRowsMessageFunc: function () {
				return (
					<Loader
						style={ {textAlign: "center"} }
						type={ "ThreeDots" }
						color={ "Blue" }
					/>
				);
			},
		},
		//onGridReady:  () => gridInitWI.api.setPinnedBottomRowData([{"work_instruction": 123456, "issued_date_formatted": "01/01/2001"}]),
	};

	function nodeSelected(event) {
		const selectedNode = gridOptions.api.getSelectedNodes();
		if (event.node.isSelected()) {
			dispatch(setSelectedInstruction(selectedNode[0].data));
		}
	}

	return (
		<>
			<div className="grid-title">
				WORK INSTRUCTIONS AVAILABLE FOR APPLICATION:
			</div>

			<div className="ag-theme-custom-react2">
				<AgGridReact
					gridOptions={ gridOptions }
					rowData={ availableOrders }
					onGridReady={ (params) => params.api.sizeColumnsToFit() }
					onGridSizeChanged={ (params) => params.api.sizeColumnsToFit() }
					rowDataChangeDetectionStrategy={
						ChangeDetectionStrategyType.IdentityCheck
					}
				/>
			</div>
		</>
	);
};

export default AvailableOrderList;
