import React from 'react';
import { Modal } from '@mantine/core';
import styled from 'styled-components';

function ImageModal({
  visible,
  setVisible,
  source,
  onClick,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  source: string;
  onClick: () => void;
}) {
  const onCancel = () => {
    setVisible(false);
  };

  return (
    <Modal opened={visible} onClose={onCancel} overlayOpacity={0.5} size="auto" centered withCloseButton={false}>
      <ModalBox>
        <ImageBox src={source} />
        <ModalBlackButton onClick={onClick}>
          <BlackButtonText>닫기</BlackButtonText>
        </ModalBlackButton>
      </ModalBox>
    </Modal>
  );
}

const ModalBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ImageBox = styled.img`
  width: 100%;
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
`;

const BlackButtonText = styled.span`
  font-weight: 400;
  color: #ffffff;
  font-size: 16px;
`;

export default ImageModal;
