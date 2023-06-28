import React,{useState} from 'react';
import { Modal } from '@mantine/core';
import styled,{keyframes} from 'styled-components';
import googleImage from '../../asset/image/google.png';
import appleImage from '../../asset/image/apple.png';
import closeImage from '../../asset/image/close.png';

function AppdownModal({

  onClose,

}: {

  onClose: () => void;

}) {

const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  const handleClose = () => {
    if (onClose && isAnimationComplete) {
      onClose();
    }
  };

  const handleAnimationEnd = () => {
    setIsAnimationComplete(true);
  };

  return (
    <ModalWrapper>
      <ModalContent onAnimationEnd={handleAnimationEnd}>
        <Xbutton onClick={onClose}>
          <XbuttonText>
            <Image src={closeImage} />
          </XbuttonText>
        </Xbutton>
        <ButtonWrap>
          <ModalBlackButton onClick={()=>console.log('app')}>
            <Image src={appleImage}/>
            <BlackButtonText>
              App Store
            </BlackButtonText>
          </ModalBlackButton>
          <ModalBlackButton onClick={()=>console.log('Google')}>
            <Image src={googleImage}/>
            <BlackButtonText>
              Google Play
            </BlackButtonText>
          </ModalBlackButton>
        </ButtonWrap>
        <ModalTitle onClick={onClose}>continue to use with website</ModalTitle>
      </ModalContent>
      <Overlay onClick={handleClose} />
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
  animation: ${slideUp} 0.3s ease-in-out;
  background-color: #fff;
  width: 100%;
  max-height: 40vh;
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
  gap:20px;
  margin-top:30px;
  align-items:center;
  justify-content:center;
`;

const ModalBlackButton = styled.div`
  width: 160px;
  height: 60px;
  background-color: #3f3f3f;
  border-radius:20px;
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
  width:30px;
  height:30px;
  margin-right:10px;
  @media only screen and (max-width: 769px){
    margin-right:5px;
    width:25px;
    height:25px;
  }
`;
const BlackButtonText = styled.span`
  font-family:'vdvd';
  font-weight: 300;
  color: #ffffff;
  font-size: 18px;
  @media only screen and (max-width: 769px){
    font-size: 14px;
  }
`;
const ModalTitle = styled.div`
  font-family: 'NotoSans' !important;
  font-size: 14px;
  color: #121212;
  font-weight: 400;
  margin: 30px auto;
  @media only screen and (max-width: 769px){
    font-size: 14px;
  }
  
`;
const Xbutton = styled.div`
  display: flex;
  margin: 20px auto;
  flex-direction:row;
  justify-content:flex-end;
`;
const XbuttonText = styled.div`
  font-size: 15px;
  color: #121212;
  font-weight: 400;
  margin-right:20px;
`;

export default AppdownModal;
