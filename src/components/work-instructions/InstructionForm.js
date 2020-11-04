import React, {  } from "react";
import { useForm } from "react-hook-form";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useDispatch, useSelector } from "react-redux";
import { selectAllAreas } from "../areas/areaDataReducer";
import { selectAllWorkTypes } from "../worktypes/workTypesDataReducer";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { BlueButton, GreyButton } from "../ui-components/Buttons";
import { newWorkInstruction } from "./InstructionData";
import Grid from "@material-ui/core/Grid";
import FocusLock from "react-focus-lock";

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
  const { register, handleSubmit, reset } = useForm();
  const areas = useSelector(selectAllAreas);
  const workTypes = useSelector(selectAllWorkTypes);

  const onSubmit = (data) => {
    const area = areas.filter(
      (obj) => obj["area_description"] === data["area_description"]
    );
    const workType = workTypes.filter(
      (obj) => obj["work_type_description"] === data["work_type_description"]
    );
    const apiObject = {
      ...data,
      project_type: workType[0].id,
      area: area[0].id,
      project_status: 1,
    };
    dispatch(newWorkInstruction(apiObject));
    props.handleHide()
  };

  return (
    <FocusLock>
      <form className={classes.grid} onSubmit={handleSubmit(onSubmit)}>
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
            />
          </Grid>
          <Grid item xs>
            <TextField
              inputRef={register({ required: true })}
              name="job_number"
              label="Job Number"
              variant="filled"
              margin="normal"
              fullWidth
            />
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
            />
          </Grid>
          <Grid item xs>
            <TextField
              inputRef={register({ required: false })}
              name="project_address"
              label="Project Address"
              variant="filled"
              margin="normal"
              fullWidth
            />
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
            />
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
            />
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
            />
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
            />
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
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs>
            <TextField
              inputRef={register({ required: false })}
              name="notes"
              label="Notes"
              variant="filled"
              margin="normal"
              multiline
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
        <hr />
        <Grid container spacing={2}>
          <Grid item xs>
            <BlueButton type="submit" fullWidth>
              SUBMIT
            </BlueButton>
          </Grid>
          <Grid item xs>
            <GreyButton fullWidth onClick={() => reset()}>
              RESET
            </GreyButton>
          </Grid>
          <Grid item xs>
            <GreyButton fullWidth onClick={() => props.handleHide()}>
              Close
            </GreyButton>
          </Grid>
        </Grid>
        <hr />
      </form>
    </FocusLock>
  );
};
export default InstructionForm;
