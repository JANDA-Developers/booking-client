/* eslint-disable camelcase */
/* eslint-disable no-shadow */
/* ts-ignore */
import randomColor from "randomcolor";
import {useState, useEffect, useMemo, useRef} from "react";
import Axios from "axios";
import {toast} from "react-toastify";
import {CLOUDINARY_KEY} from "../keys";
import {IselectedOption} from "../atoms/forms/selectBox/SelectBox";
import {IHolidaysByApi} from "../types/interface";
import moment from "moment";
import {jsonString} from "../utils/utils";

// 한방에 패치
// A X I O S  : (http://codeheaven.io/how-to-use-axios-as-your-http-client/)

export type IUseFetch = [
  any,
  boolean,
  boolean,
  (url: string | undefined) => void
];

const useShouldSave = (updateValue: any[]) => {
  const isInitialMount = useRef(true);
  const [shouldSave, setShouldSave] = useState(false);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      setShouldSave(true);
      // Your useEffect code here to be run on update
    }
  }, updateValue);

  return {shouldSave, setShouldSave};
};

const useFetch = (url: string | undefined = ""): IUseFetch => {
  const [data, setData] = useState([]);
  const [inUrl, setInUrl] = useState(url);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchData = async () => {
    setIsError(false);

    try {
      const result = await Axios(inUrl);
      setData(result.data);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [inUrl]);

  // 내부에 STATE URL을 바꾸어서 다시동작
  const doGet = (url: string | undefined) => {
    setIsLoading(true);
    url && setInUrl(url);
  };

  return [data, isLoading, isError, doGet];
};

// 이미지업로더
export interface IuseImageUploader {
  fileUrl: string;
  uploading: boolean;
  isError: boolean;
  onChangeFile(event: React.ChangeEvent<HTMLInputElement | undefined>): void;
  setFileUrl: React.Dispatch<any>;
}

// 프로필 서클 업로더
export interface IuseProfileUploader {
  fileUrl?: string;
  uploading?: boolean;
  isError?: boolean;
  onChangeFile?(event: React.ChangeEvent<HTMLInputElement | undefined>): void;
  setFileUrl?: React.Dispatch<any>;
}

//  이미지 업로더
const useImageUploader = (foo?: any): IuseImageUploader => {
  const [fileUrl, setFileUrl] = useState(foo);
  const [uploading, setUploading] = useState(false);
  const [isError, setIsError] = useState(false);

  const onChangeFile = async (
    event: React.ChangeEvent<HTMLInputElement | undefined>
  ) => {
    if (event) {
      const {
        target: {name, value, files}
      }: any = event;
      if (files) {
        setUploading(true);
        const formData = new FormData();
        formData.append("api_key", CLOUDINARY_KEY || "");
        formData.append("upload_preset", "jandaAPP");
        formData.append("file", files[0]);
        formData.append("timestamp", String(Date.now() / 1000));
        try {
          const {
            data: {secure_url}
          } = await Axios.post(
            "https://api.cloudinary.com/v1_1/stayjanda-com/image/upload",
            formData
          );
          if (secure_url) {
            setFileUrl(secure_url);
          }
        } catch (error) {
          setIsError(true);
          toast.error(error);
        } finally {
          setUploading(false);
        }
      }
    }
  };

  return {
    fileUrl,
    uploading,
    isError,
    onChangeFile,
    setFileUrl
  };
};

// 디바운스 정
function useDebounce(value: any, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;
}

export interface TUseInput<T = string> {
  value: T;
  onChangeValid: (value: boolean | string) => void;
  onChange: (foo: T) => void;
  isValid: any;
}

export type TUseRedirect = [boolean, string, (url: string) => void];

function useRedirect(
  inFlag: boolean = false,
  inUrl: string = ""
): TUseRedirect {
  const [flag, setFlag] = useState(inFlag);
  const [url, inSetRedirect] = useState(inUrl);

  const setRedirect = (redirectUrl: string) => {
    inSetRedirect(redirectUrl);
    setFlag(true);
  };

  return [flag, url, setRedirect];
}

// 밸리데이션을 포함한 훅 리턴
function useInput<T = string>(
  defaultValue: T,
  defulatValid: boolean | string = ""
): TUseInput<T> {
  const [value, setValue] = useState(defaultValue);
  const [isValid, setIsValid] = useState(defulatValid);

  const onChange = (value: T) => {
    setValue(value);
  };

  const onChangeValid = (value: boolean | string) => {
    setIsValid(value);
  };

  return {
    value,
    onChange,
    isValid,
    onChangeValid
  };
}

// 체크박스
function useCheckBox(defaultValue: boolean) {
  const [checked, setChecked] = useState(defaultValue);

  const onChange = (value: boolean) => {
    setChecked(value);
  };

  return {
    checked,
    onChange
  };
}

// 데이트 픽커
export interface IUseDayPicker {
  from: Date | null;
  setFrom: React.Dispatch<React.SetStateAction<Date | null>>;
  to: Date | null;
  setTo: React.Dispatch<React.SetStateAction<Date | null>>;
  entered: Date | null;
  setEntered: React.Dispatch<React.SetStateAction<Date | null>>;
  setDate: (date: Date) => void;
}

function useDayPicker(
  defaultFrom: Date | null | string,
  defaultTo: Date | null | string
): IUseDayPicker {
  let fromTemp: Date | null | string = defaultFrom;
  let toTemp: Date | null | string = defaultTo;
  if (typeof defaultFrom === "string") fromTemp = moment(defaultFrom).toDate();
  if (typeof defaultTo === "string") toTemp = moment(defaultTo).toDate();
  if (typeof fromTemp === "string") throw Error;
  if (typeof toTemp === "string") throw Error;
  const [from, setFrom] = useState<Date | null>(fromTemp);
  const [entered, setEntered] = useState<Date | null>(toTemp);
  const [to, setTo]: any = useState<Date | null>(toTemp);

  const setDate = (date: Date) => {
    setFrom(date);
    setEntered(date);
    setTo(date);
  };

  return {
    from,
    to,
    entered,
    setFrom,
    setTo,
    setEntered,
    setDate
  };
}

// 색상 필커
export interface IUseColor {
  color: string;
  setColor: (inInfo: string) => void;
  setDisplay: (inInfo: boolean) => void;
  display: boolean;
}

// NAME SPACE
function useColorPicker(defaultValue: string | null): IUseColor {
  let defaultColor: string = "";
  if (!defaultValue) {
    const temp = randomColor();
    if (temp instanceof Array) {
      defaultColor = temp[0];
    }
  } else {
    defaultColor = defaultValue;
  }

  const [color, inSetColor] = useState(defaultColor);
  const [display, inSetDisplay] = useState(false);

  const setColor = (value: string) => {
    inSetColor(value);
  };

  const setDisplay = (value: boolean) => {
    inSetDisplay(value);
  };

  return {
    color,
    setColor,
    setDisplay,
    display
  };
}

// 라디오 훅
function useRadio(defaultValue: any = "") {
  const [value, setValue] = useState(defaultValue);

  const onChange = (value: any) => {
    setValue(value);
  };

  return [value, onChange];
}

// 스위치 훅
function useSwitch(defaultValue: boolean) {
  const [checked, setChecked] = useState(defaultValue);

  const onChange = (value: boolean) => {
    setChecked(value);
  };

  return {checked, onChange};
}

// useRange
function useRange(defaultValue: number) {
  const [value, setValue] = useState(defaultValue);

  const onChange = (value: any) => {
    setValue(value);
  };

  return {value, onChange};
}

export interface IUseSelect<V = any> {
  selectedOption: IselectedOption<V> | null;
  onChange(foo: IselectedOption<V>): void;
}

// 셀렉트박스 훅
function useSelect<V = any>(
  defaultValue: IselectedOption<V> | null
): IUseSelect<V> {
  const [selectedOption, setSelectedOption] = useState(defaultValue);

  const onChange = (value: IselectedOption<V>) => {
    setSelectedOption(value);
  };

  return {selectedOption, onChange};
}

// 투글 훅
function useToggle(defaultValue: boolean): [boolean, any] {
  const [toggle, setToggle] = useState(defaultValue);

  const onClick = () => {
    setToggle(!toggle);
  };

  return [toggle, onClick];
}

// 투글 훅
function usePagiNation(defaultValue: number): [number, (page: number) => void] {
  const [page, inSetPage] = useState(defaultValue);

  const setPage = (foo: number) => {
    inSetPage(foo);
  };

  return [page, setPage];
}

export interface IUseModal<T = any> {
  isOpen: boolean;
  openModal: (inInfo?: T) => void;
  closeModal: () => void;
  info: T;
}
interface IModalBtn {
  msg: string;
  callBackKey: string;
}

interface IOpenModalInfo {
  [key: string]: any;
  trueBtns?: IModalBtn;
  falseBtns?: IModalBtn;
  txt?: string;
  children?: any;
  callBack?(flag: boolean, callBackKey?: string): void;
}

// 모달훅
function useModal<T = any>(
  defaultValue: boolean = false,
  defaultInfo: any = {}
): IUseModal<T> {
  const [isOpen, setIsOpen] = useState(defaultValue);
  const [info, setInfo] = useState(defaultInfo);

  const openModal = (inInfo?: any) => {
    setIsOpen(true);
    setInfo(inInfo);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    openModal,
    closeModal,
    info
  };
}

const getKoreaSpecificDayHook = (
  year: string
): {
  datas: IHolidaysByApi[];
  loading: boolean;
} => {
  const [loading, setLoading] = useState(true);
  const [datas, setDatas] = useState<IHolidaysByApi[]>([]);

  let temp: IHolidaysByApi[] = [];
  const get = async () => {
    for (let i = 1; i < 13; i++) {
      const url =
        "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo";
      const queryParams = `?${encodeURIComponent("ServiceKey")}=${
        process.env.REACT_APP_API_SPECIFIC_DAY_KEY
      }&${encodeURIComponent("solYear")}=${encodeURIComponent(
        "2019"
      )}&${encodeURIComponent("solMonth")}=${encodeURIComponent(`0${i}`)}`;

      try {
        const {data} = await Axios(url + queryParams);
        const item = data.response.body.items;
        if (Array.isArray(item.item)) {
          item.item.forEach((inItem: any) => {
            if (inItem) temp.push(inItem);
          });
        } else {
          if (item.item) {
            temp.push(item.item);
          }
        }
      } catch {
      } finally {
        setDatas(temp);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    get();
  }, [year]);

  return {datas, loading};
};

export {
  useInput,
  useCheckBox,
  useRadio,
  useSwitch,
  useSelect,
  useToggle,
  useFetch,
  useModal,
  useRange,
  useDebounce,
  useImageUploader,
  useShouldSave,
  useColorPicker,
  useDayPicker,
  getKoreaSpecificDayHook,
  usePagiNation,
  useRedirect
};
