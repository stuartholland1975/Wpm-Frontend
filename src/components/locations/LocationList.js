import React, { Fragment, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { useDispatch, useSelector } from "react-redux";
import CustomNoRowsOverlay from "../grid/CustomNoRowsOverlay";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link, useParams } from "react-router-dom";
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
import { fetchInstructionDetail } from "../work-instructions/instructionDetailData";
import { fetchLocations, selectAllLocations } from "./locationData";
import { fetchImages, selectAllImages } from "../images/ImageData";
import { PurpleButton, RedButton, GreenButton } from "../ui-components/Buttons";
import InstructionSummary from "../work-instructions/InstructionSummary";
import useOnWindowResize from "@rooks/use-on-window-resize";
import { setSelectedNode } from "../grid/gridData";

const LocationList = (props) => {
  const { OrderId } = useParams();
  const dispatch = useDispatch();
  const [] = useState({
    title: "",
    content: "",
    image: null,
    image_type: [],
    date_image: "",
    location: [],
    image_file: [],
  });

  const locations = useSelector(selectAllLocations);
  const images = useSelector(selectAllImages);
  const latestImages = useLatest(images);
  const [gridApi, setGridApi] = useState();
  const [, setColumnApi] = useState();
  const { width, height } = useWindowSize();
  const update = useUpdate();

  useLogger("LocationList", props);

  let columnDefs = [
    {
      headerName: "Select",
      colId: "select",
      checkboxSelection: true,
      maxWidth: 100,
      valueGetter: function (params) {
        if (params.data.item_count - params.data.items_complete === 0) {
          return "Complete";
        }
      },
      filter: false,
    },
    { headerName: "Worksheet Ref", field: "worksheet_ref" },
    { headerName: "Location", field: "location_ref"},
    {
      headerName: "Item Count",
      field: "item_count",
      type: "numericColumn",
      maxWidth: 150,
    },
    {
      headerName: "Items Complete",
      field: "items_complete",
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
    suppressRowClickSelection: false,
    onRowSelected: nodeSelected,
    suppressNoRowsOverlay: false,
    frameworkComponents: {
      customNoRowsOverlay: CustomNoRowsOverlay,
    },
    noRowsOverlayComponent: "customNoRowsOverlay",
    noRowsOverlayComponentParams: {
      noRowsMessageFunc: function () {
        return "PLEASE WAIT DATA IS LOADING......";
      },
    },
    isRowSelectable: function (rowNode) {
      const { item_count, items_complete } = rowNode.data;
      return rowNode.data ? item_count - items_complete > 0 : true;
    },
  };

  useEffectOnce(() => {
    dispatch(fetchImages(OrderId));
    dispatch(fetchInstructionDetail(OrderId));
    dispatch(fetchLocations(OrderId));
  });

  useUpdateEffect(() => {
    gridApi.redrawRows(locations);
  }, [images]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
    params.api.sizeColumnsToFit();
  };

  useUpdateEffect(() => {
    gridApi.sizeColumnsToFit();
    update();
  }, [width]);

  function nodeSelected() {
    const selectedNode = gridOptions.api.getSelectedNodes();

    if (selectedNode.length > 0) {
      dispatch(setSelectedNode(selectedNode[0].data));
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
        viewImages(params, siteLocationImages);
      });

      return link;
    } else {
      link = siteLocationImages.length;
    }
    return link;
  }

  function viewImages() {
    console.log("VIEW IMAGES");
  }

  const uploadImageHandler = () => {};

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
          />
        </div>
      </Container>
    </Fragment>
  );
};

export default LocationList;
