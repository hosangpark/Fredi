import React from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import likeOnImage from '../../asset/image/heart_on.png';
import likeOffImage from '../../asset/image/heart_off.png';
import newIconImage from '../../asset/image/ico_new.png';
import { replaceString } from '../../util/Price';
import { FairListItem } from '../../types/Types';


function ArtworkCard({
  item,
  showType,
  onClick,
  onClickLike,
  isLikeList,
}: {
  item: FairListItem;
  showType: 1 | 2;
  onClick: (e: any) => void;
  onClickLike: (e: any) => void;
  isLikeList?: boolean;
}) {
  return (
    <ProductBox showType={showType} onClick={onClick}>
      <ProductImageWrap showType={showType}>
        <ProductImage src={item.image[0].file_name} />
      </ProductImageWrap>
      {dayjs().diff(dayjs(item.created_time), 'day') < 14 && <NewIcon src={newIconImage} />}
      <TextWrap showType={showType}>
        <ProductNameWrap>
          <ProductName>{item.name}</ProductName>
          <Designer>{item.designer}</Designer>
        </ProductNameWrap>
        <LikeButton onClick={onClickLike} src={isLikeList ? likeOnImage : item.isLike ? likeOffImage : likeOffImage} />
        {/* <LikeCount>{replaceString(item.price)} ₩</LikeCount> */}
      </TextWrap>
    </ProductBox>
  );
}

const ProductBox = styled.div<{ showType: 1 | 2 }>`
  position: relative;
  display: column;
  width: 16.5%;
  margin-bottom: 110px;
  cursor: pointer;
  overflow: hidden;

  @media only screen and (max-width: 1024px) {
    width: ${(props) => (props.showType === 1 ? 24.25 : 49.5)}%;
  }
  @media only screen and (max-width: 768px) {
    width: ${(props) => (props.showType === 1 ? 49.5 : 100)}%;
    margin-bottom: 50px;
  }
`;
const ProductImageWrap = styled.div<{showType: 1 | 2}>`
  width: 100%;
  aspect-ratio: 200/235;
  margin-bottom: 5px;
  overflow: hidden;
  position: relative;
  background:#000000;
`;
const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  &:hover {
    transform: scale(1.1);
  }
  transition: all 0.5s ease;
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
  font-size: 12px;
  font-weight: 500;
  text-align: left;
  @media only screen and (max-width: 768px) {
    font-size: 11px;
  }
`;

const ProductName = styled(Designer)`
  font-weight: 700;
`;

const LikeButton = styled.img`
  width: 20px;
  height: 20px;
  margin-right:10px;
  @media only screen and (max-width: 768px) {
    width: 20px;
    height: 20px;
  }
`;

const LikeCount = styled(Designer)``;

const RowWrap = styled.div<{ showType?: 1 | 2 }>`
  display: flex;
  justify-content: space-between;
  align-items: ${(props) => (props.showType === 1 ? 'center' : 'flex-start')};
  flex-direction: ${(props) => (props.showType === 1 ? 'row' : 'column')};
`;

const TextWrap = styled(RowWrap)<{ showType?: 1 | 2 }>`
  padding: 5px;
  flex-direction: ${(props) => (props.showType === 1 ? 'row' : 'column')};
  align-items: center;
  @media only screen and (max-width: 768px) {
    padding: 10px;
  }
`;

const ProductNameWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

export default ArtworkCard;
