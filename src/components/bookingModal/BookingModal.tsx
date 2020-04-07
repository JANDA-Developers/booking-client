import React, { Fragment, useState, useMemo, useEffect } from "react";
import moment from "moment";
import Modal, { JDtoastModal } from "../../atoms/modal/Modal";
import {
  useInput,
  useSelect,
  IUseModal,
  useDayPicker,
  useModal,
  LANG,
} from "../../hooks/hook";
import windowSize, { WindowSizeProps } from "react-window-size";
import Button from "../../atoms/button/Button";
import { PaymentStatus, WindowSize } from "../../types/enum";
import { BOOKING_STATUS_OP, CHECK_IN_OUT_OP } from "../../types/const";
import "./BookingModal.scss";
import { IBookingModalInfo } from "./declare";
import { GB_booking, BookingModalMode } from "../../types/interface";
import { MutationFn } from "react-apollo";
import {
  updateBooking,
  updateBookingVariables,
  deleteBooking,
  deleteBookingVariables,
  startBooking,
  startBookingVariables,
  Funnels,
  refundBookingVariables,
} from "../../types/api";
import SendSMSmodalWrap from "../smsModal/SendSmsModalWrap";
import { IContext } from "../../pages/bookingHost/BookingHostRouter";
import _ from "lodash";
import { makeAssigInfo, makeSmsInfoParam } from "./helper";
import {
  getRoomSelectInfo,
  getGenderChangedGuest,
} from "../../utils/typeChanger";
import { IBookingModalContext, IBookingModalProp } from "./declaration";
import optionFineder from "../../utils/optionFinder";
import ModalEndSection from "../../atoms/modal/components/ModalEndSection";
import RefundModal from "../refundModal/RefundModal";
import { IModalSMSinfo } from "../smsModal/SendSmsModal";
import Align from "../../atoms/align/Align";
import { JDtabs, TabList, Tab, TabPanel } from "../../atoms/tabs/Tabs_";
import ElseInfo from "./components/ElseInfo";
import AssigInfo from "./components/AssigInfo";
import PaymentInfo from "./components/PayInfo";
import BookerInfo from "./components/BookerInfo";
import ResvInfo from "./components/ResvInfo";
import { getHandler } from "./getHandler";

interface IProps {
  modalHook: IUseModal<IBookingModalProp>;
  bookingData: GB_booking;
  placeHolederPrice: number;
  startBookingMu: MutationFn<startBooking, startBookingVariables>;
  updateBookingMu: MutationFn<updateBooking, updateBookingVariables>;
  deleteBookingMu: MutationFn<deleteBooking, deleteBookingVariables>;
  startBookingLoading: boolean;
  refundFn: (variables: refundBookingVariables) => void;
  context: IContext;
  loading: boolean;
  mode?: BookingModalMode;
}

const bookingModalTemp: string | null = localStorage.getItem(
  "bookingModalInfo"
);
const bookingModalInfo: IBookingModalInfo | null = bookingModalTemp
  ? JSON.parse(bookingModalTemp)
  : null;

