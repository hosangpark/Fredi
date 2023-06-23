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
  color: ${(props)=>(props.checked === true? 'white':'black')};
  background-color: ${(props)=>(props.checked === true? 'black':'white')};
  cursor: pointer;
  font-weight:300;
  overflow: hidden;
  box-sizing:border-box;
  border:1px solid #bdbdbd;
  border-radius:5px;
  padding:5px 1px;
  margin:3px;
  @media only screen and (max-width: 768px) {
    font-size:14px;
  }
`;

const ProductBox = styled.div<{home?:boolean }>`
  
  /* width: 16.5%; */
  width:${props=>props.home? 50 : 25}%;
 
`;


export default CategoryItem;
