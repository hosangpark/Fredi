import React,{useState,useRef} from 'react';
import styled from 'styled-components';

function Nodata({Text}:{Text?:string}) { 
  return (
    <ContainerWrap>
      <NodataBox>
        <NodataText>
          {Text? Text : '검색결과가 없습니다.'}
        </NodataText>
      </NodataBox>
    </ContainerWrap>
  );
}

const ContainerWrap = styled.div`
  padding-top:50px;
  flex:1;
`;
const NodataBox = styled.div`
  flex:1;
  display:flex;
  justify-content:center;
  align-items:center;
`;
const NodataText = styled.div`
  font-size:17px;
  @media only screen and (max-width: 768px) {
    font-size:15px;
  }
`;

export default Nodata;
