import React from "react";
import {Field, reduxForm} from 'redux-form'
import TextField from '@material-ui/core/TextField';
import {Autocomplete} from "@material-ui/lab";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useSelector} from "react-redux";
import {selectAllAreas} from "../areas/areaDataReducer";
import {selectAllWorkTypes} from "../worktypes/workTypesDataReducer";
import validate from "../forms/validate";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        margin: theme.spacing(1),
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '100%',
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

let InstructionForm = (props) => {
    const uiClasses = useStyles();
    const {handleSubmit, pristine, reset, submitting, classes} = props
    const areaOptions = useSelector(selectAllAreas).map(area => area['area_description'])
    const areas = useSelector(selectAllAreas)
    const workTypes = useSelector(selectAllWorkTypes)
    console.log(areas)
    const renderTextField = ({
                                 label,
                                 input,
                                 meta: {touched, invalid, error},
                                 ...custom
                             }) =>
        (
            <TextField
                label={label}
                placeholder={label}
                error={touched && invalid}
                helperText={touched && error}
                {...input}
                {...custom}
            />
        )

    const renderSelectField = ({
                                   label, input, meta: {touched, invalid, error}, ...custom
                               }) => (
        <Autocomplete
            options={areas}
            getOptionLabel={option => option['area_description']}
            className={uiClasses.textField}
            renderInput={(params => <TextField{...params}
                                              onChange={(event, index, value) => input.onChange(value)}
                                              label={label}
                                              placeholder={label}
                                              error={touched && invalid}
                                              helperText={touched && error}
                                              {...input}
                                              {...custom}
            />)}>
        </Autocomplete>
    );
    return (

        <form onSubmit={handleSubmit(validate)} className={uiClasses.root}>

            <Field
                name='work_instruction'
                label='Instruction Reference'
                variant='filled'
                margin='normal'
                autoFocus
                className={uiClasses.textField}
                component={renderTextField}
            />

            <Field
                name='job_number'
                label='Job Number'
                variant='filled'
                margin='normal'
                className={uiClasses.textField}
                component={renderTextField}
            />

            <Field
                name='project_title'
                label='Project Title'
                variant='filled'
                margin='normal'
                className={uiClasses.textField}
                component={renderTextField}
            />

            <Field
                name='project_address'
                label='Project Address'
                variant='filled'
                margin='normal'
                className={uiClasses.textField}
                component={renderTextField}
            />
            <Field
                name='issued_date'
                label='Issued Date'
                variant='filled'
                margin='normal'
                type='date'
                InputLabelProps={{shrink: true}}
                component={renderTextField}
                className={uiClasses.textField}
            />
            <Field
                name='start_date'
                label='Start Date'
                variant='filled'
                margin='normal'
                type='date'
                InputLabelProps={{shrink: true}}
                component={renderTextField}
                className={uiClasses.textField}
            />
            <Field
                name='end_date'
                label='End Date'
                variant='filled'
                margin='normal'
                type='date'
                InputLabelProps={{shrink: true}}
                component={renderTextField}
                className={uiClasses.textField}
            />
            <Field

                component={renderSelectField}
                name='area'
                label='Area'
                variant='filled'
                margin='normal'

            />
            <Field
                name="notes"
                component={renderTextField}
                label="Notes"
                multiline
                rowsMax="4"
                variant='filled'
                margin='normal'
                className={uiClasses.textField}
            />
            <div className={uiClasses.submit}>
                <button type="submit" disabled={pristine || submitting}>
                    Submit
                </button>
                <button type="button" disabled={pristine || submitting} onClick={reset}>
                    Clear Values
                </button>
            </div>

        </form>
    )
}
InstructionForm = reduxForm({
    // a unique name for the form
    form: 'instructionForm',

})(InstructionForm)

export default InstructionForm;
