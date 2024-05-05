import {useState} from "react";
import {userValidationForm} from "./UserValidationForm.jsx";

export const UserInput = (initValue, validate) => {
  const [value,setValue] = useState(initValue)
  const [isDirty, setDirty] = useState(false)
  const valid = userValidationForm(value,validate)

  const onChange = (e) => {
    setValue(e.target.value)
  }

  const onBlur = () => {
    setDirty(true)
  }

  const clear = () => {
    setValue("");
    setDirty(false);
  };

  return{
    value,
    onChange,
    onBlur,
    isDirty,
    clear,
    ...valid,
  }

}
