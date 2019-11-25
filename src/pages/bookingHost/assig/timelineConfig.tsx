import assigGroupRendererFn from "./helper/groupRenderFn";
import { IAssigGroup } from "./components/assigIntrerface";
import {
  sharedProps,
  ASSIG_IMELINE_HEIGHT
} from "../../../atoms/timeline/config";

// Assig Timeline 으로 전달될 객체
const assigDefaultProps = {
  ...sharedProps,
  groupRenderer: assigGroupRendererFn,
  fixedHeader: "fixed",
  sidebarWidth: 230,
  canMove: true,
  canResize: false,
  canSelect: true,
  itemsSorted: true,
  itemTouchSendsClick: false,
  stackItems: true,
  itemHeightRatio: 1,
  showCursorLine: true,
  lineHeight: ASSIG_IMELINE_HEIGHT,
  horizontalLineClassNamesForGroup: (group: IAssigGroup) => {
    const groupClasses = ["group"];
    group.isLastOfRoom && groupClasses.push("group--lastOfRoom");
    group.isLastOfRoomType && groupClasses.push("group--lastOfRoomType");
    return groupClasses;
  }
};

// 불러올 데이터양
export const ASSIG_VISIBLE_CELL_PC = 10;
export const ASSIG_VISIBLE_CELL_MB_DIFF = 6.5;
// 불러올 데이터양
export const ASSIG_DATA_END = 14;
export const ASSIG_DATA_START = 18;
// 불러올 데이터 타이밍
export const ASSIG_DATA_START_LIMITE = 10;
export const ASSIG_DATA_END_LIMITE = 10;

export default assigDefaultProps;
