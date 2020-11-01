import React from "react";
import {useForm} from "react-hook-form";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {useSelector} from "react-redux";
import {selectAllAreas} from "../areas/areaDataReducer";
import {selectAllWorkTypes} from "../worktypes/workTypesDataReducer";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        margin: theme.spacing(1),
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '25ch',
    },
}));


const InstructionForm = () => {
    const classes = useStyles();
    const {register, handleSubmit, errors} = useForm();
    const areas = useSelector(selectAllAreas)
    const workTypes = useSelector(selectAllWorkTypes)
    const onSubmit = () => {
        console.log("SUBMITTED")
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.root}>
            <TextField
                inputRef={register({required: true})}
                name='instructionRef'
                label='Instruction Reference'
                variant='filled'
                margin='normal'
                fullWidth
                autoFocus

            >
            </TextField>
            <TextField
                inputRef={register({required: true})}
                name='jobNumber'
                label='Job Number'
                variant='filled'
                margin='normal'
                fullWidth
            >
            </TextField>
            <TextField
                inputRef={register({required: true})}
                name='projectTitle'
                label='Project Title'
                variant='filled'
                margin='normal'
                fullWidth
            >
            </TextField>
            <TextField
                inputRef={register({required: false})}
                name='projectAddress'
                label='Project Address'
                variant='filled'
                margin='normal'
                fullWidth
            >
            </TextField>
            <div>
                <TextField
                    inputRef={register({required: true})}
                    name='issuedDate'
                    label='Issued Date'
                    variant='filled'
                    margin='normal'
                    type='date'
                    InputLabelProps={{shrink: true}}
                    className={classes.textField}
                >
                </TextField>
                <TextField
                    inputRef={register({required: true})}
                    name='startDate'
                    label='Start Date'
                    variant='filled'
                    margin='normal'
                    type='date'
                    InputLabelProps={{shrink: true}}
                    className={classes.textField}
                >
                </TextField>
                <TextField
                    inputRef={register({required: true})}
                    name='endDate'
                    label='End Date'
                    variant='filled'
                    margin='normal'
                    type='date'
                    InputLabelProps={{shrink: true}}
                    className={classes.textField}
                >
                </TextField>
            </div>

                <Autocomplete options={workTypes} getOptionLabel={option => option['work_type_description']}
                              fullWidth
                              renderInput={(params => <TextField
                                  {...params}
                                  name='workType'
                                  label='Work Type'
                                  variant='filled'
                                  margin='normal'
                                  inputRef={register({required: true})}

                              />)}>
                </Autocomplete>
                <Autocomplete options={areas} getOptionLabel={option => option['area_description']}
                              fullWidth
                              renderInput={(params => <TextField
                                  {...params}
                                  name='area'
                                  label='Area'
                                  variant='filled'
                                  margin='normal'
                                  inputRef={register({required: true})}

                              />)}>
                </Autocomplete>

            <TextField
                inputRef={register({required: false})}
                name='notes'
                label='Notes'
                variant='filled'
                margin='normal'
                multiline
                fullWidth
                InputLabelProps={{shrink: true}}
            >
            </TextField>
        </form>
    )
}
export default InstructionForm;
