import React, {Fragment} from "react";
import "moment/locale/ko";
import ErrProtecter from "../../../utils/errProtect";
import Button from "../../../atoms/button/Button";
import "./RoomConfig.scss";
import {
  getAllRoomType_GetAllRoomType_roomTypes as IRoomType,
  getAllRoomType_GetAllRoomType_roomTypes,
  changeIndexForRoomType,
  changeIndexForRoomTypeVariables,
  getAllRoomType_GetAllRoomType_roomTypes_rooms
} from "../../../types/api";
import Preloader from "../../../atoms/preloader/Preloader";
import JDIcon from "../../../atoms/icons/Icons";
import {useModal, LANG} from "../../../hooks/hook";
import RoomTypeModalWrap, {
  IRoomTypeModalInfo
} from "./components/RoomTypeModalWrap";
import RoomModalWrap, {IRoomModalInfo} from "./components/RoomModalWrap";
import Card from "../../../atoms/cards/Card";
import JDbox from "../../../atoms/box/JDbox";
import {MutationFn} from "react-apollo";
import {IContext} from "../../bookingHost/BookingHostRouter";
import Help from "../../../atoms/Help/Help";
import RoomTypeInfo from "../../../components/roomTypeInfo/RoomTypeInfo";
import {PureQueryOptions} from "apollo-client";

interface IProps {
  items?: any;
  defaultProps: any;
  setConfigMode: any;
  context: IContext;
  loading?: boolean;
  changeIndexForRoomTypeMu: MutationFn<
    changeIndexForRoomType,
    changeIndexForRoomTypeVariables
  >;
  refetchQueries: (PureQueryOptions | string)[];
  roomTypesData: getAllRoomType_GetAllRoomType_roomTypes[];
}

// 👿 여기 로딩처리를 해결할 방법이 안보인다.
//  아마도 DragList의 자체문제인것 같다.
const RoomConfigNew: React.FC<IProps> = ({
  context,
  roomTypesData,
  refetchQueries,
  loading
}) => {
  const roomTypeModalHook = useModal<IRoomTypeModalInfo>(false, {});
  const roomModalHook = useModal<IRoomModalInfo>(false, {});

  // 상자 형태의 [방] 출력
  const getRoomBox = (
    recode: IRoomType,
    room: getAllRoomType_GetAllRoomType_roomTypes_rooms
  ) => (
    <JDbox
      className="roomConfig__roomBox"
      align="flexVcenter"
      clickable
      onClick={() => {
        roomModalHook.openModal({
          roomTypeId: recode._id,
          roomId: room._id
        });
      }}
      textAlign="center"
      key={room._id}
    >
      <h6 className="roomConfig__roomTitle">{room.name}</h6>
    </JDbox>
  );

  return (
    <div id="RoomConfig" className="roomConfig container container--full">
      <div className="docs-section">
        <h3>{LANG("room_setting")}</h3>
        <Button
          onClick={() => {
            roomTypeModalHook.openModal({
              mode: "Create"
            });
          }}
          thema="primary"
          label={LANG("add_roomType")}
        />
        <div>
          <Preloader size="large" noAnimation loading={loading} />
        </div>
        {/* 방타입이 존재하지 않습니다. */}
        {roomTypesData.length === 0 && !loading && (
          <h4 className="JDtextColor--placeHolder JDmargin-bottom0">
            {LANG("roomType_dose_not_exsist")}
          </h4>
        )}
        <Fragment>
          {/* 방타입 카드 출력 */}
          {roomTypesData.map(roomType => (
            <Card
              key={roomType._id}
              className={`JDstandard-space0 roomConfig__roomType roomConfig__roomType${roomType._id}`}
            >
              <div className="roomConfig__roomCardWrap">
                <div className="roomConfig__roomType_titleSection">
                  <div className="roomConfig__roomType_titleAndIcons">
                    <h5 className="JDstandard-space">{roomType.name}</h5>
                    <Help
                      icon="info"
                      tooltip={<RoomTypeInfo roomType={roomType} />}
                    />
                  </div>
                  <Button
                    onClick={() => {
                      roomTypeModalHook.openModal({
                        roomTypeId: roomType._id,
                        mode: "Modify"
                      });
                    }}
                    mode="border"
                    label={LANG("do_modify")}
                    icon={"edit"}
                    size="small"
                  />
                </div>

                <div className="roomConfig__roomsWrapWrap">
                  {roomType.rooms.map(room => {
                    const RoomBox = getRoomBox(roomType, room);
                    return <Fragment key={room._id}>{RoomBox}</Fragment>;
                  })}
                  {/* add */}
                  <JDbox
                    clickable
                    textAlign="center"
                    mode="dashBorder"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      roomModalHook.openModal({
                        isAddMode: true,
                        roomTypeId: roomType._id
                      });
                    }}
                    align="flexVcenter"
                    className="roomConfig__addRoomBox"
                    key={`add${roomType._id}`}
                  >
                    <h6 className="roomConfig__roomTitle">
                      <span className="JDstandard-small-space">
                        {LANG("add_room")}
                      </span>
                      <JDIcon icon="edit" />
                    </h6>
                  </JDbox>
                </div>
              </div>
            </Card>
          ))}
        </Fragment>
      </div>
      <RoomTypeModalWrap
        context={context}
        modalHook={roomTypeModalHook}
        key={roomTypeModalHook.info.roomTypeId}
      />
      <RoomModalWrap
        refetchQueries={refetchQueries}
        context={context}
        key={roomModalHook.info.roomId}
        roomTypeData={roomTypesData}
        modalHook={roomModalHook}
      />
    </div>
  );
};

export default ErrProtecter(RoomConfigNew);