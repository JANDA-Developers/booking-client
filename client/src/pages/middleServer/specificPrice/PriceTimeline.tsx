import React from "react";
import "moment/locale/ko";
import moment from "moment";
import {MutationFn} from "react-apollo";
import Timeline, {
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
  SharedSideBarHeader
} from "../../../atoms/timeline/Timeline";
import ErrProtecter from "../../../utils/errProtect";
import "./PriceTimeline.scss";
import {
  getAllRoomTypePrice_GetAllRoomType_roomTypes as IRoomType,
  createRoomPrice,
  createRoomPriceVariables,
  deleteRoomPrice,
  deleteRoomPriceVariables,
  priceTimelineGetPrice_GetRoomTypeDatePrices_roomTypeDatePrices
} from "../../../types/api";
import Preloader from "../../../atoms/preloader/Preloader";
import {IItem} from "./PriceTimelineWrap";
import InputText from "../../../atoms/forms/inputText/InputText";
import {IUseDayPicker} from "../../../actions/hook";
import JDdayPicker from "../../../atoms/dayPicker/DayPicker";
import {setMidNight, autoComma} from "../../../utils/utils";
import {TimePerMs, GlobalCSS, WindowSize} from "../../../types/enum";
import Icon, {IconSize} from "../../../atoms/icons/Icons";
import JDIcon from "../../../atoms/icons/Icons";
import reactWindowSize, {WindowSizeProps} from "react-window-size";
import {ASSIG_VISIBLE_CELL_MB_DIFF} from "../assig/timelineConfig";

interface IProps {
  items: IItem[] | undefined;
  houseId: string;
  priceMap: Map<any, any>;
  defaultProps: any;
  timelineProps?: any;
  loading: boolean;
  dayPickerHook: IUseDayPicker;
  roomTypesData: IRoomType[] | undefined;
  createRoomPriceMu: MutationFn<createRoomPrice, createRoomPriceVariables>;
  delteRoomPriceMu: MutationFn<deleteRoomPrice, deleteRoomPriceVariables>;
  setDataTime: React.Dispatch<
    React.SetStateAction<{
      start: number;
      end: number;
    }>
  >;
  dataTime: {start: number; end: number};
  defaultTime: {start: number; end: number};
  placeHolderMap: Map<any, any>;
}

