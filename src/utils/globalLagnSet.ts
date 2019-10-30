import {
  BOOKING_STATUS_OP,
  KR_SMS_PARSER,
  STATISTICS_TYPE_OP,
  SMS_TARGET_OP,
  PRODUCT_STATUS_OP,
  PAYMETHOD_FOR_BOOKER_OP,
  PAYMETHOD_FOR_HOST_OP,
  GET_SMS_TARGET_OP,
  PRICING_TYPE_OP,
  PAYMENT_STATUS_OP,
  ROOM_GENDER_OP,
  PRICING_TYPE_OP_EXPEND,
  GENDER_OP,
  AUTO_SEND_OP
} from "../types/enum";
import {LANG} from "../hooks/hook";
import {isArray} from "util";

export const globalLanguageSetting = () => {
  const setArrayWithLang = (set: Array<any>, enumKey?: string) => {
    if (!enumKey) {
      set.forEach((setIn: any) => {
        setIn.label = LANG(setIn.value);
      });
    } else {
      set.forEach((setIn: any) => {
        setIn.label = LANG(enumKey)[setIn.value];
      });
    }
  };

  const settings = [
    BOOKING_STATUS_OP,
    KR_SMS_PARSER,
    PAYMENT_STATUS_OP,
    STATISTICS_TYPE_OP,
    SMS_TARGET_OP,
    PRODUCT_STATUS_OP,
    PAYMETHOD_FOR_BOOKER_OP,
    PAYMETHOD_FOR_HOST_OP,
    GET_SMS_TARGET_OP,
    PRICING_TYPE_OP,
    {value: ROOM_GENDER_OP, enumKey: "RoomGender"},
    PRICING_TYPE_OP_EXPEND,
    GENDER_OP,
    AUTO_SEND_OP
  ];
  settings.forEach((set: any) => {
    if (!isArray(set)) {
      // lang객체에 네임스페이스가 있는 OP 들일경우
      if (set.hasOwnProperty("enumKey")) {
        setArrayWithLang(set.value, set.enumKey);
      }
      // 네임스페이스가 없는 일반 객체일 경우
      for (const key in set) {
        // @ts-ignore
        set[key] = LANG(key);
      }
    } else {
      setArrayWithLang(set);
    }
  });
};