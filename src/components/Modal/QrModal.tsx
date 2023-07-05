import React from 'react';
import { Modal } from '@mantine/core';
import styled from 'styled-components';
import downImage from './../../asset/image/sign_in.png'
import linkImage from './../../asset/image/rink.svg'
import QrImage from './../../asset/image/qr.svg'

function QrModal({
  visible,
  setVisible,
  onClick,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onClick: () => void;
}) {
  const onCancel = () => {
    setVisible(false);
  };

  return (
    <Modal opened={visible} onClose={onCancel} overlayOpacity={0.5} size="auto" centered withCloseButton={false}>
      <ModalBox>
        {/* <ModalTitle>{text}</ModalTitle> */}
        <QrcodeImage src={QrImage}/>
        {/* <ModalBlackButton onClick={onClick}>
          <BlackButtonText>확인</BlackButtonText>
        </ModalBlackButton> */}
        {/* <EmptyBox/> */}
      </ModalBox>
      <PositionBox>
        <ButtonWrap style={{marginRight:15}}>
          <ImageWrap>
            <ImageRotate src={downImage}/>
          </ImageWrap>
          <ButtonTextWrap onClick={()=>{}}>
            Save Image
          </ButtonTextWrap>
        </ButtonWrap>
        <ButtonWrap>
          <ImageWrap>
            <Image src={linkImage}/>
          </ImageWrap>
          <ButtonTextWrap onClick={()=>{}}>
            Copy Link
          </ButtonTextWrap>
        </ButtonWrap>
      </PositionBox>
    </Modal>
  );
}

const ModalBox = styled.div`
  position:absolute;
  /* top:-100%; */
  top:100%;
  left:50%;
  transform:translate(-50%,-50%);
  background-color: #fff;
  padding: 20px 30px;
  border-radius:10px;
  display: flex;
  min-width:450px;
  min-height:450px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media only screen and (max-width: 768px) {
    min-width:300px;
    min-height:300px;
  }
`;
const Image = styled.img`
  width:30px;
  height:30px;
  aspect-ratio:1.0;
  @media only screen and (max-width: 768px) {
    width:20px;
    height:20px;
  }
`
const QrcodeImage = styled.img`
  width:100%;
  height:100%;
  object-fit:fill;
  aspect-ratio:1.0;
`
const ImageRotate = styled.img`
  width:30px;
  height:30px;
  aspect-ratio:1.0;
  transform:rotate(90deg);
  @media only screen and (max-width: 768px) {
    width:22px;
    height:20px;
  }
`
const PositionBox = styled.div`
  position:absolute;
  /* top:-100%; */
  top:100%;
  left:50%;
  transform:translate(-50%,250px);
  display:flex;
  justify-content:space-between;
  
  bottom:0px;
  width:450px;
  height:80px;
  @media only screen and (max-width: 768px) {
    transform:translate(-50%,170px);
    width:300px;
    height: 58px;
  }
  `;
const ButtonWrap = styled.div`
  background-color:white;
  border-radius:10px;
  display:flex;
  flex:1;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  padding-top:7px;
`;
const ImageWrap = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  width:100%;
  border:0;

`;
const ButtonTextWrap = styled.div`
font-family:'Pretendard Variable';
  display:flex;
  justify-content:center;
  align-items:center;
  font-size:14px;
  font-weight: 310;
  margin:0;
  height:40%;
   @media only screen and (max-width: 768px) {
    font-size:12px;
  }
`;


const BlackButtonText = styled.span`
  font-family:'Pretendard Variable'; !important;
  font-weight: 410;
  color: #ffffff;
  font-size: 14px;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

export default QrModal;
