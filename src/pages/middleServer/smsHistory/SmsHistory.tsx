import React, {Fragment} from "react";
import {getSmsHistory_GetSmsHistory_smsHistories} from "../../../types/api";
import Preloader from "../../../atoms/preloader/Preloader";
import "./SmsHistory.scss";
import JDPagination from "../../../atoms/pagination/Pagination";
import {IPageInfo} from "../../../types/interface";
import JDtable, {ReactTableDefault} from "../../../atoms/table/Table";
import {CellInfo} from "react-table";
import JDbadge from "../../../atoms/badge/Badge";
import JDbox from "../../../atoms/box/JDbox";
import {s4, autoHypen} from "../../../utils/utils";
import moment from "moment";
import {FLOATING_PRElOADER_SIZE, DateFormat} from "../../../types/enum";

interface Iprops {
  setPage: any;
  smsData: getSmsHistory_GetSmsHistory_smsHistories[];
  loading: boolean;
  pageData: IPageInfo | undefined | null;
}

const SmsHistory: React.SFC<Iprops> = ({
  setPage,
  pageData,
  smsData,
  loading
}) => {
  const TableColumns = [
    {
      Header: "번호",
      accessor: "index",
      Cell: ({index}: CellInfo) => <span>{index + 1}</span>
    },
    {
      Header: "전송시간",
      accessor: "createdAt",
      Cell: ({value}: CellInfo) => (
        <span>
          {moment(value)
            .local()
            .format(DateFormat.WITH_TIME)}
        </span>
      )
    },
    {
      Header: "수신자",
      accessor: "receivers",
      Cell: ({value}: CellInfo) =>
        value.map((receiver: string) => (
          <JDbox size="small" textAlign="center" key={s4()}>
            {autoHypen(receiver)}
          </JDbox>
        ))
    },
    {
      Header: "발신내용",
      accessor: "msg",
      minWidth: 300,
      Cell: ({value}: CellInfo) => (
        <div
          className={`JDscrool resvList__memo ${value &&
            value.length > 20 &&
            "resvList__memo--full"}`}
        >
          {value}
        </div>
      )
    },
    {
      Header: "발신타입",
      accessor: "msgType",
      minWidth: 200
    },
    {
      Header: "자동발신 여부",
      accessor: "autoSendCase",
      Cell: ({value}: CellInfo) => (
        <div
          className={`JDscrool smsHistory__msg ${value &&
            value.length > 20 &&
            "smsHistory__msg--full"}`}
        >
          {value ? "Y" : "N"}
        </div>
      )
    },
    {
      Header: "발신상태",
      accessor: "sendResult",
      Cell: ({value}: CellInfo) => (
        <span>
          {value ? (
            <JDbadge thema={"primary"}>송신완료</JDbadge>
          ) : (
            <JDbadge thema={"error"}>송신실패</JDbadge>
          )}
        </span>
      )
    }
  ];

  return (
    <div id="smsHistory" className="smsHistory container container--lg">
      <div className="docs-section">
        <Fragment>
          <h3>SMS 내역</h3>
          <Preloader
            size={FLOATING_PRElOADER_SIZE}
            floating
            loading={loading}
          />
          <JDtable
            {...ReactTableDefault}
            columns={TableColumns}
            data={smsData}
            showPagination={false}
            loading={false}
            align="center"
            minRows={3}
          />
          <JDPagination
            onPageChange={selectedItem => {
              setPage(selectedItem.selected + 1);
            }}
            pageCount={pageData ? pageData.totalPage : 1}
            pageRangeDisplayed={1}
            marginPagesDisplayed={4}
          />
        </Fragment>
      </div>
    </div>
  );
};

export default SmsHistory;