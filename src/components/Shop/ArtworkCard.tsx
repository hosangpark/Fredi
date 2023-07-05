import React,{useState,useEffect} from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import likeOnImage from '../../asset/image/heart.svg';
import likeOffImage from '../../asset/image/heart.svg';
import newIconImage from '../../asset/image/ico_new.png';
import { replaceString } from '../../util/Price';
import { FairListItem } from '../../types/Types';


function ArtworkCard({
  item,
  showType,
  onClick,
  onClickLike,
  isLikeList,
  index
}: {
  item: FairListItem;
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
    <ProductBox showType={showType} onClick={onClick} index={(index+1)}>
      <ProductImageWrap showType={showType} height={innerWidth}>
        <ProductImage src={item.image[0].file_name} />
      </ProductImageWrap>
      {/* {dayjs().diff(dayjs(item.created_time), 'day') < 14 && <NewIcon src={newIconImage} />} */}
      <TextWrap>
        <ProductNameWrap>
          <ProductName>{item.name}{item.name}</ProductName>
          <Designer>{item.designer}</Designer>
        </ProductNameWrap>
        <LikeButton onClick={onClickLike} src={isLikeList ? likeOnImage : item.isLike ? likeOffImage : likeOffImage} />
        {/* <LikeCount>{replaceString(item.price)} ₩</LikeCount> */}
      </TextWrap>
    </ProductBox>
  );
}

const ProductBox = styled.div<{ showType: 1 | 2, index:number }>`
  position: relative;
  display: column;
  width: calc(20% - 16px);
  cursor: pointer;
  overflow: hidden;
  margin-right: ${(props) => ((props.index) % 5 === 0 ? 0:20)}px;
  @media only screen and (max-width: 768px) {
    ${(props) => (props.showType === 1? `margin-right: ${(props.index) % 2 === 0 ? 0:5}px;` : `margin-right:0;`  )}
    ${(props) => (props.showType === 1? `width:calc(50% - 5px);` : `width:100%;`  )}
  }
`;
const ProductImageWrap = styled.div<{showType: 1 | 2, height:number }>`
  width: 100%;
  aspect-ratio: 0.851;
  overflow: hidden;
  position: relative;
  background:#000000;
  margin-bottom: 30px;
  @media only screen and (max-width: 768px) {
    margin-bottom: 10px;
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

const Designer = styled.span`
font-family:'Pretendard Variable';
  color: #121212;
  font-size: 17px;
  font-weight: 310;
  line-height:1;
  text-align: left;
  @media only screen and (max-width: 1440px) {
    font-size: 14px;
  }
  @media only screen and (max-width: 768px) {
    margin-top:5px;
    font-size: 11px;
  }
`;

const ProductName = styled.span`
font-family:'Pretendard Variable';
  -webkit-line-clamp:2;
  word-break: break-word;
  text-overflow:ellipsis;
  color: #121212;
  font-weight: 310;
  text-align: left;
  font-size: 17px;
  @media only screen and (max-width: 1440px) {
    font-size: 14px;
  }
  @media only screen and (max-width: 768px) {
    font-size: 11px;
  }
`;

const LikeButton = styled.img`
  width: 20px;
  height: 26px;
  object-fit:contain;
  @media only screen and (max-width: 768px) {
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
  margin-bottom:81px;

  &:hover{
    height:145px;
    margin-bottom:0px;
  }
  @media only screen and (max-width: 768px) {

    margin-bottom:41px;
    &:hover{
      height:105px;
      margin-bottom:0px;
    }
  }
`;

export default ArtworkCard;
