import React, {useState, Fragment} from "react";
import selectTableHOC, {
  SelectInputComponentProps,
  SelectAllInputComponentProps
} from "react-table/lib/hoc/selectTable";
import JDtable, {ReactTableDefault, JDcolumn} from "../../../atoms/table/Table";
import CheckBox from "../../../atoms/forms/checkBox/CheckBox";
import Button from "../../../atoms/button/Button";
import JDIcon, {IconSize} from "../../../atoms/icons/Icons";
import {useModal} from "../../../hooks/hook";
import BookingModalWrap from "../../../components/bookingModal/BookingModalWrap";
import {IPageInfo, IBooking, IRoomType} from "../../../types/interface";
import JDbox from "../../../atoms/box/JDbox";
import {to4YMMDD} from "../../../utils/setMidNight";
import {MutationFn} from "react-apollo";
import {
  deleteBooking,
  deleteBookingVariables,
  updateBookingVariables,
  updateBooking
} from "../../../types/api";
import autoHyphen from "../../../utils/autoFormat";
import {JDtoastModal} from "../../../atoms/modal/Modal";
import {
  PaymentStatus,
  PricingType,
  PaymentStatusKr,
  BookingStatus,
  FLOATING_PRElOADER_SIZE,
  DateFormat
} from "../../../types/enum";
import moment from "moment";
import JDbadge from "../../../atoms/badge/Badge";
import "./ResvList.scss";
import JDPagination from "../../../atoms/pagination/Pagination";
import {autoComma} from "../../../utils/utils";
import SendSMSmodalWrap, {
  IModalSMSinfo
} from "../../../components/smsModal/SendSmsModalWrap";
import Preloader from "../../../atoms/preloader/Preloader";
import ConfirmBadgeWrap from "../../../components/confirmBadge/ConfirmBadgeWrap";
import textReader from "../../../utils/textReader";
import {NetworkStatus} from "apollo-boost";
import {IContext} from "../../MiddleServerRouter";
import {getRoomSelectInfo} from "../../../utils/guestCountByRoomType";
import {inOr} from "../../../utils/C";

interface IProps {
  pageInfo: IPageInfo | undefined;
  bookingsData: IBooking[];
  loading: boolean;
  updateBookingLoading: boolean;
  deleteBookingLoading: boolean;
  context: IContext;
  networkStatus: NetworkStatus;
  setPage(page: number): void;
  deleteBookingMu: MutationFn<deleteBooking, deleteBookingVariables>;
  updateBookingMu: MutationFn<updateBooking, updateBookingVariables>;
}

