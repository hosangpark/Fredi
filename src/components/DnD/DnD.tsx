import { Button, FileButton, Image } from '@mantine/core';
import { IconPhotoPlus } from '@tabler/icons';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import deleteButtonImage from '../../asset/image/ico_del.png';

export type dndData = {
  url?: any;
  symbol: string;
  name: string;
  file?: File;
  link?: any;
  mobile?: any;
  bnum?: any;
};

interface DndListProps {
  data: dndData[];
  initList: dndData[];
  setData: (value: dndData[]) => void;
}

export function DndList({ data, setData, initList }: DndListProps) {
  const [target, setTarget] = useState<string>();
  const now = useRef<string>();
  const [fileList, setFileList] = useState<dndData[]>([]);

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, idx: dndData) => {
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      console.log('드래그 시작 ' + idx);
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
    console.log(value.symbol);
    if (target && target !== value.symbol) {
      console.log('현재값', now.current);
      now.current = value.symbol;
      const targetFile = fileList.find((item) => item.symbol === target);
      if (targetFile) {
        const targetIdx = fileList.findIndex((item) => item.symbol === target);
        const valueIdx = fileList.findIndex((item) => item.symbol === value.symbol);
        console.log('드래그 겹칩 ' + value.symbol);
        if (targetIdx < valueIdx) {
          const newTemp = fileList.filter((item) => item.symbol !== target);
          const findIdx = newTemp.findIndex((item) => item.symbol === value.symbol);
          console.log('순서', findIdx);
          newTemp.splice(findIdx + 1, 0, targetFile);
          setFileList(newTemp);
        } else {
          const newTemp = fileList.filter((item) => item.symbol !== target);
          const findIdx = newTemp.findIndex((item) => item.symbol === value.symbol);
          console.log('순서', findIdx);
          newTemp.splice(findIdx, 0, targetFile);
          setFileList(newTemp);
        }
      }
    }
  };

  useEffect(() => {
    setData(fileList);
  }, [fileList]);

  useEffect(() => {
    setFileList(initList);
  }, [initList]);
  const getBase64 = (file: File, cb: (value: string | ArrayBuffer | null) => void) => {
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
      const file = { url: url as string, name: value.name, symbol: String(Date.now()), file: value };
      setFileList((prev) => [...prev, file]);
    });
  };

  const handleDelete = (symbol: string) => {
    console.log(symbol);
    setFileList((prev) => prev.filter((item) => item.symbol !== symbol));
  };

  useEffect(() => {
    console.log('fileList', fileList);
  }, [fileList]);

  return (
    <>
      {fileList.length < 11 && (
        <FileButton onChange={handleImage} accept="image/png,image/jpeg">
          {(props) => (
            <UploadButton {...props}>
              <IconPhotoPlus style={{ width: 18, height: 18, marginRight: 5 }} /> 이미지 추가하기
            </UploadButton>
          )}
        </FileButton>
      )}
      <ImageWrap>
        {fileList.map((file, index) => (
          <ImageBox
            draggable="true"
            key={file.symbol}
            onDragStart={(e) => onDragStart(e, file)}
            onDragOver={(e) => onDragOver(e, file)}
            onDrop={onDrop}
          >
            <Image src={file.url} alt={file.name} />
            {index === 0 && (
              <GreenBox>
                <GreenBoxText>메인</GreenBoxText>
              </GreenBox>
            )}
            <DeleteButton onClick={() => handleDelete(file.symbol)} src={deleteButtonImage} />
          </ImageBox>
        ))}
      </ImageWrap>
    </>
  );
}

const UploadButton = styled(Button)`
  width: 170px;
  font-weight: 400;
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

const GreenBox = styled.div`
  width: 40px;
  height: 25px;
  background-color: #398049;
  position: absolute;
  top: 0;
  left: 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GreenBoxText = styled.span`
  color: #fff;
  font-weight: 410;
  font-size: 11px;
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
  width: 180px;
  height: 180px;
  border: 1px solid #121212;
  margin: 0;
  display: inline-block;
  overflow: hidden;
  margin-right: 7px;
  cursor: pointer;
`;
