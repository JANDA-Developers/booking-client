import React from "react";
import JDtable, {JDcolumn, ReactTableDefault} from "../../../atoms/table/Table";
import {Gender, GENDER_OP, GenderKr, PricingType} from "../../../types/enum";
import {inOr} from "../../../utils/C";
import JDselect from "../../../atoms/forms/selectBox/SelectBox";
import {IAssigInfo} from "../../../pages/middleServer/assig/components/assigIntrerface";
import {IBookingModal_AssigInfo} from "../BookingModal";

interface IGuestTableInfo {
  _id: string;
  roomType: {
    _id: string;
    name: string;
  };
  room: {
    _id: string;
    name: string;
  } | null;
  bedIndex?: number;
  gender?: Gender | null;
  [key: string]: any;
}

interface Iprops {
  guestsData: IGuestTableInfo[];
  assigInfo: IBookingModal_AssigInfo[];
  setAssigInfo: React.Dispatch<React.SetStateAction<IBookingModal_AssigInfo[]>>;
}

const RoomAssigedInfoTable: React.FC<Iprops> = ({
  guestsData,
  assigInfo,
  setAssigInfo
}) => {
  const getGenderSelectedOption = (guestId: string) => {
    const info = assigInfo.find(info => info._id === guestId);
    if (!info) return;
    return {
      value: info.gender,
      label: info.gender ? GenderKr[info.gender] : ""
    };
  };

  const TableColumns: JDcolumn<IGuestTableInfo>[] = [
    {
      Header: "게스트",
      accessor: "_id",
      maxWidth: 64,
      Cell: ({original}) => (
        <div className="RoomAssigedInfoTable__id">{original._id}</div>
      )
    },
    {
      Header: "방타입",
      accessor: "_id",
      Cell: ({original}) => <div>{original.roomType.name}</div>
    },
    {
      Header: "방",
      maxWidth: 80,
      accessor: "_id",
      Cell: ({original}) => <div>{inOr(original.room, "name", "")}</div>
    },
    {
      Header: "침대번호",
      accessor: "_id",
      maxWidth: 80,
      Cell: ({original}) => <div>{(original.bedIndex || 0) + 1}</div>
    },
    {
      Header: "성별",
      accessor: "_id",
      maxWidth: 80,
      Cell: ({original}) => (
        <div
          style={{
            width: "100%"
          }}
        >
          {original.gender === null && (
            <JDselect
              onChange={value => {
                const targetInfo = assigInfo.find(
                  info => info._id === original._id
                );
                if (!targetInfo) return;
                targetInfo.gender = value.value;
                setAssigInfo([...assigInfo]);
              }}
              selectedOption={getGenderSelectedOption(original._id)}
              options={GENDER_OP}
            />
          )}
        </div>
      )
    }
  ];

  return (
    <div className={"RoomAssigedInfoTable"}>
      <JDtable
        visibleOver
        // @ts-ignore
        columns={TableColumns}
        {...ReactTableDefault}
        data={guestsData}
        minRows={1}
        noDataText="선택사항이 없습니다."
      />
    </div>
  );
};

export default RoomAssigedInfoTable;
