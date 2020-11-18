import { createSlice, unwrapResult } from "@reduxjs/toolkit";
import React, { useRef, useState } from "react";
import { ExcelRenderer, OutTable } from "react-excel-renderer";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { selectAllActivities } from "../../services/data/activityData";
import { fetchSelectedActivities } from "../../services/thunks";

export const ExcelSlice = createSlice({
	name: "ExcelImport",
	initialState: {rows: [], cols: [], poles: []},
	reducers: {
		setImportedData: (state, action) => {
			state.rows = action.payload.rows;
			state.poles = action.payload.poles;
		},
	}
});

export const {setImportedData} = ExcelSlice.actions;


const ImportInstructionData = () => {
	const dispatch = useDispatch();
	const selectedRow = useSelector(state => state.gridData.selectedRow);
	const selectedActivities = useSelector(selectAllActivities);
	const [data, setData] = useState({rows: [], cols: []});
	const [poles, setPoles] = useState();
	const [activities, setActivities] = useState();
	const [items, setItems] = useState();
	const rowsRef = useRef([]);


	const fileHandler = (event) => {
		let fileObj = event.target.files[0];
		//just pass the fileObj as parameter
		ExcelRenderer(fileObj, (err, resp) => {
			if (err) {
				console.log(err);
			} else {
				setData({
					cols: resp.cols,
					rows: resp.rows
				});
				resp.rows.shift();
				rowsRef.current = resp.rows;
				const uniqueActivities = [...new Set(resp.rows.map(item => item[3]))];
				dispatch(fetchSelectedActivities(uniqueActivities)).then(unwrapResult).then(activities => setActivities(activities));
			}
		});
	};

	const processData = () => {

		const uniquePoles = [...new Set(rowsRef.current.map(item => item[0]))];
		const poleObject = uniquePoles.map(item => ({location_ref: item, id: uuidv4()}));
		setPoles(poleObject);
		const itemObject = rowsRef.current.map(item => ({
			work_instruction: selectedRow.work_instruction,
			location_ref: poleObject.filter(obj => obj.location_ref === item[0])[0].id,
			item_number: item[1],
			item_type: item[2].toUpperCase(),
			activity_ref: selectedActivities.filter(obj => obj.activity_code === item[3])[0].id,
			qty_ordered: item[15],
			labour_base: selectedActivities.filter(obj => obj.activity_code === item[3])[0].labour_base * item[15],
			labour_uplift: selectedActivities.filter(obj => obj.activity_code === item[3])[0].labour_uplift * item[15],
			labour_total: selectedActivities.filter(obj => obj.activity_code === item[3])[0].labour_total * item[15],
			unit_labour_payable: selectedActivities.filter(obj => obj.activity_code === item[3])[0].labour_total * item[15] / item[15],
			materials_base: item[8],
			materials_uplift: item[8] * .05,
			materials_total_excl_other_materials: item[8] * 1.05,

		}));
		console.log(itemObject);
	};


	return (
		<div>
			<input type="file" onChange={ fileHandler } style={ {"padding": "10px"} }/>

			<input type="button" onClick={ processData } style={ {"padding": "10px"} } value="PROCESS DATA"/>

			<OutTable data={ data.rows } columns={ data.cols } tableClassName="ExcelTable2007"
			          tableHeaderRowClass="heading"/>
		</div>
	);

};
export default ImportInstructionData;
