import React,{useState,useRef} from 'react';
import styled from 'styled-components';

function Nodata({Text}:{Text?:string}) { 
  return (
    <ContainerWrap>
      <NodataBox>
        <NodataText>
          {Text? Text : 'No search results found.'}
        </NodataText>
      </NodataBox>
    </ContainerWrap>
  );
}

const ContainerWrap = styled.div`
  padding:50px 0;
  flex:1;
`;
const NodataBox = styled.div`
  flex:1;
  display:flex;
  justify-content:center;
  align-items:center;
`;
const NodataText = styled.div`
font-family:'Pretendard Variable';
  font-weight: 410;
  font-size:17px;
  @media only screen and (max-width: 768px) {
    font-size:15px;
  }
`;

export default Nodata;
