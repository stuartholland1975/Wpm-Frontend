import React from "react";
import InstructionForm from "../work-instructions/InstructionFormRedux";

const Test = () => {

  const submit = values => {
    // print the form values to the console
    console.log(values)
  }
  return <InstructionForm onSubmit={submit}/>
};

export default Test;
