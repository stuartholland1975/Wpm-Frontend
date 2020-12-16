import { AgGridReact } from "ag-grid-react";
import { ChangeDetectionStrategyType } from "ag-grid-react/lib/changeDetectionService";
import React, { Fragment, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  useEffectOnce,
  useLatest,
  useMountedState,
  useUpdateEffect,
} from "react-use";
import { show } from "redux-modal";
import {
  setClickedLocation,
  setSelectedLocation,
} from "../../services/data/gridData";
import { fetchOrderSummaryInfo } from "../../services/thunks";
import CustomLoadingOverlay from "../grid/CustomLoadingOverlay";
import CustomNoRowsOverlay from "../grid/CustomNoRowsOverlay2";
import InstructionSummary from "../work-instructions/InstructionSummary";
import Loader from "react-loader-spinner";
import {
  selectOrderSummaryLocations,
  selectOrderSummaryImages,
} from "../../services/selectors";

const LocationList = () => {
  const { OrderId } = useParams();
  const dispatch = useDispatch();
  const locations = useSelector(selectOrderSummaryLocations);
  const loading = useSelector((state) => state.locations.loading);
  const images = useSelector(selectOrderSummaryImages);
  const [gridApi, setGridApi] = useState();
  const [, setColumnApi] = useState();
  const isMounted = useMountedState();
  const selectedLocation = useSelector(
    (state) => state.gridData.selectedLocation
  );

  let columnDefs = [
    {
      headerName: "Select",
      colId: "select",
      checkboxSelection: true,
      maxWidth: 120,
      valueGetter: function (params) {
        if (params.data.item_count === 0) {
          return "New";
        } else if (params.data.item_count - params.data.items_complete === 0) {
          return "Complete";
        }
      },
      filter: false,
    },
    {
      headerName: "Worksheet Ref",
      field: "worksheet_ref",
      colId: "worksheet_ref",
      maxWidth: 150,
      sort: "asc",
    },
    { headerName: "Location", field: "location_ref" },
    {
      headerName: "Item Count",
      field: "item_count",
      colId: "item_count",
      type: "numericColumn",
      maxWidth: 150,
    },
    {
      headerName: "Items Complete",
      field: "items_complete",
      colId: "items_complete",
      type: "numericColumn",
      maxWidth: 150,
    },
    {
      headerName: "Items Remaining",
      colId: "items_remaining",
      type: "numericColumn",
      maxWidth: 150,
      valueGetter: function (params) {
        const { item_count, items_complete } = params.data;
        return item_count - items_complete;
      },
    },
    {
      headerName: "Images",
      field: "image_count",
      colId: "imageCount",
      type: "rightAligned",
      maxWidth: 150,
      cellRenderer: getImageCount,
    },
    {
      headerName: "Order Value",
      field: "total_payable",
      colId: "total_payable",
      type: "rightAligned",
      cellStyle: { fontWeight: "bold" },
      valueFormatter: function (params) {
        return params.value.toLocaleString(undefined, {
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        });
      },
    },
    {
      headerName: "Value Complete",
      field: "value_complete",
      colId: "value_complete",
      type: "rightAligned",
      cellStyle: { fontWeight: "bold" },
      valueFormatter: function (params) {
        return params.value.toLocaleString(undefined, {
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        });
      },
    },
    {
      headerName: "Value Remaining",
      colId: "value_remaining",
      type: "numericColumn",
      cellStyle: { fontWeight: "bold" },
      
      valueGetter: function (params) {
        const { total_payable, value_complete } = params.data;
        return (total_payable - value_complete).toLocaleString(undefined, {
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        });
      },
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
    suppressRowClickSelection: false,
    onCellClicked: (e) => {
      if (e.column.colId === "imageCount") {
        e.node.setSelected(false);
      }
    },
    onRowSelected: rowSelected,
    suppressLoadingOverlay: true,
    /* suppressNoRowsOverlay: false,
    frameworkComponents: {
      customNoRowsOverlay: CustomNoRowsOverlay,
    },
    noRowsOverlayComponent: "customNoRowsOverlay",
    noRowsOverlayComponentParams: {
      noRowsMessageFunc: function () {
        return (
          <h3 style={{ textAlign: "center", marginTop: "15px" }}>...Loading</h3>
        );
        return (
          <Loader
            style={{ textAlign: "center", marginTop: "15px" }}
            type={"Puff"}
            color="#366363"
          />
        );
      },
    }, */
  };

  useEffectOnce(() => {
    !locations.length > 0 && dispatch(fetchOrderSummaryInfo(OrderId));
    dispatch(setSelectedLocation(false));
  });

  useUpdateEffect(() => {
    gridApi.setRowData(locations);
    //gridApi.redrawRows();
  }, [images, locations]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
    params.api.sizeColumnsToFit();
  };

  function rowSelected(event) {
    if (event.node.selected) {
      dispatch(setSelectedLocation(event.data));
    } else {
      dispatch(setSelectedLocation(false));
    }
  }

  function getImageCount(params) {
    let link;
    if (params.data.image_count > 0) {
      link = document.createElement("a");
      link.href = "#";
      link.style = "font-weight: bold";
      link.innerText = params.data.image_count;
      link.addEventListener("click", (e) => {
        e.preventDefault();
        dispatch(setClickedLocation(params.data));
        dispatch(
          show("instruction-modal", {
            title: "LOCATION IMAGES",
            content: "locationImages",
          })
        );
      });
      return link;
    } else return params.data.image_count;
  }

  useEffect(() => {
    if (isMounted) {
      if (gridApi) {
        if (!selectedLocation) {
          gridApi.deselectAll();
        }
      }
    }
  }, [gridApi, isMounted, selectedLocation]);

  return (
    <Fragment>
      <Container fluid>
        <InstructionSummary />
        <div className="grid-title">SITE LOCATION LISTING:</div>
        <hr />
        <div className="ag-theme-custom-react">
          <AgGridReact
            gridOptions={gridOptions}
            rowData={locations}
            immuntableData={true}
            getRowNodeId={(data) => data.id}
            onGridReady={onGridReady}
            onGridSizeChanged={(params) => params.api.sizeColumnsToFit()}
            rowDataChangeDetectionStrategy={
              ChangeDetectionStrategyType.IdentityCheck
            }
          />
        </div>

        {loading && locations.length === 0 && (
          <Loader
            style={{ textAlign: "center", marginTop: "30px" }}
            type={"Puff"}
            color="#366363"
            height={150}
            width={150}
          />
        )}
      </Container>
    </Fragment>
  );
};

export default LocationList;
