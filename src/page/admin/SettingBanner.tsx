import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AlertModal from '../../components/Modal/AlertModal';
import { APIGetBanner, APIRegisterBanner } from '../../api/SettingAPI';
import { BannerDnD } from '../../components/DnD/BannerDnD';
import { dndData } from '../../components/DnD/DnD';

function SettingBanner() {
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<'success'>();

  const [images, setImages] = useState<dndData[]>([]);
  const [init, setInit] = useState<dndData[]>([]);

  // const onRegisterBanner = async () => {
  //   const data = new FormData();
  //   let count = 0;
  //   for (const image of images) {
  //     console.log('f', image);
  //     if (image.file) {
  //       console.log('file');
  //       data.append('images', image.file);
  //       count += 1;
  //     } else {
  //       console.log('dd');
  //       console.log(image);
  //       data.append('images', JSON.stringify({ ...image, index: count }));
  //       count += 1;
  //       console.log(data);
  //     }
  //   }
  //   console.log('ㄹㅁ',data);
  //   try {
  //     console.log('ㄹㅁ',data);
  //     // const res = await APIRegisterBanner(data);
  //     // console.log(res);
  //     // setAlertType('success');
  //   } catch (error) {
  //     console.log(error);
  //     alert(error);
  //   }
  // };

  const fetchBanner = async () => {
    const result = await APIGetBanner();
    console.log('result', result);
    // { name: item.file_name, url: item.file_name, symbol: item.idx }
    setInit(
      result.map((item: any) => ({
        name: item.file_name,
        url: item.file_name,
        symbol: item.idx,
        link: item.link,
        type: item.type,
        bnum: item.banner_number,
      }))
    );
  };

  useEffect(() => {
    if (alertType) {
      setShowAlertModal(true);
    }
  }, [alertType]);

  useEffect(() => {
    fetchBanner();
  }, []);

  return (
    <>
      <Box last>
        <Title>배너 이미지 관리</Title>
        <BannerDnD initList={init} />
        {/* <SaveButton onClick={onRegisterBanner}>저장</SaveButton> */}
      </Box>
      <AlertModal
        visible={showAlertModal}
        setVisible={setShowAlertModal}
        onClick={() => {
          setShowAlertModal(false);
          setAlertType(undefined);
        }}
        text={alertType === 'success' ? '배너 수정이 완료되었습니다.' : ''}
      />
    </>
  );
}

const Box = styled.div<{ last?: boolean }>`
  padding: 50px;
  border-bottom: ${(props) => (props.last ? 0 : '1px solid #121212')};
  text-align: left;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h4`
  font-weight: bold;
  color: #121212;
  font-size: 18px;
  margin: 0;
  margin-bottom: 10px;
`;

const SaveButton = styled.div`
  font-weight: 400;
  background-color: #121212;
  color: #fff;
  font-size: 14px;
  margin-bottom: 15px;
  padding: 14px;
  text-align: center;
  width: 140px;
  align-self: flex-end;
  cursor: pointer;
`;

export default SettingBanner;
