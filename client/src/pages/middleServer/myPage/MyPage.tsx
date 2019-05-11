import React from 'react';
import PT from 'prop-types';
import profileImg from '../../../img/profile/default_profile.jpg';
import Button from '../../../atoms/button/Button';
import InputText from '../../../atoms/forms/inputText/InputText';
import ProfileCircle from '../../../atoms/profileCircle/ProfileCircle';
import MyHouse from './components/myHouse';
import MyHouseAdd from './components/myHouseAdd';
import utils, { toast } from '../../../utils/utils';
import Modal from '../../../atoms/modal/Modal';
import './MyPage.scss';
import MyHouseModalWrap from './components/myHouseModalWrap';
import { IHouse } from '../../../types/interface';
import Preloader from '../../../atoms/preloader/Preloader';
import { useImageUploader, IuseImageUploader } from '../../../actions/hook';

interface IProps {
  houses: IHouse[];
  profileCircleHook: IuseImageUploader;
  [foo: string]: any;
}

const Mypage: React.SFC<IProps> = ({
  houses,
  nameHook,
  phoneNumberHook,
  passwordHook,
  emailHook,
  profileMutation,
  houseModal,
  passWordModal,
  loading,
  profileCircleHook,
}) => {
  const profileStyle = {
    backgroundImage: `url(${profileImg})`,
  };

  const checkUpdateMutation = (e: any) => {
    e.preventDefault();

    if (!nameHook.isValid) {
      toast.warn('올바른 이름이 아닙니다.');
      return false;
    }
    if (!emailHook.isValid) {
      toast.warn('올바른 이메일이 아닙니다.');
      return false;
    }
    if (!phoneNumberHook.isValid) {
      toast.warn('올바른 핸드폰 번호가 아닙니다.');
      return false;
    }
    if (!passwordHook.isValid) {
      toast.warn('올바른 패스워드가 아닙니다.');
      return false;
    }
    profileMutation();
    return null;
  };

  return (
    <div id="myPage" className="myPage container container--sm">
      <div className="docs-section">
        <div className="docs-section__box">
          <form>
            <h2>MyPage</h2>
            <div className="myPage__profileCircle">
              <ProfileCircle {...profileCircleHook} config isBordered style={profileStyle} />
              <p>{`숙소 ${houses.length}개 보유중`}</p>
            </div>
            <InputText {...nameHook} validation={utils.isName} label="성함" />
            <InputText {...phoneNumberHook} validation={utils.isPhone} label="핸드폰번호" />
            <InputText {...emailHook} validation={utils.isEmail} label="이메일" />
            <div>
              <Button onClick={passWordModal.openModal} label="프로필 수정" />
            </div>
          </form>
        </div>
        <h4>생성한 숙소</h4>
        {/* 숙소 목록들 */}
        {loading && <Preloader />}
        <div className="row myPage__myHouses">
          {houses
            ? houses.map(house => (
              <div key={house._id} className="myPage__myHouse col col--4 col--md-6">
                <MyHouse
                  id={house._id}
                  title={house.name}
                  houseModal={houseModal}
                  productId={house.product ? house.product._id : undefined}
                  productName={house.product ? house.product.name : undefined}
                  purchaseProduct={house.houseType}
                  dateCreated={house.createdAt.substr(0, 10)}
                  location={house.location && house.location.address}
                />
              </div>
            ))
            : null}
          {/* 숙소추가 */}
          <div className="col col--4 col--md-6">
            <MyHouseAdd />
          </div>
        </div>
      </div>
      {/* Modal : 프로필 변경 */}
      <Modal center {...passWordModal}>
        <h6>프로필 변경</h6>
        <InputText {...passwordHook} validation={utils.isPassword} label="비밀번호" />
        <div className="JDmodal__endSection">
          <Button
            mode="flat"
            label="확인"
            onClick={(e: any) => {
              passWordModal.closeModal();
              checkUpdateMutation(e);
            }}
          />
          <Button mode="flat" label="닫기" onClick={passWordModal.closeModal} />
        </div>
      </Modal>
      <MyHouseModalWrap MyHouseModalHook={houseModal} />
    </div>
  );
};

export default Mypage;
