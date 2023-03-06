import React from 'react';
import styled from 'styled-components';
import topButtonImage from '../../asset/image/top.png';

function TopButton() {
  const moveToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return <Button onClick={moveToTop} src={topButtonImage} />;
}

const Button = styled.img`
  width: 46px;
  aspect-ratio: 1;
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 99;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    bottom: 90px;
  }
`;

export default TopButton;
