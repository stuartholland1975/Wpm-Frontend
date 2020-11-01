import React, {Fragment, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import {fetchWorkInstructions, selectAllWorkInstructions} from './InstructionData';
import {fetchDocuments, selectAllDocuments} from '../documents/documentsDataReducer';
import {useEffectOnce, useLatest} from 'react-use';
import {useDispatch, useSelector} from 'react-redux';
import CustomNoRowsOverlay from '../../CustomNoRowsOverlay';
import Loader from 'react-loader-spinner';
import {fetchAreas} from "../areas/areaDataReducer";
import {fetchWorkTypes} from "../worktypes/workTypesDataReducer";

const formatNumber = (params) =>
    Math.floor (params.value)
        .toString ()
        .replace (/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

const InstructionList = () => {
    const dispatch = useDispatch ();
    const workInstructions = useSelector (selectAllWorkInstructions);
    const documents = useSelector (selectAllDocuments);
    const latestDocs = useLatest (documents);

    const [gridApi, setGridApi] = useState ();
    const [columnApi, setColumnApi] = useState ();

    const ColumnDefs = [
        {headerName: 'ID', field: 'id', hide: true},
        {
            headerName: 'Select',
            colId: 'select',
            checkboxSelection: true,
            maxWidth: 80,
        },
        {
            headerName: 'Work Instruction',
            field: 'work_instruction',
            sort: 'desc',
        },
        {
            headerName: 'Project Title',
            field: 'project_title',
            minWidth: 400,

        },
        {
            headerName: 'Date Issued',
            field: 'issued_date_formatted',
            type: 'dateColumn',
        },
        {
            headerName: 'Work Type',
            field: 'work_type',
        },
        {
            headerName: 'Area',
            field: 'area_description',
            editable: true,
            maxWidth: 100,
        },
        {
            headerName: 'Docs',
            colId: 'docs',
            type: 'numericColumn',
            maxWidth: 100,
            valueGetter: getDocumentCount,
        },
        {
            headerName: 'Item Count',
            field: 'item_count',
            type: 'numericColumn',
            maxWidth: 110,
        },
        {
            headerName: 'Order Value',
            field: 'order_value',
            type: 'numericColumn',
            cellStyle: {fontWeight: 'bold'},
            sortable: true,
            filter: 'agNumberColumnFilter',
            valueFormatter: formatNumber,
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
            filter: 'agDateColumnFilter',
        },
    };
    const gridOptions = {
        columnDefs: ColumnDefs,
        defaultColDef: defaultColDef,
        columnTypes: columnTypes,
        pagination: true,
        paginationPageSize: 35,
        rowSelection: 'single',
        suppressRowClickSelection: false,
        domLayout: 'autoHeight',
        suppressClickEdit: true,
        suppressNoRowsOverlay: false,
        frameworkComponents: {
            customNoRowsOverlay: CustomNoRowsOverlay,
        },
        noRowsOverlayComponent: 'customNoRowsOverlay',
        noRowsOverlayComponentParams: {
            noRowsMessageFunc: () => <Loader style={{textAlign: 'center'}} type={'ThreeDots'} color={'Blue'}/>,
        },
    };

    useEffectOnce (() => {
        dispatch (fetchWorkInstructions ());
        dispatch (fetchDocuments ());
        dispatch(fetchAreas());
        dispatch(fetchWorkTypes())
    });

    const onGridReady = (params) => {
        setGridApi (params.api);
        setColumnApi (params.columnApi);
        params.api.sizeColumnsToFit ();
    };

    function getDocumentCount (params) {
        return latestDocs.current.filter (
            (obj) => obj["work_instruction"] === params.data.id,
        ).length;
    }

    return (
        <Fragment>
            <div className="ag-theme-custom-react" style={{width: '100%'}}>
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
