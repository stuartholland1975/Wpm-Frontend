import { createSelector } from "@reduxjs/toolkit";
import { selectAllAvailableWorksheets } from "./data/WorksheetData";
import { selectAllImages } from "./data/ImageData";
import { selectAllLocations } from "./data/locationData";
import { selectAllWorkInstructions } from "./data/InstructionData";
import { selectAllInstructionDetails } from "./data/instructionDetailData";

const selectedOrder = (state) => state.gridData.selectedInstruction;

export const appOrderLocations = createSelector(
  [
    selectAllLocations,
    selectedOrder,
    selectAllAvailableWorksheets,
    selectAllImages,
  ],
  (locations, order, worksheets, images) => {
    const orderLocations = locations.filter(
      (obj) => obj.work_instruction === order.work_instruction
    );
    return orderLocations.map((item) => ({
      ...item,
      application_value: worksheets
        .filter((obj) => obj.worksheet_ref === item.id)
        .map((item) => item.value_complete)
        .reduce((acc, item) => acc + item, 0),
      application_labour: worksheets
        .filter((obj) => obj.worksheet_ref === item.id)
        .map((item) => item.labour_complete)
        .reduce((acc, item) => acc + item, 0),
      application_materials: worksheets
        .filter((obj) => obj.worksheet_ref === item.id)
        .map((item) => item.materials_complete)
        .reduce((acc, item) => acc + item, 0),
      pre_construction_images: images
        .filter((obj) => obj.location === item.id && obj.imageType === "PRE")
        .map((item) => item.id).length,
      post_construction_images: images
        .filter((obj) => obj.location === item.id && obj.imageType === "POST")
        .map((item) => item.id).length,
      misc_construction_images: images
        .filter((obj) => obj.location === item.id && obj.imageType === "MISC")
        .map((item) => item.id).length,
    }));
  }
);

export const appInstructions = createSelector(
  [selectAllAvailableWorksheets, selectAllWorkInstructions],
  (worksheets, instructions) =>
    instructions.map((item) => ({
      ...item,
      applied_value: worksheets
        .filter((obj) => obj.order_ref === item.work_instruction)
        .map((item) => item.value_complete)
        .reduce((acc, item) => acc + item, 0),
      applied_labour: worksheets
        .filter((obj) => obj.order_ref === item.work_instruction)
        .map((item) => item.labour_complete)
        .reduce((acc, item) => acc + item, 0),
      applied_materials: worksheets
        .filter((obj) => obj.order_ref === item.work_instruction)
        .map((item) => item.materials_complete)
        .reduce((acc, item) => acc + item, 0),
    }))
);

export const appOrderItems = createSelector(
  [selectedOrder, selectAllInstructionDetails, selectAllAvailableWorksheets],
  (order, items, worksheets) => {
    const orderBillItems = items.filter(
      (obj) => obj.work_instruction === order.work_instruction
    );

    return orderBillItems.map((item) => ({
      ...item,
      qty_applied: worksheets
        .filter((obj) => obj.item_ref === item.id)
        .map((item) => item.qty_complete)
        .reduce((acc, item) => acc + item, 0),
      application_labour: worksheets
        .filter((obj) => obj.item_ref === item.id)
        .map((item) => item.labour_complete)
        .reduce((acc, item) => acc + item, 0),
      application_materials: worksheets
        .filter((obj) => obj.item_ref === item.id)
        .map((item) => item.materials_complete)
        .reduce((acc, item) => acc + item, 0),
      application_value: worksheets
        .filter((obj) => obj.item_ref === item.id)
        .map((item) => item.value_complete)
        .reduce((acc, item) => acc + item, 0),
    }));
  }
);

export const getAvailableOrders = createSelector(
  [selectAllWorkInstructions, selectAllAvailableWorksheets],
  (instructions, worksheets) =>
    instructions.filter((obj) =>
      worksheets.some(({ order_ref }) => order_ref === obj.work_instruction)
    )
);

export const getAvailableValues = createSelector(
  [getAvailableOrders, selectAllAvailableWorksheets],
  (orders, worksheets) =>
    orders.map((item) => {
      return {
        ...item,
        available_value: worksheets
          .filter(({ order_ref }) => order_ref === item.work_instruction)
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

const selectedLocation = (state) => state.gridData.selectedLocation;

export const inCompleteItems = createSelector(
  [selectAllInstructionDetails, selectedLocation],
  (items, location) =>
    items.filter((obj) => obj.qty_os > 0 && obj.location_ref === location.id)
);