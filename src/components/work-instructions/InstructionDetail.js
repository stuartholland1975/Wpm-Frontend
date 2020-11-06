import React, { Fragment, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { useSelector } from "react-redux";
import { selectAllInstructionDetails } from "../work-instructions/instructionDetailData";
import InstructionSummary from "./InstructionSummary";
import { Container } from "react-bootstrap";
import {
  useEffectOnce,
  useLatest,
  useUpdate,
  useRendersCount,
  useUpdateEffect,
  useLogger,
  useWindowSize,
} from "react-use";

const gridOptions = {
  columnDefs: [
    {
      headerName: "Select",
      colId: "select",
      checkboxSelection: true,
      maxWidth: 100,

      filter: false,
    },
    { headerName: "Item Ref", field: "item_number", sort: "asc" },
    { headerName: "Item Type", field: "item_type" },
    { headerName: "Location", field: "site_location" },
    { headerName: "Qty Ordered", field: "qty_ordered", type: "numericColumn" },
    { headerName: "Activity Code", field: "activity_code" },
    {
      headerName: "Activity Description",
      field: "activity_description",
    },

    {
      headerName: "Total Payable",
      field: "total_payable",
      valueFormatter: niceNumber,
      type: "numericColumn",
    },
    {
      headerName: "Qty Complete",
      field: "qty_complete",
      type: "numericColumn",
    },
    {
      headerName: "Value Complete",
      field: "value_complete",
      valueFormatter: niceNumber,
      type: "numericColumn",
    },

    {
      headerName: "Qty Applied For",
      field: "qty_applied",
      type: "numericColumn",
    },
    {
      headerName: "Value Applied For",
      field: "value_applied",
      valueFormatter: niceNumber,
      type: "numericColumn",
    },
  ],

  defaultColDef: {
    filter: true,
    sortable: true,
    resizable: true,
    flex: true,
  },

  pagination: true,
  paginationPageSize: 15,
  rowSelection: "single",
  domLayout: "autoHeight",
};

function niceNumber(params) {
  return params.value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const InstructionDetail = (props) => {
  const orderItems = useSelector(selectAllInstructionDetails);
  const { width, height } = useWindowSize();
  const update = useUpdate();
  const [gridApi, setGridApi] = useState();
  const [, setColumnApi] = useState();
  
  const onGridReady = (params) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
    params.api.sizeColumnsToFit();
  };

  useUpdateEffect(() => {
    gridApi.sizeColumnsToFit();
    update();
  }, [width]);

  return (
    <Fragment>
      <Container fluid>
        <InstructionSummary />
        <div className="grid-title">ORDER DETAIL LISTING:</div>
        <hr />
        <div className="ag-theme-custom-react">
          <AgGridReact
            gridOptions={gridOptions}
            rowData={orderItems}
            immuntableData={true}
            getRowNodeId={(data) => data.id}
            onGridReady={onGridReady}
          />
        </div>
      </Container>
    </Fragment>
  );
};
export default InstructionDetail;
