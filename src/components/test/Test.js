import React, { Fragment } from "react";
import { show } from 'redux-modal'
import { BlueButton, GreyButton } from "../ui-components/Buttons";
import { useDispatch } from 'react-redux';
import InstructionModal from '../work-instructions/InstructionModal';
import InstructionForm from '../work-instructions/InstructionForm';



const Test = (props) => {

    const dispatch = useDispatch()

    const handleOpen = name => () => {
        console.log("OPEN MODAL")
        dispatch(show(name, { title: "CREATE WORK INSTRUCTION" }))
      };
  return <Fragment>
      <BlueButton
      onClick={handleOpen('instruction-modal')}
      >CREATE</BlueButton>
      <InstructionModal><InstructionForm/></InstructionModal>
  </Fragment>;
};
export default Test;
