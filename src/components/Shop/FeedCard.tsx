import React from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import viewImage from '../../asset/image/eyeview.png';
import newIconImage from '../../asset/image/ico_new.png';
import { replaceString } from '../../util/Price';
import { FairListItem } from '../../types/Types';

function FeedCard({
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
  return (
    <ProductBox showType={showType} isLast={(index + 1) % 4 === 0} onClick={onClick}>
      <ProductImageWrap>
        <ProductImage src={item.image[0].file_name} />
        <ViewCount>
          <ViewImg src={viewImage} />
          <SpanCount>
            {item.image[0].count}
          </SpanCount>
        </ViewCount>
      </ProductImageWrap>
      {/* {dayjs().diff(dayjs(item.created_time), 'day') < 14 && <NewIcon src={newIconImage} />} */}
    </ProductBox>
  );
}

const ProductBox = styled.div<{ isLast: boolean; showType: 1 | 2 }>`
  position: relative;
  display: column;
  width: 16.5%;
  margin-bottom: 1%;
  cursor: pointer;
  overflow: hidden;
  @media only screen and (max-width: 1440px) {
    width: 24.25%;
  }
  @media only screen and (max-width: 768px) {
    width: calc(50% - 2px);
    margin-bottom: 0px;
  }
`;
const ProductImageWrap = styled.div`
  width: 100%;
  aspect-ratio: 1.0;
  overflow: hidden;
  position: relative;
`;
const ProductImage = styled.img`
  width: 100%;
  height: 100%;
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
  color: #121212;
  font-size: 12px;
  font-weight: 500;
  margin-left:5px;
  @media only screen and (max-width: 768px) {
    font-size: 10px;
  }
`;

const ViewImg = styled.img`
  width: 13px;
  object-fit:contain;
  margin-top:3px;
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

export default FeedCard;
