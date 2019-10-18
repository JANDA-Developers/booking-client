import React from "react";
import {IContext} from "../../pages/MiddleServerRouter";
import {getBookings_GetBookings_bookings} from "../../types/api";
import {IUseDayPicker} from "../../hooks/hook";
import ArrowDayByDay from "../../atoms/dayPicker/component/inputComponent/ArrowDayByDay";
import JDdayPicker from "../../atoms/dayPicker/DayPicker";
import Preloader from "../../atoms/preloader/Preloader";

interface IViewConfig {
  dayPickerHook?: IUseDayPicker;
  viewDayPicker?: boolean;
}

interface Iprops extends IViewConfig {
  context: IContext;
  loading: boolean;
  info: {
    bookingsCheckInToday: getBookings_GetBookings_bookings[];
    bookingsCount: number;
    bookingsCheckInCount: number;
  };
}

const DayCheckIn: React.FC<Iprops> = ({
  context,
  info,
  dayPickerHook,
  viewDayPicker,
  loading
}) => {
  if (loading) return <Preloader loading={loading} size="medium" />;
  return (
    <div>
      {dayPickerHook && viewDayPicker && (
        <JDdayPicker
          isRange={false}
          input
          canSelectBeforeDay={false}
          label="달력날자"
          {...dayPickerHook}
          className="JDwaves-effect JDoverflow-visible"
          inputComponent={(prop: any) => (
            <ArrowDayByDay
              {...prop}
              format="MM월 DD일"
              dayPickerHook={dayPickerHook}
            />
          )}
        />
      )}
      {info.bookingsCheckInCount}/{info.bookingsCount}
    </div>
  );
};

export default DayCheckIn;