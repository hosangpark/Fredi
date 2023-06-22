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
  <ProductBox onClick={()=>setChecked(!checked,item)} checked={checked}>
    {item}
  </ProductBox>
  )
}

const CheckBoxButton = styled.div`
  cursor: pointer;
  width: 18px;
  height: 18px;
`;

const ProductBox = styled.div<{checked:boolean }>`
  font-size:14px;
  /* width: 16.5%; */
  cursor: pointer;
  overflow: hidden;
  box-sizing:border-box;
  border:2px solid #d4d4d4;
  border-radius:5px;
  padding:5px 10px;
  /* margin:5px 10px; */
  color: ${(props)=>(props.checked === true? 'white':'black')};
  background-color: ${(props)=>(props.checked === true? 'black':'white')};
  @media only screen and (max-width: 768px) {
    font-size:12px;
  }
`;


export default CategoryItem;
