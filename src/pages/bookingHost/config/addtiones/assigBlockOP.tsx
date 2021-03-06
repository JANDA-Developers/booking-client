import React, { useState } from "react";
import { IAddtionProp } from "../components/ConfigBlock";
import JDswitch from "../../../../atoms/forms/switch/Switch";
import { LANG } from "../../../../hooks/hook";
import { muResult } from "../../../../utils/utils";
import JDbox from "../../../../atoms/box/JDbox";
import {
  DEFAULT_ADDITION_BLOCKOP,
  DEFAULT_HOUSE_CONFIG
} from "../../../../types/defaults";
import { IMG_REPO } from "../../../../types/const";

const AssigTimelineRoomTabs: React.FC<IAddtionProp> = ({
  updateFn: updateFnProp,
  context
}) => {
  const { houseConfig, house } = context;
  const { assigTimeline } = houseConfig;
  const { itemBlockOp, roomTypeTabEnable } =
    assigTimeline || DEFAULT_HOUSE_CONFIG.assigTimeline;
  const { useColor, itemBlockOpEnable } =
    itemBlockOp || DEFAULT_ADDITION_BLOCKOP;
  const [use, setUse] = useState(itemBlockOpEnable);
  const [colorEnable, setEnableColor] = useState(useColor);

  const updateFn = async () => {
    const result = await updateFnProp({
      assigTimeline: {
        roomTypeTabEnable,
        itemBlockOp: {
          itemBlockOpEnable: !use,
          useColor: !colorEnable
        }
      }
    })

    return result;
  };
  return (
    <div className="additionDetail">
      <div className="docs-section__box">
        <span>{LANG("display_related_setting")}</span>
      </div>
      <div className="additionDetail__titleTopRight">
        {/* <JDswitch
          checked={use}
          onChange={async flag => {
            await setUse(flag);
            const result = await updateFn();
            if (!muResult(result, "UpdateHouseConfig")) {
              setUse(!flag);
            }
          }}
          label="사용하기"
        /> */}
      </div>
      <h6>{LANG("use_color_setting_function")}</h6>
      <JDswitch
        checked={colorEnable}
        onChange={async flag => {
          await setEnableColor(flag);
          const result = await updateFn();

          // 에러처리
          if (!muResult(result, "UpdateHouseConfig")) {
            setEnableColor(!flag);
          }
        }}
        // disabled={!use}
        label={LANG("use")}
      />
      <JDbox
        className="additionDetail__HilightPhoto"
        mode="photoFrame"
        photo={`${IMG_REPO}describe/guestHilight.gif`}
      />
      <div />
    </div>
  );
};

export default AssigTimelineRoomTabs;
