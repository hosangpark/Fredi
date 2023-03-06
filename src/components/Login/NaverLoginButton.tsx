import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import API from '../../api/default';
import naverImage from '../../asset/image/sns_naver.png';

function NaverLoginButton() {
  const naver = (window as any).naver;
  const NAVER_CLIENT_ID = 'iESKNVDDiIJZJakD29lF';
  const NAVER_CALLBACK_URL = 'https://fredi.co.kr/naver';
  const naverRef = useRef<HTMLDivElement>(null);

  const onLogin = () => {
    console.log('click');
    const naverLogin = new naver.LoginWithNaverId({
      clientId: NAVER_CLIENT_ID,
      callbackUrl: NAVER_CALLBACK_URL,
      // 팝업창으로 로그인을 진행할 것인지?
      isPopup: false,
      // 버튼 타입 ( 색상, 타입, 크기 변경 가능 )
      loginButton: { color: 'green', type: 1, height: 45 },
      callbackHandle: true,
    });
    naverLogin.init();
    naverLogin.logout(); //네이버 로그인이 계속 유지되는 경우가 있음, 초기화시 로그아웃
  };

  const handleClick = () => {
    const loginfnc: any = document.getElementById('naverIdLogin')?.firstChild;
    loginfnc.click();
  };

  useEffect(() => {
    onLogin();
  }, []);

  return (
    <>
      <SnsButton src={naverImage} onClick={handleClick} />
      <NaverIdLogin id="naverIdLogin" ref={naverRef} style={{ display: 'none' }}></NaverIdLogin>
    </>
  );
}

const SnsButton = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 100%;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    width: 45px;
    height: 45px;
  }
`;

const NaverIdLogin = styled.div`
  border-radius: 50px;
  overflow: hidden;
`;

export default NaverLoginButton;
