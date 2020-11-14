import React from "react";
import { useEffectOnce } from "react-use";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAppInstructions,
  fetchAvailableWorksheets,
  fetchAppLocations,
} from "../../services/thunks";
import { useParams } from "react-router-dom";
import ApplicationInstructionList from "./ApplicationInstructionsList";
import Container from "react-bootstrap/Container";
import ApplicationLocations from "./ApplicationLocations";
import { setSelectedInstruction } from "../grid/gridData";



const ApplicationDetail = () => {
  const dispatch = useDispatch();
  const params = useParams();
  useEffectOnce(() => {
    dispatch(fetchAppInstructions(params.appId));
    dispatch(
      fetchAvailableWorksheets(
        `?applied=True&application_number=${params.appId}`
      )
    );
    dispatch(fetchAppLocations(params.appId))
    dispatch(setSelectedInstruction(false))
  });

  return (
    <Container fluid>
      <h2  style={{textAlign: 'center', textDecoration: 'underline', fontWeight: 'bolder'}}>{`APPLICATION NUMBER  ${params.appId}`}</h2>
      <ApplicationInstructionList />
      <ApplicationLocations/>
    </Container>
  );
};

export default ApplicationDetail;
