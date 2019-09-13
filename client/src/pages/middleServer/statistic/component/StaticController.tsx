import React from "react";
import {IContext} from "../../../MiddleServerRouter";
import {
  SalesStatisticsUnitKr,
  STATISTICS_OP,
  STATISTICS_TYPE_OP
} from "../../../../types/enum";
import {IQueryOp} from "../../../outPages/houseManual/HouseManualWrap";
import JDselect from "../../../../atoms/forms/selectBox/SelectBox";
import JDdayPicker from "../../../../atoms/dayPicker/DayPicker";
import {IStaticsWrapProps, IGraphViewMode, IStaticsProps} from "../Statistic";
import StaticIcons from "./StaticIcons";
import {IconSize} from "../../../../atoms/icons/Icons";

interface Iprops {
  context: IContext;
  staticsProps: IStaticsProps;
}

const StaticController: React.FC<Iprops> = ({context, staticsProps}) => {
  const {queryDateHook, queryOp, setQueryOp} = staticsProps;
  return (
    <div>
      <h6>통계 변환</h6>
      <div>
        <JDselect
          selectedOption={{value: "매출통계", label: "매출통계"}}
          onChange={value => {
            setQueryOp({
              ...queryOp,
              selectStatic: value.value
            });
          }}
          options={STATISTICS_OP}
          label="통계 보기"
        />
      </div>
      <div>
        <JDdayPicker
          canSelectBeforeDay={true}
          {...queryDateHook}
          label="통계날자"
          input
        />
      </div>
      <div>
        <JDselect
          onChange={value => {
            setQueryOp({
              ...queryOp,
              unit: value.value
            });
          }}
          selectedOption={{
            value: queryOp.unit,
            label: SalesStatisticsUnitKr[queryOp.unit]
          }}
          options={STATISTICS_TYPE_OP}
          label="보기 단위"
        />
      </div>
    </div>
  );
};

export default StaticController;
