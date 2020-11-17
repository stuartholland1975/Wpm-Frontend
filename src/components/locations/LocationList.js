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
import { fetchOrderSummaryInfo } from "../../services/thunks";
import CustomNoRowsOverlay from "../grid/CustomNoRowsOverlay";
import { setClickedLocation, setSelectedLocation } from "../../services/data/gridData";
import { selectAllImages } from "../../services/data/ImageData";
import InstructionSummary from "../work-instructions/InstructionSummary";
import { selectAllLocations } from "../../services/data/locationData";
import Loader from "react-loader-spinner";

const LocationList = () => {
  const { OrderId } = useParams();
  const dispatch = useDispatch();
  

  const locations = useSelector(selectAllLocations);
  const images = useSelector(selectAllImages);
  const latestImages = useLatest(images);
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
      colId: "images",
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
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
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
    suppressRowClickSelection: true,
    onRowSelected: rowSelected,
    onCellClicked: cellClicked,
    suppressNoRowsOverlay: false,
    frameworkComponents: {
      customNoRowsOverlay: CustomNoRowsOverlay,
    },
    noRowsOverlayComponent: "customNoRowsOverlay",
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
    /* isRowSelectable: function (rowNode) {
			const {item_count, items_complete} = rowNode.data;
			return rowNode.data ? item_count - items_complete > 0 || item_count === 0 : true;
		}, */
  };

  useEffectOnce(() => {
    dispatch(fetchOrderSummaryInfo(OrderId));
  });

  useUpdateEffect(() => {
    gridApi.redrawRows();
  }, [images]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
    params.api.sizeColumnsToFit();
  };

  /* useUpdateEffect(() => {
		gridApi.sizeColumnsToFit();
		update();
	}, [width]); */

  function rowSelected() {
    const selectedNode = gridOptions.api.getSelectedNodes();

    if (selectedNode.length > 0) {
      dispatch(setSelectedLocation(selectedNode[0].data));
    }
  }

  function cellClicked(params) {
    const imageColumn = gridOptions.columnApi.getColumn("images");
    if (params.colDef.colId === imageColumn.colDef.colId) {
      dispatch(setClickedLocation(params.data));
    }
  }

  function getImageCount(params) {
    const siteLocationImages = latestImages.current.filter(
      (obj) => obj.location === params.data.id
    );

    let link;
    if (siteLocationImages.length > 0) {
      link = document.createElement("a");
      link.href = "#";
      link.style = "font-weight: bold";
      link.innerText = siteLocationImages.length;
      link.addEventListener("click", (e) => {
        e.preventDefault();
        dispatch(
          show("instruction-modal", {
            title: "LOCATION IMAGES",
            content: "locationImages",
          })
        );
      });
      return link;
    } else {
      link = siteLocationImages.length;
    }
    return link;
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
      </Container>
    </Fragment>
  );
};

export default LocationList;
