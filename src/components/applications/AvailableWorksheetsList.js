import { AgGridReact } from "ag-grid-react";
import { ChangeDetectionStrategyType } from "ag-grid-react/lib/changeDetectionService";
import moment from "moment";
import React, { Fragment } from "react";
import Loader from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { removeEditedRow, setEditedRow } from "../../services/data/gridData";
import { selectAllAvailableWorksheets } from "../../services/data/WorksheetData";
import CustomNoRowsOverlay from "../grid/CustomNoRowsOverlay";

function formatDate(params) {
	return moment(params.value).format("DD/MM/YYYY");
}

const numFormatGrid = (params) => {
	return params.value.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};

const AvailableWorksheetsList = () => {
	const orderWorksheets = useSelector(selectAllAvailableWorksheets);
	const dispatch = useDispatch();

	const ColumnDefs = [
		{
			headerName: "Select",
			colId: "select",
			checkboxSelection: true,
			maxWidth: 80,
			headerCheckboxSelection: false,
		},
		{headerName: "Work Instruction", field: "order_ref"},
		{headerName: "Item Number", field: "item_number", sort: "asc"},
		{headerName: "Location", field: "location_ref"},
		{
			headerName: "WD Date",
			field: "date_work_done",
			valueFormatter: formatDate,
			type: "dateColumn",
		},
		{headerName: "Supervisor", field: "supervisor_name"},
		{
			headerName: "Qty To Apply",
			field: "qty_complete",
			type: "numericColumn",
			valueFormatter: numFormatGrid,
		},
		{
			headerName: "Value To Apply",
			field: "value_complete",
			type: "numericColumn",
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
		paginationPageSize: 10,
		rowSelection: "multiple",
		suppressRowClickSelection: false,
		domLayout: "autoHeight",
		suppressClickEdit: true,
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
		onRowSelected: setAppData,
	};

	function setAppData(event) {
		if (event.node.isSelected()) {
			/*const renderedNodes = gridOptions.api.getRenderedNodes().map(item => item.data)
			const selectedNode = gridOptions.api.getSelectedNodes().map(item => item.data)
			const result = renderedNodes.filter(o1 => selectedNode.some(o2 => o1.id === o2.id));
			event.node.setSelected(true)
			console.log(renderedNodes, selectedNode, result)*/
			dispatch(setEditedRow(event.data));
		} else dispatch(removeEditedRow(event.data.id));
	}

	return (
		<Fragment>
			<hr/>
			<div className="grid-title">WORKSHEETS AVAILABLE FOR APPLICATION:</div>

			<div className="ag-theme-custom-react2">
				<AgGridReact
					gridOptions={ gridOptions }
					rowData={ orderWorksheets }
					onGridReady={ (params) => params.api.sizeColumnsToFit() }
					onGridSizeChanged={ (params) => params.api.sizeColumnsToFit() }
					rowDataChangeDetectionStrategy={
						ChangeDetectionStrategyType.IdentityCheck
					}
				/>
			</div>
		</Fragment>
	);
};

export default AvailableWorksheetsList;
