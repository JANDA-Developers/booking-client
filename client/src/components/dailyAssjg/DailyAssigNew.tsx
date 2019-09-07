import React from "react";
import "./DailyAssig.scss";
import {
  getAllRoomTypeWithGuest_GetGuests_guests,
  getAllRoomTypeWithGuest_GetAllRoomType_roomTypes_rooms
} from "../../types/api";
import {useModal, IUseModal} from "../../actions/hook";
import JDdayPicker from "../../atoms/dayPicker/DayPicker";
import BookingModalWrap from "../bookingModal/BookingModalWrap";
import ArrowDayByDay from "../../atoms/dayPicker/component/inputComponent/arrowDayByDay";
import Preloader from "../../atoms/preloader/Preloader";
import {IContext} from "../../pages/MiddleServerRouter";
import {DragBoxRoom} from "./components/DragBoxRoom";
import {DndProvider} from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import {IDragItemProp} from "./components/DragItem";
import GuestTooltip from "./components/GuestTooltip";
import {IDailyAssigProp, IDailyAssigDataControl} from "./DailyAssigWrap";
import getDailyAssigUtils from "../../pages/middleServer/assig/components/dailyAssigUtils";
import {JDtoastModal} from "../../atoms/modal/Modal";

export interface IDailyAssigContext extends IDailyAssigProp {
  confirmModalHook: IUseModal<any>;
  bookingModalHook: IUseModal<any>;
  handleDrop: (
    room: getAllRoomTypeWithGuest_GetAllRoomType_roomTypes_rooms,
    item: getAllRoomTypeWithGuest_GetGuests_guests & IDragItemProp
  ) => void;
}

interface IProps {
  context: IContext;
  dailyAssigDataControl: IDailyAssigDataControl;
  outDailyAssigContext: IDailyAssigProp;
}

const DailyAssigNew: React.SFC<IProps> = ({
  context,
  outDailyAssigContext,
  dailyAssigDataControl
}) => {
  const {
    allocateMu,
    loading,
    dayPickerHook,
    roomTypesData
  } = outDailyAssigContext;
  const bookingModalHook = useModal(false);
  const confirmModalHook = useModal(false);

  const handleDrop = (
    room: getAllRoomTypeWithGuest_GetAllRoomType_roomTypes_rooms,
    item: getAllRoomTypeWithGuest_GetGuests_guests & IDragItemProp
  ) => {
    allocateMu({
      variables: {
        roomId: room._id,
        guestId: item._id,
        bedIndex: 3
      }
    });
  };

  // 2차 Context
  const dailayAssigContext: IDailyAssigContext = Object.assign(
    outDailyAssigContext,
    {
      confirmModalHook,
      bookingModalHook,
      handleDrop
    }
  );

  const dailyAssigUtils = getDailyAssigUtils(
    dailyAssigDataControl,
    dailayAssigContext
  );

  return (
    <div className="dailyAssigWrap">
      <div className="dailyAssig__dayPicker">
        <JDdayPicker
          isRange={false}
          input
          canSelectBeforeDays={false}
          label="달력날자"
          {...dayPickerHook}
          className="JDwaves-effect JDoverflow-visible"
          inputComponent={<ArrowDayByDay dayPickerHook={dayPickerHook} />}
        />
      </div>
      <Preloader noAnimation size="medium" loading={loading || false} />
      <div className="dailyAssig">
        {roomTypesData.map(roomType => (
          <div key={`roomType${roomType._id}`} className="dailyAssig__row">
            <div className="dailyAssig__roomTypeTittle">{roomType.name}</div>
            <DndProvider backend={HTML5Backend}>
              <div className="dailyAssig__roomsWrap">
                {roomType.rooms.map(room => {
                  const itemsInRoom = itemDatas.filter(
                    guest =>
                      guest.allocatedRoom &&
                      guest.allocatedRoom._id === room._id
                  );
                  return (
                    <DragBoxRoom
                      key={room._id}
                      itemsInRoom={itemsInRoom}
                      onDrop={item => handleDrop(room, item)}
                      roomType={roomType}
                      room={room}
                    />
                  );
                })}
              </div>
            </DndProvider>
          </div>
        ))}
      </div>
      <GuestTooltip
        dailyAssigUtils={dailyAssigUtils}
        dailyAssigDataControl={dailyAssigDataControl}
        dailayAssigContext={dailayAssigContext}
        context={context}
      />
      <JDtoastModal confirm {...confirmModalHook} />
      <BookingModalWrap context={context} modalHook={bookingModalHook} />
    </div>
  );
};

export default DailyAssigNew;
