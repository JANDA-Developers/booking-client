import React, { useState, Fragment, useEffect, useLayoutEffect } from "react";
import windowSize, { WindowSizeProps } from "react-window-size";
import { Query } from "react-apollo";
import ErrProtecter from "../../../utils/errProtect";
import JDdayPicker from "../../../atoms/dayPicker/DayPicker";
import {
  useDayPicker,
  useModal,
  IUseModal,
  useCheckBox,
  useInput,
  LANG
} from "../../../hooks/hook";
import "./Reservation.scss";
import Button from "../../../atoms/button/Button";
import Card from "../../../atoms/cards/Card";
import {
  makeBookingForPublic,
  makeBookingForPublicVariables,
  getAllRoomTypeForBooker,
  getHouseForPublic_GetHouseForPublic_house
} from "../../../types/api";
import $ from "jquery";
import BookingInfoBox from "./components/bookingInfoBox";
import PayMentModal from "./components/paymentModal";
import RoomTypeCardWrap from "./components/roomTypeCards/roomTypeCardsWrap";
import {
  isEmpty,
  queryDataFormater,
  muResult,
  toNumber,
  mergeObject,
  insideRedirect,
  getOptionsObj
} from "../../../utils/utils";
import { JDtoastModal } from "../../../atoms/modal/Modal";
import { IRoomType, IMu } from "../../../types/interface";
import {
  WindowSize,
  PricingType,
  Funnels,
  PayMethod
} from "../../../types/enum";
import {
  PAYMETHOD_FOR_BOOKER_OP,
  PAYMENT_STATUS_OP2
} from "../../../types/const";
import { GET_ALL_ROOM_TYPE_FOR_BOOKER } from "../../../apollo/queries";
import Preloader from "../../../atoms/preloader/Preloader";
import { Helmet } from "react-helmet";
import RoomSearcher from "../../../components/roomSearcher.tsx/RoomSearcher";
import BookingInfoModal from "./components/roomTypeCards/bookingInfoModal";
import isLast from "../../../utils/isLast";
import { IContext } from "../../bookingHost/BookingHostRouter";
import BookingModalWrap from "../../../components/bookingModal/BookingModalWrap";
import { DEFAULT_BOOKING, DEFAULT_CARD_INFO } from "../../../types/defaults";
import { divisionRoomSelectInfo } from "../../../utils/typeChanger";
import { to4YMMDD } from "../../../utils/setMidNight";
import {
  IBookingModalProp,
  IRoomSelectInfo
} from "../../../components/bookingModal/declaration";
import JDbox from "../../../atoms/box/JDbox";
import { IBookerInfo, IReservationHooks } from "./declation";
import { Redirect } from "react-router-dom";
import { TCardRegistInfo } from "../../../components/cardModal/declare";
import moment from "moment";
import { toast, JDtypho, useSelect } from "@janda-com/front";

class GetAllAvailRoomQu extends Query<getAllRoomTypeForBooker> { }
export interface ISetBookingInfo
  extends React.Dispatch<React.SetStateAction<IBookerInfo>> { }

interface IProps {
  makeBookingForPublicMu?: IMu<
    makeBookingForPublic,
    makeBookingForPublicVariables
  >;
  publicHouseInfo?: getHouseForPublic_GetHouseForPublic_house;
  createLoading: boolean;
  context?: IContext;
  reservationModalHook?: IUseModal;
}

