import React,{useState} from 'react';
import { Modal } from '@mantine/core';
import styled,{keyframes} from 'styled-components';
import googleImage from '../../asset/image/google.png';
import appleImage from '../../asset/image/apple.png';
import closeImage from '../../asset/image/close.svg';

function TopTextButton({
  text,
  onClick,
}: {
  text:string;
  onClick: () => void;
}) {

  return (
    <ButtonBox onClick={onClick}>
      {text}
    </ButtonBox>
  );
}

const ButtonBox = styled.div`
  position:absolute;
  right:25px;
  top:15px;
  z-index:101;
  font-family:'Pretendard Variable';
  font-weight: 310;
  padding:5px;
  color: #121212;
  cursor: pointer;
  display:none;
  @media only screen and (max-width: 768px) {
    right:15px;
      display:block;
      font-size:14px;
  }
`;


export default TopTextButton;
