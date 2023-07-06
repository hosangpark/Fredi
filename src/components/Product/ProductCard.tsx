import React from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import likeOnImage from '../../asset/image/heart_on.png';
import likeOffImage from '../../asset/image/heart_off.png';
import newIconImage from '../../asset/image/ico_new.png';
import { TProductListItem } from '../../types/Types';

function ProductCard({
  item,
  showType,
  index,
  onClick,
  onClickLike,
  isLikeList,
}: {
  item: TProductListItem;
  showType: 1 | 2;
  index: number;
  onClick: (e: any) => void;
  onClickLike: (e: any) => void;
  isLikeList?: boolean;
}) {
  return (
    <ProductBox showType={showType} isLast={(index + 1) % 4 === 0} onClick={onClick}>
      <ProductImageWrap>
        <ProductImage src={item.image[0].file_name} />
      </ProductImageWrap>
      {dayjs().diff(dayjs(item.created_time), 'day') < 14 && <NewIcon src={newIconImage} />}
      <TextWrap showType={showType}>
        <ProductNameWrap>
          <ProductName>{item.name}</ProductName>
          <Designer>{item.designer}</Designer>
        </ProductNameWrap>
        <LikeRowWrap>
          <LikeButton onClick={onClickLike} src={isLikeList ? likeOnImage : item.isLike ? likeOnImage : likeOffImage} />
          <LikeCount>{item.like_count}</LikeCount>
        </LikeRowWrap>
      </TextWrap>
    </ProductBox>
  );
}

const ProductBox = styled.div<{ isLast: boolean; showType: 1 | 2 }>`
  position: relative;
  display: column;
  width: 24.25%;
  margin-bottom: 110px;
  margin-right: ${(props) => (props.isLast ? 0 : 1)}%;
  cursor: pointer;
  overflow: hidden;

  @media only screen and (max-width: 768px) {
    width: ${(props) => (props.showType === 1 ? 100 : 50)}%;
    margin-right: 0;
    margin-bottom: 50px;
  }
`;
const ProductImageWrap = styled.div`
  width: 100%;
  aspect-ratio: 0.8;
  margin-bottom: 15px;
  overflow: hidden;
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
  width: 18px;
  height: 18px;
  margin-right: 6px;
  @media only screen and (max-width: 768px) {
    width: 15px;
    height: 15px;
    margin-right: 4px;
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
  padding: 0 10px;
  flex-direction: ${(props) => (props.showType === 1 ? 'row' : 'column')};
  align-items: flex-start;
`;

const LikeRowWrap = styled.div`
  display: flex;
  align-items: center;
`;

const ProductNameWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

export default ProductCard;
