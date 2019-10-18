import React, {Fragment, useRef, useState, useEffect} from "react";
import DayPicker, {
  CaptionElementProps,
  DayModifiers,
  DayPickerProps
} from "react-day-picker";
import classNames from "classnames";
import Caption from "./component/Caption";
import Information from "./component/Information";
import Navbar from "./component/Navbar";
import JDdayPickerInput from "./component/input/JDdayPickerInput";
import HorizenDay from "./component/horizen/HorizenDays";
import HorizenCaption from "./component/horizen/HorizenCaption";
import "./DayPicker.scss";
import {IUseDayPicker} from "../../hooks/hook";
import moment from "moment";

export interface IJDdayPickerProps extends IUseDayPicker {
  canSelectBeforeDay?: boolean;
  horizen?: boolean;
  placeholder?: string;
  input?: boolean;
  label?: string;
  readOnly?: boolean;
  isRange?: boolean;
  displayYear?: boolean;
  canSelectSameDate?: boolean;
  format?: string;
  lang?: string;
  showInputIcon?: boolean;
  inputDisabled?: boolean;
  maxLimit?: boolean;
  showWeekEndColor?: boolean;
  mode?: "reservation";
  inputComponent?: any;
  onChangeDate?(foo?: string | Date | null, foo2?: string | Date | null): void;
  className?: string;
  inputClassName?: string;
  calenaderPosition?: "left" | "right" | "center";
  displayCaption?: boolean;
  displayHeader?: boolean;
  displayInfo?: boolean;
}

