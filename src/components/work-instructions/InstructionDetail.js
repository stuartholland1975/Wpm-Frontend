import { AgGridReact } from "ag-grid-react";
import { ChangeDetectionStrategyType } from "ag-grid-react/lib/changeDetectionService";
import React, { Fragment, useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedBillItem } from "../../services/data/gridData";
import { selectAllInstructionDetails } from "../../services/data/instructionDetailData";
import InstructionSummary from "./InstructionSummary";
import { selectOrderSummaryDetails } from "../../services/selectors";
import { useEffectOnce } from "react-use";

function niceNumber(params) {
  return params.value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const InstructionDetail = () => {
  const orderItems = useSelector(selectOrderSummaryDetails);
  const [gridApi, setGridApi] = useState();
  const [, setColumnApi] = useState();
  const dispatch = useDispatch();

  const gridOptions = {
    columnDefs: [
      {
        headerName: "Select",
        colId: "select",
        checkboxSelection: true,
        minWidth: 100,
        valueGetter: function (params) {
          if (params.data.qty_ordered - params.data.qty_complete === 0) {
            return "Complete";
          } else if (params.data.qty_complete > 0.0) {
            return "In Progress";
          }
        },
        filter: false,
      },
      { headerName: "Item Ref", field: "item_number", sort: "desc", flex: 1 },
      { headerName: "Item Type", field: "item_type", flex: 1 },
      { headerName: "Location", field: "site_location", minWidth: 250 },
      {
        headerName: "Qty Ordered",
        field: "qty_ordered",
        type: "numericColumn",
        valueFormatter: niceNumber,
      },
      { headerName: "Activity Code", field: "activity_code" },
      {
        headerName: "Activity Description",
        field: "activity_description",
        minWidth: 400,
      },
      {
        headerName: "Total Payable",
        field: "total_payable",
        valueFormatter: niceNumber,
        type: "numericColumn",
        flex: 2,
      },
      {
        headerName: "Qty Complete",
        field: "qty_complete",
        type: "numericColumn",
        valueFormatter: niceNumber,
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
        valueFormatter: niceNumber,
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
    paginationPageSize: 20,
    rowSelection: "single",
    domLayout: "autoHeight",
    onRowSelected: rowSelected,
    isRowSelectable: function (rowNode) {
      const { qty_complete } = rowNode.data;
      return rowNode.data ? qty_complete === 0 : true;
    },
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
    params.api.sizeColumnsToFit();
    
  };

  function rowSelected(event) {
    if (event.node.selected) {
      dispatch(setSelectedBillItem(event.data));
    }
  }

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
            onGridSizeChanged={(params) => params.api.sizeColumnsToFit()}
            rowDataChangeDetectionStrategy={
              ChangeDetectionStrategyType.IdentityCheck
            }
          />
        </div>
      </Container>
    </Fragment>
  );
};
export default InstructionDetail;
