import { createSlice } from "@reduxjs/toolkit";
import React, { useRef, useState } from "react";
import { ExcelRenderer, OutTable } from "react-excel-renderer";
import { useDispatch, useSelector } from "react-redux";
import { selectAllActivities } from "../../services/data/activityData";
import { selectAllLocations } from "../../services/data/locationData";
import {
  createLocation,
  fetchSelectedActivities,
  newInstructionDetail,
  createBulkLocations,
  createBulkBillItems,
} from "../../services/thunks";

export const ExcelSlice = createSlice({
  name: "ExcelImport",
  initialState: { rows: [], cols: [], poles: [] },
  reducers: {
    setImportedData: (state, action) => {
      state.rows = action.payload.rows;
      state.cols = action.payload.cols;
    },
  },
});

export const { setImportedData } = ExcelSlice.actions;

const numFormat = (num) => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const ImportInstructionData = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState({ rows: [], cols: [] });
  const importDraft = useSelector((state) => state.excelData);
  const activities = useSelector(selectAllActivities);
  const workInstruction = useSelector(
    (state) => state.gridData.selectedRow.work_instruction
  );
  const locations = useSelector(selectAllLocations);

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
        dispatch(setImportedData({ rows: resp.rows, cols: resp.cols }));
        const uniqueActivities = [...new Set(resp.rows.map((item) => item[3]))];
        console.log(uniqueActivities);
        dispatch(fetchSelectedActivities(uniqueActivities));
      }
    });
  };

  const createLocations = () => {
    let newLocations = [];
    const uniqueLocations = [
      ...new Set(importDraft.rows.map((item) => item[0])),
    ];
    uniqueLocations.forEach((value) => {
      newLocations.push({
        location_ref: value,
        location_description: value,
        work_instruction: workInstruction,
      });
      //dispatch(createLocation({location_ref: value, location_description: value, work_instruction: workInstruction}));
    });
    dispatch(createBulkLocations(newLocations));
  };

  const createItems = () => {
    let newBillItems = [];
    importDraft.rows.forEach((item) => {
      const imported_activity_code = item[3];
      const imported_qty = item[6];
      const imported_materials = item[5];
      const imported_item_type = item[2];
      const imported_pack_number = item[4];
      const imported_item_number = item[1];
      const matched_activity = activities.filter(
        (obj) => obj.activity_code === imported_activity_code
      );

      let container = {};
      const labourBase = parseFloat(
        matched_activity.map((item) => item.labour_base)[0] * imported_qty
      );
      const labourUplift = parseFloat(
        matched_activity.map((item) => item.labour_uplift)[0] * imported_qty
      );
      const labourTotal = labourBase + labourUplift;
      const materialsTotalExclOtherMaterials = parseFloat(
        imported_materials * 1.05
      );
      const materialsOther = parseFloat(
        matched_activity.map((item) => item.materials_other)[0] * imported_qty
      );
      const materialsTotalInclOtherMaterials = parseFloat(
        materialsTotalExclOtherMaterials + materialsOther
      );
      const unitMaterialsPayable = parseFloat(
        materialsTotalInclOtherMaterials / imported_qty
      );
      const totalPayable = parseFloat(
        materialsTotalInclOtherMaterials + labourTotal
      );
      const unitTotalPayable = parseFloat(totalPayable / imported_qty);

      container.work_instruction = workInstruction;
      container.location_ref = locations.filter(
        (obj) => obj.location_ref === item[0]
      )[0].id;
      container.item_number = imported_item_number;
      container.item_type = imported_item_type.toUpperCase();
      container.activity_ref = matched_activity.map((item) => item.id)[0];
      container.qty_ordered = imported_qty;

      container.labour_base = labourBase.toFixed(2);
      container.labour_uplift = labourUplift.toFixed(2);
      container.labour_total = labourTotal.toFixed(2);
      container.unit_labour_payable = (labourTotal / imported_qty).toFixed(2);
      container.materials_base = imported_materials.toFixed(2);
      container.materials_uplift = (imported_materials * 0.05).toFixed(2);
      container.materials_total_excl_other_materials = materialsTotalExclOtherMaterials.toFixed(
        2
      );
      container.materials_other = materialsOther.toFixed(2);
      container.materials_total_incl_other_materials = materialsTotalInclOtherMaterials.toFixed(
        2
      );
      container.unit_materials_payable = materialsTotalInclOtherMaterials.toFixed(
        2
      );
      container.total_payable = totalPayable.toFixed(2);
      container.unit_total_payable = unitTotalPayable.toFixed(2);
      container.pack_number = imported_pack_number;
      newBillItems.push(container);
    });

    dispatch(createBulkBillItems(newBillItems));
  };

  return (
    <div>
      <input type="file" onChange={fileHandler} style={{ padding: "10px" }} />

      <input
        type="button"
        onClick={createLocations}
        style={{ padding: "10px" }}
        value="CREATE LOCATIONS"
      />

      <input
        type="button"
        onClick={createItems}
        style={{ padding: "10px" }}
        value="CREATE ITEMS"
      />

      <OutTable
        data={importDraft.rows}
        columns={importDraft.cols}
        tableClassName="ExcelTable2007"
        tableHeaderRowClass="heading"
      />
    </div>
  );
};
export default ImportInstructionData;
