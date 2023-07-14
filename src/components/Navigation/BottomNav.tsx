import React, { memo, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import newIconImage from '../../asset/image/ico_new.png';
import { APICheckNew } from '../../api/SettingAPI';
import { UserContext } from '../../context/user';
import AlertModal from '../Modal/AlertModal';
import home01 from '../../asset/image/home.svg';
import home02 from '../../asset/image/home02.png';
import home03 from '../../asset/image/Fair.svg';
import home04 from '../../asset/image/discover.svg';
import home05 from '../../asset/image/my.svg';
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
  const [userName, setUserName] = useState('user');

  const onLogout = () => {
    sessionStorage.clear();
    patchUser(0, 3);
    window.location.replace('/');
  };

  // const getUserDetails = async () => {
  //   try {
  //     const res = await APIUserDetails();
  //     console.log(res);
  //     setUserDetails(res);
  //     setIsSnsUser(res.type !== 1 ? true : false);
  //   } catch (error) {
  //     console.log(error);
  //     navigate('/signin', { replace: true });
  //   }
  // };

  // const checkNew = async () => {
  //   const result = await APICheckNew();
  //   setCheck(result);
  // };

  // useEffect(() => {
  //   checkNew();
  // }, []);

  return (
    <BottomNavWrap draggable={false}>
      <MenuButton
        onClick={() => {
          removeHistory();
          navigate('/');
        }}
      >
        <MenuButtonImage src={home01} width={29}/>
        <MenuButtonText>Home</MenuButtonText>
      </MenuButton>
      <MenuButton
        onClick={() => {
          removeHistory();
          navigate('/MainTab/FairTab');
        }}
      >
        <MenuButtonImage src={home03} width={29}/>
        <MenuButtonText>Fair</MenuButtonText>
      </MenuButton>
      <MenuButton
        onClick={() => {
          removeHistory();
          if (!token) {
            setShowLogin(true);
          } else {
            navigate('/community/FeedTab');
          }
        }}
      >
        <MenuButtonImage src={home04} width={29}/>
        <MenuButtonText>Discover</MenuButtonText>
      </MenuButton>
      <MenuButton
        onClick={() => {
          removeHistory();
          if (!token) {
            setShowLogin(true);
          } else {
            navigate(`/MobileProfile/${user}`);
          }
        }}
      >
        <MenuButtonImage src={home05} width={29}/>
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
  /* border-top: 1px solid #efefef; */
  height: 70px;
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
  width: ${(props) => (props.width ? props.width : 24)}px;
  height: ${(props) => (props.width ? props.width : 24)}px;
  margin-bottom:8px;
`;

const MenuButtonText = styled.span`
font-family:'Pretendard Variable';
  font-weight: 410;
  color: #121212;
  font-size: 10px;
`;

export default memo(BottomNav);
