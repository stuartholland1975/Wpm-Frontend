import React, {Fragment, useEffect, useState} from "react";
import {AgGridReact} from "ag-grid-react";
import {fetchWorkInstructions, selectAllWorkInstructions,} from "./InstructionData";
import { fetchDocuments, resetDocuments, selectAllDocuments, } from "../documents/documentsDataReducer";
import {useEffectOnce, useLatest, useMountedState, useUpdateEffect, useWindowSize, useUpdate} from "react-use";
import {useDispatch, useSelector} from "react-redux";
import CustomNoRowsOverlay from "../../CustomNoRowsOverlay";
import Loader from "react-loader-spinner";
import {fetchAreas, updateArea} from "../areas/areaDataReducer";
import {fetchWorkTypes} from "../worktypes/workTypesDataReducer";
import {resetLocations} from "../locations/locationData";
import {resetInstructionDetails} from "./instructionDetailData";
import {setSelectedNode, resetGridRow} from "../grid/gridData";

const formatNumber = (params) =>
    Math.floor(params.value)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

const InstructionList = () => {
    const dispatch = useDispatch(), workInstructions = useSelector(selectAllWorkInstructions),
        documents = useSelector(selectAllDocuments),
        latestDocs = useLatest(documents), [gridApi, setGridApi] = useState(), [, setColumnApi] = useState(),
        isMounted = useMountedState(),
        selectedNode = useSelector((state) => state.gridData.selectedNode), {width, height} = useWindowSize(),
        update = useUpdate(), ColumnDefs = [
            {headerName: "ID", field: "id", hide: true},
            {
                headerName: "Select",
                colId: "select",
                checkboxSelection: true,
                maxWidth: 80,
            },
            {
                headerName: "Work Instruction",
                field: "work_instruction",
                sort: "desc",
            },
            {
                headerName: "Project Title",
                field: "project_title",
                minWidth: 400,
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
                editable: true,
                maxWidth: 100,
            },
            {
                headerName: "Docs",
                colId: "docs",
                type: "numericColumn",
                maxWidth: 100,
                valueGetter: getDocumentCount,
            },
            {
                headerName: "Item Count",
                field: "item_count",
                type: "numericColumn",
                maxWidth: 110,
            },
            {
                headerName: "Order Value",
                field: "order_value",
                type: "numericColumn",
                cellStyle: {fontWeight: "bold"},
                sortable: true,
                filter: "agNumberColumnFilter",
                valueFormatter: formatNumber,
            },
        ], defaultColDef = {
            filter: true,
            sortable: true,
            resizable: true,
            flex: true,
        }, columnTypes = {
            dateColumn: {
                filter: "agDateColumnFilter",
            },
        }, gridOptions = {
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
                        style={ {textAlign: "center"} }
                        type={ "ThreeDots" }
                        color={ "Blue" }
                    />
                ),
            },
        };


    useEffectOnce(() => {
        dispatch(fetchWorkInstructions());
        dispatch(fetchDocuments());
        dispatch(fetchAreas());
        dispatch(fetchWorkTypes());
        dispatch(resetLocations());
        dispatch(resetInstructionDetails());
        dispatch(resetDocuments());
        dispatch(resetGridRow());
    });

    const onGridReady = (params) => {
        setGridApi(params.api);
        setColumnApi(params.columnApi);
        params.api.sizeColumnsToFit();
    };

    function getDocumentCount(params) {
        return latestDocs.current.filter(
            (obj) => obj["work_instruction"] === params.data.id
        ).length;
    }

    function nodeSelected() {
        const selectedNode = gridOptions.api.getSelectedNodes();
        if (selectedNode.length > 0) {
            dispatch(setSelectedNode(selectedNode[0].data));
        }
    }

    useUpdateEffect(() => {
        gridApi.sizeColumnsToFit()
        update()
    },[width])
    
    
    
    useEffect(() => {
        if (isMounted) {
            if (gridApi) {
                if (!selectedNode) {
                    gridApi.deselectAll();
                }
            }
        }
    }, [gridApi, isMounted, selectedNode]);

    return (
        <Fragment>
            <div className="ag-theme-custom-react" style={{width: "100%"}}>
                <div className="grid-title">WORK INSTRUCTION LISTING:</div>
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
