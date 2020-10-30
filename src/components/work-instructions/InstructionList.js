import React, { Fragment, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { fetchWorkInstructions } from "./InstructionData";
import { selectAllWorkInstructions } from "./InstructionData";
import { useEffectOnce } from "react-use";
import { useDispatch, useSelector } from "react-redux";

const formatNumber = (params) =>
  Math.floor(params.value)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

const InstructionList = () => {
  const dispatch = useDispatch();
  const workInstructions = useSelector(selectAllWorkInstructions);

  useEffectOnce(() => dispatch(fetchWorkInstructions()));

  const [gridApi, setGridApi] = useState();
  const [columnApi, setColumnApi] = useState();

  function onGridReady(params) {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
  }

  return (
    <Fragment>
      <div className="grid-title">WORK INSTRUCTION LISTING:</div>
      <div className="ag-theme-custom-react">
        <AgGridReact
          // gridOptions={gridInit}
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