const BookingModal: React.FC<IProps & WindowSizeProps> = ({
  modalHook,
  bookingData,
  updateBookingMu,
  startBookingMu,
  deleteBookingMu,
  startBookingLoading,
  placeHolederPrice,
  loading,
  context,
  refundFn,
  windowWidth,
  mode,
}) => {
  const isCreateMode = mode === "CREATE" || mode === "CREATE_ASSIG";
  const {
    _id: bookingId,
    email,
    memo,
    payment,
    phoneNumber,
    status: bookingStatus,
    checkIn,
    checkOut,
    checkInInfo,
    name,
    funnels,
    guests,
    breakfast: breakfastDefault,
  } = bookingData;
  const refundModalHook = useModal(false);
  const { payMethod, status: paymentStatus, totalPrice, tid } = payment;
  const [refundAmt, setRefundAmt] = useState<number>(totalPrice);
  const { house } = context;
  const { _id: houseId } = house;
  const checkInOutHook = useSelect(
    optionFineder(CHECK_IN_OUT_OP, checkInInfo.isIn)
  );
  const [breakfast, setBreakfast] = useState(breakfastDefault);
  const sendSmsModalHook = useModal<IModalSMSinfo>(false);
  const confirmModalHook = useModal(false);
  const bookingNameHook = useInput(name);
  const bookingPhoneHook = useInput(phoneNumber, true);
  const priceHook = useInput(totalPrice || placeHolederPrice);
  const memoHook = useInput(memo || "");
  const emailHook = useInput(email);
  const isDesktopUp = windowWidth > WindowSize.DESKTOP;
  const [assigInfo, setAssigInfo] = useState(makeAssigInfo(guests));
  const modalStyle = {
    content: {
      maxWidth: "30rem",
    },
  };

  const payMethodHook = useSelect(
    isCreateMode
      ? bookingModalInfo?.payMethodLastOp || null
      : { value: payMethod, label: LANG(payMethod) }
  );

  useEffect(() => {
    return () => {
      localStorage.setItem(
        "bookingModalInfo",
        JSON.stringify({
          payMethodLastOp: payMethodHook.selectedOption,
          funnelLastOp: funnelStatusHook.selectedOption,
        })
      );
    };
  });

  const deafultPayStatusOp = {
    value: paymentStatus,
    label: LANG("PaymentStatus", paymentStatus),
  };
  const createDefaultPayStatusOp = {
    value: PaymentStatus.COMPLETED,
    label: LANG("PaymentStatus", PaymentStatus.COMPLETED),
  };
  const paymentStatusHook = useSelect<PaymentStatus>(
    isCreateMode ? createDefaultPayStatusOp : deafultPayStatusOp
  );
  const funnelStatusHook = useSelect<Funnels | null>(
    funnels
      ? { value: funnels, label: LANG("Funnels", funnels) }
      : bookingModalInfo?.funnelLastOp || null
  );
  const bookingStatusHook = useSelect(
    isCreateMode
      ? BOOKING_STATUS_OP[0]
      : optionFineder(BOOKING_STATUS_OP, bookingStatus)
  );
  const resvDateHook = useDayPicker(
    moment(checkIn).toDate(),
    moment(checkOut).toDate()
  );
  const updateGuests = useMemo(() => {
    if (guests && mode === "CREATE_ASSIG")
      return getGenderChangedGuest(guests, assigInfo);
    return guests || [];
  }, [assigInfo, guests?.length]);
  const roomSelectInfo = useMemo(
    () => getRoomSelectInfo(updateGuests, bookingData.roomTypes || []),
    [bookingData.roomTypes?.length, assigInfo]
  );

  const bookingModalContext: IBookingModalContext = {
    bookingStatusHook,
    resvDateHook,
    paymentStatusHook,
    deleteBookingMu,
    bookingData,
    refundAmt,
    confirmModalHook,
    startBookingMu,
    updateBookingMu,
    bookingNameHook,
    bookingPhoneHook,
    isCreateMode,
    setAssigInfo,
    updateGuests,
    funnelStatusHook,
    priceHook,
    roomSelectInfo,
    refundFn,
    bookingModalHook: modalHook,
    placeHolederPrice,
    checkInOutHook,
    breakfast,
    setBreakfast,
    payMethodHook,
    emailHook,
    totalPrice,
    guests,
    isDesktopUp,
    memoHook,
    assigInfo,
    sendSmsModalHook,
    houseId,
    mode,
  };

  // SMS 발송 모달에 전달할 정보를 생성
  const smsModalInfoTemp = makeSmsInfoParam(
    bookingModalContext,
    modalHook.info.bookingId || bookingId,
    context
  );

  const responseStyle: any = isDesktopUp
    ? { mr: "normal", col: true as boolean, className: "modal__section" }
    : {};

  const sharedProp = {
    responseStyle,
    bookingModalContext,
  };

  const {
    deleteModalCallBackFn,
    handleCreateBtnClick,
    handleDeletBtnClick,
    handleRefundBtn,
    handleUpdateBtnClick,
  } = getHandler(bookingModalContext, smsModalInfoTemp);

  return (
    <Modal
      foot={
        <div className="JDmodal__paddingBottom">
          <Button
            id="BookingModalCreateBtn"
            size="small"
            label={LANG("do_create")}
            disabled={!isCreateMode}
            thema="primary"
            mode="flat"
            onClick={handleCreateBtnClick}
            tabIndex={0}
          />
          <Button
            id="BookingModalUpdateBtn"
            mode="flat"
            size="small"
            disabled={isCreateMode}
            label={LANG("do_modify")}
            thema="primary"
            onClick={handleUpdateBtnClick}
          />
          <Button
            id="BookingModalDeleteBtn"
            mode="flat"
            size="small"
            label={LANG("delete_booking")}
            disabled={isCreateMode}
            thema="error"
            onClick={handleDeletBtnClick}
          />
        </div>
      }
      head={{
        title: "예약정보",
      }}
      onAfterClose={() => {
        modalHook.info.onCloseModal?.();
      }}
      style={modalStyle}
      className={`Modal bookingModal`}
      overlayClassName="Overlay"
      loading={loading || startBookingLoading}
      {...modalHook}
    >
      {isDesktopUp ? (
        <Align
          className={`JDz-index-1`}
          flex={{
            wrap: true,
            oneone: true,
          }}
        >
          <Fragment>
            <BookerInfo {...sharedProp} smsModalInfoTemp={smsModalInfoTemp} />
            <PaymentInfo {...sharedProp} />
            <ResvInfo {...sharedProp} />
            <AssigInfo {...sharedProp} />
            <ElseInfo {...sharedProp} />
          </Fragment>
        </Align>
      ) : (
        <JDtabs breakTabs={isDesktopUp} tabsAlign="spaceBetween">
          <TabList
            style={{
              marginTop: "-1.2rem",
            }}
          >
            <Tab>예약자</Tab>
            <Tab>결제</Tab>
            <Tab>예약</Tab>
            <Tab>배정</Tab>
            <Tab>기타</Tab>
          </TabList>
          <TabPanel>
            <BookerInfo {...sharedProp} smsModalInfoTemp={smsModalInfoTemp} />
          </TabPanel>
          <TabPanel>
            <PaymentInfo {...sharedProp} />
          </TabPanel>
          <TabPanel>
            <ResvInfo {...sharedProp} />
          </TabPanel>
          <TabPanel>
            <AssigInfo {...sharedProp} />
          </TabPanel>
          <TabPanel>
            <ElseInfo {...sharedProp} />
          </TabPanel>
        </JDtabs>
      )}
      <RefundModal
        onRefundClick={handleRefundBtn}
        setRefundAmt={setRefundAmt}
        refundAmt={refundAmt}
        modalHook={refundModalHook}
      />
      <SendSMSmodalWrap
        isInBookingModal
        context={context}
        modalHook={sendSmsModalHook}
      />
      <JDtoastModal
        confirm
        confirmCallBackFn={deleteModalCallBackFn}
        {...confirmModalHook}
      />
    </Modal>
  );
};

export default windowSize(BookingModal);

// ℹ️ 배정달력 예약생성 플로우
// 배정 달력 선택정보 -> 예약정보로 변환(Booking) -> 배정정보로 변환(Guest 하나당 배정정보) -> (예약정보 및 방배정) 정보로 변환
