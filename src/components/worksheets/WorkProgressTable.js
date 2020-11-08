import React, {useContext, useEffect, useRef, useState} from "react";
import CustomNoRowsOverlay from '../grid/CustomNoRowsOverlay';
import {AgGridReact} from "ag-grid-react";




import InstructionSummary from "../work-instructions/InstructionSummary";
import Container from "react-bootstrap/Container";
import { useSelector } from "react-redux";



function formatNumber(params) {
    return params.value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
}

function parseNumber(params) {
    return parseFloat(params.newValue)
}

const WorkProgressTable = (props) => {
    const orderDetail = useSelector(state => state.instructionDetails)
    const selectedLocation = useSelector(state => state.gridData.selectedLocation)
    let cellDefs = []


    const [editingGridCell, setEditingGridCell] = useState()
    let columnDefs = [
        {headerName: 'ID', field: 'id', hide: true},
        {headerName: 'Worksheet Ref', field: 'worksheet_ref'},
        {headerName: 'Item Ref', field: 'item_number', sort: "asc"},
        {headerName: 'Item Type', field: 'item_type',},
        {headerName: 'Qty Ordered', field: 'qty_ordered', type: "numericColumn", valueFormatter: formatNumber,},
        {headerName: 'Activity Code', field: 'activity_code'},
        {headerName: 'Activity Description', field: 'activity_description', minWidth: 500,},
        {
            headerName: 'Qty Os',
            field: 'qty_os',
            type: "numericColumn",
            valueFormatter: formatNumber,
        },
        {
            headerName: 'Qty Done',
            colId: 'qty_to_complete',
            field: 'qty_to_complete',
            type: "numericColumn",
            editable: true,
            valueFormatter: formatNumber,
            valueParser: parseNumber,
        }
    ]
    let defaultColDef = {
        filter: true,
        sortable: true,
        resizable: true,
        flex: true,
    }

    let gridOptions = {
        columnDefs: columnDefs,
        defaultColDef: defaultColDef,
        pagination: true,
        paginationPageSize: 20,
        domLayout: 'autoHeight',
        singleClickEdit: false,
        editType: 'fullRow',
        enableCellChangeFlash: true,
        onCellValueChanged: onCellChangedHandler,

        frameworkComponents: {
            customNoRowsOverlay: CustomNoRowsOverlay,
        },
        noRowsOverlayComponent: 'customNoRowsOverlay',
        noRowsOverlayComponentParams: {
            noRowsMessageFunc: function () {
                return 'ALL ITEMS FOR THIS WORKSHEET ARE COMPLETE'
            },
        },
        onGridReady: function () {
            gridInit.api.startEditingCell({rowIndex: 0, colKey: 'qty_to_complete'})
            cellDefs = gridInit.api.getEditingCells()
            cellDefs.forEach(function (cellDef) {
                const {rowIndex, column} = cellDef;
                setEditingGridCell({rowIndex: rowIndex, colKey: column.getId()})
                console.log(cellDefs)
            })
        }
    }

    let newFormData = []

    function onCellChangedHandler(event) {
        gridInit.api.flashCells({
            rowNodes: [event.node], columns: ["qty_to_complete"]
        })
        if (event.data.qty_to_complete > event.data.qty_ordered - event.data.qty_complete) {
            const errorCell = gridInit.api.getEditingCells()
            const rowIndex = errorCell[0].rowIndex
            alert("Cannot Exceed Qty Outstanding")

            gridInit.api.stopEditing()
            gridInit.api.startEditingCell({rowIndex: rowIndex, colKey: 'qty_to_complete', keyPress: 46})
        } else {
            newFormData.push(event.data.id)

        }
    }

    const [gridInit, setGridInit] = useState(gridOptions)

    const tableData = () => {
       // let worksheetItems = orderDetail.filter(item => item.location_ref === selectedLocation[0] && item.qty_ordered - item.qty_complete !== 0)
      //  const worksheetData = worksheetItems.map(v => ({...v, qty_to_complete: 0}))
       // gridInit.api.setRowData(worksheetData)

    }

    useEffect(() => {
        tableData()
    }, [])



    return (
        <Container fluid>
            <InstructionSummary/>
            <Container fluid>
                <div className="grid-title">
                    UPDATE WORK PROGRESS
                </div>

                <hr/>
                <div className="ag-theme-custom-react">
                    <AgGridReact
                        gridOptions={gridOptions}

                    />
                </div>
            </Container>

        </Container>
    )
}
export default WorkProgressTable
