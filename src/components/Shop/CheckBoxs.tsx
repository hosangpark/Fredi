import React from 'react';
import styled from 'styled-components';

interface checkProps {
  checked: boolean; // disable
  onClick?: () => void;
}


function CheckBoxs({ checked, onClick }: checkProps) {
    return <CheckBoxDisable onClick={onClick} src={require('../../asset/image/check_off.png')} />;
}


const CheckBoxDisable = styled.img`
  width: 18px;
  height: 18px;
`;

export default CheckBoxs;
