import { Button, FileButton, Image, TextInput } from '@mantine/core';
import { IconPhotoPlus } from '@tabler/icons';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { setTextRange } from 'typescript';
import deleteButtonImage from '../../asset/image/ico_del.png';
import { dndData } from './DnD';
import { SegmentedControl } from '@mantine/core';

interface DndListProps {
  key: string;
  idx: number;
  url: string;
  name: string;
  file: any;
  link: string;
  num: any;
  mobile: any;
  bnum: number;
  changeText: (text: any, num: any) => void;
  changeMobile: (text: any, num: any) => void;
  handleDelete: (num: any) => void;
}

export function BannerRow(props: DndListProps) {
  const [text, setText] = useState<any>(props.link);
  const [mobile, setMobile] = useState<any>(props.mobile);

  // console.log('rps', props);
  return (
    <>
      <ImageBox>
        <Image src={props.url} alt={props.name} />
        <DeleteButton onClick={() => props.handleDelete(props.idx)} src={deleteButtonImage} />
      </ImageBox>
      <SegmentedControl
        data={[
          { value: 'PC', label: 'PC' },
          { value: 'Mobile', label: 'Mobile' },
        ]}
        styles={{
          root: {
            width: '100%',
            marginBottom: 10,
          },
        }}
        value={mobile}
        onChange={(e) => {
          setMobile(e);
          props.changeMobile(e, props.num);
        }}
      />
      <TextInput
        placeholder="링크추가(http, https 포함 입력)"
        style={{ marginBottom: 10 }}
        value={text}
        onChange={(e: any) => {
          setText(e.target.value);
          props.changeText(e.target.value, props.num);
        }}
      />
    </>
  );
}

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

const DeleteButton = styled.img`
  width: 18px;
  height: 18px;
  position: absolute;
  top: 7px;
  right: 7px;
  cursor: pointer;
`;
