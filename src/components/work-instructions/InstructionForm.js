import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useEffect } from "react";
import FocusLock from "react-focus-lock";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useRendersCount } from "react-use";
import { selectAllAreas } from "../../services/data/areaData";
import { updateData } from "../../services/data/FormData";
import { setSelectedRow } from "../../services/data/gridData";
import { selectAllWorkTypes } from "../../services/data/workTypesData";
import { newWorkInstruction, updateWorkInstruction } from "../../services/thunks";
import { BlueButton, GreyButton } from "../ui-components/Buttons";


//TODO: AREA AND WORKTYPE DEFAULTS CLEAR ON FIRST RERENDER

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

const InstructionForm = (props) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const initialData = useSelector((state) => state.gridData.selectedRow);
	const {register, handleSubmit, reset} = useForm({
		mode: "onChange",
		defaultValues: {
			work_instruction: initialData.work_instruction,
			job_number: initialData.job_number,
			project_title: initialData.project_title,
			project_address: initialData.project_address,
			issued_date: initialData.issued_date,
			start_date: initialData.start_date,
			end_date: initialData.end_date,
			work_type_description: initialData.work_type,
			area_description: initialData.area_description,
			country: initialData.area_description,
			notes: initialData.notes,
		},
	});
	const areas = useSelector(selectAllAreas);
	const workTypes = useSelector(selectAllWorkTypes);
	const rendersCount = useRendersCount();

	console.log({renders: rendersCount});

	const onSubmit = (data) => {
		const area = areas.filter(
			(obj) => obj["area_description"] === data["area_description"]
		);
		const workType = workTypes.filter(
			(obj) => obj["work_type_description"] === data["work_type_description"]
		);
		let apiObject = {
			...data,
			project_type: workType[0].id,
			area: area[0].id,
			project_status: 1,
		};

		if (props.formType === "create") {
			dispatch(newWorkInstruction(apiObject));
			props.handleHide();
			dispatch(setSelectedRow(false));
		} else if (props.formType === "edit") {
			apiObject = {...apiObject, id: initialData.id};
			dispatch(updateWorkInstruction(apiObject));
			props.handleHide();
			dispatch(setSelectedRow(false));
		}
	};

	const closeAndReset = () => {
		props.handleHide();
		dispatch(setSelectedRow(false));
	};

	useEffect(() => {
		reset();
	}, [reset]);

	return (
		<FocusLock>
			<form className={ classes.grid }>
				<Grid container spacing={ 2 }>
					<Grid item xs>
						<TextField
							inputRef={ register({
								required: true,
							}) }
							name="work_instruction"
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
							name="job_number"
							label="Job Number"
							variant="filled"
							margin="normal"
							fullWidth
						/>
					</Grid>
				</Grid>
				<Grid container spacing={ 2 }>
					<Grid item xs>
						<TextField
							inputRef={ register({required: true}) }
							name="project_title"
							label="Project Title"
							variant="filled"
							margin="normal"
							fullWidth
						/>
					</Grid>
					<Grid item xs>
						<TextField
							inputRef={ register({required: false}) }
							name="project_address"
							label="Project Address"
							variant="filled"
							margin="normal"
							fullWidth
						/>
					</Grid>
				</Grid>
				<Grid container spacing={ 2 }>
					<Grid item xs>
						<TextField
							inputRef={ register({required: true}) }
							name="issued_date"
							label="Issued Date"
							variant="filled"
							margin="normal"
							type="date"
							fullWidth
							InputLabelProps={ {shrink: true} }
						/>
					</Grid>
					<Grid item xs>
						<TextField
							inputRef={ register({required: true}) }
							name="start_date"
							label="Start Date"
							variant="filled"
							margin="normal"
							type="date"
							fullWidth
							InputLabelProps={ {shrink: true} }
						/>
					</Grid>
					<Grid item xs>
						<TextField
							inputRef={ register({required: true}) }
							name="end_date"
							label="End Date"
							variant="filled"
							margin="normal"
							type="date"
							fullWidth
							InputLabelProps={ {shrink: true} }
						/>
					</Grid>
				</Grid>
				<Grid container spacing={ 2 }>
					<Grid item xs>
						<Autocomplete
							openOnFocus
							options={ workTypes }
							getOptionLabel={ (option) => option["work_type_description"] }
							getOptionSelected={ (option, values) => option._id === values._id }
							onInputChange={ (event, newInputValue) => {
								console.log(event, initialData.name);
								dispatch(
									updateData({field: "work_type", value: newInputValue})
								);
							} }
							fullWidth
							renderInput={ (params) => (
								<TextField
									{ ...params }
									name="work_type_description"
									label="Work Type"
									variant="filled"
									margin="normal"
									inputRef={ register({required: true}) }
									InputLabelProps={ {shrink: true} }
								/>
							) }
						/>
					</Grid>
					<Grid item xs>
						<Autocomplete
							openOnFocus
							options={ areas }
							getOptionLabel={ (option) => option["area_description"] }
							getOptionSelected={ (option, values) => option._id === values._id }
							onInputChange={ (event, newInputValue) => {
								console.log(event, initialData.name);
								dispatch(
									updateData({field: "area_description", value: newInputValue})
								);
							} }
							fullWidth
							renderInput={ (params) => (
								<TextField
									{ ...params }
									name="area_description"
									label="Area"
									variant="filled"
									margin="normal"
									inputRef={ register({required: true}) }
									InputLabelProps={ {shrink: true} }
									value={ params }
								/>
							) }
						/>
					</Grid>
				</Grid>

				<Grid container spacing={ 2 }>
					<Grid item xs>
						<TextField
							inputRef={ register({required: false}) }
							name="notes"
							label="Notes"
							variant="filled"
							margin="normal"
							multiline
							fullWidth
							InputLabelProps={ {shrink: true} }
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
export default InstructionForm;
