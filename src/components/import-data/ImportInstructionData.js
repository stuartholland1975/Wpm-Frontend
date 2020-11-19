import { createSlice } from "@reduxjs/toolkit";
import React, { useRef, useState } from "react";
import { ExcelRenderer, OutTable } from "react-excel-renderer";
import { useDispatch, useSelector } from "react-redux";
import { selectAllActivities } from "../../services/data/activityData";
import { selectAllLocations } from "../../services/data/locationData";
import { createLocation, fetchSelectedActivities, newInstructionDetail } from "../../services/thunks";

export const ExcelSlice = createSlice({
	name: "ExcelImport",
	initialState: {rows: [], cols: [], poles: []},
	reducers: {
		setImportedData: (state, action) => {
			state.rows = action.payload.rows;
			state.cols = action.payload.cols;
		},
	},
});

export const {setImportedData} = ExcelSlice.actions;

const numFormat = (num) => {
	return num.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};

const ImportInstructionData = () => {
	const dispatch = useDispatch();
	const [data, setData] = useState({rows: [], cols: []});
	const importDraft = useSelector(state => state.excelData);
	const activities = useSelector(selectAllActivities);
	const workInstruction = useSelector(state => state.gridData.selectedRow.work_instruction);
	const locations = useSelector(selectAllLocations)

	const rowsRef = useRef([]);
	//const apiObject = useSelector(createApiObject);

	const fileHandler = (event) => {
		let fileObj = event.target.files[0];
		//just pass the fileObj as parameter
		ExcelRenderer(fileObj, (err, resp) => {
			if (err) {
				console.log(err);
			} else {
				resp.rows.shift();
				dispatch(setImportedData({rows: resp.rows, cols: resp.cols}));
				const uniqueActivities = [...new Set(resp.rows.map((item) => item[3]))];
				dispatch(fetchSelectedActivities(uniqueActivities));

			}
		});
	};


	const createLocations = () => {
		const uniqueLocations = [...new Set(importDraft.rows.map(item => item[0]))];
		uniqueLocations.forEach(value => {
			dispatch(createLocation({location_ref: value, location_description: value, work_instruction: workInstruction}));
		});
	};

	const createItems = () => {
		let container = {};
		importDraft.rows.forEach((item) => {
      const labourBase =
        activities.filter((obj) => obj.activity_code === item[3])[0]
          .labour_base * item[15];
      const labourUplift =
        activities.filter((obj) => obj.activity_code === item[3])[0]
          .labour_uplift * item[15];
      const labourTotal = labourBase + labourUplift;
      const materialsTotalExclOtherMaterials = parseFloat(item[8] * 1.05);
      const MaterialsOther =
        parseFloat(activities.filter((obj) => obj.activity_code === item[3])[0]
          .materials_other * item[15]);
      const materialsTotalInclOtherMaterials =
        parseFloat(materialsTotalExclOtherMaterials + MaterialsOther);
      const unitMaterialsPayable = parseFloat(materialsTotalInclOtherMaterials / item[15]);
      const totalPayable = parseFloat(materialsTotalInclOtherMaterials + labourTotal);
      const unitTotalPayable = parseFloat(totalPayable / item[15]);

      container.work_instruction = workInstruction;
      container.location_ref = locations.filter(
        (obj) => obj.location_ref === item[0]
      )[0].id;
      container.item_number = item[1];
      container.item_type = item[2].toUpperCase();
      container.activity_ref = activities.filter(
        (obj) => obj.activity_code === item[3]
      )[0].id;
      container.qty_ordered = item[15];
      container.labour_base = item[7];
      container.labour_uplift = (item[7] * 0.3745).toFixed(2);
      container.labour_total = (item[7] * 1.3745).toFixed(2);
      container.unit_labour_payable = (item[7] * 1.3745 / item[15]).toFixed(2);
      container.materials_base = item[8].toFixed(2)
      container.materials_uplift = (item[8] * 0.05).toFixed(2);
      container.materials_total_excl_other_materials = (item[8] * 1.05).toFixed(2);
      container.materials_other = item[13].toFixed(2);
      container.materials_total_incl_other_materials = ((item[8] * 1.05) + item[13]).toFixed(2);
      container.unit_materials_payable = (((item[8] * 1.05 + item[13]) / item[15])).toFixed(2);
      container.total_payable = ((item[8] * 1.05 + item[13] + (item[7] * 1.3745))).toFixed(2);
      container.unit_total_payable = ((item[8] * 1.05 + item[13] + (item[7] * 1.3745)) / item[15]).toFixed(2);
      container.pack_number = item[6];
      dispatch(newInstructionDetail(container))
    });

	}

	return (
		<div>
			<input type="file" onChange={ fileHandler } style={ {padding: "10px"} }/>

			<input
				type="button"
				onClick={ createLocations }
				style={ {padding: "10px"} }
				value="CREATE LOCATIONS"
			/>

			<input
				type="button"
				onClick={ createItems }
				style={ {padding: "10px"} }
				value="CREATE ITEMS"
			/>

			<OutTable
				data={ importDraft.rows }
				columns={ importDraft.cols }
				tableClassName="ExcelTable2007"
				tableHeaderRowClass="heading"
			/>
		</div>
	);
};
export default ImportInstructionData;
