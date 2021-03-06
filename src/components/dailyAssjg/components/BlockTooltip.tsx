import React from "react";
import TooltipList, {
  TooltipButtons,
} from "../../../atoms/tooltipList/TooltipList";
import { IContext } from "../../../pages/bookingHost/BookingHostRouter";
import {
  IDailyAssigUtils,
  IDailyAssigDataControl,
} from "../../../pages/bookingHost/assig/components/assigIntrerface";
import { IDailyAssigContext } from "../DailyAssig";
import { getGuests_GetBlocks_blocks as IB } from "../../../types/api";
import Button from "../../../atoms/button/Button";
import { LANG } from "../../../hooks/hook";

interface Iprops {
  context: IContext;
  dailyAssigUtils: IDailyAssigUtils;
  dailayAssigContext: IDailyAssigContext;
  dailyAssigDataControl: IDailyAssigDataControl;
  deleteBtnCallBack: (block: IB) => void;
}

const BlockTooltip: React.FC<Iprops> = ({
  deleteBtnCallBack,
  dailayAssigContext,
}) => {
  const { blocksData } = dailayAssigContext;

  return (
    <TooltipList
      id="blockTooltip"
      className="blockTooltip"
      getContent={(guestId: string) => {
        const targetBlock = blocksData.find((guest) => guest._id === guestId);
        if (!targetBlock) return <div />;
        return (
          <TooltipButtons
            Buttons={[
              {
                onClick: () => {
                  deleteBtnCallBack(targetBlock);
                },
                label: LANG("delete"),
              },
            ]}
          />
        );
      }}
    />
  );
};

export default BlockTooltip;
