import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { Mutation } from 'react-apollo';
import InputText from '../../atoms/forms/InputText';
import { PHONE_VERIFICATION } from '../../queries';
import Button from '../../atoms/Buttons';
import '../../atoms/Modal.scss';
import { useInput } from '../../actions/hook';

function PhoneVerification() {
  const [popPhone, setPopPhone] = useState(false);
  const keyHook = useInput('');
  // eslint-disable-next-line no-unused-vars
  const [phoneVerfication, setPhoneVerfication] = useState(false);

  return (
    <div id="loginPage" className="container">
      <div className="docs-section" />
      <div className="flex-grid__col col--full-12 col--md-12">
        <Mutation
          mutation={PHONE_VERIFICATION}
          onCompleted={() => {
            setPopPhone(true);
          }}
        >
          {mutation => <Button onClick={mutation} mode="small" label="인증하기" />}
        </Mutation>
      </div>
      {/* 모달 */}
      <ReactModal
        isOpen={popPhone}
        onRequestClose={() => setPopPhone(false)}
        className="Modal"
        overlayClassName="Overlay"
      >
        <p>핸드폰 인증번호</p>
        <InputText {...keyHook} label="인증번호" />
        <div className="ReactModal__EndSection">
          <Mutation
            mutation={PHONE_VERIFICATION}
            variables={{
              key: keyHook.value,
            }}
            onCompleted={() => {
              setPhoneVerfication(true);
            }}
          >
            {mutation => <Button label="인증하기" onClick={mutation} />}
          </Mutation>
          <Button label="Close Modal" onClick={() => setPopPhone(true)} />
        </div>
      </ReactModal>
    </div>
  );
}

export default PhoneVerification;
