import React, { useState } from 'react';
import styled from 'styled-components';

interface Props {
  item: string;
  checked:boolean;
  setChecked: (e:boolean,type?:string)=>void;
}
function CategoryItem({item,checked,setChecked}: Props) {
  // const [checked, setChecked] = useState(false)
  return (
  <ProductBox  onClick={()=>setChecked(!checked,item)} home={item.includes('&')}>
    <ProductItem checked={checked} >
      {item}
    </ProductItem>
  </ProductBox>
  )
}

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


export default CategoryItem;
