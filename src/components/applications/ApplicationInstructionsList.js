import React, { Fragment } from "react";
import { AgGridReact } from "ag-grid-react";
import Container from "react-bootstrap/Container";
import { selectAllWorkInstructions } from "../work-instructions/InstructionData";
import { setSelectedInstruction } from "../grid/gridData";
import { useSelector, useDispatch } from "react-redux";
import CustomNoRowsOverlay from "../grid/CustomNoRowsOverlay";
import { selectAllAvailableWorksheets } from "../worksheets/WorksheetData";
import { createSelector } from "@reduxjs/toolkit";
import Loader from "react-loader-spinner";

const getAppInstructions = createSelector(
  [selectAllAvailableWorksheets, selectAllWorkInstructions],
  (worksheets, instructions) =>
    instructions.map((item) => ({
      ...item,
      applied_value: worksheets
        .filter((obj) => obj.order_ref === item.work_instruction)
        .map((item) => item.value_complete)
        .reduce((acc, item) => acc + item, 0),
    }))
);

const numFormatGrid = (params) => {
  return params.value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const ApplicationInstructionsList = (props) => {
  const appInstructions = useSelector(getAppInstructions);
  const appWorksheets = useSelector(selectAllAvailableWorksheets);
  const dispatch = useDispatch();
  const columnDefs = [
    /* {
      headerName: "Select",
      colId: "select",
      checkboxSelection: true,
      maxWidth: 80,
    }, */
    { headerName: "Work Instruction", field: "work_instruction", sort: "asc" },
    { headerName: "Project Title", field: "project_title" },
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
    rowDeselection: true,
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
          rowData={appInstructions}
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
