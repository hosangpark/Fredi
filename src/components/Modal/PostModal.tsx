import React from 'react';
import { Modal } from '@mantine/core';
import DaumPostcode from 'react-daum-postcode';

function PostModal({
  visible,
  setVisible,
  setAddress,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  setAddress: (address: { address: string; zonecode: string }) => void;
}) {
  const onCancel = () => {
    setVisible(false);
  };

  const onComplete = (data: any) => {
    setVisible(false);
    setAddress(data);
  };

  return (
    <Modal opened={visible} title={`주소 검색`} onClose={onCancel} fullScreen>
      <DaumPostcode style={{ width: '100%', height: '90vh', padding: 0 }} onComplete={onComplete} autoClose={false} defaultQuery="" />
    </Modal>
  );
}

export default PostModal;
