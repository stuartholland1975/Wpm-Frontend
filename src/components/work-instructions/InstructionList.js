import React, { Fragment, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { fetchWorkInstructions } from "./InstructionData";
import { selectAllWorkInstructions } from "./InstructionData";
import { useEffectOnce } from "react-use";
import { useDispatch, useSelector } from "react-redux";
import CustomNoRowsOverlay from '../../CustomNoRowsOverlay';
import Loader from 'react-loader-spinner';

const formatNumber = (params) =>
  Math.floor(params.value)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

const ColumnDefs = [
  { headerName: "ID", field: "id", hide: true },
  {
    headerName: "Select",
    colId: "select",
    checkboxSelection: true,
    maxWidth: 80,
    editable: false,
  },
  {
    headerName: "Work Instruction",
    field: "work_instruction",
    editable: true,
    sort: "desc",
  },
  {
    headerName: "Project Title",
    field: "project_title",
    minWidth: 600,
    editable: true,
  },
  {
    headerName: "Date Issued",
    field: "issued_date_formatted",
    type: "dateColumn",
    editable: true,
  },
  {
    headerName: "Work Type",
    field: "work_type",
    editable: true,
    cellEditor: "agSelectCellEditor",
    //cellEditorParams: {values: workTypeOptions},
  },
  {
    headerName: "Area",
    field: "area_description",
    editable: true,
    maxWidth: 100,
    cellEditor: "agSelectCellEditor",
    // cellEditorParams: {values: areaOptions},
  },

  {
    headerName: "Docs",
    colId: "docs",
    type: "numericColumn",
    maxWidth: 100,
    //   valueGetter: function (params) {
    //      let orderDocuments = documents.filter(
    //          (obj) => obj.work_instruction === params.data.id
    //      );
    //       return orderDocuments.length;
    //  },
    editable: false,
  },

  {
    headerName: "Item Count",
    field: "item_count",
    type: "numericColumn",
    maxWidth: 110,
    editable: false,
  },

  {
    headerName: "Order Value",
    field: "order_value",
    type: "numericColumn",
    cellStyle: { fontWeight: "bold" },
    sortable: true,
    editable: false,
    filter: "agNumberColumnFilter",
    valueFormatter: formatNumber,
  },
];
const defaultColDef = {
  filter: true,
  sortable: true,
  resizable: true,
  flex: true,
  editable: true,
  // valueSetter: function (event) {
  //      editedFields = {...editedFields, [event.colDef.field]: event.newValue}
  //      const mergedObjects = {...event.data, ...editedFields}
  //      dispatch(updateGridData(mergedObjects))
  //     dispatch(addFormData(mergedObjects))
  //      return false
  //  }
};
const columnTypes = {
  dateColumn: {
    filter: "agDateColumnFilter",
  },
};
const gridOptions = {
  columnDefs: ColumnDefs,
  defaultColDef: defaultColDef,
  columnTypes: columnTypes,
  pagination: true,
  paginationPageSize: 30,
  editType: "fullRow",
  rowSelection: "single",
  suppressRowClickSelection: false,
  domLayout: "autoHeight",
  //onRowValueChanged: rowValueChanged,
  suppressClickEdit: true,
  suppressNoRowsOverlay: false,
    frameworkComponents: {
        customNoRowsOverlay: CustomNoRowsOverlay,
    },
      noRowsOverlayComponent: "customNoRowsOverlay",
      noRowsOverlayComponentParams: {
         noRowsMessageFunc: function () {
           return (
              <Loader
                 style={{textAlign: "center"}}
                 type={"ThreeDots"}
                  color={"Blue"}
              />
          );
      },
     },
};

const InstructionList = () => {
  const dispatch = useDispatch();
  const workInstructions = useSelector(selectAllWorkInstructions);
  const open = useSelector(state => state.drawer.open);

  const [gridApi, setGridApi] = useState();
  const [columnApi, setColumnApi] = useState();

  useEffectOnce(() => dispatch(fetchWorkInstructions()));

  useEffect(() => {
    if (gridApi) {
      gridApi.sizeColumnsToFit();
    }
  },[open]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
  };

  return (
    <Fragment>
      <div className="grid-title">WORK INSTRUCTION LISTING:</div>
      <div className="ag-theme-custom-react" style={{width: '100%'}}>
        <AgGridReact
          gridOptions={gridOptions}
          rowData={workInstructions}
          immutableData={true}
          getRowNodeId={(data) => data.id}
          onGridReady={onGridReady}
        />
      </div>
    </Fragment>
  );
};

export default InstructionList;
