import { Button, FileButton, Image, TextInput } from '@mantine/core';
import { IconChevronDownLeft, IconPhotoPlus } from '@tabler/icons';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { setTextRange } from 'typescript';
import { APIDeleteBanner, APIRegisterBanner } from '../../api/SettingAPI';
import deleteButtonImage from '../../asset/image/ico_del.png';
import AlertModal from '../Modal/AlertModal';
import { BannerRow } from './BannerRow';
import { dndData } from './DnD';

interface BannerDnDProps {
  // data: dndData[];
  initList: dndData[];
  // setData: (value: dndData[]) => void;
}

export function BannerDnD({ initList }: BannerDnDProps) {
  console.log('initList', initList);
  const [target, setTarget] = useState<string>();
  const now = useRef<string>();
  const [alertType, setAlertType] = useState<'success'>();
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [fileList, setFileList] = useState<dndData[]>([]);
  const [images, setImages] = useState<dndData[]>([]);
  const [data, setData] = useState<any>();

  useEffect(() => {
    console.log('fileList', fileList);
    setImages(fileList);
  }, [fileList]);

  useEffect(() => {
    setFileList(initList);
  }, [initList]);

  const getBase64 = (file: File, cb: (value: string | ArrayBuffer | null) => void) => {
    console.log('db', cb);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  };

  const handleImage = (value: File) => {
    getBase64(value, (url) => {
      console.log('url', url);
      const file = {
        url: url as string,
        name: value.name,
        symbol: String(Date.now()),
        file: value,
        link: '' as string,
        type: 'P' as string,
      };
      console.log('file', file);
      setFileList((prev) => [...prev, file]);
    });
  };

  const changeText = (text: any, num: any) => {
    console.log(text, num);
    fileList[num].link = text;
    console.log(fileList);
    setFileList(fileList);
  };

  const changeMobile = (text: any, num: any) => {
    console.log(text, num);
    fileList[num].mobile = text;
    console.log('fileList add ', fileList);
    setFileList(fileList);
  };

  // const onRegisterBanner = async () => {
  //   console.log(fileList);
  //   const res = await APIRegisterBanner(fileList);
  //   console.log(res);
  //   setAlertType('success');
  // }

  const onRegisterBanner = async () => {
    const data = new FormData();
    const array = new Array();
    let count = 0;
    for (const image of images) {
      console.log('f', image);
      if (image.file) {
        image.link = fileList[count].link;
        if (fileList[count].mobile == undefined) {
          fileList[count].mobile = 'PC';
        }
        data.append('images', image.file);
        data.append('add', JSON.stringify({ index: count, link: fileList[count].link, mobile: fileList[count].mobile }));
        console.log(fileList[count].mobile);
        count += 1;
      } else {
        data.append('images', JSON.stringify({ ...image, index: count }));
        count += 1;
      }
    }
    try {
      const res = await APIRegisterBanner(data);
      console.log(res);
      setAlertType('success');
      setShowAlertModal(true);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const handleDelete = async (symbol: string) => {
    const res = await APIDeleteBanner({ idx: symbol });
    setFileList((prev) => prev.filter((item) => item.symbol !== symbol));
  };

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, idx: dndData) => {
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      console.log('드래그 시작 ' + idx.symbol);
      setTarget(idx.symbol);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // 1

    now.current = undefined;
    setTarget(undefined);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>, value: dndData) => {
    e.preventDefault(); // 1
    if (target && target !== value.symbol) {
      console.log('현재값', now.current);
      now.current = value.symbol;
      const targetFile = fileList.find((item) => item.symbol === target);
      if (targetFile) {
        const targetIdx = fileList.findIndex((item) => item.symbol === target);
        const target_bnum = fileList[Number(targetIdx)].bnum;
        const valueIdx = fileList.findIndex((item) => item.symbol === value.symbol);
        const value_bnum = fileList[Number(valueIdx)].bnum;
        console.log('드래그 겹칩 ' + value.symbol);
        if (target_bnum < value_bnum) {
          const newTemp = fileList.filter((item) => item.symbol !== target);
          newTemp.splice(valueIdx, 0, targetFile);
          console.log('newTemp:', newTemp);
          setFileList(newTemp);
        } else {
          const newTemp = fileList.filter((item) => item.symbol !== target);
          newTemp.splice(valueIdx, 0, targetFile);
          console.log('newTemp:', newTemp);
          setFileList(newTemp);
        }
      }
    }
  };

  return (
    <>
      {fileList.length < 12 && (
        <FileButton onChange={handleImage} accept="image/png,image/jpeg">
          {(props) => {
            return (
              <UploadButton {...props}>
                <IconPhotoPlus style={{ width: 18, height: 18, marginRight: 5 }} /> 이미지 추가하기
              </UploadButton>
            );
          }}
        </FileButton>
      )}
      <ImageWrap>
        {fileList.map((file: any, index) => {
          return (
            <div
              // draggable="true"
              key={file.symbol}
              onDragStart={(e) => onDragStart(e, file)}
              onDragOver={(e) => onDragOver(e, file)}
              onDrop={onDrop}
            >
              <BannerRow
                key={file.symbol}
                idx={file.symbol}
                num={index}
                name={file.name}
                file={file}
                link={file.link}
                url={file.url}
                changeText={changeText}
                handleDelete={handleDelete}
                mobile={file.type === 'M' ? 'Mobile' : 'PC'}
                changeMobile={changeMobile}
                bnum={file.bnum}
              />
            </div>
          );
        })}
        <SaveButton onClick={() => onRegisterBanner()}>저장</SaveButton>
      </ImageWrap>
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

const UploadButton = styled(Button)`
  width: 170px;
  font-weight: 410;
  border: 1px solid #121212;
  background-color: #fff;
  color: #121212;
  font-size: 14px;
  margin-bottom: 15px;
  &:hover {
    background-color: #fff;
  }
  border-radius: 0;
`;

const ImageWrap = styled.div``;

const DeleteButton = styled.img`
  width: 18px;
  height: 18px;
  position: absolute;
  top: 7px;
  right: 7px;
  cursor: pointer;
`;

const ImageBox = styled.div`
  position: relative;
  border: 1px solid #121212;
  margin: 0;
  display: inline-block;
  overflow: hidden;
  margin-bottom: 7px;
  cursor: pointer;
  width: 100%;
  /* aspect-ratio: 2.5/1; */
`;
const SaveButton = styled.div`
  font-weight: 410;
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