const ModifyTimeline: React.FC<IProps & WindowSizeProps> = ({
  items,
  defaultProps,
  roomTypesData,
  loading,
  createRoomPriceMu,
  delteRoomPriceMu,
  houseId,
  priceMap,
  dataTime,
  setDataTime,
  defaultTime,
  dayPickerHook,
  placeHolderMap,
  windowWidth,
  ...timelineProps
}) => {
  const isMobile = windowWidth <= WindowSize.MOBILE;
  const isTabletDown = windowWidth <= WindowSize.TABLET;

  // 그룹 렌더
  const ModifyGroupRendererFn = ({group}: any) => {
    const roomType: IRoomType | undefined =
      roomTypesData && roomTypesData[group.roomTypeIndex];

    //  룹타입 부분 렌더할지 체크
    return (
      <div key={group._id}>
        <span className="title">{group.name}</span>
      </div>
    );
  };

  // 가격 인풋 블러시
  const handlePriceBlur = (value: string | null, item: IItem) => {
    const inValue = value ? parseInt(value, 10) : null;
    //  ❗️ 남은 부분이 PLcae Holder로 매워져 있을수 있도록 해야함

    const beforePrice = priceMap.get(item.id);

    if (beforePrice !== undefined) {
      // 이전가격과 같다면 리턴.
      if (beforePrice === inValue) return;

      if (inValue === null) {
        delteRoomPriceMu({
          variables: {
            date: item.end,
            roomTypeId: item.group
          }
        });
        // ❔ 컬백으로 옴겨야할까?
        priceMap.delete(item.id);
        return;
      }
    }

    if (inValue !== null) {
      createRoomPriceMu({
        variables: {
          houseId,
          date: item.end,
          roomTypeId: item.group,
          price: inValue
        }
      });
      // ❔ 컬백으로 옴겨야할까? 아마 그러는게 낳을듯 ㅠㅠ
      //  이게 실패가 생기니까 Ui 오류가 발생함. 콜백에서하면
      //  실패시 다시 map에서 default가 나올수도 있으니...
      priceMap.set(item.id, inValue);
    }
  };

  // 아이템 렌더
  const itemRendererFn = ({
    item,
    itemContext,
    getItemProps,
    getResizeProps
  }: any) => {
    // props 안에 필수 좌표값 존재
    const props = getItemProps(item.itemProps);

    return (
      <div
        style={{...props.style, backgroundColor: "transparent", border: "none"}}
      >
        <InputText
          defaultValue={priceMap.get(item.id)}
          placeholder={autoComma(placeHolderMap.get(item.id))}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            handlePriceBlur(e.currentTarget.value, item);
          }}
        />
      </div>
    );
  };

  // 타임라인 이동시
  const handleTimeChange = (
    visibleTimeStart: number,
    visibleTimeEnd: number,
    updateScrollCanvas: any
  ) => {
    const dataLimitEnd = dataTime.end - TimePerMs.DAY * 20;
    const dataLimitstart = dataTime.start + TimePerMs.DAY * 10;

    //  뒤로 요청
    if (visibleTimeStart < dataLimitstart) {
      const queryStart = visibleTimeStart - TimePerMs.DAY * 60;
      const queryEnd = visibleTimeEnd + TimePerMs.DAY * 30;

      setDataTime({
        start: setMidNight(queryStart),
        end: setMidNight(queryEnd)
      });
    }

    //  앞으로 요청
    if (dataLimitEnd < visibleTimeEnd) {
      const queryStart = visibleTimeStart - TimePerMs.DAY * 30;
      const queryEnd = visibleTimeEnd + TimePerMs.DAY * 60;

      setDataTime({
        start: setMidNight(queryStart),
        end: setMidNight(queryEnd)
      });
    }
    updateScrollCanvas(visibleTimeStart, visibleTimeEnd);
  };

  const modifySideBarRendererFn = () => <div className="modify__sideTop" />;

  return (
    <div id="specificPrice" className="specificPrice container container--full">
      <div className="docs-section">
        <h3>상세가격 수정</h3>
        <p className="JDtextColor--point">
          * 해당 가격 수정은 모든 가격설정중 최우선 적용 됩니다.
        </p>
        <div className="flex-grid flex-grid--end">
          <div className="flex-grid__col col--full-4 col--lg-4 col--md-6" />
        </div>
        <div className="ModifyTimeline__timelineWrapScroll">
          <div className="ModifyTimeline__timelineWrap specificPrice__timeline">
            <Timeline
              {...defaultProps}
              {...timelineProps}
              items={items || []}
              groups={roomTypesData || []}
              onTimeChange={handleTimeChange}
              defaultTimeStart={defaultTime.start}
              defaultTimeEnd={
                isTabletDown
                  ? defaultTime.end - TimePerMs.DAY * ASSIG_VISIBLE_CELL_MB_DIFF
                  : defaultTime.end
              }
              itemRenderer={itemRendererFn}
              groupRenderer={ModifyGroupRendererFn}
              sidebarContent={modifySideBarRendererFn()}
              sidebarWidth={isMobile ? 100 : 230}
            >
              <TimelineHeaders>
                <SidebarHeader>
                  {({getRootProps}: any) => (
                    <SharedSideBarHeader
                      getRootProps={getRootProps}
                      dayPickerHook={dayPickerHook}
                    />
                  )}
                </SidebarHeader>
                <DateHeader
                  intervalRenderer={({
                    getIntervalProps,
                    intervalContext
                  }: any) => {
                    const isToday = intervalContext.interval.startTime.isSame(
                      new Date(),
                      "day"
                    );
                    return (
                      <div
                        className={`rct-dateHeader ${isToday &&
                          "rct-dateHeader--today"}`}
                        {...getIntervalProps()}
                      >
                        <div className="rct-dateHeader__inner">
                          {intervalContext.intervalText
                            .replace("요일,", ", ")
                            .replace(/[0-9]{4}년/, "")}
                        </div>
                      </div>
                    );
                  }}
                  height={GlobalCSS.TIMELINE_HEADER_HEIGHT}
                  unit="day"
                />
              </TimelineHeaders>
            </Timeline>
            <Preloader size="large" loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default reactWindowSize<IProps>(ErrProtecter(ModifyTimeline));
