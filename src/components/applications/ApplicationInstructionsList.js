import React, { Fragment } from "react";
import { AgGridReact } from "ag-grid-react";
import { setSelectedInstruction } from "../grid/gridData";
import { useSelector, useDispatch } from "react-redux";
import CustomNoRowsOverlay from "../grid/CustomNoRowsOverlay";
import Loader from "react-loader-spinner";
import { appInstructions } from "../../services/selectors";

const numFormatGrid = (params) => {
  return params.value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const ApplicationInstructionsList = () => {
  const instructions = useSelector(appInstructions);
  const dispatch = useDispatch();
  const columnDefs = [
    { headerName: "Work Instruction", field: "work_instruction", sort: "asc" },
    { headerName: "Project Title", field: "project_title" },
    {
      headerName: "Application Labour",
      field: "applied_labour",
      type: "numericColumn",
      valueFormatter: numFormatGrid,
    },
    {
      headerName: "Application Materials",
      field: "applied_materials",
      type: "numericColumn",

      valueFormatter: numFormatGrid,
    },
    {
      headerName: "Application Value",
      field: "applied_value",
      type: "numericColumn",
      cellStyle: { fontWeight: "bold" },
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
            style={{ textAlign: "center" }}
            type={"ThreeDots"}
            color={"Blue"}
          />
        );
      },
    },
  };

  function selectedRow(event) {
    if (event.node.isSelected()) {
      dispatch(setSelectedInstruction(event.data));
    }
  }

  return (
    <Fragment>
      <hr />
      <div className="grid-title">APPLICATION INSTRUCTIONS</div>
      <hr />
      <div className="ag-theme-custom-react2">
        <AgGridReact
          gridOptions={gridOptions}
          rowData={instructions}
          onGridReady={(params) => params.api.sizeColumnsToFit()}
          immutableData={true}
          getRowNodeId={(data) => data.id}
          onGridSizeChanged={(params) => params.api.sizeColumnsToFit()}
        />
      </div>
    </Fragment>
  );
};

export default ApplicationInstructionsList;
