/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import $ from "jquery";
import {
  makeBooking_MakeBooking,
  makeBookingForPublic,
  makeBookingForPublicVariables,
  getHouseForPublic
} from "../../../types/api";
import {
  MAKE_BOOKING_FOR_PUBLIC,
  GET_HOUSE_FOR_PUBLIC
} from "../../../apollo/queries";
import { IUseModal, LANG } from "../../../hooks/hook";
import { isInIfram } from "../../../utils/isInIfram";
import { IContext } from "../../bookingHost/BookingHostRouter";
import { useMutation, useQuery } from "@apollo/react-hooks";
import client from "../../../apollo/apolloClient";
import Reservation from "./Reservation";
import { onCompletedMessage, queryDataFormater } from "../../../utils/utils";
import Preloader from "../../../atoms/preloader/Preloader";
import { langVarChange } from "../../../utils/langVarChange";

export interface IReservationWrapProps {
  publicKey?: string;
  context?: IContext;
  modalHook?: IUseModal;
  callBackCreateBookingMu?: (CreateBooking: makeBooking_MakeBooking) => void;
}

// 하우스 아이디를 우선 Props를 통해서 받아야함
const ReservationWrap: React.FC<IReservationWrapProps &
  RouteComponentProps<any>> = ({
  match,
  publicKey: publicKeyProp,
  context,
  modalHook,
  callBackCreateBookingMu
}) => {
  const publicKey = publicKeyProp || match.params.publickey;
  // hpk 를 URL로 부터 받아 헤더에 셋팅
  sessionStorage.setItem("hpk", publicKey);

  const { data, loading } = useQuery<getHouseForPublic>(GET_HOUSE_FOR_PUBLIC, {
    client,
    skip: publicKey === undefined
  });

  const publicHouseInfo =
    queryDataFormater(data, "GetHouseForPublic", "house", undefined) ||
    undefined;

  langVarChange(publicHouseInfo?.tags || []);

  // 스타트부킹(게스트)
  const [makeBookingForPublicMu, { loading: makeBookingLoading }] = useMutation<
    makeBookingForPublic,
    makeBookingForPublicVariables
  >(MAKE_BOOKING_FOR_PUBLIC, {
    client,
    onCompleted: ({ MakeBookingForPublic }) => {
      localStorage.setItem(
        "JD-BN",
        MakeBookingForPublic.booking?.bookingNum || ""
      );
      onCompletedMessage(MakeBookingForPublic, LANG("COMPLETE"), LANG("FAIL"));
      makeBookingCallBackFn(MakeBookingForPublic);
    }
  });

  const makeBookingCallBackFn = (result: any) => {
    modalHook && modalHook.closeModal();
    callBackCreateBookingMu && callBackCreateBookingMu(result);
  };

  if (isInIfram()) {
    $("html").addClass("inIframe");
  }

  if (loading) {
    return (
      <div>
        <Preloader page loading={loading} />
      </div>
    );
  }

  return (
    <div>
      <Reservation
        context={context}
        publicHouseInfo={publicHouseInfo}
        makeBookingForPublicMu={makeBookingForPublicMu}
        createLoading={makeBookingLoading}
        reservationModalHook={modalHook}
      />
    </div>
  );
};

export default ReservationWrap;

// 🚁 iFrame 에서 상위페이지를 Redirect 하는 방법 [https://help.surveygizmo.com/help/break-out-of-iframe];

// ⭐️⭐️ ⭐️⭐️ ⭐️⭐️ ⭐️⭐️ ⭐️⭐️  IFRAME 코드 IFRAME 코드 IFRAME 코드
// {
/*
<iframe id="JD_RESV_APP" style="border:none;min-height:400px" scrolling="no" title="JDqna" src="http://localhost:8000/#/outpage/reservation/c61bf04b-446b-7907-54d5-d509147ca39e" width="100%" height="1500px"></iframe>

<script>
window.addEventListener('message', function(e) {
  if(e.data.height) {
    jQuery('#JD_RESV_APP').height(e.data.height);
 }
})
</script>
  */
// }
