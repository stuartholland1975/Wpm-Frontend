import React from 'react'
import {
  BlueButton,
  GreenButton,
  PurpleButton,
  RedButton,
} from "../ui-components/Buttons";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { Divider } from "@react-md/divider";
import { Container } from "react-bootstrap";
import { NavLink, useLocation, withRouter, useHistory } from "react-router-dom";



const LocationButtons = (props) => {
  const history=useHistory()
    return (
      <Container fluid>
        <GreenButton
          type="button"
          onClick={props.createLocation}
          fullWidth
          // startIcon={<AddIcon />}
        >
          CREATE LOCATION
        </GreenButton>
        <GreenButton
          type="button"
          onClick={props.editLocation}
          fullWidth
          // startIcon={<EditIcon />}
        >
          EDIT LOCATION
        </GreenButton>
        <RedButton
          type="button"
          onClick={props.deleteLocation}
          fullWidth
          // startIcon={<DeleteIcon />}
        >
          DELETE LOCATION
        </RedButton>
        <Divider />
        <GreenButton
          type="button"
          onClick={props.updateProgress}
          fullWidth
          // startIcon={<EditIcon />}
        >
          UPDATE WORK SHEET
        </GreenButton>
        <GreenButton
          type="button"
          onClick={props.uploadImage}
          fullWidth
          // startIcon={<CloudUploadIcon />}
        >
          UPLOAD IMAGE
        </GreenButton>
        <GreenButton
          type="button"
          onClick={props.uploadDocument}
          fullWidth
          // startIcon={<CloudUploadIcon />}
        >
          UPLOAD DOCUMENT
        </GreenButton>
        <Divider />
        <PurpleButton type="button" onClick={props.viewItems} fullWidth>
          VIEW ITEMS
        </PurpleButton>

        <PurpleButton type="button" onClick={props.viewDocuments} fullWidth>
          VIEW DOCUMENTS
        </PurpleButton>
        <PurpleButton type="button" onClick={props.viewImages} fullWidth>
          VIEW ALL IMAGES
        </PurpleButton>
        <PurpleButton type="button" onClick={props.viewImageMap} fullWidth>
          VIEW IMAGE MAP
        </PurpleButton>
        <PurpleButton
          type="button"
          onClick={props.viewWorksheets}
          fullWidth
          onClick={() => history.push("/work-instructions/summary/worksheets")}
        >
          VIEW WORKSHEETS
        </PurpleButton>
      </Container>
    );
}

export default LocationButtons
