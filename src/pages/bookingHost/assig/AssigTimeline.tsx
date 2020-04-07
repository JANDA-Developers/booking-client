import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  Fragment,
  useRef,
  useLayoutEffect
} from "react";
import { Link } from "react-router-dom";
import "moment/locale/ko";
import _ from "lodash";
import { WindowSizeProps } from "react-window-size";
import Timeline, {
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
  TimelineMarkers,
  CustomMarker,
  CursorMarker
} from "../../../atoms/timeline/Timeline";
import {
  getCutCount,
  getCuttedGroups,
  getCuttedItmes
} from "./helper/outHelper";
import windowSize from "react-window-size";
import Button from "../../../atoms/button/Button";
import BookingModalWrap from "../../../components/bookingModal/BookingModalWrap";
import { IUseDayPicker, useModal, LANG } from "../../../hooks/hook";
import classnames from "classnames";
import assigGroupRendererFn from "./helper/groupRenderFn";
import { IRoomType } from "../../../types/interface";
import "./scss/AssigTimeline.scss";
import {
  WindowSize as EWindowSize,
  GlobalCSS,
  WindowSize,
  TimePerMs
} from "../../../types/enum";
import itemRendererFn from "./components/items/itemRenderFn";
import ItemMenuTooltip from "./components/tooltips/ItemMenuTooltip";
import CanvasMenuTooltip from "./components/tooltips/CanvasMenuTooltip";
import { DEFAULT_ASSIG_ITEM, DEFAULT_NONE_GOUP } from "../../../types/defaults";
import JDmodal, { JDtoastModal } from "../../../atoms/modal/Modal";
import {
  IAssigDataControl,
  IAssigItem,
  GuestTypeAdd,
  IAssigGroup,
  IAssigTimelineHooks,
  IAssigTimelineContext,
  ICreateMenuProps,
  IDeleteMenuProps
} from "./components/assigIntrerface";
import { getAssigUtils } from "./helper/assigUtils";
import BlockItemTooltip from "./components/tooltips/BlockItemTooltip";
import JDmultiBox from "../../../atoms/multiBox/MultiBox";
import { getAssigHandlers } from "./helper/assigHandlers";
import moment from "moment";
import { isEmpty } from "../../../utils/utils";
import BlockOpModal from "./helper/BlockOpModal";
import DailyAssigWrap from "../../../components/dailyAssjg/DailyAssigWrap";
import ReservationModal from "../../../components/reservationModala/ReservationModal";
import ReadyItemTooltip from "./components/tooltips/ReadyItemTooltip";
import HeaderCellRender from "./helper/HeaderCellRender";
import DayPickerModal from "../../../components/dayPickerModal/DayPickerModal";
import { IContext } from "../BookingHostRouter";
import { SharedSideBarHeader } from "../../../atoms/timeline/components/SharedHeader";
import PageHeader from "../../../components/pageHeader/PageHeader";
import PageBody from "../../../components/pageBody/PageBody";
import AssigTimelineConfigModal from "./components/AssigTimelineConfigModal/AssigTimelineConfigModal";
import getConfigStorage from "./helper/getStorage";
import Preloader from "../../../atoms/preloader/Preloader";

interface IProps {
  context: IContext;
  defaultProps: any;
  dayPickerHook: IUseDayPicker;
  groupData: IAssigGroup[];
  loading: boolean;
  roomTypesData: IRoomType[];
  deafultGuestsData: IAssigItem[];
  defaultTimeStart: Date;
  defaultTimeEnd: Date;
  assigDataControl: IAssigDataControl;
  dataTime: {
    start: number;
    end: number;
  };
  setDataTime: React.Dispatch<
    React.SetStateAction<{
      start: number;
      end: number;
    }>
  >;
  reloadTime: () => void;
}

