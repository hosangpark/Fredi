import React from 'react';
import styled from 'styled-components';

interface Props {
  checked: boolean;
  onClick?: () => void;
}
function CheckBox({ checked, onClick }: Props) {
  return <CheckBoxButton onClick={onClick} src={checked ? require('../../asset/image/check_on.png') : require('../../asset/image/check_off.png')} />;
}
const CheckBoxButton = styled.img`
  cursor: pointer;
  width: 18px;
  height: 18px;
`;

export default CheckBox;
