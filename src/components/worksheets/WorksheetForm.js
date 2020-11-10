import  React, {useEffect} from 'react';
import {useForm} from "react-hook-form";
import {useSelector} from "react-redux";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {selectAllSupervisors} from "../supervisors/SupervisorsData";
import FocusLock from "react-focus-lock";
import { BlueButton, GreyButton } from "../ui-components/Buttons";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";

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

    const {register, handleSubmit, reset} = useForm()
    const supervisors  = useSelector(selectAllSupervisors)
    const classes = useStyles();

    const onSubmit = data => {
        console.log(JSON.stringify(data))
        closeAndReset()
    }
    const closeAndReset = () => {
		props.handleHide();
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
                inputRef={register({required: true})}
                fullWidth
                type="date"
                label="WORK DONE DATE"
                name="work_done_date"
                InputLabelProps={{shrink: true}}

            />
            </Grid>
					<Grid item xs>
            <Autocomplete
                id="supervisor"
                options={supervisors}
               // onChange={onSelectTag}
                getOptionLabel={supervisors => `${supervisors.first_name}  ${supervisors.surname}`}
                style={{width: 300}}
                renderInput={(params) => <TextField {...params} label="SuperVisor" variant="filled" InputLabelProps={{shrink: true}}
                                                    name="supervisor" inputRef={register({required: true})}/>}
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
    )
}

export default WorksheetForm;
