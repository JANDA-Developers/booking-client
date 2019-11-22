import {
  BookingModalMode,
  GB_booking,
  IGuestCount
} from "../../types/interface";
import {
  deleteBooking_DeleteBooking,
  updateBooking_UpdateBooking,
  startBooking_StartBooking,
  getBooking_GetBooking_booking_guests,
  Funnels
} from "../../types/api";
import {
  Gender,
  PricingType,
  BookingStatus,
  PaymentStatus,
  PayMethod
} from "../../types/enum";
import {
  IUseSelect,
  IUseDayPicker,
  TUseInput,
  IUseModal
} from "../../hooks/hook";
import { IContext } from "../../pages/bookingHost/BookingHostRouter";

// (예약/게스트) 정보
export interface IBookingModal_AssigInfo {
  _id: string;
  roomId: string;
  gender: Gender | null;
  bedIndex: number;
  pricingType: PricingType;
}

//  (예약/방타입) 정보
export interface IRoomSelectInfo {
  roomTypeId: string;
  roomTypeName?: string;
  count: IGuestCount;
  pricingType: PricingType;
  roomNames?: string[];
}

export interface IBookingModalContext {
  bookingStatusHook: IUseSelect<BookingStatus>;
  resvDateHook: IUseDayPicker;
  paymentStatusHook: IUseSelect<PaymentStatus>;
  bookingNameHook: TUseInput<any>;
  bookingPhoneHook: TUseInput<any>;
  priceHook: TUseInput<any>;
  payMethodHook: IUseSelect<PayMethod>;
  emailHook: TUseInput<any>;
  guests: getBooking_GetBooking_booking_guests[] | null;
  assigInfo: IBookingModal_AssigInfo[];
  memoHook: TUseInput<string>;
  houseId: string;
  funnelStatusHook: IUseSelect<Funnels | null>;
  mode?: BookingModalMode;
}

export interface IBookingModalProp {
  startBookingCallBack?: (result: "error" | startBooking_StartBooking) => any;
  updateBookingCallBack?: (
    result: "error" | updateBooking_UpdateBooking
  ) => any;
  deleteBookingCallBack?: (
    result: "error" | deleteBooking_DeleteBooking
  ) => any;
  bookingId?: string;
  createParam?: GB_booking;
  mode?: BookingModalMode;
}

export interface IBookingModalWrapProps {
  startBookingCallBack?: (result: "error" | startBooking_StartBooking) => any;
  updateBookingCallBack?: (
    result: "error" | updateBooking_UpdateBooking
  ) => any;
  deleteBookingCallBack?: (
    result: "error" | deleteBooking_DeleteBooking
  ) => any;
  context: IContext;
  modalHook: IUseModal<IBookingModalProp>;
}