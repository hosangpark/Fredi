import React from 'react';
import styled from 'styled-components';

interface Props {
  checked: boolean;
  onClick?: () => void;
  size?:number
}
function CheckBox({ checked, onClick, size }: Props) {
  return <CheckBoxButton size={size} onClick={onClick} src={checked ? require('../../asset/image/check_on.png') : require('../../asset/image/check_off.png')} />;
}
const CheckBoxButton = styled.img<{size?:number}>`
  cursor: pointer;
  width: ${props=>props.size? props.size : 18}px;
  height: ${props=>props.size? props.size : 18}px;
`;

export default CheckBox;
