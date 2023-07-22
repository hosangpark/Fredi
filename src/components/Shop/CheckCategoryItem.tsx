import React, { useState } from 'react';
import styled from 'styled-components';
import CheckBox from './CheckBox';

interface Props {
  item: string;
  idx:number;
  checked:boolean;
  setChecked: (idx:number,item:string)=>void;
}
function CheckCategoryItem({item,idx,checked,setChecked}: Props) {
  // const [checked, setChecked] = useState(false)
  return (
  <CheckboxItems  onClick={()=>setChecked(idx,item)}>
    <CheckBox checked={checked} size={20}/>
    <CheckBoxText>{item}</CheckBoxText>
  </CheckboxItems>
  )
}

const CheckboxItems = styled.div`
  display:flex;
  align-items:center;
  padding:5px;
  width:33.3333%;
`
const CheckBoxText = styled.span`
  font-family:'Pretendard Variable';
  font-size: 14px;
  margin-left: 7px;
  font-weight: 410;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const ProductItem = styled.div<{checked:boolean}>`
  color: ${(props)=>(props.checked === true? '#FFFFFF':'#000000')};
  background-color: ${(props)=>(props.checked === true? '#000000':'#FFFFFF')};
  font-family:'Pretendard Variable';
  cursor: pointer;
  font-weight: 310;
  overflow: hidden;
  box-sizing:border-box;
  border:0.5px solid #B4B4B4;
  border-radius:4.31px;
  padding:10px 1px;
  margin:5px;
  font-size:14px;
  @media only screen and (max-width: 768px) {
  }
`;

const ProductBox = styled.div<{home?:boolean }>`

  /* width: 16.5%; */
  width:${props=>props.home? 50 : 25}%;
 
`;


export default CheckCategoryItem;
