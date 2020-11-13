import { AgGridReact } from "ag-grid-react";
import { ChangeDetectionStrategyType } from "ag-grid-react/lib/changeDetectionService";
import React, { useState } from "react";
import { Container } from "react-bootstrap";
import Loader from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useEffectOnce } from "react-use";
import { fetchActivities } from "../../services/thunks";
import CustomNoRowsOverlay from "../grid/CustomNoRowsOverlay";
import { selectAllActivities } from "./activityData";

function niceNumber(params = 0.00) {
	return params.value.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

function numberParser(params) {
	return Number(params.newValue);
}

const roundedValue = (num) => {
	return Math.round((num + Number.EPSILON) * 100) / 100;
};

//TODO CRUD FUNCTIONS

const ActivityList = () => {
	const activities = useSelector(selectAllActivities);
	const dispatch = useDispatch();
	const [gridApi, setGridApi] = useState();
	const [, setColumnApi] = useState();
	useEffectOnce(() => {
		dispatch(fetchActivities());
	});

	const columnDefs = [
		{
			headerName: "Select",
			colId: "select",
			checkboxSelection: true,
			//minWidth: 80,

		},
		{
			headerName: "Activity Code",
			field: "activity_code",
			sort: "desc",

			// flex: 1,
		},
		{
			headerName: "Activity Description",
			field: "activity_description",
			minWidth: 400,


			// flex: 2,
		},
		{
			headerName: "Unit",
			field: "unit_description",
			cellEditor: "agSelectCellEditor",
			//flex: 1,

		},

		{
			headerName: "Labour Base",
			field: "labour_base",
			type: "rightAligned",
			valueFormatter: niceNumber,
			valueParser: numberParser,
			filter: "agNumberColumnFilter",


		},
		{
			headerName: "Labour Uplift",
			field: "labour_uplift",
			type: "rightAligned",
			valueFormatter: niceNumber,
			valueParser: numberParser,
			filter: "agNumberColumnFilter",

		},
		{
			headerName: "Labour Total",
			field: "labour_total",
			type: "rightAligned",
			valueFormatter: niceNumber,
			valueParser: numberParser,
			filter: "agNumberColumnFilter",

		},
		{
			headerName: "Other Materials",
			field: "materials_other",
			type: "rightAligned",
			valueFormatter: niceNumber,
			valueParser: numberParser,
			filter: "agNumberColumnFilter",


		},
		{
			headerName: "Total Payable",
			field: "total_payable",
			type: "rightAligned",
			cellStyle: {fontWeight: "bold"},
			valueFormatter: niceNumber,
			valueParser: numberParser,
			filter: "agNumberColumnFilter",

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

	let gridOptions = {
		columnDefs: columnDefs,
		defaultColDef: defaultColDef,
		columnTypes: columnTypes,
		pagination: true,
		paginationPageSize: 30,
		editType: "fullRow",
		undoRedoCellEditing: true,
		rowSelection: "single",
		domLayout: "autoHeight",
		suppressClickEdit: true,
		enableCellChangeFlash: true,
		//onRowValueChanged: rowValueChanged,
		//stopEditingWhenGridLosesFocus: true,
		frameworkComponents: {
			customNoRowsOverlay: CustomNoRowsOverlay,
			customLoadingOverlay: CustomNoRowsOverlay,
			//simpleEditor: SimpleEditor,
		},
		noRowsOverlayComponent: "customLoadingOverlay",
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


	return (

		<Container fluid>
			<hr/>
			<div className="grid-title">ACTIVITY LISTING:</div>
			<hr/>
			<div className="ag-theme-custom-react">
				<AgGridReact
					gridOptions={ gridOptions }
					rowData={ activities }
					immuntableData={ true }
					getRowNodeId={ (data) => data.id }
					onGridReady={ (params) => params.api.sizeColumnsToFit() }
					onGridSizeChanged={ (params) => params.api.sizeColumnsToFit() }
					rowDataChangeDetectionStrategy={
						ChangeDetectionStrategyType.IdentityCheck
					}
				/>
			</div>
		</Container>

	);
};

export default ActivityList;
