import React, { useEffect } from "react";
import { getBookingMemos_GetBookings_bookings } from "../../../types/api";
import JDbox from "../../../atoms/box/JDbox";
import { IDiv } from "../../../types/interface";
import TextButton from "../../../atoms/textButton/TextButton";
import { bookingSearch } from "../../../utils/bookingSearch";
import { MemoToolTipIcon } from "./MemoTooltipIcon";
import ReactTooltip from "react-tooltip";
interface Iprops extends IDiv {
  booking: getBookingMemos_GetBookings_bookings;
}

const GuestMemoBox: React.FC<Iprops> = ({ booking, ...prop }) => {
  return (
    <div
      {...prop}
      className="JDhoverBox guestMemoBox uestMemoBox JDtext-align-left"
    >
      <JDbox
        className="guestMemoBox__box memoBox"
        topLabel={
          <TextButton
            onClick={() => {
              bookingSearch(booking.bookingId);
            }}
            color="primary"
          >
            {booking.name}
          </TextButton>
        }
        mode="border"
      >
        {booking.memo}
      </JDbox>
    </div>
  );
};

export default GuestMemoBox;
