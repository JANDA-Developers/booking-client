import React from "react";
import { IUseModal } from "../../../../../hooks/hook";
import { IContext } from "../../../BookingHostRouter";
import JDmodal from "../../../../../atoms/modal/Modal";
import "./CardModal.scss";
import CardViewer, { TCreateCardCallBack } from "./CardViewer";
import { getMyProfile_GetMyProfile_user_houses_product } from "../../../../../types/api";
import { TCardViewInfo } from "../../../../../components/bilingModal/components/CardInfoFormWrap";

export interface ICardModalTarget {
  product?: getMyProfile_GetMyProfile_user_houses_product;
  houseName?: string;
}

export interface ICardModalInfo {
  createCardCallBack?: TCreateCardCallBack;
  currentHouseInfo?: ICardModalTarget;
  selectCallBack?: (billKey: TCardViewInfo) => any;
}

interface Iprops {
  context: IContext;
  modalHook: IUseModal<ICardModalInfo>;
}

const CardModal: React.FC<Iprops> = ({ context, modalHook }) => {
  const { info } = modalHook;
  const { currentHouseInfo, selectCallBack, createCardCallBack } = info;

  return (
    <JDmodal className="cardModal" {...modalHook}>
      <CardViewer
        createCardCallBack={createCardCallBack}
        selectCallBack={selectCallBack}
        currentHouseInfo={currentHouseInfo}
        context={context}
      />
    </JDmodal>
  );
};

export default CardModal;