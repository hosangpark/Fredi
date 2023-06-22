import React, { memo, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import newIconImage from '../../asset/image/ico_new.png';
import { APICheckNew } from '../../api/SettingAPI';
import { UserContext } from '../../context/user';
import AlertModal from '../Modal/AlertModal';
import home01 from '../../asset/image/homeicon.png';
import home02 from '../../asset/image/home02.png';
import home03 from '../../asset/image/searchicon.png';
import home04 from '../../asset/image/snsicon.png';
import home05 from '../../asset/image/profile.png';
import likeOffImage from '../../asset/image/heart_off.png';
import ConfirmModal from '../Modal/ConfirmModal';
import { removeHistory } from '../Layout/Header';

function BottomNav() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');

  const { user, patchUser } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [check, setCheck] = useState<{ product: boolean; producer: boolean }>();
  const [showLogin, setShowLogin] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  const onLogout = () => {
    sessionStorage.clear();
    patchUser(0, 3);
    window.location.replace('/');
  };

  // const checkNew = async () => {
  //   const result = await APICheckNew();
  //   setCheck(result);
  // };

  // useEffect(() => {
  //   checkNew();
  // }, []);

  return (
    <BottomNavWrap>
      <MenuButton
        onClick={() => {
          removeHistory();
          navigate('/');
        }}
      >
        <MenuButtonImage src={home01} />
        <MenuButtonText>HOME</MenuButtonText>
      </MenuButton>

      {user.level <= 1 && (
        <MenuButton
          onClick={() => {
            console.log(user.level);
            removeHistory();

            if (user.level > 1) {
              setShowModal(true);
            } else {
              navigate('/producer');
            }
          }}
        >
          <MenuButtonImage src={home02} />
          <MenuButtonText>Producing</MenuButtonText>
        </MenuButton>
      )}
      <MenuButton
        onClick={() => {
          removeHistory();
          navigate('/MainTab');
        }}
      >
        <MenuButtonImage src={home03} />
        <MenuButtonText>FAIR</MenuButtonText>
      </MenuButton>

      {/* <MenuButton
        onClick={() => {
          removeHistory();
          if (!token) {
            return setShowLogin(true);
          }
          navigate('/likelist');
        }}
      >
        <MenuButtonImage src={likeOffImage} width={26} />
        <MenuButtonText>관심작품</MenuButtonText>
      </MenuButton> */}
      
      <MenuButton
        onClick={() => {
          removeHistory();
          navigate('/community');
        }}
      >
        <MenuButtonImage src={home04} width={26} />
        <MenuButtonText>SNS</MenuButtonText>
      </MenuButton>
      <MenuButton
        onClick={() => {
          removeHistory();
          navigate('/MobileProfile');
          // if (!token) {
          //   setShowLogin(true);
          // } else {
          //   navigate('/profile');
          // }
        }}
      >
        <MenuButtonImage src={home05} />
        <MenuButtonText>MY</MenuButtonText>
      </MenuButton>
      <AlertModal
        visible={showModal}
        setVisible={setShowModal}
        onClick={() => {
          setShowModal(false);
        }}
        text="접근 권한이 없습니다."
      />
      <AlertModal
        visible={showLogin}
        setVisible={setShowLogin}
        onClick={() => {
          removeHistory();
          navigate('/signin');
          setShowLogin(false);
        }}
        text="회원가입 후 이용 가능합니다."
      />
      <ConfirmModal visible={confirmModal} setVisible={setConfirmModal} text="로그아웃 하시겠습니까?" onOk={onLogout} />
    </BottomNavWrap>
  );
}

const BottomNavWrap = styled.div`
  position: fixed;
  padding:5px 0 10px 0;
  bottom: 0;
  display: none;
  width: 100%;
  background-color: #fff;
  border-top: 1px solid #efefef;
  height: 60px;
  align-items: center;
  justify-content: space-between;
  z-index: 99;
  @media only screen and (max-width: 768px) {
    display: flex;
  }
`;

const NewIcon = styled.img`
  width: 14px;
  height: 14px;
  position: absolute;
  /* left: 0px; */
  top: 3px;
  @media only screen and (max-width: 768px) {
    width: 12px;
    height: 12px;
    right: 10px;
    top: 0px;
  }
  @media only screen and (max-width: 400px) {
  }
`;

const MenuButton = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  position: relative;
  cursor: pointer;
`;

const MenuButtonImage = styled.img<{ width?: number }>`
  width: ${(props) => (props.width ? props.width : 27)}px;
  height: 27px;
  margin-bottom: 3px;
  @media only screen and (max-width: 768px) {
    width: 23px;
    height: 23px;
  }

`;

const MenuButtonText = styled.span`
  font-weight: 400;
  color: #121212;
  font-size: 10px;
  display:none;
`;

export default memo(BottomNav);
