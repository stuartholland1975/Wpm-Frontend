import React, { Fragment } from "react";
import { AgGridReact } from "ag-grid-react";
import { useSelector } from "react-redux";
import CustomNoRowsOverlay from "../grid/CustomNoRowsOverlay";
import { ChangeDetectionStrategyType } from "ag-grid-react/lib/changeDetectionService";
import { appOrderItems } from "../../services/selectors";

function numFormatGrid(params) {
  return params.value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function ApplicationBillItems() {
  const items = useSelector(appOrderItems);

  const columnDefs = [
    {
      headerName: "Item Ref",
      field: "item_number",
      sort: "asc",
      minWidth: 120,
    },
    { headerName: "Item Type", field: "item_type", minWidth: 120 },
    { headerName: "Location", field: "site_location", minWidth: 200 },
    {
      headerName: "Qty Ordered",
      field: "qty_ordered",
      type: "numericColumn",
      valueFormatter: numFormatGrid,
    },
    {
      headerName: "Qty Applied",
      field: "qty_applied",
      type: "numericColumn",
      valueFormatter: numFormatGrid,
    },
    { headerName: "Activity Code", field: "activity_code" },
    {
      headerName: "Activity Description",
      field: "activity_description",
      minWidth: 300,
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

  let defaultColDef = {
    filter: true,
    sortable: true,
    resizable: true,
    flex: true,
  };

  let gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: defaultColDef,
    pagination: true,
    paginationPageSize: 10,
    domLayout: "autoHeight",
    suppressRowClickSelection: true,
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

  return (
    <Fragment>
      <hr />
      <div className="grid-title">APPLICATION ITEMS:</div>
      <hr />
      <div className="ag-theme-custom-react2">
        <AgGridReact
          gridOptions={gridOptions}
          rowData={items}
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
