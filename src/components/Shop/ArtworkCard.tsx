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
      <ProductImageWrap>
        <ProductImage src={item.image[0].file_name} />
      </ProductImageWrap>
      {dayjs().diff(dayjs(item.created_time), 'day') < 14 && <NewIcon src={newIconImage} />}
      <TextWrap>
        <ProductNameWrap>
          <ProductName>{item.name}{item.name}{item.name}{item.name}</ProductName>
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
  width: ${(props) => (props.showType === 1 ? 19.20 : 19.25)}%;
  cursor: pointer;
  overflow: hidden;

  @media only screen and (max-width: 768px) {
    width: ${(props) => (props.showType === 1 ? 49.5 : 100)}%;
    margin-bottom: 50px;
  }
`;
const ProductImageWrap = styled.div`
  width: 100%;
  object-fit:cover;
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
font-family:'Pretendard Variable';
  color: #121212;
  font-size: 12px;
  font-weight: 400;
  text-align: left;
  @media only screen and (max-width: 768px) {
    font-size: 11px;
  }
`;

const ProductName = styled(Designer)`
  font-weight: 400;
  -webkit-line-clamp:2;
  word-break: break-word;
  overflow:hidden;
  text-overflow:ellipsis;
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



const TextWrap = styled.div`
  display: flex;
  justify-content: space-between;

  padding: 5px;
  
  @media only screen and (max-width: 768px) {
    padding: 10px;
  }
`;

const ProductNameWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin-right:5px;
  height:54px;
  margin-bottom:91px;
  &:hover{
    height:145px;
    margin-bottom:0px;
  }
  @media only screen and (max-width: 768px) {
    margin-bottom:51px;
    &:hover{
      height:105px;
      margin-bottom:0px;
    }
  }
`;

export default ArtworkCard;