let LAST_HEIGHT = 0;
const Reservation: React.SFC<IProps & WindowSizeProps> = ({
  windowWidth,
  makeBookingForPublicMu,
  context,
  createLoading,
  publicHouseInfo,
  reservationModalHook
}) => {
  const isHost = context ? true : false;
  const houseId = context ? context.house._id : undefined;
  const defaultBookingInfo: IBookerInfo = {
    name: "",
    password: "",
    memo: "",
    email: "colton950901@naver.com",
    phoneNumber: "",
    agreePrivacyPolicy: isHost ? true : false,
    resvCode: ""
  };

  if (!publicHouseInfo?.bookingPayInfo.payMethods) return <div />;
  const { bookingPayInfo, houseConfig } = publicHouseInfo;
  const { payMethods } = bookingPayInfo;
  const { bookingConfig, options: optArray } = houseConfig;
  const { bookOnlySingleDay, maxStayDate } = bookingConfig;

  const customMsgs = getOptionsObj(optArray);
  const { ResvCompeleteMsg, ResvCautionMsg } = customMsgs;

  if (isEmpty(payMethods))
    return (
      <div>
        <h1>현재 숙소는 예약을 받지 않습니다.</h1>
      </div>
    );
  const isMobile = windowWidth < WindowSize.PHABLET;
  const dayPickerHook = useDayPicker(null, null);

  const defaultPay = PAYMETHOD_FOR_BOOKER_OP.find(po => po.value === bookingPayInfo.payMethods?.[0]);

  // 모바일에서만 사용
  const [redirect, setRedirect] = useState("");
  const [step, setStep] = useState<"search" | "select">("search");
  const [roomSelectInfo, setRoomSelectInfo] = useState<IRoomSelectInfo[]>([]);
  const [bookerInfo, setBookerInfo] = useState<IBookerInfo>(defaultBookingInfo);
  const rsevModalHook = useModal(false);
  const toastModalHook = useModal(false);
  const confirmModalHook = useModal(false);
  const bookingInfoModal = useModal(false);
  const roomInfoHook = useState<IRoomType[]>([]);
  const bookingModalHook = useModal<IBookingModalProp>();
  const sendSmsHook = useCheckBox(!isHost);
  const priceHook = useInput(0);
  const payMethodHook = useSelect(
    defaultPay || PAYMETHOD_FOR_BOOKER_OP[1],
    PAYMETHOD_FOR_BOOKER_OP
  );
  const cardInfoHook = useState<TCardRegistInfo>(DEFAULT_CARD_INFO);
  const filteredPayMethodOp = PAYMETHOD_FOR_BOOKER_OP.filter(op =>
    payMethods.includes(op.value)
  );

  useEffect(() => {
    window.scrollTo(screen.width / 2, screen.height / 2);
  }, [bookingInfoModal.isOpen, rsevModalHook.isOpen]);

  const reservationHooks: IReservationHooks = {
    priceHook,
    cardInfoHook,
    roomInfoHook,
    toastModalHook,
    dayPickerHook,
    bookerInfo,
    setBookerInfo,
    roomSelectInfo,
    setRoomSelectInfo,
    sendSmsHook,
    payMethodHook
  };

  const openPaymentCompleteModal = (code: string) => {
    const publicKey = sessionStorage.getItem("hpk");
    const { name, password, phoneNumber } = bookerInfo;

    confirmModalHook.openModal({
      txt: (
        <div>
          {ResvCompeleteMsg && (
            <JDtypho mb="normal">
              <JDtypho weight={600} mb="small">
                예약완료 메세지
              </JDtypho>
              <div
                style={{
                  whiteSpace: "pre-line"
                }}
              >
                {ResvCompeleteMsg}
              </div>
            </JDtypho>
          )}
          {LANG("your_resv_code_is")(code)}
        </div>
      ),
      confirmCallBackFn: () => {
        location.href = insideRedirect(
          `outpage/checkReservation/${publicKey}/${name}/${phoneNumber}/${password}`
        );
      }
    });
  };

  // 날자를 선택하면 예약선택 상태 초기화
  useEffect(() => {
    setRoomSelectInfo([]);
    priceHook.onChange(0);
    const { from, to } = dayPickerHook;
    setBookerInfo(defaultBookingInfo);
    if (from && to && maxStayDate)
      if (moment(to).diff(from, "d") > maxStayDate)
        toast.warn(LANG("max_range_book_day_is")(maxStayDate));
  }, [dayPickerHook.to, dayPickerHook.from]);

  // Iframe 높이조절
  useLayoutEffect(() => {
    const theHeight = $("#JDreservation").height() || 1000;
    const changeHeight = () => {
      window.parent.postMessage({ height: theHeight }, "*");
      LAST_HEIGHT = theHeight;
    };
    changeHeight();
  });

  //방선택 을 했는지 확인
  const roomSelectValidation = () => {
    if (isEmpty(roomSelectInfo)) {
      toastModalHook.openModal({ txt: LANG("no_room_selected") });
      return false;
    }
    return true;
  };

  const roomCardMessage = () => {
    if (!dayPickerHook.from) return LANG("please_slect_date_at_calender");
    if (dayPickerHook.from && !dayPickerHook.to)
      return LANG("please_select_checkOut_date");
    if (dayPickerHook.from && dayPickerHook.to)
      return LANG("there_is_no_room_in_selected_date");
    return "";
  };

  const bookingCompleteFn = async () => {
    const {
      agreePrivacyPolicy,
      email,
      memo,
      name,
      password,
      phoneNumber
    } = bookerInfo;

    if (!makeBookingForPublicMu) throw Error("makeBookingForPublicMu 가 없음");

    const { cardNo, cardPw, expMonth, expYear, idNo } = cardInfoHook[0];

    const isCardPay = payMethodHook.selectedOption?.value === PayMethod.CARD;

    const makeBookingVariables: makeBookingForPublicVariables = {
      bookerParams: {
        agreePrivacyPolicy,
        email,
        memo,
        name,
        password,
        phoneNumber,
        funnels: Funnels.HOMEPAGE
      },
      checkInOut: {
        checkIn: to4YMMDD(dayPickerHook.from),
        checkOut: to4YMMDD(dayPickerHook.to)
      },
      guestDomitoryParams: roomSelectInfo
        .filter(room => room.pricingType === PricingType.DOMITORY)
        .map(room => ({
          roomTypeId: room.roomTypeId,
          countFemale: room.count.female,
          countMale: room.count.male
        })),
      guestRoomParams: roomSelectInfo
        .filter(room => room.pricingType === PricingType.ROOM)
        .map(room => ({
          roomTypeId: room.roomTypeId,
          countRoom: room.count.roomCount
        })),
      paymentParams: {
        payMethod: payMethodHook.selectedOption!.value,
        price: toNumber(priceHook.value),
        cardPayInfo: isCardPay
          ? {
            cardNo: cardNo,
            cardPw: cardPw,
            expMonth,
            expYear,
            idNo
          }
          : undefined
      }
    };

    const tempResult = await makeBookingForPublicMu({
      variables: makeBookingVariables
    });

    if (tempResult) rsevModalHook.closeModal();

    const validResult = muResult(tempResult, "MakeBookingForPublic", "booking");

    if (!validResult) return;

    localStorage.setItem(
      localStorage.getItem("JD-BN") || "",
      validResult.bookingNum
    );

    openPaymentCompleteModal(validResult.bookingNum);
  };

  const openBookingModal = (user: "guest" | "host") => {
    if (user === "host") {
      const tempDefault = mergeObject(DEFAULT_BOOKING, {
        payment: {
          totalPrice: priceHook.value
        }
      });
      bookingModalHook.openModal({
        mode: "CREATE",
        createParam: {
          ...tempDefault,
          checkOut: dayPickerHook.to,
          checkIn: dayPickerHook.from,
          ...divisionRoomSelectInfo(roomSelectInfo)
        }
      });
    } else {
      if (isMobile) {
        bookingInfoModal.openModal();
      } else {
        rsevModalHook.openModal();
      }
    }
  };

  const handleResvBtnClick = () => {
    if (!roomSelectValidation()) return;
    if (isHost) {
      openBookingModal("host");
    } else {
      openBookingModal("guest");
    }
  };

  /* 모바일 날자 검색 UI */
  if (step === "search" && isMobile) {
    return (
      <div id="JDreservation" className="JDreservation">
        <div className="JDreservation__mobileRoomSearcherWrap">
          <RoomSearcher
            callBackOnSearch={result => {
              dayPickerHook.setFrom(result.checkIn);
              dayPickerHook.setTo(result.checkOut);
              dayPickerHook.setEntered(result.checkOut);
              setStep("select");
            }}
          />
        </div>
      </div>
    );
  }

  if (redirect) {
    return <Redirect to={redirect} />;
  }

  return (
    <div id="JDreservation" className="JDreservation">
      <Helmet>
        <script src="https://web.nicepay.co.kr/v3/webstd/js/nicepay-2.0.js" />
      </Helmet>
      <div className="flex-grid">
        <div className="flex-grid__col JDreservation__card-grid col--full-4 col--lg-5 col--wmd-12">
          <Card className="JDmargin-bottom0 JDreservation__card JDreservation__dayPickerCard">
            <h6 className="JDreservation__sectionTitle">
              ① {LANG("select_date")}
            </h6>
            {/* TODO: change 될때마다 roomSelectInfo를 초기화 해주어야함 */}
            {isMobile || (
              <JDdayPicker
                mode="checkInOutStyle"
                canSelectSameDate={false}
                {...dayPickerHook}
              />
            )}
            {isMobile && (
              <div className="JDflex">
                <JDbox mb="no" align="flexVcenter" size="small">
                  {dayPickerHook.from?.toLocaleDateString() +
                    " " +
                    LANG("checkIn")}
                </JDbox>
                <JDbox mb="no" align="flexVcenter" size="small">
                  {dayPickerHook.to?.toLocaleDateString() +
                    " " +
                    LANG("checkOut")}
                </JDbox>
              </div>
            )}
          </Card>
        </div>
        <div className="flex-grid__col JDreservation__roomSelect-grid col--full-8 col--lg-7 col--wmd-12">
          <Card
            fullWidth={isMobile}
            className="JDz-index-1 JDstandard-space0 JDreservation__card"
          >
            <h6 className="JDreservation__sectionTitle">
              ② {LANG("room_select")}
            </h6>
            {/* TODO: roomTypes들의 반복문을 통해서 만들고 해당 정보는 roomSelectInfo 에서 filter를 통해서 가져와야함 */}

            <GetAllAvailRoomQu
              skip={!(dayPickerHook.from && dayPickerHook.to)}
              query={GET_ALL_ROOM_TYPE_FOR_BOOKER}
            >
              {({ data: roomTypeData, loading: roomAvailCountLoading }) => {
                const roomTypes = queryDataFormater(
                  roomTypeData,
                  "GetAllRoomTypeForBooker",
                  "roomTypes",
                  undefined
                );

                return !isEmpty(roomTypes) ? (
                  roomTypes.map((roomType, index) => (
                    <RoomTypeCardWrap
                      houseConfigInfo={houseConfig}
                      reservationHooks={reservationHooks}
                      windowWidth={windowWidth}
                      roomTypeData={roomType}
                      isHost={isHost}
                      houseId={houseId}
                      key={`roomCard${roomType._id}`}
                      lastCard={isLast(index, roomTypes)}
                    />
                  ))
                ) : (
                    <Fragment>
                      <h4 className="JDreservation__cardMessage JDtextcolor--placeHolder JDtext-align-center">
                        <Preloader
                          className="JDstandard-margin0"
                          loading={roomAvailCountLoading}
                        />
                        {roomAvailCountLoading || roomCardMessage()}
                      </h4>
                    </Fragment>
                  );
              }}
            </GetAllAvailRoomQu>
          </Card>
          {!isMobile && (
            <Card
              fullWidth={isMobile}
              className={`JDstandard-space0 JDmargin-bottom0 JDreservation__confirmCard JDreservation__card`}
            >
              <h6 className="JDreservation__sectionTitle">
                {LANG("check_selection")}
              </h6>
              <BookingInfoBox
                houseConfig={houseConfig}
                roomTypeInfo={roomInfoHook[0]}
                from={dayPickerHook.from}
                to={dayPickerHook.to}
                roomSelectInfo={roomSelectInfo}
                totalPrice={toNumber(priceHook.value)}
              />
            </Card>
          )}
          {isEmpty(roomSelectInfo) && isMobile && (
            <Button
              id="ResvBtn"
              thema="primary"
              icon="return"
              onClick={() => {
                setStep("search");
              }}
              label={LANG("go_back")}
              size="longLarge"
              className="JDmarginTop JDmargin-bottom0"
            />
          )}
          {!isEmpty(roomSelectInfo) && (
            <Button
              id="ResvBtn"
              thema="primary"
              onClick={handleResvBtnClick}
              label={LANG("make_reservation")}
              size="longLarge"
              className="JDmarginTop JDmargin-bottom0"
            />
          )}
        </div>
        {ResvCautionMsg && (
          <div
            style={{
              marginTop: "1rem"
            }}
          >
            <JDtypho mb="superTiny" weight={600} size="small">
              예약전 주의사항
            </JDtypho>
            <JDtypho
              style={{
                whiteSpace: "pre-line",
                wordBreak: "keep-all"
              }}
              size="small"
            >
              {ResvCautionMsg}
            </JDtypho>
          </div>
        )}
      </div>
      {/* 호스트예약일떄 */}
      <div className="JDreservation__wrap">
        {context && (
          <BookingModalWrap
            makeBookingCallBack={result => {
              if (result !== "error") {
                reservationModalHook && reservationModalHook.closeModal();
              }
            }}
            context={context}
            modalHook={bookingModalHook}
          />
        )}
      </div>
      {/* 게스트예약일떄 카드 정보를 입력 할수있는 창 */}
      <PayMentModal
        customMsgs={customMsgs}
        publicHouseInfo={publicHouseInfo}
        bookingCompleteFn={bookingCompleteFn}
        createLoading={createLoading}
        reservationHooks={reservationHooks}
        modalHook={rsevModalHook}
      />
      {/* 모바일 + 게스트일떄 장바구니 먼저 보여줌 */}
      {isMobile && (
        <BookingInfoModal
          houseConfig={houseConfig}
          paymentModalHook={rsevModalHook}
          modalHook={bookingInfoModal}
          roomTypeInfo={roomInfoHook[0]}
          from={dayPickerHook.from}
          to={dayPickerHook.to}
          roomSelectInfo={roomSelectInfo}
          totalPrice={priceHook.value}
        />
      )}
      <JDtoastModal {...confirmModalHook} confirm />
      <JDtoastModal {...toastModalHook} isAlert />
    </div>
  );
};

export default windowSize<IProps>(ErrProtecter(Reservation));
