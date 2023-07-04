import React from 'react';
import { Modal } from '@mantine/core';
import styled from 'styled-components';

function ConfirmModal({
  visible,
  setVisible,
  text,
  onOk,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  text: string;
  onOk: () => void;
}) {
  const onClose = () => {
    setVisible(false);
  };

  return (
    <Modal opened={visible} onClose={onClose} overlayOpacity={0.5} size="auto" centered withCloseButton={false}>
      <ModalBox>
        <ModalTitle>{text}</ModalTitle>
        <ButtonWrap>
          <ModalBlackButton onClick={onOk}>
            <BlackButtonText>확인</BlackButtonText>
          </ModalBlackButton>
          <ModalWhiteButton onClick={onClose}>
            <WhiteButtonText>취소</WhiteButtonText>
          </ModalWhiteButton>
        </ButtonWrap>
      </ModalBox>
    </Modal>
  );
}

const ModalBox = styled.div`
  background-color: #fff;
  padding: 30px 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media only screen and (max-width: 768px) {
    padding: 20px 30px;
  }
`;

const ModalTitle = styled.span`
  font-family: 'NotoSans' !important;
  font-size: 17px;
  color: #121212;
  font-weight: 600;
  margin-bottom: 10px;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const ButtonWrap = styled.div`
  display: flex;
  flex-direction: row;
`;

const ModalBlackButton = styled.div`
  width: 130px;
  height: 50px;
  background-color: #121212;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid #121212;
  margin-top: 20px;
  @media only screen and (max-width: 768px) {
    width: 100px;
    height: 40px;
    margin-top: 10px;
  }
`;

const BlackButtonText = styled.span`
  font-family: 'NotoSans' !important;
  font-weight: 410;
  color: #ffffff;
  font-size: 14px;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const ModalWhiteButton = styled(ModalBlackButton)`
  background-color: #fff;
  margin-left: 10px;
`;

const WhiteButtonText = styled(BlackButtonText)`
  color: #121212;
`;

export default ConfirmModal;
