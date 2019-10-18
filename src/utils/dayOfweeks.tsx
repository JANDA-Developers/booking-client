import {DayOfWeekPriceInput} from "../types/api";

// 단순 변환 함수
const JDMonthTextChanger = (Month: string | number): string => {
  if (Month === "December" || Month === 11) return "12월";
  if (Month === "November" || Month === 10) return "11월";
  if (Month === "October" || Month === 9) return "10월";
  if (Month === "September" || Month === 8) return "9월";
  if (Month === "August" || Month === 7) return "8월";
  if (Month === "July" || Month === 6) return "7월";
  if (Month === "June" || Month === 5) return "6월";
  if (Month === "May" || Month === 4) return "5월";
  if (Month === "April" || Month === 3) return "4월";
  if (Month === "March" || Month === 2) return "3월";
  if (Month === "February" || Month === 1) return "2월";
  if (Month === "January" || Month === 0) return "1월";
  console.error("JDMonthTextChanger Month is not 0~11");
  return "";
};

//  숫자(0~6)를 받아서 무슨 요일인지 반환
const JDWeekChanger = (number: number, bit?: boolean): string => {
  if (!bit) {
    const weekLanguage = ["일", "월", "화", "수", "목", "금", "토"];
    return weekLanguage[number % 7];
  }
  if (number === 1) return "일";
  if (number === 2) return "월";
  if (number === 4) return "화";
  if (number === 8) return "수";
  if (number === 16) return "목";
  if (number === 32) return "금";
  if (number === 64) return "토";
  return "err";
};

enum Day {
  SUN = "SUN",
  MON = "MON",
  TUE = "TUE",
  WED = "WED",
  THU = "THU",
  FRI = "FRI",
  SAT = "SAT"
}

const dayarrEnToBooleanArr = (dayArr: string[]) => [
  dayArr.includes(Day.SUN),
  dayArr.includes(Day.MON),
  dayArr.includes(Day.TUE),
  dayArr.includes(Day.WED),
  dayArr.includes(Day.THU),
  dayArr.includes(Day.FRI),
  dayArr.includes(Day.SAT)
];

const dayarrEnToValueArr = (dayArr: DayOfWeekPriceInput[]) => {
  const sun = dayArr.find(d => d.day === Day.SUN) || null;
  const sunPrice = sun ? sun.price : null;
  const mon = dayArr.find(d => d.day === Day.MON) || null;
  const monPrice = mon ? mon.price : null;
  const tue = dayArr.find(d => d.day === Day.TUE) || null;
  const tuePrice = tue ? tue.price : null;
  const wed = dayArr.find(d => d.day === Day.WED) || null;
  const wedPrice = wed ? wed.price : null;
  const thr = dayArr.find(d => d.day === Day.THU) || null;
  const thrPrice = thr ? thr.price : null;
  const fri = dayArr.find(d => d.day === Day.FRI) || null;
  const friPrice = fri ? fri.price : null;
  const sat = dayArr.find(d => d.day === Day.SAT) || null;
  const satPrice = sat ? sat.price : null;

  return [sunPrice, monPrice, tuePrice, wedPrice, thrPrice, friPrice, satPrice];
};

// number를 DayOfWeekEnum[] (숫자배열) 반환
export const applyDaysToArr = (applyDaysBinary: number): DayOfWeekEnum[] => {
  // val 은 0~127 사이의 숫자
  let val = applyDaysBinary % (1 << 7);
  const result: DayOfWeekEnum[] = [];
  let index = 6;
  while (val > 0) {
    const day = 1 << index;
    if (val >= day) {
      result.push(day);
      val -= day;
    }
    index -= 1;
  }
  return result;
};

// Array 를 nubmer로 합산
export const arrToApplyDays = (arr: Array<number | boolean>): number =>
  arr.map((val, i) => (val ? 1 : 0) << i).reduce((v1, v2) => v1 + v2) % 128;

//  숫자 이넘
export enum DayOfWeekEnum {
  SUN = 1, // 1
  MON = SUN << 1, // 2
  TUE = MON << 1, // 4
  WED = TUE << 1, // 8
  THU = WED << 1, // 16
  FRI = THU << 1, // 32
  SAT = FRI << 1, // 64
  ALL_DAY = (SAT << 1) - 1 // 127
}

export const numberToStrings = (
  number: number,
  merge?: string
): string | string[] => {
  const applyDaysLang = applyDaysToArr(number).map(num =>
    JDWeekChanger(num, true)
  );
  if (merge) return applyDaysLang.join(merge);
  return applyDaysLang;
};

export const koreaToNumber = (foo: string) => {
  if (foo === "일") return 0;
  if (foo === "월") return 1;
  if (foo === "화") return 2;
  if (foo === "수") return 3;
  if (foo === "목") return 4;
  if (foo === "금") return 5;
  if (foo === "토") return 6;
};

export {
  dayarrEnToValueArr,
  JDMonthTextChanger,
  JDWeekChanger,
  dayarrEnToBooleanArr
};