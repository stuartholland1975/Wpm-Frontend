import { AgGridReact } from "ag-grid-react";
import { useConfirm } from "material-ui-confirm";
import React, { Fragment } from "react";
import Container from "react-bootstrap/Container";
import { useDispatch, useSelector } from "react-redux";
import { useEffectOnce } from "react-use";
import { setEditedRow } from "../../services/data/gridData";
import { updateGridOrderItem } from "../../services/data/instructionDetailData";
import { inCompleteItems } from "../../services/selectors";
import { fetchSupervisors } from "../../services/thunks";
import CustomNoRowsOverlay from "../grid/CustomNoRowsOverlay2";
import SimpleEditor from "../grid/SimpleEditor";
import InstructionSummary from "../work-instructions/InstructionSummary";

function formatNumber(params) {
  return (
    params.value &&
    params.value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

const WorkProgressTable = () => {
  const rowData = useSelector(inCompleteItems);
  const confirm = useConfirm();
  const dispatch = useDispatch();

  useEffectOnce(() => {
    dispatch(fetchSupervisors());
  });

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
      //valueParser: parseNumber,
      //cellRenderer: "simpleEditor",
      valueSetter: function (params) {
        if (params.newValue !== params.oldValue) {
          console.log("NOT EQUAL");
          if (params.newValue > params.data.qty_os) {
            confirm({
              title: "Qty Complete Exceeds Qty Outstanding",
              cancellationButtonProps: {
                disabled: true,
                hidden: true,
              },
              confirmationButtonProps: {
                variant: "contained",
              },
            }).then(() => {
              const rowNode = params.api.getRowNode(params.data.id);
              params.api.setFocusedCell(rowNode.rowIndex, "qty_to_complete");
              params.api.startEditingCell({
                rowIndex: rowNode.rowIndex,
                colKey: "qty_to_complete",
              });
            });
          } else {
            dispatch(
              updateGridOrderItem({
                ...params.data,
                qty_to_complete: Number(params.newValue),
              })
            );
            dispatch(
              setEditedRow({
                ...params.data,
                qty_to_complete: Number(params.newValue),
              })
            );
            return false;
          }
        }
      },
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
    stopEditingWhenGridLosesFocus: true,
    /*onRowValueChanged: function(event){
			console.log("FIRED")
			return dispatch(setEditedRow(event.data));
		},*/
    frameworkComponents: {
      customNoRowsOverlay: CustomNoRowsOverlay,
      simpleEditor: SimpleEditor,
    },
    noRowsOverlayComponent: "customNoRowsOverlay",
    noRowsOverlayComponentParams: {
      noRowsMessageFunc: function () {
      //  return "ALL ITEMS FOR THIS WORKSHEET ARE COMPLETE";
      return <h1 style={{marginTop: 15}}>ALL ITEMS FOR THIS SELECTION ARE COMPLETE</h1>
      },
    },
  };

  const onGridReady = (params) => {
    params.api.sizeColumnsToFit();
    params.api.startEditingCell({
      rowIndex: 0,
      colKey: "qty_to_complete",
    });
  };

  return (
    <Fragment>
      <Container fluid>
        <InstructionSummary />
        <div className="grid-title">UPDATE WORK PROGRESS</div>
        <hr />
        <div className="ag-theme-custom-react">
          <AgGridReact
            gridOptions={gridOptions}
            rowData={rowData}
            onGridReady={onGridReady}
            immutableData={true}
            getRowNodeId={(data) => data.id}
            onGridSizeChanged={(params) => params.api.sizeColumnsToFit()}
          />
        </div>
      </Container>
    </Fragment>
  );
};
export default WorkProgressTable;
