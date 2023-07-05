import React,{useState, useEffect} from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import likeOnImage from '../../asset/image/heart_on.png';
import likeOffImage from '../../asset/image/heart_off.png';
import newIconImage from '../../asset/image/ico_new.png';
import { replaceString } from '../../util/Price';
import { FairListItem } from '../../types/Types';

function FairCard({
  item,
  showType,
  index,
  onClick,
  onClickLike,
  isLikeList,
}: {
  item: FairListItem;
  showType: 1 | 2;
  index: number;
  onClick: (e: any) => void;
  onClickLike: (e: any) => void;
  isLikeList?: boolean; 
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
      <ProductImageWrap height={innerWidth}>
        <ProductImage src={item.image[0]?.file_name ? item.image[0].file_name : 'd'} />
        {/* <LikeButton onClick={onClickLike} src={isLikeList ? likeOnImage : item.isLike ? likeOnImage : likeOffImage} /> */}
      </ProductImageWrap>
      {/* {dayjs().diff(dayjs(item.created_time), 'day') < 14 && <NewIcon src={newIconImage} />} */}
      <TextWrap>
        <ProductNameWrap>
          <ProductName>{item.name}</ProductName>
          <Designer>{item.designer}</Designer>
        </ProductNameWrap>
        {/* <LikeCount>{replaceString(item.price)} ₩</LikeCount> */}
      </TextWrap>
    </ProductBox>
  );
}

const ProductBox = styled.div`
  position: relative;
  display: column;
  width: 100%;
  cursor: pointer;
  overflow: hidden;
  /* @media only screen and (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 50px;
  } */
`;
const ProductImageWrap = styled.div<{height:number}>`
  width: 100%;
  aspect-ratio:2.7118;
  background-color:black;
  
  @media only screen and (max-width: 768px) {
    /* aspect-ratio:410/280; */
    height:${props => (props.height/(410/280))}px;
  }
`;
const ProductImage = styled.img`
  width: 100%;
  height: 100%;
`;


const Designer = styled.span`
font-family:'Pretendard Variable';
  color: #121212;
  font-size: 22px;
  margin-bottom:10px;
  line-height:1;
  font-weight: 450;
  text-align: left;
  @media only screen and (max-width: 1440px) {
    font-size: 16px;
  }
  @media only screen and (max-width: 768px) {
    font-weight: 360;
    font-size: 11px;
  }
`;

const ProductName = styled(Designer)`
font-family:'Pretendard Variable';
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
  justify-content: space-between;
  align-items: ${(props) => (props.showType === 1 ? 'center' : 'flex-start')};
  flex-direction: ${(props) => (props.showType === 1 ? 'row' : 'column')};
`;

const TextWrap = styled(RowWrap)<{ showType?: 1 | 2 }>`
  padding: 40px 50px;
  flex-direction: ${(props) => (props.showType === 1 ? 'row' : 'column')};
  align-items: flex-start;
  @media only screen and (max-width: 1440px) {
    padding: 30px 30px;
  }
  @media only screen and (max-width: 768px) {
    padding: 20px 20px 32.5px;
  }
`;

const ProductNameWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

export default FairCard;
