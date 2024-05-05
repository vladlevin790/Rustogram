import {useEffect, useState} from "react";

export const userValidationForm = (value, validate) => {

  const [emptyInput, setEmptyInput] = useState(true);
  const [minLength, setMinLength] = useState(false);
  const [maxLength, setMaxLength] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [inputValid, setInputValid] = useState(false)

  useEffect(() => {

    for (const valid in validate) {
      switch (valid) {

        case "minLength" :
          value.length < validate[valid] ? setMinLength(true) : setMinLength(false)
          break

        case "emptyInput":
          value ? setEmptyInput(false) : setEmptyInput(true)
          break

        case "maxLength":
          value.length > validate[valid] ? setMaxLength(true) : setMaxLength(false)
          break

        case "emailError":
          const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ;
          re.test((value).toLowerCase()) ? setEmailError(false) : setEmailError(true);
          break
      }
    }
  },[value])

  useEffect(() => {
    if(emptyInput || minLength || maxLength || emailError){
      setInputValid(false);
    }else{
      setInputValid(true);
    }
  }, [emptyInput,minLength,maxLength,emailError]);

  return{
    emptyInput,
    minLength,
    emailError,
    maxLength,
    inputValid,
  }

}
