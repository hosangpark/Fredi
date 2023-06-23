import React,{useState, useEffect} from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import likeOnImage from '../../asset/image/heart_on.png';
import likeOffImage from '../../asset/image/heart_off.png';
import newIconImage from '../../asset/image/ico_new.png';
import arrowImage from '../../asset/image/arr_down.png';
import { replaceString } from '../../util/Price';
import { ArtistItem, FairListItem } from '../../types/Types';

function ArtistCard({
  item,
  onClick,
}: {
  item: ArtistItem;
  onClick: (e: any) => void;
}) {
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);

  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", resizeListener);
  }, [innerWidth]);
  
  return (
    <ProductBox onClick={onClick}>
      <ProductNameWrap>
        <Designer>{item.designer}</Designer>

        {/* {innerWidth <= 768?
        <ArrowImage src={arrowImage} />
        :
        null
        } */}
      </ProductNameWrap>
    </ProductBox>
  );
}

const ProductBox = styled.div`
  position: relative;
  display: column;
  /* width: 24.25%; */
  width: 16.6%;
  margin: 20px 0;
  cursor: pointer;
  overflow: hidden;
  @media only screen and (max-width: 1440px) {
    width: 24.25%;
  }
  @media only screen and (max-width: 768px) {
    width: 49%;
  }
`;
const ProductImageWrap = styled.div`
  width: 100%;
  aspect-ratio: 0.8;
  margin-bottom: 15px;
  overflow: hidden;
  position: relative;
`;
const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  &:hover {
    transform: scale(1.1);
  }
  transition: all 0.5s ease;
`;
const ArrowImage = styled.img`
  width: 15px;
  height: 15px;
  transform: rotate( -90deg );
  
  /* &:hover {
    transform: scale(1.1);
  }
  transition: all 0.5s ease; */
`;

const NewIcon = styled.img`
  width: 25px;
  height: 25px;
  position: absolute;
  left: 10px;
  top: 10px;
`;

const Designer = styled.span`
  color: #121212;
  font-weight: 400;
  text-align: left;
  @media only screen and (max-width: 1024px) {
    font-size: 14px;
  }
  @media only screen and (max-width: 768px) {
    font-weight: 300;
    font-size: 12px;
  }
`;

const ProductName = styled(Designer)`
  font-weight: 700;
`;

const LikeButton = styled.img`
  width: 25px;
  height: 25px;
  position: absolute;
  right: 15px;
  bottom: 15px;
  @media only screen and (max-width: 768px) {
  }
`;

const LikeCount = styled(Designer)``;

const RowWrap = styled.div<{ showType?: 1 | 2 }>`
  display: flex;
  /* justify-content: space-between;
  align-items: ${(props) => (props.showType === 1 ? 'center' : 'flex-start')};
  flex-direction: ${(props) => (props.showType === 1 ? 'row' : 'column')}; */
`;

const TextWrap = styled(RowWrap)<{ showType?: 1 | 2 }>`
  padding: 0 10px;
  /* flex-direction: ${(props) => (props.showType === 1 ? 'row' : 'column')};
  align-items: flex-start; */
`;

const ProductNameWrap = styled.div`
  display: flex;
  align-items:center;
  justify-content:center;
  @media only screen and (max-width: 768px) {
    /* justify-content:space-between; */
  }
`;

export default ArtistCard;
