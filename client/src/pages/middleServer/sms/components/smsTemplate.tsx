import React, { useState, Fragment } from 'react';
import JDLabel from '../../../../atoms/label/JDLabel';
import JDselect from '../../../../atoms/forms/SelectBox';
import { AUTO_SEND_OP, SMS_TARGET_OP } from '../../../../types/apiEnum';
import { useSelect, useInput } from '../../../../actions/hook';
import InputText from '../../../../atoms/forms/InputText';
import Switch from '../../../../atoms/forms/Switch';
import Button from '../../../../atoms/button/Button';
import { ErrProtecter } from '../../../../utils/utils';

interface IProps {}

const HouseCard: React.SFC<IProps> = () => {
  const [messageValue, setMessage] = useState('');

  const onTemplateBtnClick = (label: string) => {
    setMessage(`${messageValue} [${label}]`);
  };

  const tempArr = [
    '숙박날자(월/일)',
    '숙박날자(년/월/일)',
    '예약자명',
    '객실명',
    '인원수/방갯수',
    '총금액',
    '입금계좌',
  ];
  return (
    <Fragment>
      <InputText value={messageValue} onChange={setMessage} label="발신 메세지" textarea doubleHeight />
      <div>
        <div>
          <JDLabel txt="템플릿 메세지" />
        </div>
        {tempArr.map(value => (
          <Button
            onClick={() => {
              onTemplateBtnClick(value);
            }}
            label={value}
          />
        ))}
      </div>
      <div className="JDz-index-1 flex-grid flex-grid--start">
        {/* props 로부터 받아서 쓸거임. onChange시에는 뮤테이션을 날리겠지. */}
        <JDselect isMulti size="11rem" options={AUTO_SEND_OP} label="자동발신" />
        <JDselect size="9rem" options={SMS_TARGET_OP} label="발신대상" />
        <Switch label="활성화" />
      </div>
      <div>
        <Button size="large" thema="primary" label="추가" />
        <Button size="large" thema="primary" label="저장" />
        <Button size="large" thema="warn" label="삭제" />
      </div>
    </Fragment>
  );
};

export default ErrProtecter(HouseCard);