import React, { Fragment } from "react";
import { AgGridReact } from "ag-grid-react";
import { useSelector, useDispatch } from "react-redux";
import CustomNoRowsOverlay from "../grid/CustomNoRowsOverlay";
import { ChangeDetectionStrategyType } from "ag-grid-react/lib/changeDetectionService";
import { setClickedLocation } from "../grid/gridData";
import { show } from "redux-modal";
import {appOrderLocations} from "../../services/selectors"

function numFormatGrid(params) {
  return params.value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}


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
      headerName: "Application Labour",
      type: "numericColumn",
      field: "application_labour",
      valueFormatter: numFormatGrid,
    },
    {
      headerName: "Application Materials",
      type: "numericColumn",
      field: "application_materials",
      valueFormatter: numFormatGrid,
    },
    {
      headerName: "Application Value",
      type: "numericColumn",
      field: "application_value",
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
    paginationPageSize: 5,
    domLayout: "autoHeight",

    suppressRowClickSelection: true,

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
        console.log(params);
        dispatch(
          setClickedLocation({ ...params.data, colId: params.colDef.colId })
        );
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