const ResvList: React.SFC<IProps> = ({
  pageInfo,
  bookingsData,
  loading,
  updateBookingMu,
  deleteBookingMu,
  setPage,
  networkStatus,
  context
}) => {
  const {
    houseConfig: {
      bookingConfig: {
        newBookingMark: {enable: newBookingMarkEnable}
      }
    },
    JDlang
  } = context;

  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll]: any = useState(false);
  const bookingModalHook = useModal(false);
  const alertModalHook = useModal(false);
  const sendSmsModalHook = useModal<IModalSMSinfo>(false);

  //   여기에 key가 들어오면 id배열에서 찾아서 넣거나 제거해줌
  const onToogleRow = (key: string) => {
    if (checkedIds.includes(key)) {
      setCheckedIds([...checkedIds.filter(value => value !== key)]);
    } else {
      setCheckedIds([...checkedIds, key]);
    }
  };

  //    모든 라인들에대한 아이디를 투글함
  const onToogleAllRow = (flag: boolean) => {
    const bookingIds = bookingsData.map(booking => booking._id);
    const updateSelecetedes = bookingIds.map(id =>
      checkedIds.includes(id) ? "" : id
    );
    setCheckedIds(updateSelecetedes);
    setSelectAll(flag);
  };

  const handleDeleteBookingBtnClick = () => {
    alertModalHook.openModal({
      // txt: `${JDlang("nextResv")}${checkedIds.length}${JDlang("checkDelete")}`
    });
  };

  const handleCancleBookingBtnClick = () => {
    checkedIds.forEach(id => {
      updateBookingMu({
        variables: {
          bookingId: id,
          params: {
            bookingStatus: BookingStatus.CANCEL
          }
        }
      });
    });
  };

  const handleSendSmsBtnClick = () => {
    const receivers = checkedIds.map(id => {
      const target = bookingsData.find(booking => booking._id === id);
      if (target) {
        return target.phoneNumber;
      } else {
        return 0;
      }
    });

    sendSmsModalHook.openModal({
      receivers,
      createMode: true
    });
  };

  const handleCompleteBookingBtnClick = () => {
    checkedIds.forEach(id => {
      updateBookingMu({
        variables: {
          bookingId: id,
          params: {
            bookingStatus: BookingStatus.COMPLETE
          }
        }
      });
    });
  };

  const deleteModalCallBackFn = (flag: boolean) => {
    if (flag) {
      checkedIds.forEach(bookingId => {
        deleteBookingMu({
          variables: {
            bookingId: bookingId
          }
        });
      });
    }
  };

  const TableColumns: JDcolumn<IBooking>[] = [
    {
      Header: "예약일자",
      accessor: "createdAt",
      Cell: ({value}) => {
        return (
          <div className="resvList__createdAt">
            {moment(value)
              .local()
              .format(DateFormat.WITH_TIME)}
          </div>
        );
      }
    },
    {
      Header: "숙박정보",
      accessor: "roomTypes",
      Cell: ({value, original}) => {
        const roomTypes: IRoomType[] = value;
        const selectInfoes = getRoomSelectInfo(original.guests, roomTypes);

        return selectInfoes.map(selectInfo => (
          <JDbox
            size="small"
            textAlign="center"
            key={`${original._id}${selectInfo.roomTypeId}`}
          >
            {selectInfo.roomTypeName}
            <br />
            <span>
              {(() => {
                const {female, male, roomCount} = selectInfo.count;
                return (
                  <span>
                    {selectInfo.pricingType === PricingType.DOMITORY ? (
                      <Fragment>
                        {female !== 0 && <span>{female}여 </span>}
                        {male !== 0 && <span>{male}남</span>}
                      </Fragment>
                    ) : (
                      <span>{roomCount}개</span>
                    )}
                  </span>
                );
              })()}
            </span>
          </JDbox>
        ));
      }
    },
    {
      Header: "체크인",
      accessor: "_id",
      Cell: ({original}) => <div>{to4YMMDD(original.checkIn)}</div>
    },
    {
      Header: "체크아웃",
      accessor: "_id",
      Cell: ({original}) => <div>{to4YMMDD(original.checkOut)}</div>
    },
    {
      Header: () => (
        <div>
          {"예약자명"}
          <br />
          {"연락처"}
        </div>
      ),
      accessor: "name",
      Cell: ({original}) => {
        const Booking: IBooking = original;
        return (
          <div>
            {Booking.name}
            <br />
            {autoHyphen(Booking.phoneNumber)}
          </div>
        );
      }
    },
    {
      Header: () => (
        <div>
          {"이용금액"}
          <br />
          {"결제상태"}
        </div>
      ),
      accessor: "payment",
      Cell: ({original}) => (
        <div>
          <span>{autoComma(original.payment.totalPrice)}원</span>
          <br />
          <span
            className={`resvList__paymentStatus ${original.payment.status ===
              PaymentStatus.PROGRESSING && "resvList__paymentStatus--notYet"}`}
          >
            {
              // @ts-ignore
              PaymentStatusKr[original.paymentStatus]
            }
          </span>
        </div>
      )
    },
    {
      Header: "메모",
      accessor: "memo",
      minWidth: 200,
      Cell: ({value}) => (
        <div
          className={`JDscrool resvList__memo ${value &&
            value.length > 20 &&
            "resvList__memo--full"}`}
        >
          {textReader(value)}
        </div>
      )
    },
    {
      Header: "상태",
      accessor: "_id",
      Cell: ({original}) => {
        const {isNew, isConfirm, _id, status, payment, checkInInfo} = original;
        const isCancled = status === BookingStatus.CANCEL;
        const isProgressing = status === BookingStatus.PROGRESSING;
        const isComplete = status === BookingStatus.COMPLETE;
        const {status: paymentStatus} = payment;
        const isPaied = paymentStatus === PaymentStatus.COMPLETE;
        const isCheckIn = checkInInfo.isIn;

        return (
          <div className="resvList__statusBadgesWrap">
            {newBookingMarkEnable && (
              <ConfirmBadgeWrap
                className="JDstandard-space0"
                show={isNew && !isConfirm}
                bookingId={_id}
              />
            )}
            {isCheckIn && <JDbadge thema={"new"}>체크인</JDbadge>}
            {isCancled && <JDbadge thema={"error"}>취소</JDbadge>}
            {isProgressing && <JDbadge thema={"grey"}>진행중</JDbadge>}
            {isComplete && <JDbadge thema={"positive"}>정상</JDbadge>}
            {isProgressing || isPaied || (
              <JDbadge thema={"warn"}>미결제</JDbadge>
            )}
          </div>
        );
      }
    },
    {
      Header: "상세",
      accessor: "_id",
      minWidth: 40,
      Cell: ({value}) => (
        <JDIcon
          onClick={() => {
            bookingModalHook.openModal({
              bookingId: value
            });
          }}
          size={IconSize.MEDIUM}
          hover
          icon="person"
        />
      )
    }
  ];

  const selectInputCompoent = ({checked, id}: SelectInputComponentProps) => {
    const inId = id.replace("select-", "");
    const onChange = (flag: boolean) => {
      onToogleRow(inId);
    };

    return <CheckBox size="small" onChange={onChange} checked={checked} />;
  };

  const selectAllInputComponentProps = ({
    checked
  }: SelectAllInputComponentProps) => (
    <CheckBox onChange={onToogleAllRow} checked={checked} />
  );

  const SelectableJDtable = selectTableHOC(JDtable);
  return (
    <div id="resvList" className="resvList container container--full">
      <div className="docs-section">
        {/* <h3>{JDlang("bookingList")}</h3> */}
        <div>
          <Button
            size="small"
            onClick={handleCancleBookingBtnClick}
            // label={JDlang("cancleBooking")}
          />
          <Button
            onClick={handleSendSmsBtnClick}
            size="small"
            // label={JDlang("sendSMS")}
          />
          <Button
            onClick={handleDeleteBookingBtnClick}
            size="small"
            thema="error"
            // label={JDlang("deleteBooking")}
          />
        </div>
        {networkStatus === 1 && loading ? (
          <Preloader size="large" loading={true} />
        ) : (
          <SelectableJDtable
            {...ReactTableDefault}
            // 아래 숫자는 요청하는 쿼리와 같아야합니다.
            defaultPageSize={20}
            toggleAll={() => {}}
            toggleSelection={onToogleRow}
            SelectAllInputComponent={selectAllInputComponentProps}
            SelectInputComponent={selectInputCompoent}
            isCheckable
            align="center"
            data={bookingsData}
            selectAll={selectAll}
            isSelected={(key: string) => checkedIds.includes(key)}
            columns={TableColumns}
            keyField="_id"
          />
        )}
        <Preloader
          size={FLOATING_PRElOADER_SIZE}
          floating
          loading={networkStatus !== 1 && loading}
        />
        <JDPagination
          onPageChange={({selected}: {selected: number}) => {
            setPage(selected + 1);
          }}
          pageCount={inOr(pageInfo, "totalPage", 1)}
          pageRangeDisplayed={1}
          marginPagesDisplayed={4}
        />
        <BookingModalWrap
          key={`${bookingModalHook.info.bookingId || "BookingModaldefaultId"}`}
          modalHook={bookingModalHook}
          context={context}
        />
        <JDtoastModal
          confirm
          confirmCallBackFn={deleteModalCallBackFn}
          {...alertModalHook}
        />
        <SendSMSmodalWrap modalHook={sendSmsModalHook} context={context} />
      </div>
    </div>
  );
};

export default ResvList;