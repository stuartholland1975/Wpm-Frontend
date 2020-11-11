import React, { useState, Fragment } from "react";
import { useEffectOnce } from "react-use";
import { useDispatch, useSelector } from "react-redux";
import { fetchActivities } from "../../services/thunks";
import { selectAllActivities } from "./activityData";
import Loader from "react-loader-spinner";
import CustomNoRowsOverlay from "../grid/CustomNoRowsOverlay";
import { AgGridReact } from "ag-grid-react";
import { Container } from "react-bootstrap";
import { ChangeDetectionStrategyType } from "ag-grid-react/lib/changeDetectionService";

function niceNumber(params = 0.00) {
  return params.value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function numberParser(params) {
  return Number(params.newValue);
}

const roundedValue = (num) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

//TODO CRUD FUNCTIONS

const ActivityList = () => {
  const activities = useSelector(selectAllActivities);
  const dispatch = useDispatch();
  const [gridApi, setGridApi] = useState();
  const [, setColumnApi] = useState();
  useEffectOnce(() => {
    dispatch(fetchActivities());
  });

  const columnDefs = [
    {
      headerName: "Select",
      colId: "select",
      checkboxSelection: true,
      maxWidth: 80,
      editable: false,
    },
    {
      headerName: "Activity Code",
      field: "activity_code",
      sort: "desc",
      cellEditor: "agTextCellEditor",
      editable: true,
    },
    {
      headerName: "Activity Description",
      field: "activity_description",
      minWidth: 500,
      cellEditor: "agTextCellEditor",
      editable: true,
    },
    {
      headerName: "Unit",
      field: "unit_description",
      cellEditor: "agSelectCellEditor",

      editable: true,
    },

    {
      headerName: "Labour Base",
      field: "labour_base",
      type: "rightAligned",
      valueFormatter: niceNumber,
      valueParser: numberParser,
      filter: "agNumberColumnFilter",
      cellEditor: "agTextCellEditor",
      editable: true,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
      headerName: "Labour Uplift",
      field: "labour_uplift",
      type: "rightAligned",
      valueFormatter: niceNumber,
      valueParser: numberParser,
      filter: "agNumberColumnFilter",
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
      headerName: "Labour Total",
      field: "labour_total",
      type: "rightAligned",
      valueFormatter: niceNumber,
      valueParser: numberParser,
      filter: "agNumberColumnFilter",
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
      headerName: "Other Materials",
      field: "materials_other",
      type: "rightAligned",
      valueFormatter: niceNumber,
      valueParser: numberParser,
      filter: "agNumberColumnFilter",
      cellEditor: "agTextCellEditor",
      editable: true,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
      headerName: "Total Payable",
      field: "total_payable",
      type: "rightAligned",
      cellStyle: { fontWeight: "bold" },
      valueFormatter: niceNumber,
      valueParser: numberParser,
      filter: "agNumberColumnFilter",
      cellRenderer: "agAnimateShowChangeCellRenderer",
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

  let gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: defaultColDef,
    columnTypes: columnTypes,
    pagination: true,
    paginationPageSize: 30,
    editType: "fullRow",
    undoRedoCellEditing: true,
    rowSelection: "single",
    domLayout: "autoHeight",
    suppressClickEdit: true,
    enableCellChangeFlash: true,
    //onRowValueChanged: rowValueChanged,
    //stopEditingWhenGridLosesFocus: true,
    frameworkComponents: {
      customNoRowsOverlay: CustomNoRowsOverlay,
      customLoadingOverlay: CustomNoRowsOverlay,
      //simpleEditor: SimpleEditor,
    },
    noRowsOverlayComponent: "customLoadingOverlay",
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

  const onGridReady = (params) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
    params.api.sizeColumnsToFit();
  };

  return (
    <Fragment>
      <Container fluid>
        <div className="grid-title">ACTIVITY LISTING:</div>
        <hr />
        <div className="ag-theme-custom-react">
          <AgGridReact
            gridOptions={gridOptions}
            rowData={activities}
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

export default ActivityList;
