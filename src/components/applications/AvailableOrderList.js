import { AgGridReact } from "ag-grid-react";
import { ChangeDetectionStrategyType } from "ag-grid-react/lib/changeDetectionService";
import React, {useState} from "react";
import Loader from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedInstruction } from "../../services/data/gridData";
import { selectAllAvailableWorkInstructions } from "../../services/data/InstructionData";
import { fetchAvailableWorksheets } from "../../services/thunks";
import CustomNoRowsOverlay from "../grid/CustomNoRowsOverlay2";
import {useUpdateEffect} from "react-use";

const numFormatGrid = (params) => {
	return params.value.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};

const AvailableOrderList = () => {
	const dispatch = useDispatch();

	const availableOrders = useSelector(selectAllAvailableWorkInstructions);
	const [gridApi, setGridApi] = useState()


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
			//sort: "asc",
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
		paginationPageSize: 10,
		rowSelection: "single",
		suppressRowClickSelection: false,
		domLayout: "autoHeight",
		suppressClickEdit: true,
		onRowSelected: selectedRow,
		suppressNoRowsOverlay: false,
		enableCellChangeFlash: true,
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
	const onGridReady = params => {
		params.api.sizeColumnsToFit();
		setGridApi(params.api)
		/* const node = params.api.getRowNode(0)
		node.setSelected(true)
		console.log(params.api.getSelectedNodes(), node) */
	};

	 

	useUpdateEffect(() => {
		gridApi.getDisplayedRowAtIndex(0).setSelected(true)
	},[availableOrders])

	function selectedRow(event) {
		if (event.node.isSelected()) {
			dispatch(setSelectedInstruction(event.data));
			dispatch(fetchAvailableWorksheets(`?applied=False&&item_ref__work_instruction=${ event.data.work_instruction }`));

		} else if (event.api.getSelectedNodes().length === 0) {
			dispatch(setSelectedInstruction(false));
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
					onGridReady={ onGridReady }
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
