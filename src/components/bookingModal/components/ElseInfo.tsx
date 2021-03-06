import React from "react";
import { IBookingModalContext } from "../declaration";
import Align from "../../../atoms/align/Align";
import JDtypho from "../../../atoms/typho/Typho";
import InputText from "../../../atoms/forms/inputText/InputText";
import { LANG } from "../../../hooks/hook";
import JDselect from "../../../atoms/forms/selectBox/SelectBox";
import { CHECK_IN_OUT_OP } from "../../../types/const";
import CheckBox from "../../../atoms/forms/checkBox/CheckBox";
import copytoClipboard from "../../../utils/copyToClipboard";

interface IProps {
  responseStyle: any;
  bookingModalContext: IBookingModalContext;
}

const ElseInfo: React.FC<IProps> = ({ bookingModalContext, responseStyle }) => {
  const {
    memoHook,
    checkInOutHook,
    breakfast,
    setBreakfast,
    bookingData,
    isDesktopUp,
  } = bookingModalContext;
  const { bookingNum } = bookingData;
  return (
    <Align {...responseStyle} mr={undefined}>
      {isDesktopUp && <JDtypho mb="normal">{LANG("else")}</JDtypho>}
      <div>
        <InputText readOnly
          iconOnClick={() => {
            copytoClipboard(bookingNum);
          }} iconHover icon="copyFile" value={bookingNum} label={LANG("booking_number")} />
      </div>
      <div>
        <InputText {...memoHook} halfHeight textarea label={LANG("memo")} />
      </div>
      <div>
        <JDselect
          id="checkInOutSelecter"
          menuPlacement="top"
          options={CHECK_IN_OUT_OP}
          label={LANG("check_in_slash_check_out")}
          {...checkInOutHook}
        />
      </div>
      <div>
        <CheckBox
          id="breakfast"
          label={LANG("breakfast")}
          checked={breakfast}
          onChange={(v) => {
            setBreakfast(v);
          }}
        />
      </div>
    </Align>
  );
};

export default ElseInfo;
