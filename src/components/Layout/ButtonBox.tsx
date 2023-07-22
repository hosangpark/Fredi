import React,{useState} from 'react';
import { Modal } from '@mantine/core';
import styled,{keyframes} from 'styled-components';
import googleImage from '../../asset/image/google.png';
import appleImage from '../../asset/image/apple.png';
import closeImage from '../../asset/image/close.svg';

function ButtonContainer({
  idx,
  text1,
  text2,
  onClick1,
  onClick2,
  cancle,
  marginT,
  marginB,
  width,
  visible
}: {
  idx?:string | undefined;
  text1:string;
  text2:string;
  onClick1: () => void;
  onClick2: () => void;
  cancle: () => void;
  marginT?:number
  marginB?:number
  width?:number
  visible?:boolean
}) {

  return (
    <ButtonWrap width={width&&width} visible={visible? visible : false} marginT={marginT? marginT :37} marginB={marginB? marginB :37}>
      <WhiteButton onClick={cancle}>
        <WhiteButtonText>{text2}</WhiteButtonText>
      </WhiteButton>
      <BlackButton onClick={idx ? onClick1 : onClick2}>
        <BlackButtonText>{text1}</BlackButtonText>
      </BlackButton>
    </ButtonWrap>
    
  );
}

const ButtonWrap = styled.div<{width?:number,marginT?:number,marginB?:number,visible?:boolean}>`
  display: flex;
  width:${props=>props.width ? props.width : 748}px;
  margin:${props=>props.marginT&& props.marginT}px auto ${props=>props.marginB&& props.marginB}px;
  min-height:55px;
  
  @media only screen and (max-width: 768px) {
    display:${props => props.visible? 'none':'flex'};
    width:100%;
    min-height:45px;
  }
`;

const BlackButton = styled.div`
  background-color: rgb(73, 73, 73);
  border: 1px solid #131313;
  cursor: pointer;
  border-radius:5px;
  flex:1;
  display:flex;
  
  justify-content:center;
  align-items:center;
  @media only screen and (max-width: 768px) {
  }
`;
const BlackButtonText = styled.span`
font-family:'Pretendard Variable';
  color: #ffffff;
  font-size: 14px;
  font-weight: 360;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
  `;

const WhiteButton = styled(BlackButton)`
margin-right:10px;
  background-color: #ffffff;
  flex:1;
`;

const WhiteButtonText = styled(BlackButtonText)`
  color: #121212;
`;



export default ButtonContainer;
