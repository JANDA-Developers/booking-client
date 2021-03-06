import { IBookingModalContext } from "./declaration";
import {
  bookingModalGetMakeBookingVariables,
  bookingModalValidate
} from "./helper";
import { LANG } from "../../hooks/hook";
import { muResult, toNumber } from "../../utils/utils";
import { AutoSendWhen, PaymentStatus } from "../../types/enum";
import { isPhone } from "../../utils/inputValidations";
import { toast } from "react-toastify";

export const getHandler = (
  bookingModalContext: IBookingModalContext,
  smsModalInfoTemp: any
) => {
  const {
    deleteBookingMu,
    memoHook,
    paymentStatusHook,
    bookingNameHook,
    priceHook,
    bookingPhoneHook,
    checkInOutHook,
    bookingStatusHook,
    payMethodHook,
    breakfast,
    makeBookingMu,
    bookingModalHook,
    sendSmsModalHook,
    bookingData,
    updateBookingMu,
    cancelBookingMu,
    refundBookingMu,
    confirmModalHook,
    refundModalHook,
    funnelStatusHook
  } = bookingModalContext;

  const { payment } = bookingData;
  const { refundedPrice, status, totalPrice } = payment;

  // 예약삭제 여부를 물어보는 버튼 컬백함수
  const deleteModalCallBackFn = (confirm: boolean) => {
    if (confirm) {
      deleteBookingMu({
        variables: {
          bookingId: bookingModalHook.info.bookingId || ""
        }
      });
    }
  };

  // 예약삭제 버튼 클릭
  const handleDeletBtnClick = () => {
    confirmModalHook.openModal({
      txt: LANG("are_you_sure_you_want_to_delete_the_reservation")
    });
  };

  // 부킹모달 예약 명령
  const makeBooking = async (callBackMakeBooking?: any) => {
    if (!bookingModalValidate(bookingModalContext)) return;

    try {
      const result = await makeBookingMu({
        variables: bookingModalGetMakeBookingVariables(bookingModalContext)
      });
      if (muResult(result, "MakeBooking")) callBackMakeBooking();
    } catch (error) {
      bookingModalHook.closeModal();
    }
  };

  // 예약생성 버튼 핸들
  const handleCreateBtnClick = () => {
    if (bookingModalHook.info.onMakeBookingStart)
      bookingModalHook.info.onMakeBookingStart();
    if (!bookingData.roomTypes) return;

    const smsCallBackFn = async (sendFlag: boolean, sendSmsMu: any) => {
      if (sendFlag) makeBooking(sendSmsMu);
      else makeBooking();
    };

    const cantSendSms = !isPhone(bookingPhoneHook.value);
    if (cantSendSms) {
      makeBooking();
    } else {
      sendSmsModalHook.openModal({
        ...smsModalInfoTemp,
        findSendCase: AutoSendWhen.WHEN_BOOKING_CREATED,
        callBackFn: smsCallBackFn,
        mode: "CreateBooking"
      });
    }
  };

  const handleCancelBtnClick = () => {
    if (status === PaymentStatus.CANCELED || status === PaymentStatus.NOT_YET) {
      toast.error(LANG("can_not_refund"));
      return;
    } else if (refundedPrice || 0 >= totalPrice) {
      toast.error(LANG("already_refund_all"));
      return;
    }
    refundModalHook.openModal();
  };

  // 예약수정 버튼 핸들
  const handleUpdateBtnClick = () => {
    if (!bookingModalValidate(bookingModalContext)) return;
    // SMS 인포를 꺼내서 발송할 SMS 문자가 있는지 확인해야할것 같다.
    updateBookingMu({
      variables: {
        bookingId: bookingModalHook.info.bookingId!,
        params: {
          email: "demo@naver.com",
          memo: memoHook.value,
          checkInInfo: {
            isIn: checkInOutHook.selectedOption?.value || false
          },
          breakfast,
          name: bookingNameHook.value,
          payMethod: payMethodHook.selectedOption!.value,
          paymentStatus: paymentStatusHook.selectedOption!.value,
          bookingStatus: bookingStatusHook.selectedOption!.value,
          phoneNumber: bookingPhoneHook.value,
          price: toNumber(priceHook.value),
          funnels: funnelStatusHook.selectedOption?.value || null
        }
      }
    });
    bookingModalHook.closeModal();
  };

  const handleRefund = async (amt: any,msg:string) => {
    const result = await cancelBookingMu({
      variables: {
        param: {
          bookingNum: bookingData.bookingNum
        }
      }
    });

    if(result.data?.CancelBooking.ok) {
      refundBookingMu({
        variables:{
          amount: amt,
          bookingNum: bookingData.bookingNum,
          cancelMessage: msg
        }
      })
    }
  };

  return {
    deleteModalCallBackFn,
    makeBooking,
    handleUpdateBtnClick,
    handleCreateBtnClick,
    handleCancelBtnClick,
    handleDeletBtnClick,
    handleRefund
  };
};
