import React,{useState,useEffect} from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import likeOnImage from '../../asset/image/heart_on.png';
import likeOffImage from '../../asset/image/heart_off.png';
import newIconImage from '../../asset/image/ico_new.png';
import { replaceString } from '../../util/Price';
import { ImageItem } from '../../page/user/MobileProfile';

function ImageCard({
  item,
  index,
  onClick,
  // onClickLike,
  isLikeList,
}: {
  item: ImageItem;
  index: number;
  onClick: (e: any) => void;
  // onClickLike: (e: any) => void;
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
    <ProductBox index={(index + 1)} onClick={onClick} height={innerWidth}>
      <ProductImage src={item.image[0].file_name} />
    </ProductBox>
  );
}

const ProductBox = styled.div<{ index:number; height:number}>`
  width: calc(25% - 10px);
  aspect-ratio: 1;
  cursor: pointer;
  overflow: hidden;
  margin-bottom: 30px;
  margin-right: ${(props) => ((props.index) % 4 === 0 ? 0:10)}px;
  @media only screen and (max-width: 1440px) {
    /* width: 24.25%; */
    margin-bottom: 10px;
    margin-right: ${(props) => ((props.index) % 3 === 0 ? 0:5)}px;
    width: calc(33.3333% - 5px)
  }
  @media only screen and (max-width: 768px) {
    margin-bottom: 2px;
    width: calc(50% - 1px);
    margin-right: ${(props) => ((props.index) % 2 === 0 ? 0:2)}px;
    height:${props => (props.height/2-1)}px;
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
  color: #121212;
  font-size: 12px;
  font-weight: 410;
  text-align: left;
  @media only screen and (max-width: 768px) {
    font-size: 11px;
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
  justify-content: space-between;
  align-items: ${(props) => (props.showType === 1 ? 'center' : 'flex-start')};
  flex-direction: ${(props) => (props.showType === 1 ? 'row' : 'column')};
`;

const TextWrap = styled(RowWrap)<{ showType?: 1 | 2 }>`
  padding: 0 10px;
  flex-direction: ${(props) => (props.showType === 1 ? 'row' : 'column')};
  align-items: flex-start;
`;

const ProductNameWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

export default ImageCard;
