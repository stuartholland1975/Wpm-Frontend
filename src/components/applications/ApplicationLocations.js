import React, { Fragment } from "react";
import { AgGridReact } from "ag-grid-react";
import { useSelector, useDispatch } from "react-redux";
import CustomNoRowsOverlay from "../grid/CustomNoRowsOverlay";
import Loader from "react-loader-spinner";
import Container from "react-bootstrap/Container";
import { selectAllImages } from "../images/ImageData";
import { ChangeDetectionStrategyType } from "ag-grid-react/lib/changeDetectionService";
import { selectAllLocations } from "../locations/locationData";
import { createSelector } from "@reduxjs/toolkit";
import { selectAllAvailableWorksheets } from "../worksheets/WorksheetData";
import { setClickedLocation, setSelectedLocation } from "../grid/gridData";
import { show } from "redux-modal";

function numFormatGrid(params) {
  return params.value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
const selectedOrder = (state) => state.gridData.selectedInstruction;

const appOrderLocations = createSelector(
  [
    selectAllLocations,
    selectedOrder,
    selectAllAvailableWorksheets,
    selectAllImages,
  ],
  (locations, order, worksheets, images) => {
    const orderLocations = locations.filter(
      (obj) => obj.work_instruction === order.work_instruction
    );
    return orderLocations.map((item) => ({
      ...item,
      application_value: worksheets
        .filter((obj) => obj.worksheet_ref === item.id)
        .map((item) => item.value_complete)
        .reduce((acc, item) => acc + item, 0),
      pre_construction_images: images
        .filter((obj) => obj.location === item.id && obj.imageType === "PRE")
        .map((item) => item.id).length,
      post_construction_images: images
        .filter((obj) => obj.location === item.id && obj.imageType === "POST")
        .map((item) => item.id).length,
      misc_construction_images: images
        .filter((obj) => obj.location === item.id && obj.imageType === "MISC")
        .map((item) => item.id).length,
    }));
  }
);

export default function ApplicationLocations() {
  const locations = useSelector(appOrderLocations);
  const dispatch = useDispatch();

  let columnDefs = [
    { headerName: "Worksheet Ref", field: "worksheet_ref", sort: "asc" },
    { headerName: "Location", field: "location_ref" },
    {
      headerName: "Pre Construction Images",
      field: "pre_construction_images",
      colId: "PRE",
      type: "numericColumn",
      cellRenderer: imageLink,
    },
    {
      headerName: "Post Construction Images",
      field: "post_construction_images",
      colId: "POST",
      type: "numericColumn",
      cellRenderer: imageLink,
    },
    {
      headerName: "Misc Images",
      field: "misc_construction_images",
      colId: "MISC",
      type: "numericColumn",
      cellRenderer: imageLink,
      cellStyle: function (params) {
        if (params.value === 0) {
          return { color: "red" };
        }
      },
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
    suppressNoRowsOverlay: false,
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

  function imageLink(params) {
    const colour = params.value === 0 ? "red" : "blue";
    let link;
    if (params.value > 0) {
      link = document.createElement("a");
      link.href = "#";
      link.style = `font-weight: bold; color:${colour}`;
      link.innerText = params.value;
      link.addEventListener("click", (e) => {
        e.preventDefault();
        console.log(params)
        dispatch(setClickedLocation({...params.data, colId: params.colDef.colId}));
        dispatch(
          show("instruction-modal", {
            title: "LOCATION IMAGES",
            content: "locationImages",
          })
        );
      });
    } else {
      link = document.createElement("div");
      link.style = `font-weight: bold; color:${colour}`;
      link.innerText = params.value;
    }
    
    return link;
  }

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
