import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import React from "react";
import FocusLock from "react-focus-lock";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedLocation } from "../grid/gridData";
import { BlueButton, GreyButton } from "../ui-components/Buttons";
import { createLocation, updateLocation, deleteLocation } from "../../services/thunks";


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


const LocationForm = (props) => {

	const classes = useStyles();
	const dispatch = useDispatch();
	const workInstruction = useSelector(state => state.gridData.selectedRow);
	const selectedLocation = useSelector(state => state.gridData.selectedLocation);
	const {register, handleSubmit, reset} = useForm({
		mode: "onChange",
		defaultValues: {
			location_ref: selectedLocation.location_ref,
			location_description: selectedLocation.location_description,

		}
	});

	const onSubmit = data => {
		let apiObject = {
			...data,
			work_instruction: workInstruction.work_instruction,
		};
		if (props.formType === "create") {
			dispatch(createLocation(apiObject));
			props.handleHide();
			dispatch(setSelectedLocation(false));
		} else if (props.formType === "edit") {
			apiObject = {...apiObject, id: selectedLocation.id};
			dispatch(updateLocation(apiObject));
			props.handleHide();
			dispatch(setSelectedLocation(false));
			props.handleHide();
		}
	};

	const closeAndReset = () => {
		props.handleHide();
		dispatch(setSelectedLocation(false));
	};


	return (
		<FocusLock>
			<form className={ classes.grid }>
				<Grid container spacing={ 2 }>
					<Grid item xs>
						<TextField
							inputRef={ register({
								required: true,
							}) }
							name="location_ref"
							label="Instruction Reference"
							variant="filled"
							margin="normal"
							fullWidth
							autoFocus
						/>
					</Grid>
					<Grid item xs>
						<TextField
							inputRef={ register({required: true}) }
							name="location_description"
							label="Location Description"
							variant="filled"
							margin="normal"
							fullWidth
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

export default LocationForm;
