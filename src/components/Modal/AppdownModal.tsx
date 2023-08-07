import React,{useState} from 'react';
import { Modal } from '@mantine/core';
import styled,{keyframes} from 'styled-components';
import googleImage from '../../asset/image/google.png';
import appleImage from '../../asset/image/apple.png';
import closeImage from '../../asset/image/close.svg';

function AppdownModal({

  onClose,

}: {

  onClose: (e:boolean) => void;

}) {



const closeTodayPop = () => {
  let expires = new Date();
  let Time = expires.setHours(expires.getHours() + 24);
  localStorage.setItem("homeVisited", JSON.stringify(Time));
  // 현재 시간의 24시간 뒤의 시간을 homeVisited에 저장
  onClose(false);
};

const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  const handleAnimationEnd = () => {
    setIsAnimationComplete(true);
  };


  const redireactApp = (type:number) => {
    exeDeepLink();
    checkInstallApp(type);
  };

  function checkInstallApp(type:number) {
    function clearTimers() {
      clearInterval(check);
      clearTimeout(timer);
    }

    function isHideWeb() {
      if (document.hidden) {
        clearTimers();
      }
    }
    const check = setInterval(isHideWeb, 200);

    const timer = setTimeout(function() {
      redirectStore(type);
    }, 500);
  }

  const redirectStore = (type:number) => {
    const ua = navigator.userAgent.toLowerCase();
    if(type == 2){
      if (window.confirm("스토어로 이동하시겠습니까?")) {
        window.location.href =
          "https://play.google.com/store/apps/details?id=com.fredi"
      }
    } else if (type == 1){
      if (window.confirm("스토어로 이동하시겠습니까?")) {
        window.location.href =
          "https://apps.apple.com/kr/app/id1658309658";
      }
    }
  };

  function exeDeepLink() {
    let url = "com.fredi://path/";
    window.location.href = url;
  }

  return (
    <ModalWrapper>
      <ModalContent onAnimationEnd={handleAnimationEnd}>
        <Xbutton onClick={closeTodayPop}>
          <Image src={closeImage} />
        </Xbutton>
        <ButtonWrap>
          <ModalBlackButton style={{marginRight:26}} onClick={()=>redireactApp(1)}>
            <Image src={appleImage}/>
            <BlackButtonText>
              App Store
            </BlackButtonText>
          </ModalBlackButton>
          <ModalBlackButton onClick={()=>redireactApp(2)}>
            <Image src={googleImage}/>
            <BlackButtonText>
              Google Play
            </BlackButtonText>
          </ModalBlackButton>
        </ButtonWrap>
        {/* <ModalTitle onClick={()=>onClose(false)}>continue to use with website</ModalTitle> */}
        <ModalTitle onClick={closeTodayPop}>Turn off pop-ups for one day</ModalTitle>
      </ModalContent>
      <Overlay onClick={closeTodayPop} />
    </ModalWrapper>
  );
}

const slideUp = keyframes`
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
`;

const ModalWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
`;

const ModalContent = styled.div`
  position:relative;
  animation: ${slideUp} 0.3s ease-in-out;
  background-color: #fff;
  width: 100%;
  /* max-height: 40vh; */
  padding:110px 0 70px;
  overflow-y: auto;
  border-top-right-radius:20px;
  border-top-left-radius:20px;
  z-index: 9998;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
`;

const ButtonWrap = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom:48px;
  align-items:center;
  justify-content:center;
`;

const ModalBlackButton = styled.div`
  width: 154px;
  height: 59px;
  background-color: #3f3f3f;
  border-radius:15px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid #3f3f3f;
    @media only screen and (max-width: 769px){
      width: 140px;
    }
  `;

const Image = styled.img`
  width:25px;
  height:25px;
  margin-right:10px;
  @media only screen and (max-width: 769px){
    margin-right:5px;
    width:20px;
    height:20px;
  }
`;
const BlackButtonText = styled.span`
  font-family:'Pretendard Variable';
  font-weight: 310;
  color: #ffffff;
  font-size: 18px;
  @media only screen and (max-width: 769px){
    font-size: 14px;
  }
`;
const ModalTitle = styled.div`
  font-family:'Pretendard Variable';
  font-size: 16px;
  color: #121212;
  font-weight: 310;
  @media only screen and (max-width: 769px){
    font-size: 14px;
  }
  
`;
const Xbutton = styled.div`
  position:absolute;
  top:20px;
  right:20px;
`;
const XbuttonText = styled.div`
  position:absolute;
  top:20px;
  right:20px;
`;

export default AppdownModal;
