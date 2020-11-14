import React from "react";
import { useEffectOnce } from "react-use";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAppInstructions,
  fetchAvailableWorksheets,
} from "../../services/thunks";
import { useParams } from "react-router-dom";
import ApplicationInstructionList from "./ApplicationInstructionsList";
import Container from "react-bootstrap/Container";

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
  });

  return (
    <Container fluid>
      <h2  style={{textAlign: 'center', textDecoration: 'underline', fontWeight: 'bolder'}}>{`APPLICATION NUMBER  ${params.appId}`}</h2>
      <ApplicationInstructionList />
    </Container>
  );
};

export default ApplicationDetail;
