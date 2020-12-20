import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useState } from "react";
import FocusLock from "react-focus-lock";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useEffectOnce } from "react-use";
import { selectAllActivities } from "../../services/data/activityData";
import { selectAllInstructionDetails } from "../../services/data/instructionDetailData";
import { selectAllLocations } from "../../services/data/locationData";
import {
  fetchActivities,
  newInstructionDetail,
  selectAllInstructionHeaders,
  updateInstructionDetail,
  updateWorkInstruction,
} from "../../services/thunks";
import { BlueButton, GreyButton } from "../ui-components/Buttons";
import {
  selectOrderSummaryHeader,
  selectOrderSummaryDetails,
  selectOrderSummaryLocations,
  selectedBillItem,
} from "../../services/selectors";
import { setSelectedBillItem } from "../../services/data/gridData";

//TODO EDIT BILL ITEM

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    margin: theme.spacing(4),
  },
  grid: {
    flexGrow: 1,
  },

  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "45ch",
  },
}));

function niceNumber(value) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const roundNumber = (number) =>
  Math.round((number + Number.EPSILON) * 100) / 100;

const BillItemForm = (props) => {
  const nextItem =
    useSelector(selectOrderSummaryDetails)
      .map((item) => item["item_number"])
      .reduce((a, b) => Math.max(a, b), 0) + 1;
  const classes = useStyles();
  const dispatch = useDispatch();

  const selectedItem = useSelector((state) => state.gridData.selectedBillItem);

  const defaultValues =
    props.formType === "create"
      ? {
          item_number: nextItem,
          location_ref: "",
          activity_code: "",
          item_type: "",
        }
      : {
          item_number: selectedItem.item_number,
          location_ref: selectedItem.site_location,
          activity_code: selectedItem.activity_code,
          item_type: selectedItem.item_type,
          qty_ordered: selectedItem.qty_ordered.toFixed(2),
          materials_base: selectedItem.materials_base.toFixed(2),
        };

  const { register, handleSubmit, reset } = useForm({
    defaultValues: defaultValues,
  });

  const instructionLocations = useSelector(selectOrderSummaryLocations);
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState({
    location: "",
    item_type: "",
    activity_code: "",
  });
  const itemTypeOptions = [
    { id: "BOQ", description: "Original Bill Item" },
    { id: "VARN", description: "Variation" },
    { id: "MISC", description: "Misc" },
    { id: "FREE", description: "Free" },
    { id: "DIRECT", description: "Direct" },
  ];

  const activityOptions = useSelector(selectAllActivities);

  const instruction = useSelector(selectOrderSummaryHeader);

  const onSubmit2 = ({
    item_number,
    qty_ordered,
    materials_base,
    activity_code,
    item_type,
    location_ref,
  }) => {
    const labourBase = roundNumber(
      qty_ordered *
        activityOptions.filter((obj) => obj.activity_code === activity_code)[0]
          .labour_base
    );
    const labourUplift = roundNumber(
      qty_ordered *
        activityOptions.filter((obj) => obj.activity_code === activity_code)[0]
          .labour_uplift
    );
    const labourTotal = roundNumber(labourBase + labourUplift);
    const unitLabour = roundNumber(labourTotal / qty_ordered);
    const otherMaterials = activityOptions.filter(
      (obj) => obj.activity_code === activity_code
    )[0].materials_other;
    const materialsBase = parseFloat(materials_base);
    const materialsUplift = roundNumber(materialsBase * 0.05);
    const materialsTotalExclOtherMaterials = roundNumber(
      materialsBase + materialsUplift
    );
    const materialsTotalInclOtherMaterials = roundNumber(
      materialsTotalExclOtherMaterials + otherMaterials
    );
    const unitMaterialsPayable = roundNumber(
      materialsTotalInclOtherMaterials / qty_ordered
    );
    const totalPayable = roundNumber(
      labourTotal + materialsTotalInclOtherMaterials
    );
    const unitTotalPayable = roundNumber(totalPayable / qty_ordered);
    const apiObject = {
      work_instruction: instruction[0].work_instruction,
      location_ref: instructionLocations.filter(
        (obj) => obj.location_ref === location_ref
      )[0].id,
      item_number: item_number,
      item_type: value.item_type.id,
      activity_ref: activityOptions.filter(
        (obj) => obj.activity_code === activity_code
      )[0].id,
      qty_ordered: qty_ordered,
      labour_base: labourBase,
      labour_uplift: labourUplift,
      labour_total: labourTotal,
      unit_labour_payable: unitLabour,
      materials_base: materialsBase,
      materials_uplift: materialsUplift,
      materials_total_excl_other_materials: materialsTotalExclOtherMaterials,
      materials_other: value.activity_code.materials_other,
      materials_total_incl_other_materials: materialsTotalInclOtherMaterials,
      unit_materials_payable: unitMaterialsPayable,
      total_payable: totalPayable,
      unit_total_payable: unitTotalPayable,
    };
    if (props.formType === "create") {
      dispatch(newInstructionDetail(apiObject));
      props.handleHide();
    } else if (props.formType === "edit") {
      dispatch(updateInstructionDetail({ ...apiObject, id: selectedItem.id }));
      dispatch(
        updateWorkInstruction({
          id: instruction[0].id,
          order_value:
            instruction[0].order_value -
            selectedItem.total_payable +
            totalPayable,
        })
      );
      props.handleHide();
    }
  };

  const closeAndReset = () => {
    props.handleHide();
  };

  useEffectOnce(() => {
    dispatch(fetchActivities());
    return () => dispatch(setSelectedBillItem(false));
  });

  return (
    <FocusLock>
      <form className={classes.grid}>
        <Grid container spacing={2}>
          <Grid item xs>
            <TextField
              inputRef={register({
                required: true,
              })}
              name="item_number"
              label="Item Number"
              variant="filled"
              margin="normal"
              fullWidth
              autoFocus
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs>
            <Autocomplete
              openOnFocus
              options={instructionLocations}
              value={inputValue.location}
              onChange={(event, newValue) => {
                setValue((prevState) => ({ ...prevState, location: newValue }));
              }}
              getOptionSelected={(option, values) => option._id === values._id}
              defaultValue={{ location_ref: selectedItem.site_location }}
              getOptionLabel={(option) => option.location_ref}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Location"
                  variant="filled"
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  name="location_ref"
                  inputRef={register({ required: true })}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs>
            <Autocomplete
              options={itemTypeOptions}
              openOnFocus
              getOptionLabel={(option) => option.description}
              getOptionSelected={(option, values) => option._id === values._id}
              onChange={(event, newValue) => {
                setValue((prevState) => ({
                  ...prevState,
                  item_type: newValue,
                }));
              }}
              fullWidth
              defaultValue={{ description: selectedItem.item_type }}
              value={inputValue.itemType}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Item Type"
                  variant="filled"
                  name="item_type"
                  InputLabelProps={{ shrink: true }}
                  inputRef={register({ required: true })}
                  margin="normal"
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs>
            <Autocomplete
              options={activityOptions}
              openOnFocus
              getOptionLabel={(option) => option.activity_code}
              /* getOptionLabel={(option) =>
                `${option["activity_code"]} / ${option["activity_description"]}`
			  }
			  getOptionSelected={(option, values) => option._id === values._id} */
              onChange={(event, newValue) => {
                setValue((prevState) => ({
                  ...prevState,
                  activity_code: newValue,
                }));
              }}
              fullWidth
              defaultValue={{ activity_code: selectedItem.activity_code }}
              value={inputValue.activityCode}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Activity Code"
                  variant="filled"
                  name="activity_code"
                  InputLabelProps={{ shrink: true }}
                  inputRef={register({ required: true })}
                  margin="normal"
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs>
            <TextField
              variant="filled"
              margin="normal"
              inputRef={register({ required: true })}
              fullWidth
              type="number"
              step="0.01"
              label="Qty Ordered"
              name="qty_ordered"
              defaultValue="0.00"
            />
          </Grid>
          <Grid item xs>
            <TextField
              variant="filled"
              margin="normal"
              inputRef={register({ required: true })}
              fullWidth
              type="number"
              step="0.01"
              label="Materials Pack Value"
              name="materials_base"
              defaultValue="0.00"
            />
          </Grid>
        </Grid>
        <hr />
        <Grid container spacing={2}>
          <Grid item xs>
            <BlueButton onClick={handleSubmit(onSubmit2)} fullWidth>
              SUBMIT
            </BlueButton>
          </Grid>
          <Grid item xs>
            <GreyButton fullWidth onClick={() => reset()}>
              RESET
            </GreyButton>
          </Grid>
          <Grid item xs>
            <GreyButton fullWidth onClick={closeAndReset}>
              Close
            </GreyButton>
          </Grid>
        </Grid>
        <hr />
      </form>
    </FocusLock>
  );
};

export default BillItemForm;
