import { AgGridReact } from "ag-grid-react";
import React, { Fragment } from "react";
import Loader from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedInstruction, setSelectedLocation } from "../../services/data/gridData";
import CustomNoRowsOverlay from "../grid/CustomNoRowsOverlay";


const ApplicationInstructionsList = (props) => {
	const appOrders = useSelector(state => state.applicationDetail.orders);
	const dispatch = useDispatch();
	const columnDefs = [
		{
			headerName: "Select",
			colId: "select",
			checkboxSelection: true,
			maxWidth: 80,
		  },
		{headerName: "Work Instruction", field: "work_instruction", sort: "asc"},
		{headerName: "Project Title", field: "project_title"},
		{
			headerName: "Application Labour",
			field: "labour_value",
			type: "numericColumn",
			valueFormatter: numFormatGrid,
		},
		{
			headerName: "Application Materials",
			field: "materials_value",
			type: "numericColumn",
			valueFormatter: numFormatGrid,
		},
		{
			headerName: "Application Value",
			field: "applied_value",
			type: "numericColumn",
			cellStyle: {fontWeight: "bold"},
			valueFormatter: numFormatGrid,
		},
	];

	const defaultColDef = {
		filter: true,
		sortable: true,
		resizable: true,
		flex: true,
	};

	const gridOptions = {
		columnDefs: columnDefs,
		defaultColDef: defaultColDef,
		pagination: true,
		paginationPageSize: 15,
		domLayout: "autoHeight",
		rowSelection: "single",
		// rowDeselection: true,
		onRowSelected: selectedRow,
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
	};

	function numFormatGrid(params) {

		return params.value.toLocaleString(undefined, {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	}

	function selectedRow(event) {
		if (event.node.isSelected()) {
			dispatch(setSelectedInstruction(event.data));
			dispatch(setSelectedLocation(false))
		}else if (event.api.getSelectedNodes().length === 0) {
			dispatch(setSelectedInstruction(false))
		}
	}

	return (
		<Fragment>
			<hr/>
			<div className="grid-title">APPLICATION INSTRUCTIONS</div>
			<div className="ag-theme-custom-react2">
				<AgGridReact
					gridOptions={ gridOptions }
					onGridReady={ (params) => params.api.sizeColumnsToFit() }
					rowData={ appOrders }
					immutableData={ true }
					getRowNodeId={ (data) => data.id }
					onGridSizeChanged={ (params) => params.api.sizeColumnsToFit() }
				/>
			</div>
		</Fragment>
	);
};

export default ApplicationInstructionsList;
