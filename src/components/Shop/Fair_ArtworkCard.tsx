import React,{useState,useEffect} from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import likeOnImage from '../../asset/image/heart_on.svg';
import likeOffImage from '../../asset/image/heart.svg';
import newIconImage from '../../asset/image/ico_new.png';
import { replaceString } from '../../util/Price';
import { FairDetailsArtworkItem, FairListItem } from '../../types/Types';


function Fair_ArtworkCard({
  item,
  showType,
  onClick,
  onClickLike,
  isLikeList,
  index
}: {
  item: FairDetailsArtworkItem;
  showType: 1 | 2;
  onClick: (e: any) => void;
  onClickLike: (e: any) => void;
  isLikeList?: boolean;
  index:number
}) {
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", resizeListener);
  }, [innerWidth]);

  return (
    <ProductBox showType={showType} index={(index+1)}>
      <ProductImageWrap onClick={onClick} showType={showType} height={innerWidth}>
        <ProductImage src={item?.imageList[0].file_name} />
      </ProductImageWrap>
      <TextWrap>
        <ProductNameWrap>
          <ProductName>{item?.name} {item?.idx}</ProductName>
          <Designer>{item?.designer_name}</Designer>
        </ProductNameWrap>
        <LikeButton onClick={onClickLike} src={isLikeList ? likeOnImage : item?.isLike ? likeOnImage : likeOffImage} />
      </TextWrap>
    </ProductBox>
  );
}

const ProductBox = styled.div<{ showType: 1 | 2, index:number }>`
  position: relative;
  display: column;
  width: calc(20% - 16px);

  overflow: hidden;
  margin-right: ${(props) => ((props.index) % 5 === 0 ? 0:20)}px;
  @media only screen and (max-width: 768px) {
    ${(props) => (props.showType === 1? `margin-right: ${(props.index) % 2 === 0 ? 0:5}px;` : `margin-right:0;`  )}
    ${(props) => (props.showType === 1? `width:calc(50% - 2.5px);` : `width:100%;`  )}
  }
`;
const ProductImageWrap = styled.div<{showType: 1 | 2, height:number }>`
  width: 100%;
  aspect-ratio: 0.851;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  background:#000000;
  @media only screen and (max-width: 768px) {
    height:${props =>  props.showType === 1 && (props.height/2-5)/0.851}px;
  }
`;
const ProductImage = styled.img`
  width: 100%;
  height: 100%;

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

const Designer = styled.div`
font-family:'Pretendard Variable';
  color: #121212;
  font-size: 17px;
  font-weight: 310;
  line-height:17px;
  text-align: left;
  margin-top:6px;
  @media only screen and (max-width: 1440px) {
    font-size: 14px;
    line-height:14px;
  }
  @media only screen and (max-width: 768px) {
    margin-top:5px;
    font-size: 11px;
    line-height:11px;
  }
`;

const ProductName = styled.span`
font-family:'Pretendard Variable';
  display: -webkit-box;
  -webkit-line-clamp: 3; // 원하는 라인수
  -webkit-box-orient: vertical;
  overflow:hidden;
  text-overflow:hidden;
  color: #121212;
  font-weight: 310;
  text-align: left;
  font-size: 17px;
  line-height:19px;
  @media only screen and (max-width: 1440px) {
    font-size: 14px;
    line-height:14px;
  }
  @media only screen and (max-width: 768px) {
    font-size: 11px;
    line-height:11px;
  }
`;

const LikeButton = styled.img`
  width: 20px;
  height: 26px;
  object-fit:contain;
  margin-top:30px;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    margin-top:10px;
  }
`;

const LikeCount = styled(Designer)``;



const TextWrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding:0 10px;
`;

const ProductNameWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin-right:5px;
  height:166px;
  margin: 30px 10px 0;
  @media only screen and (max-width: 768px) {
    margin: 10px 10px 0;
    height:93px;
  }
`;

export default Fair_ArtworkCard;
