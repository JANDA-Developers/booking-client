/* eslint-disable no-shadow */
import { useState } from 'react';

function useInput(defaultValue) {
  const [value, setValue] = useState(defaultValue);
  const [isValid, setIsValid] = useState('');

  const onChange = (value) => {
    console.log(value);
    setValue(value);
  };

  const onChangeValid = (value) => {
    console.log(value);
    setIsValid(value);
  };

  return {
    value,
    onChange,
    isValid,
    onChangeValid,
  };
}

function useCheckBox(defaultValue) {
  const [checked, setChecked] = useState(defaultValue);

  const onChange = (value) => {
    setChecked(value);
  };

  return {
    checked,
    onChange,
  };
}

function useRadio(defaultValue) {
  const [value, setValue] = useState(defaultValue);

  const onChange = (value) => {
    setValue(value);
    console.log(value);
  };

  return [value, onChange];
}

function useSwitch(defaultValue) {
  const [checked, setChecked] = useState(defaultValue);

  const onChange = (value) => {
    setChecked(value);
  };

  return { checked, onChange };
}

function useSelect(defaultValue) {
  const [selectedOption, setSelectedOption] = useState(defaultValue);

  const onChange = (value) => {
    setSelectedOption(value);
  };

  return { selectedOption, onChange };
}

export {
  useInput, useCheckBox, useRadio, useSwitch, useSelect,
};
