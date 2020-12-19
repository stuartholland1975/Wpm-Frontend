import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useState } from "react";
import FocusLock from "react-focus-lock";
import { useForm } from "react-hook-form";
import Resizer from "react-image-file-resizer";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedLocation } from "../../services/data/gridData";
import { newImage } from "../../services/data/ImageData";
import { BlueButton, GreyButton } from "../ui-components/Buttons";
import { fetchSingleLocation } from "../../services/thunks";

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

const ImageForm = (props) => {
  const { register, handleSubmit, errors, reset } = useForm();
  const classes = useStyles();
  const dispatch = useDispatch();

  const [image, setImage] = useState();
  const [imageResized, setImageResized] = useState();
  const [imageType, setImageType] = useState();

  const selectedLocation = useSelector(
    (state) => state.gridData.selectedLocation
  );

  const imageTypeOptions = [
    { id: "PRE", description: "Pre Construction Image" },
    { id: "POST", description: "Post Construction Image" },
    { id: "MISC", description: "Misc Image" },
  ];

  const onSubmit = (data) => {
    const { Title, ImageDate, ContentNotes, ImageFile } = data;
    let formData = new FormData();
    formData.append("title", Title);
    formData.append("date_image", ImageDate);
    formData.append("notes", ContentNotes);
    formData.append("construction_image", image, image.name);
    formData.append("construction_image_resized", imageResized, image.name);
    formData.append("image_type", imageType.id);
    formData.append("location", selectedLocation.id);
    dispatch(newImage(formData)).then(() =>
      dispatch(fetchSingleLocation(selectedLocation.id))
    );

    closeAndReset();
  };
  const closeAndReset = () => {
    props.handleHide();
    dispatch(setSelectedLocation(false));
  };
  const onSelectImageFile = async (event) => {
    const file = event.target.files[0];
    const resizedImage = await resizeFile(file);
    setImage(file);
    setImageResized(resizedImage);
  };

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        1280,
        720,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "blob"
      );
    });

  return (
    <FocusLock>
      <form className={classes.grid}>
        <TextField
          variant="filled"
          margin="normal"
          inputRef={register({ required: true })}
          fullWidth
          label="Title"
          name="Title"
          autoFocus
        />
        <TextField
          variant="filled"
          margin="normal"
          inputRef={register({ required: true })}
          fullWidth
          label="Content Notes"
          name="ContentNotes"
        />
        <Autocomplete
          id="image_type"
          options={imageTypeOptions}
          onChange={(event, newValue) => setImageType(newValue)}
          getOptionLabel={(option) => option.description}
          getOptionSelected={(option) => option.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Image Type"
              variant="filled"
              name="ImageType"
              inputRef={register({ required: true })}
            />
          )}
        />
        <TextField
          type="file"
          id="image_file"
          inputRef={register({ required: true })}
          margin="normal"
          fullWidth
          name="ImageFile"
          variant="filled"
          onChange={onSelectImageFile}
        />
        <TextField
          id="image_date"
          variant="filled"
          margin="normal"
          inputRef={register({ required: true })}
          fullWidth
          type="date"
          label="Image Date"
          name="ImageDate"
          InputLabelProps={{ shrink: true }}
        />

        <hr />
        <Grid container spacing={2}>
          <Grid item xs>
            <BlueButton onClick={handleSubmit(onSubmit)} fullWidth>
              SUBMIT
            </BlueButton>
          </Grid>
          <Grid item xs>
            <GreyButton fullWidth onClick={() => reset()}>
              RESET
            </GreyButton>
          </Grid>
          <Grid item xs>
            <GreyButton fullWidth onClick={closeAndReset}>
              Close
            </GreyButton>
          </Grid>
        </Grid>
        <hr />
      </form>
    </FocusLock>
  );
};
export default ImageForm;
