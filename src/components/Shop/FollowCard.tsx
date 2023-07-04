import React,{useState,useEffect} from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import viewImage from '../../asset/image/eyeview.png';
import newIconImage from '../../asset/image/ico_new.png';
import { replaceString } from '../../util/Price';
import { FairListItem } from '../../types/Types';

function FollowCard({
  item,
  onClick,
  index
}: {
  item: FairListItem;
  onClick: (e: any) => void;
  index:number;
}) {
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", resizeListener);
  }, [innerWidth]);

  return (
    <ProductBox onClick={onClick} index={index+1} height={innerWidth}>
      <ProductImage src={item.image[0].file_name} />
      <ViewCount>
        <ViewImg src={viewImage} />
        <SpanCount>
          {item.image[0].count? item.image[0].count : 41}
        </SpanCount>
      </ViewCount>
    </ProductBox>
  );
}

const ProductBox = styled.div<{index:number,height:number}>`
  position: relative;
  display: column;
  width: calc(25% - 7.5px);
  aspect-ratio:1;
  margin-bottom: 10px;
  cursor: pointer;
  overflow: hidden;
  margin-right:${props=>props.index % 4 === 0 ? 0:10}px;
  @media only screen and (max-width: 768px) {
    width: calc(33.333% - 2px);
    height:${props => (props.height/3-2)}px;
    margin-right:${props=>props.index % 3 === 0 ? 0:2}px;
    margin-bottom: 0px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height:100%;
  /* &:hover {
    transform: scale(1.1);
  }
  transition: all 0.5s ease; */
  `;

const ViewCount = styled.div`
  display:flex;
  position: absolute;
  right: 15px;
  bottom: 15px;
  align-items:center;
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
const SpanCount = styled.span`
font-family:'Pretendard Variable';
mix-blend-mode: difference;
  color: #ffffff;
  font-size: 12px;
  font-weight: 200;
  margin-left:5px;
  @media only screen and (max-width: 768px) {
    font-size: 10px;
  }
`;

const ViewImg = styled.img`
  width: 13px;
  object-fit:contain;
  /* mix-blend-mode: difference; */
  /* background: #ffffff; */
  margin-top:0px;
  @media only screen and (max-width: 768px) {
    width: 12px;
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

export default FollowCard;