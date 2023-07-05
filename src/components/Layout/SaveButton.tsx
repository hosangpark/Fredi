import React,{useState} from 'react';
import { Modal } from '@mantine/core';
import styled,{keyframes} from 'styled-components';
import googleImage from '../../asset/image/google.png';
import appleImage from '../../asset/image/apple.png';
import closeImage from '../../asset/image/close.svg';

function SaveButton({
  onClick,
}: {
  onClick: () => void;
}) {

  return (
    <ButtonBox>
      Save
    </ButtonBox>
  );
}

const ButtonBox = styled.div`
  position:absolute;
  right:30px;
  top:20px;
  z-index:101;
  font-family:'Pretendard Variable';
  font-weight: 310;
  color: #121212;
  cursor: pointer;
  display:none;
  @media only screen and (max-width: 768px) {
    right:20px;
      display:block;
      font-size:14px;
  }
`;


export default SaveButton;
