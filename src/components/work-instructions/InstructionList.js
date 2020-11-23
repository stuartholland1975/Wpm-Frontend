import { AgGridReact } from "ag-grid-react";
import React, { useState, Fragment } from "react";
import Loader from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useEffectOnce, useLatest, useUpdateEffect } from "react-use";
import CustomNoRowsOverlay from "../../CustomNoRowsOverlay";
import {
  fetchAreas,
  fetchDocuments,
  fetchWorkInstructions,
} from "../../services/thunks";
import {
  resetDocuments,
  selectAllDocuments,
} from "../../services/data/documentsData";
import { resetGridRow, setSelectedRow } from "../../services/data/gridData";
import { resetImages } from "../../services/data/ImageData";
import { resetLocations } from "../../services/data/locationData";
import { fetchWorkTypes } from "../../services/data/workTypesData";
import { selectAllWorkInstructions } from "../../services/data/InstructionData";
import { resetInstructionDetails } from "../../services/data/instructionDetailData";

const formatNumber = (params) =>
  Math.floor(params.value)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

const InstructionList = () => {
  const dispatch = useDispatch(),
    workInstructions = useSelector(selectAllWorkInstructions),
    documents = useSelector(selectAllDocuments),
    latestDocs = useLatest(documents),
    [gridApi, setGridApi] = useState(),
    selectedNode = useSelector((state) => state.gridData.selectedRow),
    ColumnDefs = [
      { headerName: "ID", field: "id", hide: true },
      {
        headerName: "Select",
        colId: "select",
        checkboxSelection: true,
      },
      {
        headerName: "Work Instruction",
        field: "work_instruction",
        sort: "desc",
      },
      {
        headerName: "Project Title",
        field: "project_title",
        minWidth: 450,
      },
      {
        headerName: "Date Issued",
        field: "issued_date_formatted",
        type: "dateColumn",
      },
      {
        headerName: "Work Type",
        field: "work_type",
      },
      {
        headerName: "Area",
        field: "area_description",
      },

      {
        headerName: "Docs",
        type: "numericColumn",
        field: "document_count",
      },
      {
        headerName: "Item Count",
        field: "item_count",
        type: "numericColumn",
      },
      {
        headerName: "Order Value",
        field: "order_value",
        type: "numericColumn",
        cellStyle: { fontWeight: "bold" },
        sortable: true,
        filter: "agNumberColumnFilter",
        valueFormatter: formatNumber,
      },
    ],
    defaultColDef = {
      filter: true,
      sortable: true,
      resizable: true,
      flex: true,
    },
    columnTypes = {
      dateColumn: {
        filter: "agDateColumnFilter",
      },
    };
  const gridOptions = {
    columnDefs: ColumnDefs,
    defaultColDef: defaultColDef,
    columnTypes: columnTypes,
    pagination: true,
    paginationPageSize: 35,
    rowSelection: "single",
    onRowSelected: nodeSelected,
    suppressRowClickSelection: false,
    domLayout: "autoHeight",
    suppressClickEdit: true,
    suppressNoRowsOverlay: false,
    frameworkComponents: {
      customNoRowsOverlay: CustomNoRowsOverlay,
    },
    noRowsOverlayComponent: "customNoRowsOverlay",
    noRowsOverlayComponentParams: {
      noRowsMessageFunc: () => (
        <Loader
          style={{ textAlign: "center" }}
          type={"ThreeDots"}
          color="#366363"
        />
      ),
    },
  };

  useEffectOnce(() => {
    dispatch(fetchWorkInstructions());
    dispatch(fetchAreas());
    dispatch(fetchWorkTypes());
    dispatch(resetLocations());
    dispatch(resetInstructionDetails());
    dispatch(resetImages());
    dispatch(resetGridRow());
  });

  function nodeSelected(event) {
    const selectedNode = gridOptions.api.getSelectedNodes();
    if (event.node.isSelected()) {
      dispatch(setSelectedRow(selectedNode[0].data));
    }
  }

  useUpdateEffect(() => {
    if (!selectedNode && gridApi) {
      gridApi.deselectAll();
    }
  }, [selectedNode]);

  function onGridReady(params) {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  }

  return (
    <Fragment>
      <div className="ag-theme-custom-react" style={{ width: "100%" }}>
        <hr />
        <div className="grid-title">WORK INSTRUCTION LISTING:</div>
        <hr />
        <AgGridReact
          gridOptions={gridOptions}
          rowData={workInstructions}
          immutableData={true}
          getRowNodeId={(data) => data.id}
          onGridReady={onGridReady}
          onGridSizeChanged={(params) => params.api.sizeColumnsToFit()}
        />
      </div>
    </Fragment>
  );
};

export default InstructionList;
