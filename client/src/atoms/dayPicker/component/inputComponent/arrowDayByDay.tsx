import React, {Fragment} from "react";
import JDIcon from "../../../icons/Icons";
import {IUseDayPicker} from "../../../../actions/hook";
import moment from "moment";

interface Iprops {
  dayPickerHook: IUseDayPicker;
}

const ArrowDayByDay: React.FC<Iprops> = ({dayPickerHook}) => {
  const handleDayPickerArrow = (direction: "prev" | "next") => {
    const directionNum = direction === "prev" ? -1 : 1;
    dayPickerHook.setDate(
      moment(dayPickerHook.from || undefined)
        .add(directionNum, "days")
        .toDate()
    );
  };

  return (
    <Fragment>
      <JDIcon
        hover
        className="DayPicker-box--inputComponent__arrow DayPicker-box--inputComponent__arrow--left"
        onClick={e => {
          e.preventDefault();
          handleDayPickerArrow("prev");
        }}
        icon="arrowLeft"
      />
      <span>
        {moment(dayPickerHook.from || new Date()).format("YYYY-MM-DD")}
      </span>
      <JDIcon
        hover
        className="DayPicker-box--inputComponent__arrow DayPicker-box--inputComponent__arrow--right"
        onClick={e => {
          e.stopPropagation();
          handleDayPickerArrow("next");
        }}
        icon="arrowRight"
      />
    </Fragment>
  );
};

export default ArrowDayByDay;