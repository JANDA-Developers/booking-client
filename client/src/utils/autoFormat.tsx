//  전화번호 형식에 맞추어 - 붙임
const autoHypenPhone = (str: string = ''): string => {
  const inStr = str.replace(/[^0-9]/g, '');
  let tmp = '';
  if (inStr.length < 4) {
    return inStr;
  }
  if (inStr.length < 7) {
    tmp += inStr.substr(0, 3);
    tmp += '-';
    tmp += inStr.substr(3);
    return tmp;
  }
  if (inStr.length < 11) {
    tmp += inStr.substr(0, 3);
    tmp += '-';
    tmp += inStr.substr(3, 3);
    tmp += '-';
    tmp += inStr.substr(6);
    return tmp;
  }
  if (inStr.length >= 11) {
    tmp += inStr.substr(0, 3);
    tmp += '-';
    tmp += inStr.substr(3, 4);
    tmp += '-';
    tmp += inStr.substr(7);
    return tmp;
  }

  return inStr;
};

//  3글자 마다 ,붙여줌
const autoComma = (str: string = ''): string => {
  let t = `${str}`;
  const comma = /,/g;
  t = t.replace(comma, '');
  const x = t.split('.');
  let x1 = x[0];
  const x2 = x.length > 1 ? `.${x[1]}` : '';
  const rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
};

// 숫자로된 string 타입을 반환
const numberStr = (str: string = ''): string => str.replace(/[^0-9.]/g, '');
// 스트링을 숫자로 만듬
const stringToNumber = (str: string = ''): number => parseInt(str.replace(/[^0-9.]/g, ''), 10);

export default autoHypenPhone;
export { autoComma, numberStr, stringToNumber };