const AssigTimeline: React.FC<IProps & WindowSizeProps> = ({
  dayPickerHook,
  defaultProps,
  groupData,
  loading,
  context,
  deafultGuestsData,
  defaultTimeStart,
  defaultTimeEnd,
  windowWidth,
  windowHeight,
  roomTypesData,
  setDataTime,
  dataTime,
  assigDataControl,
  reloadTime
}) => {
  const [viewRoomType, setViewRoomType] = useState(
    roomTypesData.map(roomType => roomType._id)
  );
  const firstUpdate = useRef(true);
  const { networkStatus } = assigDataControl;
  const { house, houseConfig, sideNavIsOpen } = context;
  const isDesktopHDDown = windowWidth < EWindowSize.DESKTOPHD;
  const isTabletDown = windowWidth <= EWindowSize.TABLET;
  const isMobile = windowWidth < EWindowSize.PHABLET;
  const [lock, setLock] = useState(isMobile);
  const timeline_size_var = (() => {
    if (isMobile) return 3;
    if (isTabletDown) return 6;
    if (isDesktopHDDown) return 5;
    return 0;
  })();

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
  });

  const [cutCount, setCutCount] = useState(getCutCount(windowHeight));

  // 그룹 데이터에서 필터된것만 추출
  let filteredGroup = useMemo(() => {
    return getCuttedGroups(
      groupData.filter(group => viewRoomType.includes(group.roomTypeId)),
      cutCount.cutFrom,
      cutCount.cutTo
    );
  }, [groupData.length, cutCount.cutTo, cutCount.cutFrom]);

  // 그룹 데이터가 비어있다면 보정용으로 하나추가
  if (isEmpty(filteredGroup)) filteredGroup = [DEFAULT_NONE_GOUP];

  const filtedGroupIds = useMemo(() => filteredGroup.map(fg => fg.id), [
    groupData.length,
    cutCount.cutTo,
    cutCount.cutFrom
  ]);

  const [guestValue, setGuestValue] = useState<IAssigItem[]>(
    getCuttedItmes(filtedGroupIds, deafultGuestsData)
  );

  useEffect(() => {
    const cuttedItems = getCuttedItmes(
      filteredGroup.map(fg => fg.id),
      deafultGuestsData
    );
    setGuestValue(cuttedItems);
  }, [filtedGroupIds.join()]);

  const dayPickerModalHook = useModal(false);
  const [isMultiSelectingMode, setIsMultiSelectingMode] = useState(false);
  const configModal = useModal(false);
  const confirmModalHook = useModal(false);
  const reservationModal = useModal(false);
  const [inIsEmpty, setEmpty] = useState(false);
  const [sideBarFold, setSideBarFold] = useState(isMobile);

  const bookingModal = useModal(false);
  const blockOpModal = useModal<IAssigItem>(false, DEFAULT_ASSIG_ITEM);
  const [blockMenuProps, setBlockMenuProps] = useState<IDeleteMenuProps>({
    item: DEFAULT_ASSIG_ITEM
  });
  const [createMenuProps, setCreateMenuProps] = useState<ICreateMenuProps>({
    item: DEFAULT_ASSIG_ITEM
  });
  const dailyAssigHook = useModal(false);
  const { basicConfig } = useMemo(() => getConfigStorage(), [
    configModal.isOpen
  ]);
  const { useTodayMark, useCursorMark, zoomValue } = basicConfig;

  const debounceCut = _.debounce(
    () => {
      setCutCount(getCutCount(windowHeight));
    },
    1000,
    {
      leading: false,
      trailing: true
    }
  );

  // 스크롤시 데이터로딩
  const handleWindowScrollEvent = () => {
    allTooltipsHide();
    debounceCut();
  };

  const handleKeyDownCavnas = (e: KeyboardEvent) => {
    if (
      !isMultiSelectingMode &&
      e.shiftKey &&
      !isEmpty(getItemsByType(GuestTypeAdd.MARK))
    ) {
      console.info(handleKeyDownCavnas);
      setIsMultiSelectingMode(true);
    }
  };

  const debounceKeyDownCanvas = _.debounce(handleKeyDownCavnas, 100);

  const handleKeyUpCavnas = (e: KeyboardEvent) => {
    setIsMultiSelectingMode(false);
  };

  const assigHooks: IAssigTimelineHooks = {
    guestValue,
    blockMenuProps,
    createMenuProps,
    setGuestValue,
    setCreateMenuProps,
    setBlockMenuProps,
    confirmModalHook,
    bookingModal,
    setDataTime,
    dataTime,
    blockOpModal,
    isMultiSelectingMode
  };

  const assigContext: IAssigTimelineContext = useMemo(
    () => ({
      isMobile,
      houseConfig,
      networkStatus,
      windowWidth,
      windowHeight,
      groupData,
      lock,
      setLock,
      houseId: house._id
    }),
    [windowWidth, guestValue, networkStatus]
  );

  const assigUtils = useMemo(
    () => getAssigUtils(assigHooks, assigDataControl, assigContext),
    [guestValue, isMultiSelectingMode]
  );

  const { assigTimeline } = houseConfig;
  if (!assigTimeline) {
    throw Error("empty houseConfig__assigTimeline");
  }

  const { roomTypeTabEnable } = assigTimeline;

  const { allTooltipsHide, removeMark, getItemsByType } = assigUtils;

  const assigHandler = useMemo(
    () => getAssigHandlers(assigUtils, assigContext, assigHooks),
    [guestValue, isMultiSelectingMode]
  );

  const {
    handleCanvasClick,
    handleCanvasContextMenu,
    handleItemClick,
    handleItemMove,
    handleItemResize,
    handleItemSelect,
    handleMoveResizeValidator,
    handleDraggingEnd,
    handleTimeChange,
    handleItemDoubleClick,
    handleDraggingCell,
    handleMouseDownCanvas
  } = assigHandler;

  // 툴팁들을 제거하고
  const handleTimelineWrapClickEvent = () => {
    console.count("handleTimelineWrapClickEvent");
    if (guestValue.find(guest => guest.type === GuestTypeAdd.MARK)) {
      removeMark();
    }
    allTooltipsHide();
  };

  const renderHeaderCell = useCallback((prop: any) => {
    // 아이템 업데이트때는 업데이트될 필요가없는데
    const onClickCell = ({ intervalContext }: any) => {
      if (!intervalContext) return;
      dailyAssigHook.openModal({
        date: moment(intervalContext.interval.startTime).toDate()
      });
    };
    return (
      <HeaderCellRender onClickCell={onClickCell} holidays={[]} {...prop} />
    );
  }, []);

  // 메모를 사용해 멀티박스 업데이트 방지
  const roomTypesDatas = useMemo(
    () => ({
      value: roomTypesData.map(roomType => roomType._id),
      labels: roomTypesData.map(roomType => roomType.name)
    }),
    [roomTypesData.length]
  );

  const callBackitemRenderer = useCallback(
    (props: any) =>
      itemRendererFn({
        ...props,
        assigUtils,
        assigContext,
        assigHooks
      }),
    []
  );

  // 아예 그룹이 없을떄 처리
  useEffect(() => {
    if (isEmpty(groupData) && !loading) setEmpty(true);
  }, [inIsEmpty]);

  const timelineClassNames = useMemo(
    () =>
      classnames("assigTimeline", undefined, {
        "assiTimeline--mobile": windowWidth <= WindowSize.MOBILE,
        "assigTimeline--loading": firstUpdate.current && loading,
        "assigTimeline--empty": inIsEmpty,
        "assigTimeline--foldSidebar": sideBarFold
      }),
    [windowWidth, loading, inIsEmpty]
  );

  // 이벤트 리스너
  useEffect(() => {
    const handleClickWindow = () => {
      allTooltipsHide();
    };

    const remove = () => {
      window.removeEventListener("keyup", handleKeyUpCavnas);
      window.removeEventListener("keydown", debounceKeyDownCanvas);
      window.removeEventListener("scroll", e => handleWindowScrollEvent);
      window.removeEventListener("click", handleClickWindow);
      return "";
    };

    window.addEventListener("keyup", handleKeyUpCavnas);
    window.addEventListener("keydown", debounceKeyDownCanvas);
    window.addEventListener("scroll", handleWindowScrollEvent);
    window.addEventListener("click", handleClickWindow);
    return () => {
      remove();
    };
  }, []);

  // 풀링으로 새로받은 게스트데이터를 적용시켜준다.
  useEffect(() => {
    if (networkStatus >= 7) {
      const newIndexStart = deafultGuestsData.length;

      // 업데이트전 휘발성 블럭들을 찾아서 합쳐줍니다.
      const volatilityBlocks = getItemsByType(GuestTypeAdd.MARK);

      // 휘발성 블록들의 인덱스를 다시 정의해줍니다.
      volatilityBlocks.forEach(
        (block, index) => (block.itemIndex = newIndexStart + index)
      );

      setGuestValue([...deafultGuestsData, ...volatilityBlocks]);
    }
  }, [deafultGuestsData]);

  // 기본으로 사용될 끝시간을 계산합니다.
  const endTime = useMemo(() => {
    let configZoom = zoomValue || 0;
    return moment(defaultTimeEnd.valueOf() - configZoom * TimePerMs.H * 3).add(
      -1 * timeline_size_var,
      "days"
    );
  }, [zoomValue]);

  const timelineKey = `timeline${endTime}${sideNavIsOpen ? "a" : "b"}`;

  return (
    <Fragment>
      <PageHeader
        title={LANG("allocation_calendar")}
        desc={LANG("assigTimeline__decs")}
      />

      <PageBody>
        <div
          id="AssigTimeline"
          className={timelineClassNames}
          onDoubleClick={handleTimelineWrapClickEvent}
          onClick={e => {
            // 윈도우 마우스클릭 이벤트를 방지함
            // e.stopPropagation();
          }}
        >
          <div className="flex-grid flex-grid--end">
            <div>
              <Button
                size="small"
                onClick={() => {
                  reservationModal.openModal();
                }}
                label={LANG("make_reservation")}
                mode={isMobile ? "iconButton" : undefined}
                disabled={networkStatus === 1}
                icon="edit"
              />
              <Button
                size="small"
                mode={isMobile ? "iconButton" : undefined}
                onClick={() => {
                  dayPickerHook.setDate(
                    moment()
                      .local()
                      .add(-1, "day")
                      .toDate()
                  );
                  reloadTime();
                }}
                icon="calendar"
                label={LANG("goto_today")}
              />
              <Button
                onClick={() => {
                  configModal.openModal();
                }}
                mode={isMobile ? "iconButton" : undefined}
                size="small"
                label={LANG("config")}
                icon="keyBoard"
              />
              <Button
                mode={isMobile ? "iconButton" : undefined}
                label={LANG("assig_lock")}
                size="small"
                onClick={() => {
                  setLock(!lock);
                }}
                icon={lock ? "lock" : "unLock"}
              />
            </div>
            {roomTypeTabEnable && (
              <JDmultiBox
                noWrap
                reversal="onlyFull"
                defaultAllToogle={true}
                withAllTooglerLabel={LANG("see_all")}
                withAllToogler
                onChange={setViewRoomType}
                selectedValue={viewRoomType}
                {...roomTypesDatas}
              />
            )}
          </div>
          <CanvasMenuTooltip
            assigHooks={assigHooks}
            assigContext={assigContext}
            assigUtils={assigUtils}
          />
          <BlockItemTooltip
            assigHooks={assigHooks}
            assigContext={assigContext}
            assigUtils={assigUtils}
          />
          <BlockOpModal
            key={blockOpModal.info.bookingId}
            assigDataControl={assigDataControl}
            assigHooks={assigHooks}
            assigContext={assigContext}
            assigUtils={assigUtils}
          />
          <ReadyItemTooltip />
          <ItemMenuTooltip
            assigHooks={assigHooks}
            assigContext={assigContext}
            assigUtils={assigUtils}
          />
          <div className="assigTimeline__timelineWrap">
            <Timeline
              key={timelineKey}
              handleMouseDownCanvas={handleMouseDownCanvas}
              onItemMove={handleItemMove}
              onItemResize={handleItemResize}
              items={guestValue}
              groups={filteredGroup}
              {...defaultProps}
              canMove={!lock}
              canChangeGroup={!lock}
              handleDraggingCell={handleDraggingCell}
              onItemDoubleClick={handleItemDoubleClick}
              onItemClick={handleItemClick}
              onCanvasClick={handleCanvasClick}
              onTimeChange={handleTimeChange}
              itemRenderer={callBackitemRenderer}
              groupRenderer={assigGroupRendererFn}
              defaultTimeStart={defaultTimeStart}
              defaultTimeEnd={endTime}
              handleDraggingEnd={handleDraggingEnd}
              moveResizeValidator={handleMoveResizeValidator}
              onItemSelect={handleItemSelect}
              onCanvasContextMenu={handleCanvasContextMenu}
              // TODO
              // 접이식으로 변경 방번호만으로도 충분할수 있다.
              // 사이드바는 햔재크기의 3분의 1로 하고
              // 옆으로 펼치는 식으로 진행하는것임
              sidebarWidth={isMobile ? (sideBarFold ? 30 : 100) : 230}
            >
              <TimelineHeaders>
                {/* 왼쪽 위 달력 부분 */}
                <SidebarHeader>
                  {({ getRootProps }: any) => (
                    <SharedSideBarHeader
                      dayPickerModalHook={dayPickerModalHook}
                      getRootProps={getRootProps}
                    />
                  )}
                </SidebarHeader>
                <DateHeader
                  labelFormat="MM.DD ddd"
                  intervalRenderer={renderHeaderCell}
                  height={GlobalCSS.TIMELINE_HEADER_HEIGHT}
                  unit="day"
                />
                {useCursorMark && <CursorMarker />}
                <DateHeader />
              </TimelineHeaders>
              <TimelineMarkers>
                {useTodayMark && <CustomMarker date={new Date().valueOf()} />}
              </TimelineMarkers>
            </Timeline>
          </div>
          {/* 생성된 방이 없을때 */}
          {inIsEmpty && (
            <div className="assigTimeline__placeHolderWrap">
              <Link to="/roomConfig">
                <Button
                  mode="border"
                  thema="point"
                  pulse
                  label={LANG("goto_create_roomType")}
                />
              </Link>
            </div>
          )}
          <ReservationModal
            modalHook={reservationModal}
            callBackCreateBookingMu={CreateBooking => {
              if (CreateBooking?.booking) {
                assigUtils.hilightGuestBlock({
                  bookingId: CreateBooking.booking._id,
                  scrollMove: true
                });
              }
            }}
            context={context}
            publicKey={house.publicKey || undefined}
          />
          <BookingModalWrap context={context} modalHook={bookingModal} />
          <JDtoastModal confirm {...confirmModalHook} />
          <AssigTimelineConfigModal context={context} modalHook={configModal} />
          <JDmodal {...dailyAssigHook}>
            <DailyAssigWrap date={dailyAssigHook.info.date} context={context} />
          </JDmodal>
        </div>
        <DayPickerModal
          modalHook={dayPickerModalHook}
          isRange={false}
          canSelectBeforeDay={true}
          calenaderPosition="center"
          label={`${LANG("calender_date")}`}
          {...dayPickerHook}
          className="JDwaves-effect JDoverflow-visible"
        />
      </PageBody>
      <Preloader
        floating
        loading={loading}
        className="assigTimeline__mainPreloder"
      />
      <Preloader
        id="assigTimeline__verticalPreloader"
        size="small"
        loading={true}
      />
    </Fragment>
  );
};

export default windowSize<IProps>(AssigTimeline);
