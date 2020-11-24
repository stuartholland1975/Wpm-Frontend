import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useState } from "react";
import FocusLock from "react-focus-lock";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useEffectOnce } from "react-use";
import { fetchActivities, newInstructionDetail, selectAllInstructionHeaders } from "../../services/thunks";
import { selectAllActivities } from "../../services/data/activityData";
import { selectAllLocations } from "../../services/data/locationData";
import { BlueButton, GreyButton } from "../ui-components/Buttons";
import { selectAllInstructionDetails } from "../../services/data/instructionDetailData";

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

const roundNumber = number => Math.round((number + Number.EPSILON) * 100) / 100;

const BillItemForm = (props) => {
	const nextItem = useSelector(selectAllInstructionDetails).map(item => item["item_number"]).reduce((a, b) => Math.max(a, b), 0) + 1;
	const classes = useStyles();
	const dispatch = useDispatch();
	const {register, handleSubmit, reset} = useForm({
		defaultValues: {
			"item_number": nextItem,
			"location_ref": "",
			"activity_code": "",
			"item_type": ""
		}
	});
	const instructionLocations = useSelector(selectAllLocations);
	const [inputValue, setInputValue] = useState("");
	const [value, setValue] = useState({location: "", item_type: "", activity_code: ""});
	const itemTypeOptions = [
		{id: "BOQ", description: "Original Bill Item"},
		{id: "VARN", description: "Variation"},
		{id: "MISC", description: "Misc"},
		{id: "FREE", description: "Free"},
		{id: "DIRECT", description: "Direct"},
	];

	const activityOptions = useSelector(selectAllActivities);
	const instruction = useSelector(selectAllInstructionHeaders)[0].work_instruction;

	const onSubmit = ({item_number, qty_ordered, materials_base}) => {
		const labourBase = roundNumber(qty_ordered * value.activity_code.labour_base);
		const labourUplift = roundNumber(qty_ordered * value.activity_code.labour_uplift);
		const labourTotal = roundNumber(labourBase + labourUplift);
		const unitLabour = roundNumber(labourTotal / qty_ordered);
		const otherMaterials = value.activity_code.materials_other;
		const materialsBase = parseFloat(materials_base);
		const materialsUplift = roundNumber(materialsBase * 0.05);
		const materialsTotalExclOtherMaterials = roundNumber(materialsBase + materialsUplift);
		const materialsTotalInclOtherMaterials = roundNumber(materialsTotalExclOtherMaterials + otherMaterials);
		const unitMaterialsPayable = roundNumber(materialsTotalInclOtherMaterials / qty_ordered);
		const totalPayable = roundNumber(labourTotal + materialsTotalInclOtherMaterials);
		const unitTotalPayable = roundNumber(totalPayable / qty_ordered);
		const apiObject = {
			work_instruction: instruction,
			location_ref: value.location.id,
			item_number: item_number,
			item_type: value.item_type.id,
			activity_ref: value.activity_code.id,
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
			unit_total_payable: unitTotalPayable
		};
		dispatch(newInstructionDetail(apiObject));
		closeAndReset();
	};

	const closeAndReset = () => {
		props.handleHide();
	};

	useEffectOnce(() => {
		dispatch(fetchActivities());
	});

	return (
		<FocusLock>
			<form className={ classes.grid }>
				<Grid container spacing={ 2 }>
					<Grid item xs>
						<TextField
							inputRef={ register({
								required: true,
							}) }
							name="item_number"
							label="Item Number"
							variant="filled"
							margin="normal"
							fullWidth
							autoFocus
						/>
					</Grid>
				</Grid>
				<Grid container spacing={ 2 }>
					<Grid item xs>
						<Autocomplete
							openOnFocus
							options={ instructionLocations }
							value={ inputValue.location }
							onChange={ (event, newValue) => {
								setValue(prevState => ({...prevState, location: newValue}));
							} }
							getOptionLabel={ option => option.location_ref }
							fullWidth
							renderInput={ (params) => (
								<TextField
									{ ...params }
									label="Location"
									variant="filled"
									margin="normal"
									InputLabelProps={ {shrink: true} }
									name="location_ref"
									inputRef={ register({required: true}) }
								/>
							) }
						/>
					</Grid>
				</Grid>
				<Grid container spacing={ 2 }>
					<Grid item xs>
						<Autocomplete
							options={ itemTypeOptions }
							openOnFocus
							getOptionLabel={ (option) => option.description }
							onChange={ (event, newValue) => {
								setValue(prevState => ({...prevState, item_type: newValue}));
							} }
							fullWidth
							value={ inputValue.itemType }
							renderInput={ (params) => <TextField { ...params } label="Item Type" variant="filled"
							                                     name="item_type" InputLabelProps={ {shrink: true} }
							                                     inputRef={ register({required: true}) } margin='normal'/> }
						/>
					</Grid>
				</Grid>
				<Grid container spacing={ 2 }>
					<Grid item xs>
						<Autocomplete

							options={ activityOptions }
							openOnFocus
							getOptionLabel={ (option) => `${ option["activity_code"] } / ${ option["activity_description"] }` }
							onChange={ (event, newValue) => {
								setValue(prevState => ({...prevState, activity_code: newValue}));
							} }
							fullWidth
							value={ inputValue.activityCode }
							renderInput={ (params) => <TextField { ...params } label="Activity Code" variant="filled"
							                                     name="activity_code" InputLabelProps={ {shrink: true} }
							                                     inputRef={ register({required: true}) } margin='normal'/> }
						/>
					</Grid>
				</Grid>
				<Grid container spacing={ 2 }>
					<Grid item xs>
						<TextField
							variant="filled"
							margin="normal"
							inputRef={ register({required: true}) }
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
							inputRef={ register({required: true}) }
							fullWidth
							type="number"
							step="0.01"
							label="Materials Pack Value"
							name="materials_base"
							defaultValue="0.00"
						/>
					</Grid>
				</Grid>
				<hr/>
				<Grid container spacing={ 2 }>
					<Grid item xs>
						<BlueButton onClick={ handleSubmit(onSubmit) } fullWidth>
							SUBMIT
						</BlueButton>
					</Grid>
					<Grid item xs>
						<GreyButton fullWidth onClick={ () => reset() }>
							RESET
						</GreyButton>
					</Grid>
					<Grid item xs>
						<GreyButton fullWidth onClick={ closeAndReset }>
							Close
						</GreyButton>
					</Grid>
				</Grid>
				<hr/>


			</form>
		</FocusLock>
	);
};

export default BillItemForm;
