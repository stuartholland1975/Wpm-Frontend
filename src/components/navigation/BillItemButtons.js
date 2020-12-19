import React from 'react'
import {
  BlueButton,
  GreenButton,
  PurpleButton,
  RedButton,
} from "../ui-components/Buttons";
import { Divider } from "@react-md/divider";
import { Container } from "react-bootstrap";

const BillItemButtons = (props) => {
   return (
     <Container fluid>
       <GreenButton
         type="button"
         onClick={props.createBillItem}
         fullWidth
         // startIcon={<AddIcon />}
       >
         CREATE BILL ITEM
       </GreenButton>
       <GreenButton
         type="button"
         onClick={props.editBillItem}
         fullWidth
         // startIcon={<EditIcon />}
       >
         EDIT BILL ITEM
       </GreenButton>
       <RedButton
         type="button"
         onClick={props.deleteBillItem}
         fullWidth
         // startIcon={<DeleteIcon />}
       >
         DELETE BILL ITEM
       </RedButton>
       <Divider />
       
       <GreenButton
         type="button"
         onClick={props.uploadDocument}
         fullWidth
         // startIcon={<CloudUploadIcon />}
       >
         UPLOAD DOCUMENT
       </GreenButton>
       <Divider />
       <PurpleButton type="button" onClick={props.viewLocations} fullWidth>
         VIEW LOCATIONS
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
     </Container>
   );
}

export default BillItemButtons
