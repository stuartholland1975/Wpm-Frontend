import React, { Fragment } from "react";
import { AgGridReact } from "ag-grid-react";
import { useSelector, useDispatch } from "react-redux";
import CustomNoRowsOverlay from "../grid/CustomNoRowsOverlay";
import Loader from "react-loader-spinner";
import Container from "react-bootstrap/Container";
import { ChangeDetectionStrategyType } from "ag-grid-react/lib/changeDetectionService";
import { selectAllLocations } from "../locations/locationData";
import { createSelector } from "@reduxjs/toolkit";
import { selectAllAvailableWorksheets } from "../worksheets/WorksheetData";

function numFormatGrid(params) {
  return params.value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
const selectedOrder = (state) => state.gridData.selectedInstruction;

const appOrderLocations = createSelector(
  [selectAllLocations, selectedOrder, selectAllAvailableWorksheets],
  (locations, order, worksheets) => {
    const orderLocations = locations.filter(
      (obj) => obj.work_instruction === order.work_instruction
    );
    return orderLocations.map((item) => ({
      ...item,
      application_value: worksheets
        .filter((obj) => obj.worksheet_ref === item.id)
        .map((item) => item.value_complete)
        .reduce((acc, item) => acc + item, 0),
    }));
  }
);

export default function ApplicationLocations() {
  const locations = useSelector(appOrderLocations);
  let columnDefs = [
    { headerName: "Worksheet Ref", field: "worksheet_ref", sort: "asc" },
    { headerName: "Location", field: "location_ref" },
    {
      headerName: "Pre Construction Images",
      colId: "PRE",
      // cellRenderer: imageLink,
    },
    {
      headerName: "Post Construction Images",
      colId: "POST",
      // cellRenderer: imageLink,
    },
    {
      headerName: "Misc Images",
      colId: "MISC",
      //  cellRenderer: imageLink,
    },
    {
      headerName: "Application Value",
      type: "numericColumn",
      field: "application_value",
      cellStyle: { fontWeight: "bold" },
      /* valueGetter: function (params) {

            const appLocationValue = worksheetsStateRef.current.filter(({worksheet_ref}) => worksheet_ref === params.data.location_ref).map(item => item.value_complete).reduce((acc, item) => acc + item, 0)
            return (appLocationValue)
        }, */
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
    columnDefs: columnDefs,
    defaultColDef: defaultColDef,
    columnTypes: columnTypes,
    pagination: true,
    paginationPageSize: 20,
    domLayout: "autoHeight",
    rowSelection: "single",
    suppressRowClickSelection: true,
    // onRowSelected: rowSelected,
    // onCellClicked: cellClicked,
    suppressNoRowsOverlay: false,
    frameworkComponents: {
      customNoRowsOverlay: CustomNoRowsOverlay,
    },
    noRowsOverlayComponent: "customNoRowsOverlay",
    noRowsOverlayComponentParams: {
      noRowsMessageFunc: function () {
        return "NO DATA TO DISPLAY";
      },
    },
  };

  return (
    <Fragment>
      <hr />
      <div className="grid-title">APPLICATION LOCATIONS:</div>
      <hr />
      <div className="ag-theme-custom-react2">
        <AgGridReact
          gridOptions={gridOptions}
          rowData={locations}
          immuntableData={true}
          getRowNodeId={(data) => data.id}
          onGridReady={(params) => params.api.sizeColumnsToFit()}
          onGridSizeChanged={(params) => params.api.sizeColumnsToFit()}
          rowDataChangeDetectionStrategy={
            ChangeDetectionStrategyType.IdentityCheck
          }
        />
      </div>
    </Fragment>
  );
}
