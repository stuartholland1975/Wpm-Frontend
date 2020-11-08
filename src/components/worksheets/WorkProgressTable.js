import React, { Fragment } from "react";
import CustomNoRowsOverlay from "../grid/CustomNoRowsOverlay";
import { AgGridReact } from "ag-grid-react";
import InstructionSummary from "../work-instructions/InstructionSummary";
import Container from "react-bootstrap/Container";
import { useDispatch, useSelector } from "react-redux";
import { selectAllInstructionDetails } from "../work-instructions/instructionDetailData";
import { createSelector } from "reselect";
import { useConfirm } from "material-ui-confirm";
import { setEditedRow } from "../grid/gridData";
import FocusLock from "react-focus-lock";

function formatNumber(params) {
  return params.value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parseNumber(params) {
  return parseFloat(params.newValue);
}

const selectedLocation = (state) => state.gridData.selectedLocation;

const dataSelector = createSelector(
  [selectAllInstructionDetails, selectedLocation],
  (items, location) =>
    items
      .filter((obj) => obj.qty_os > 0 && obj.location_ref === location.id)
      .map((v) => ({ ...v, qty_to_complete: 0 }))
);

const WorkProgressTable = (props) => {
  let cellDefs = [];
  const rowData = useSelector(dataSelector);
  const confirm = useConfirm();
  const dispatch = useDispatch();

  let columnDefs = [
    { headerName: "ID", field: "id", hide: true },
    { headerName: "Worksheet Ref", field: "worksheet_ref" },
    { headerName: "Item Ref", field: "item_number", sort: "asc" },
    { headerName: "Item Type", field: "item_type" },
    {
      headerName: "Qty Ordered",
      field: "qty_ordered",
      type: "numericColumn",
      valueFormatter: formatNumber,
    },
    { headerName: "Activity Code", field: "activity_code" },
    {
      headerName: "Activity Description",
      field: "activity_description",
      minWidth: 500,
    },
    {
      headerName: "Qty Os",
      field: "qty_os",
      type: "numericColumn",
      valueFormatter: formatNumber,
    },
    {
      headerName: "Qty Done",
      colId: "qty_to_complete",
      field: "qty_to_complete",
      type: "numericColumn",
      editable: true,
      valueFormatter: formatNumber,
      valueParser: parseNumber,
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
    paginationPageSize: 20,
    domLayout: "autoHeight",
    singleClickEdit: true,
    editType: "fullRow",
    enableCellChangeFlash: true,
    onRowValueChanged: onCellChangedHandler,
    frameworkComponents: {
      customNoRowsOverlay: CustomNoRowsOverlay,
    },
    noRowsOverlayComponent: "customNoRowsOverlay",
    noRowsOverlayComponentParams: {
      noRowsMessageFunc: function () {
        return "ALL ITEMS FOR THIS WORKSHEET ARE COMPLETE";
      },
    },
    /* onGridReady: function () {
      gridOptions.api.startEditingCell({ rowIndex: 0, colKey: "qty_to_complete" });
      cellDefs = gridOptions.api.getEditingCells();
      cellDefs.forEach(function (cellDef) {
        const { rowIndex, column } = cellDef;
        setEditingGridCell({ rowIndex: rowIndex, colKey: column.getId() });
        console.log(cellDefs);
      });
    }, */
  };

  const onGridReady = () => {
    gridOptions.api.sizeColumnsToFit();
    gridOptions.api.startEditingCell({
      rowIndex: 0,
      colKey: "qty_to_complete",
    });
  };

  let newFormData = [];

  function onCellChangedHandler(event) {
    dispatch(setEditedRow(event.data))
    gridOptions.api.flashCells({
      rowNodes: [event.node],
      columns: ["qty_to_complete"],
    });
    if (
      event.data.qty_to_complete >
      event.data.qty_ordered - event.data.qty_complete
    ) {
      confirm({
        title: "QTY DONE CANNOT EXCEED QTY OUTSTANDING",
        cancellationButtonProps: {
          disabled: true,
          hidden: true,
        },
      }).then(() => {
        const rowIndex = gridOptions.api.getEditingCells()[0].rowIndex - 1;
        //gridOptions.api.stopEditing()
        gridOptions.api.setFocusedCell(rowIndex, "qty_to_complete");
        gridOptions.api.startEditingCell({
          rowIndex: rowIndex,
          colKey: "qty_to_complete",
          keyPress: 46,
        });
      });
    } else {
      newFormData.push(event.data.id);
    }
  }

  return (
    <Fragment>
      <Container fluid>
        <InstructionSummary />
        <div className="grid-title">UPDATE WORK PROGRESS</div>
        <hr />
        <div className="ag-theme-custom-react">
            <FocusLock>
          <AgGridReact
            gridOptions={gridOptions}
            //enterMovesDown={true}
            //enterMovesDownAfterEdit={true}
            rowData={rowData}
            immutableData={true}
            getRowNodeId={(data) => data.id}
            onGridSizeChanged={onGridReady}
          />
          </FocusLock>
        </div>
      </Container>
    </Fragment>
  );
};
export default WorkProgressTable;
