import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React, { useState } from "react";
import FocusLock from "react-focus-lock";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { selectAllInstructionHeaders, newDocument} from "../../services/thunks";
//import { updateData } from "../forms/FormData";
import { BlueButton, GreyButton } from "../ui-components/Buttons";


const useStyles = makeStyles((theme) => ({
	paper: {

		display: "flex",
		flexDirection: "column",
		alignItems: "left",
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},

	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

const DocumentForm = (props) => {

	const {register, handleSubmit, errors, reset} = useForm();
	const classes = useStyles();
	const [document, setDocument] = useState({
		document_title: "",
		document: null,
	});
	const instructionId = useSelector(selectAllInstructionHeaders)[0].id;
	const dispatch = useDispatch()
	const onSubmit = data => {

		prepareDocumentData(data);
	};
	const prepareDocumentData = (data) => {
		const {Title, DocumentFile} = data;
		let form_data = new FormData;
		form_data.append("document", DocumentFile[0], DocumentFile[0].name);
		form_data.append("document_title", Title);
		form_data.append("work_instruction", instructionId);
		dispatch(newDocument(form_data))
		closeAndReset()

	};
	const closeAndReset = () => {
		props.handleHide();

	};

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
							label="Title"
							name="Title"
							autoFocus
						/>
					</Grid>
					<Grid container spacing={ 2 }>
					<Grid item xs>
						<TextField
							type="file"
							inputRef={ register({required: true}) }
							margin="normal"
							label="Upload File"
							fullWidth
							name="DocumentFile"
							variant="filled"
							InputLabelProps={ {shrink: true} }
						/>
					</Grid>
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
export default DocumentForm;
