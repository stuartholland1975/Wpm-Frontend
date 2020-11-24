import { createSelector } from "@reduxjs/toolkit";
import { selectAllActivities } from "./data/activityData";
import { selectAllWorkInstructions } from "./data/InstructionData";
import { selectAllInstructionDetails } from "./data/instructionDetailData";
import { selectAllLocations } from "./data/locationData";
import { selectAllAvailableWorksheets } from "./data/WorksheetData";

const numFormat = (num) => {
	return num.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};

export const selectedOrder = (state) => state.gridData.selectedInstruction;
export const selectedLocation = (state) => state.gridData.selectedLocation;

const applicationLocations = state => state.applicationDetail.locations;
const applicationImages = state => state.applicationDetail.images;

export const appOrderLocations = createSelector(
	[
		applicationLocations,
		selectedOrder,
		applicationImages
	],
	(locations, order, images) => {
		const orderLocations = locations.filter(
			(obj) => obj.work_instruction === order.work_instruction
		);
		return orderLocations.map((item) => ({
			...item,

			pre_construction_images: images
				.filter((obj) => obj.location === item.id && obj["image_type"] === "PRE")
				.map((item) => item.id).length,
			post_construction_images: images
				.filter((obj) => obj.location === item.id && obj["image_type"] === "POST")
				.map((item) => item.id).length,
			misc_construction_images: images
				.filter((obj) => obj.location === item.id && obj["image_type"] === "MISC")
				.map((item) => item.id).length,
		}));
	}
);

const workInstruction = (state) => state.gridData.selectedRow.work_instruction;
const spreadsheetData = (state) => state.excelData.rows;
export const createApiObject = createSelector(
	[workInstruction, spreadsheetData, selectAllActivities, selectAllLocations],
	(workInstruction, spreadsheetData, activities, locations) => {
		let container = {};
		return spreadsheetData.forEach((item) => {
			const labourBase =
				activities.filter((obj) => obj.activity_code === item[3])[0]
					.labour_base * item[15];
			const labourUplift =
				activities.filter((obj) => obj.activity_code === item[3])[0]
					.labour_uplift * item[15];
			const labourTotal = labourBase + labourUplift;
			const materialsTotalExclOtherMaterials = numFormat(item[8] * 1.05);
			const MaterialsOther =
				activities.filter((obj) => obj.activity_code === item[3])[0]
					.materials_other * item[15];
			const materialsTotalInclOtherMaterials =
				materialsTotalExclOtherMaterials + MaterialsOther;
			const unitMaterialsPayable = materialsTotalInclOtherMaterials / item[15];
			const totalPayable = materialsTotalInclOtherMaterials + labourTotal;
			const unitTotalPayable = totalPayable / item[15];

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
			container.labour_base = labourBase;
			container.labour_uplift = labourUplift;
			container.labour_total = labourTotal;
			container.unit_labour_payable = labourTotal / item[15];
			container.materials_base = item[8];
			container.materials_uplift = item[8] * 0.05;
			container.materials_total_excl_other_materials = materialsTotalExclOtherMaterials;
			container.materials_other = MaterialsOther;
			container.materials_total_incl_other_materials = materialsTotalInclOtherMaterials;
			container.unit_materials_payable = unitMaterialsPayable;
			container.total_payable = totalPayable;
			container.unit_total_payable = unitTotalPayable;
			container.pack_number = item[6];
			return container;
		});
	}
);

const applicationItems = state => state.applicationDetail.items;

export const appOrderItems = createSelector(
	[selectedOrder, applicationItems],
	(order, items) => {
		return items.filter(
			(obj) => obj.work_instruction === order.work_instruction
		);
	}
);

export const getAvailableOrders = createSelector(
	[selectAllWorkInstructions, selectAllAvailableWorksheets],
	(instructions, worksheets) =>
		instructions.filter((obj) =>
			worksheets.some(({order_ref}) => order_ref === obj.work_instruction)
		)
);

export const getAvailableValues = createSelector(
	[getAvailableOrders, selectAllAvailableWorksheets],
	(orders, worksheets) =>
		orders.map((item) => {
			return {
				...item,
				available_value: worksheets
					.filter(({order_ref}) => order_ref === item.work_instruction)
					.map((item) => item.value_complete)
					.reduce((acc, item) => acc + item, 0),
			};
		})
);

const selectedInstruction = (state) => state.gridData.selectedInstruction;

export const availableWorksheets = createSelector(
	[selectAllAvailableWorksheets, selectedInstruction],
	(worksheets, instruction) =>
		worksheets.filter((obj) => obj.order_ref === instruction.work_instruction)
);



export const inCompleteItems = createSelector(
	[selectAllInstructionDetails, selectedLocation],
	(items, location) =>
		items.filter((obj) => obj.qty_os > 0 && obj.location_ref === location.id)
);