const JDdayPicker: React.FC<IJDdayPickerProps> = ({
  horizen,
  calenaderPosition = "right",
  input,
  isRange = true,
  label,
  inputDisabled,
  onChangeDate,
  canSelectSameDate = true,
  showInputIcon = true,
  displayCaption = true,
  displayHeader = true,
  displayInfo = true,
  format,
  placeholder,
  lang = "ko",
  from,
  setFrom,
  to,
  setTo,
  entered,
  displayYear = true,
  canSelectBeforeDay,
  inputClassName,
  inputComponent,
  setEntered,
  maxLimit,
  readOnly,
  mode,
  showWeekEndColor = true,
  className
}) => {
  const dayPickerFullWrap: any = useRef();
  const isInitialMount = useRef(true);

  // 리셋버튼 클릭 이벤트
  const handleResetClick = () => {
    setFrom(null);
    setTo(null);
    setEntered(null);
  };

  // From을 SET 할지 TO를 SET 할지 물어봄
  const isSelectingFromDay = (inFrom: any, inTo: any, day: any) => {
    // From 이전의 날자를 선택했다면
    const isBeforeFirstDay =
      inFrom && DayPicker.DateUtils.isDayBefore(day, inFrom);
    // From과 To 가 ⭐️이미️️️⭐️ 존재하는가?
    const isRangeSelected = inFrom && inTo;
    return !inFrom || isBeforeFirstDay || isRangeSelected;
  };

  // handle --day : Enter
  const handleDayMouseEnter = (day: Date) => {
    if (!isSelectingFromDay(from, to, day)) setEntered(day);
  };

  // handle --day : Click
  const handleDayClick = (day: Date, modifiers: DayModifiers) => {
    if (readOnly) return;
    // 불가능한 날자를 눌럿을경우에
    if (modifiers.disabled) return;

    // 같은날을 선택할수 없는경우에
    if (from && !canSelectSameDate && day <= from) {
      handleResetClick();
      return;
    }

    // 범위선택이 닌 경우에
    if (!isRange) {
      setFrom(day);
      setEntered(day);
      setTo(day);
      return;
    }

    // 이미 선택된 날을 눌렀을경우에
    if (from && to && day >= from && day <= to) {
      handleResetClick();
      return;
    }

    // 첫선택 인가?
    if (isSelectingFromDay(from, to, day)) {
      // 첫날을 셋팅하고 나머지날자는 널 기입
      setFrom(day);
      setEntered(null);
      setTo(null);
    } else {
      // 마지막 날에 값 기입
      if (from && mode === "reservation" && moment(from).isSame(day, "day")) {
        setTo(
          moment(from)
            .add(1, "day")
            .toDate()
        );
      } else {
        setTo(day);
      }
      setEntered(day);
    }
  };

  // Effect : calendar With Set
  useEffect(() => {
    if (horizen) {
      const Months = dayPickerFullWrap.current.querySelector(
        ".DayPicker-Months"
      );
      const today = Months.querySelector(".DayPicker-Day--today");
      const todayOffestX = today.offsetLeft;
      Months.scrollLeft = todayOffestX - Months.offsetWidth / 2 + 40;
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    onChangeDate && onChangeDate(from, to);
  }, [from, to]);

  // 여기다가 클래스 적립
  const wrapClasses = classNames("DayPicker-box", className, {
    "DayPicker-box--inputComponent": inputComponent,
    "DayPicker--readOnly": readOnly,
    "DayPicker--reservation": mode === "reservation",
    "DayPicker--showWeekEndColor": showWeekEndColor,
    "DayPicker--unDisplayCaption": displayCaption === false,
    "DayPicker--unDisplayNavbar": displayHeader === false,
    "DayPicker--unDisplayInfo": displayInfo === false
  });

  // 이건 순수하게 달력부분
  const classes = classNames({
    "DayPicker--horizen": horizen,
    "DayPicker--input": input,
    "DayPicker--maxLimit": maxLimit,
    "DayPicker--unYear": !displayYear,
    "DayPicker--unRange": !isRange,
    "DayPicker--right": calenaderPosition === "right",
    "DayPicker--left": calenaderPosition === "left",
    "DayPicker--center": calenaderPosition === "left"
  });

  const modifiers = {start: from || undefined, end: entered || undefined};
  const selectedDays: any = [from, {from, to: entered}];
  const MONTHS = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월"
  ];
  const WEEKDAYS_LONG = ["일", "월", "화", "수", "목", "금", "토"];
  const WEEKDAYS_SHORT = ["일", "월", "화", "수", "목", "금", "토"];

  // TODO : 너무 아슬아슬하게 결합되어있다 분리가 필요함
  const dayPickerProps: DayPickerProps = {
    tabIndex: 1,
    renderDay: horizen ? HorizenDay : undefined,
    navbarElement: <Navbar />,
    weekdayElement: horizen ? undefined : undefined,
    showWeekDays: !horizen,
    captionElement: ({date}: CaptionElementProps) => {
      const element = horizen ? (
        <HorizenCaption date={date} onChange={() => {}} />
      ) : (
        <Caption date={date} onChange={() => {}} />
      );
      return element;
    },
    className: `Range ${classes}`,
    selectedDays,
    modifiers,
    onDayClick: handleDayClick,
    onDayMouseEnter: handleDayMouseEnter,
    numberOfMonths: horizen ? 3 : 1,
    pagedNavigation: true,
    months: MONTHS,
    weekdaysLong: WEEKDAYS_LONG,
    weekdaysShort: WEEKDAYS_SHORT,
    locale: lang,
    showOutsideDays: false,
    disabledDays: canSelectBeforeDay ? undefined : [{before: new Date()}]
  };

  return (
    <div className={`${wrapClasses}`} ref={dayPickerFullWrap}>
      {input ? (
        <JDdayPickerInput
          showInputIcon={showInputIcon}
          inputComponent={inputComponent}
          placeholder={placeholder}
          format={format}
          disabled={inputDisabled}
          from={from}
          to={to}
          label={label}
          readOnly={readOnly}
          isRange={isRange}
          dayPickerProps={dayPickerProps}
          inputClassName={inputClassName}
          displayYear={displayYear}
        />
      ) : (
        <Fragment>
          <DayPicker {...dayPickerProps} />
          <Information from={from} to={to} handler={handleDayMouseEnter} />
        </Fragment>
      )}
    </div>
  );
};

export default JDdayPicker;