import React from "react";
import { useForm, Controller } from "react-hook-form";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useSelector } from "react-redux";
import { selectAllAreas } from "../areas/areaDataReducer";
import { selectAllWorkTypes } from "../worktypes/workTypesDataReducer";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { BlueButton } from "../ui-components/Buttons";
import {
  newWorkInstruction,
  selectAllWorkInstructions,
} from "./InstructionData";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    margin: theme.spacing(4),
  },
  grid: {
    flexGrow: 1,
    margin: theme.spacing(3),
  },

  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "45ch",
  },
}));

const InstructionForm = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { register, handleSubmit, errors, control } = useForm();
  const areas = useSelector(selectAllAreas);
  const workTypes = useSelector(selectAllWorkTypes);

  const onSubmit = (data) => {
    const area = areas.filter(
      (obj) => obj.area_description === data.area_description
    );
    const workType = workTypes.filter(
      (obj) => obj.work_type_description === data.work_type_description
    );
    const apiObject = {
      ...data,
      project_type: workType[0].id,
      area: area[0].id,
      project_status: 1,
    };
    dispatch(newWorkInstruction(apiObject));
    history.push("/work-instructions");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.grid}>
      <Grid container spacing={2}>
        <Grid item xs>
          <TextField
            inputRef={register({
              required: true,
            })}
            name="work_instruction"
            label="Instruction Reference"
            variant="filled"
            margin="normal"
            fullWidth
            autoFocus
          ></TextField>
        </Grid>
        <Grid item xs>
          <TextField
            inputRef={register({ required: true })}
            name="job_number"
            label="Job Number"
            variant="filled"
            margin="normal"
            fullWidth
          ></TextField>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs>
          <TextField
            inputRef={register({ required: true })}
            name="project_title"
            label="Project Title"
            variant="filled"
            margin="normal"
            fullWidth
          ></TextField>
        </Grid>
        <Grid item xs>
          <TextField
            inputRef={register({ required: false })}
            name="project_address"
            label="Project Address"
            variant="filled"
            margin="normal"
            fullWidth
          ></TextField>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs>
          <TextField
            inputRef={register({ required: true })}
            name="issued_date"
            label="Issued Date"
            variant="filled"
            margin="normal"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
          ></TextField>
        </Grid>
        <Grid item xs>
          <TextField
            inputRef={register({ required: true })}
            name="start_date"
            label="Start Date"
            variant="filled"
            margin="normal"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
          ></TextField>
        </Grid>
        <Grid item xs>
          <TextField
            inputRef={register({ required: true })}
            name="end_date"
            label="End Date"
            variant="filled"
            margin="normal"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
          ></TextField>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs>
          <Autocomplete
            openOnFocus
            options={workTypes}
            getOptionLabel={(option) => option["work_type_description"]}
            fullWidth
            renderInput={(params) => (
              <TextField
                {...params}
                name="work_type_description"
                label="Work Type"
                variant="filled"
                margin="normal"
                inputRef={register({ required: true })}
              />
            )}
          ></Autocomplete>
        </Grid>
        <Grid item xs>
          <Autocomplete
            openOnFocus
            options={areas}
            getOptionLabel={(option) => option["area_description"]}
            fullWidth
            renderInput={(params) => (
              <TextField
                {...params}
                name="area_description"
                label="Area"
                variant="filled"
                margin="normal"
                inputRef={register({ required: true })}
              />
            )}
          ></Autocomplete>
        </Grid>
      </Grid>
      <TextField
        inputRef={register({ required: false })}
        name="notes"
        label="Notes"
        variant="filled"
        margin="normal"
        multiline
        fullWidth
        InputLabelProps={{ shrink: true }}
      ></TextField>
      <div>
        <BlueButton type="submit">SUBMIT</BlueButton>
      </div>
    </form>
  );
};
export default InstructionForm;
