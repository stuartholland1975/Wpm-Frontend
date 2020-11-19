import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useConfirm } from "material-ui-confirm";
import React, { useEffect, useState } from "react";
import FocusLock from "react-focus-lock";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { resetEditedRow, selectAllEditedRows } from "../../services/data/gridData";
import { selectAllSupervisors } from "../../services/data/SupervisorsData";
import {
	fetchOrderSummaryInfo,
	newWorksheet,
	selectAllInstructionHeaders, updateInstructionDetail,

} from "../../services/thunks";
import { BlueButton, GreyButton } from "../ui-components/Buttons";


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

const WorksheetForm = (props) => {
	const {register, handleSubmit, reset} = useForm();
	const supervisors = useSelector(selectAllSupervisors);
	const editedRows = useSelector(selectAllEditedRows);
	const instructionId = useSelector(selectAllInstructionHeaders)[0].id;
	const projectTitle = useSelector(selectAllInstructionHeaders)[0].project_title;
	const classes = useStyles();
	const confirm = useConfirm();
	const dispatch = useDispatch();
	const [inputValue, setInputValue] = useState("");
	const [value, setValue] = useState("");
	const history = useHistory();

	const onSubmit = (data) => {
		console.log(JSON.stringify(data));
		const worksheetContainer = [];
		const billItemContainer = [];


		editedRows.forEach((item, index) => {
			let worksheetObject = {};
			let billItemObject = {};
			worksheetObject.completed_by = value.id;
			const {location_ref, qty_to_complete, unit_materials_payable, id, unit_labour_payable, unit_total_payable, qty_os} = item;
			worksheetObject.worksheet_ref = location_ref;
			worksheetObject.item_ref = id;
			worksheetObject.date_work_done = data.work_done_date;
			worksheetObject.qty_complete = qty_to_complete;
			worksheetObject.value_complete = (
				unit_total_payable * qty_to_complete
			).toFixed(2);
			worksheetObject.materials_complete = (
				unit_materials_payable * qty_to_complete
			).toFixed(2);
			worksheetObject.labour_complete = (
				unit_labour_payable * qty_to_complete
			).toFixed(2);

			worksheetContainer.push(worksheetObject);
			console.log(worksheetObject, worksheetContainer);
			/*if (qty_os - qty_to_complete === 0) {
				billItemObject = {...item}
				billItemObject.id = id;
				billItemObject.item_status = "Closed";
				billItemObject.item_complete = true;
				billItemContainer.push(billItemObject);
			}
			console.log(billItemObject, billItemContainer);*/
			if (qty_os - qty_to_complete === 0) {
				dispatch(updateInstructionDetail({id: id, item_status: "Closed", item_complete: true}));
			}

		});


		dispatch(newWorksheet(worksheetContainer)).then(() => dispatch(fetchOrderSummaryInfo(instructionId)));


		closeAndReset();
	};

	const closeAndReset = () => {
		dispatch(resetEditedRow());
		props.handleHide();
		history.push({pathname: `/work-instructions/summary/locations/${ instructionId }`, state: projectTitle});
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
							variant="filled"
							margin="normal"
							inputRef={ register({required: true}) }
							fullWidth
							type="date"
							label="WORK DONE DATE"
							name="work_done_date"
							InputLabelProps={ {shrink: true} }
						/>
					</Grid>
					<Grid item xs>
						<Autocomplete
							id="supervisor"
							options={ supervisors }
							value={ inputValue.value }
							onChange={ (event, newValue) => {
								setValue(newValue);
							} }
							getOptionLabel={ (supervisors) =>
								`${ supervisors["first_name"] }  ${ supervisors["surname"] }`
							}
							style={ {width: 300} }
							renderInput={ (params) => (
								<TextField
									{ ...params }
									label="SuperVisor"
									variant="filled"
									InputLabelProps={ {shrink: true} }
									name="supervisor"
									inputRef={ register({required: true}) }
								/>
							) }
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

export default WorksheetForm;
