import React, {Fragment} from "react";
import {BlueButton} from "../ui-components/Buttons";
import {showModal} from 'react-redux-modal-provider';
import WorkInstructionForm from "../work-instructions/WorkInstructionForm";
import {useDispatch} from "react-redux";
import { show } from 'redux-modal'

const Test = (props) => {
    const dispatch = useDispatch()
const handleOpen = name => () => {
    dispatch(show(name, { message: "CREATE WORK INSTRUCTION" }))
  };
    return <Fragment>
        <BlueButton
            onClick={handleOpen('work-instruction-form')}>CREATE</BlueButton>
        <WorkInstructionForm/>
    </Fragment>
};
export default Test;
