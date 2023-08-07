import React, { useRef, useState } from 'react';
import { Modal } from '@mantine/core';
import styled from 'styled-components';
import downImage from './../../asset/image/save_img.svg'
import linkImage from './../../asset/image/rink.svg'
import { QRCodeCanvas } from 'qrcode.react';
import AlertModal from './AlertModal';

function QrModal({
  idx,
  innerWidth,
  visible,
  setVisible,
  onClick,
}: {
  idx?:string;
  innerWidth:number;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onClick: () => void;
}) {

  const [showContentModal, setShowContentModal] = useState(false);
  const [alertType, setAlertType] = useState<string>();
  const [cccc, ddd] = useState(0);

  const DownloadQRCode = () => {
    const canvas = document.querySelector("#qrcode-canvas") as HTMLCanvasElement
    if (!canvas) throw new Error("<canvas> not found in the DOM")

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream")
    const downloadLink = document.createElement("a")
    downloadLink.href = pngUrl
    downloadLink.download = "QR code.png"
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }
  

  const handleCopyClipBoard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowContentModal(true)
      setAlertType(`It's been copied`)
    } catch (error) {
      setShowContentModal(true)
      setAlertType('Copy failed')
    }
  }
  const CCC = () => {
    ddd(cccc+1)
  }

  return (
    <Modal opened={visible} onClose={()=>setVisible(false)} overlayOpacity={0.5} size="auto" centered withCloseButton={false}>
      <ModalBox onClick={CCC}>
        {/* <ModalTitle>{text}</ModalTitle> */}
        {/* <QrcodeImage src={QrImage}/> */}
        <QRCodeCanvas id='qrcode-canvas' value={`https://new.fredi.co.kr/MobileProfile/${idx}`} size={innerWidth < 768 ? 250 : 400}/>
      <PositionBox>
        <ButtonWrap style={{marginRight:15}}>
          <ImageWrap>
            <ImageRotate src={downImage}/>
          </ImageWrap>
          <ButtonTextWrap onClick={DownloadQRCode}>
            Save Image
          </ButtonTextWrap>
        </ButtonWrap>
        <ButtonWrap>
          <ImageWrap>
            <Image src={linkImage}/>
          </ImageWrap>
          <ButtonTextWrap onClick={()=>{handleCopyClipBoard(`https://new.fredi.co.kr/MobileProfile/${idx}`)}}>
            Copy Link
          </ButtonTextWrap>
        </ButtonWrap>
      </PositionBox>
      </ModalBox>
      
      <AlertModal
        visible={showContentModal}
        setVisible={setShowContentModal}
        onClick={() => {
          setShowContentModal(false);
        }}
        text={alertType? alertType : 'Ok'}
      />
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
const ImageRotate = styled.img`
  width:30px;
  height:30px;
  aspect-ratio:1.0;
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
  transform:translate(-225px,10px);
  display:flex;
  justify-content:space-between;
  z-index:9999;
  bottom:0px;
  width:450px;
  height:80px;
  @media only screen and (max-width: 768px) {
    transform:translate(-150px,10px);
    width:300px;
    height: 58px;
  }
  `;
const ButtonWrap = styled.div`
  background-color:white;
  border-radius:10px;
  display:flex;
  flex:1;
  z-index:100;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  padding-top:7px;
`;
const ImageWrap = styled.div`
  display:flex;
  justify-content:center;
  cursor: pointer;
  cursor: pointer;
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
  cursor: pointer;
  font-weight: 310;
  margin:0;
  height:40%;
   @media only screen and (max-width: 768px) {
    font-size:12px;
  }
`;


export default QrModal;
