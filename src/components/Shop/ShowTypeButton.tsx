import React from 'react';
import styled from 'styled-components';
import one from '../../asset/image/ico_list.png';
import two from '../../asset/image/ico_list2.png';

interface Props {
  onClickType1: () => void;
  onClickType2: () => void;
  style?: {};
}

function ShowTypeButton({ onClickType1, onClickType2, style }: Props) {
  return (
    <TypeButtonWrap style={style}>
      <TypeButton onClick={onClickType1} src={one} />
      <TypeButton onClick={onClickType2} src={two} />
    </TypeButtonWrap>
  );
}

const TypeButtonWrap = styled.div`
  display: none;
  margin-bottom: 15px;
  @media only screen and (max-width: 764px) {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
`;

const TypeButton = styled.img`
  width: 30px;
  margin-right: 7px;
  cursor: pointer;
`;

export default ShowTypeButton;
