import React, { useState } from "react";
import GuestSearchInput from "./GuestSearchInput";
import { queryDataFormater } from "../../utils/utils";
import { GET_BOOKINGS } from "../../apollo/queries";
import { Query } from "react-apollo";
import {
  getBookings,
  getBookingsVariables,
  GetBookingsFilter
} from "../../types/api";
import { isYYYYMMDD, isNumberMinMax } from "../../utils/inputValidations";
import { IContext } from "../../pages/bookingHost/BookingHostRouter";

class GetBookingsQuery extends Query<getBookings, getBookingsVariables> {}

interface IProps {
  context: IContext;
}

const GuestSearchInputWrap: React.FC<IProps> = ({ context }) => {
  const { house } = context;
  let houseId = "";
  houseId = house ? house._id : "";

  const [onTypeValue, setType] = useState<string>("");

  const searchFilterCreater = (value: string): GetBookingsFilter => {
    const isPhoneNumber = isNumberMinMax(value, 4, 11);
    return {
      phoneNumnber: isPhoneNumber && !isYYYYMMDD(value) ? value : undefined,
      name: !isPhoneNumber && !isYYYYMMDD(value) ? value : undefined,
      stayDate: isYYYYMMDD(value)
        ? {
            checkIn: value,
            checkOut: value
          }
        : undefined,
      createdAt: undefined
    };
  };

  const filter = searchFilterCreater(onTypeValue);

  const skipValidate = () => {
    if (!houseId) return false;
    if (!filter.name && !filter.phoneNumnber && !filter.stayDate) return false;
    return true;
  };

  return (
    <GetBookingsQuery
      skip={skipValidate()}
      query={GET_BOOKINGS}
      variables={{
        houseId: houseId || "",
        count: 10,
        page: 1,
        filter: filter
      }}
    >
      {({ data: bookingsData, loading, error }) => {
        const bookings = queryDataFormater(
          bookingsData,
          "GetBookings",
          "bookings",
          undefined
        );

        return (
          <GuestSearchInput
            context={context}
            bookings={bookings || []}
            onTypeValue={onTypeValue}
            setType={setType}
            loading={loading}
          />
        );
      }}
    </GetBookingsQuery>
  );
};

export default GuestSearchInputWrap;
