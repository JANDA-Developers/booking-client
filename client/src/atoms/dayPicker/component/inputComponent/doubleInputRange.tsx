import React from "react";
import {IUseDayPicker} from "../../../../actions/hook";
import InputText from "../../../forms/inputText/InputText";
import {setYYYYMMDD} from "../../../../utils/setMidNight";
import JDLabel from "../../../label/JDLabel";
import JDbox from "../../../box/JDbox";
interface Iprops {
  dayPickerHook: IUseDayPicker;
}

const DoubleInputRange: React.FC<Iprops> = ({dayPickerHook}) => {
  return (
    <div className="JDflex--between standard">
      <JDbox>
        <JDLabel txt="체크인 날자" />
        <h6>{setYYYYMMDD(dayPickerHook.from)}</h6>
      </JDbox>
      <JDbox>
        <JDLabel txt="체크아웃 날자" />
        <h6>{setYYYYMMDD(dayPickerHook.to)}</h6>
      </JDbox>
    </div>
  );
};

export default DoubleInputRange;