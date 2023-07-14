import React, { useState } from 'react';
import styled from 'styled-components';
import { TCartItem } from '../../page/shop/Cart';
import { replaceString } from '../../util/Price';
interface Props {
  cartItem: TCartItem;
}

function OrderCard({ cartItem }: Props) {
  return (
    <OrderCardWrap>
      <CartItemImage src={cartItem.image[0].file_name} />
      <SpaceWrap>
        <CartItemTitleWrap>
          <CartItemAuthor>[{cartItem.designer} 디자이너] </CartItemAuthor>
          <CartItemTitle> {cartItem.name}</CartItemTitle>
        </CartItemTitleWrap>
        <AmountText>{cartItem.amount}개</AmountText>
        <PriceText>{replaceString(cartItem.price)} 원</PriceText>
      </SpaceWrap>
    </OrderCardWrap>
  );
}

const OrderCardWrap = styled.div`
  position: relative;
  padding: 25px 10px;
  border-bottom: 1px solid #121212;
  display: flex;
  flex-direction: row;
  @media only screen and (max-width: 768px) {
    padding: 20px 10px;
  }
`;

const RowWrap = styled.div`
  display: flex;
  flex-direction: row;
`;

const CenterWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SpaceWrap = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  align-items: flex-start;
`;

const Div = styled.div``;

const CartItemTitleWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const CartItemImage = styled.img`
  width: 95px;
  height: 95px;
  margin-left: 12px;
  margin-right: 20px;
`;

const CartItemTitle = styled.span`
  font-family:'Pretendard Variable';;
  font-size: 15px;
  margin-left: 8px;
  font-weight: 410;
  @media only screen and (max-width: 768px) {
    margin-left: 0;
    font-size: 12px;
  }
`;

const DeleteButton = styled.div`
  margin-right: 5px;
  padding: 5px;
  cursor: pointer;
`;

const DeleteButtonMobile = styled(DeleteButton)`
  position: absolute;
  top: 10px;
  right: 0px;
  display: none;
  padding: 5px;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    display: block;
  }
`;

const DeleteButtonImage = styled.img`
  width: 17px;
  height: 17px;
  @media only screen and (max-width: 768px) {
    width: 14px;
    height: 14px;
  }
`;

const CartItemAuthor = styled.span`
  font-family:'Pretendard Variable';;
  font-size: 15px;
  color: #121212;
  font-weight: 410;
  @media only screen and (max-width: 768px) {
    font-size: 11px;
  }
`;

const AmountControllerWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  @media only screen and (max-width: 768px) {
    margin-top: 5px;
  }
`;

const AmountControllerBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 23px;
  border: 1px solid #e5e5e5;
  border-left: 0;
  border-right: 0;
`;

const AmountControllerButton = styled.div`
  display: flex;
  width: 23px;
  height: 23px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid #e5e5e5;
`;

const AmountControllerButtonImage = styled.img`
  width: 7px;
  height: 7px;
`;
const AmountControllerButtonImageMinus = styled(AmountControllerButtonImage)`
  height: auto;
`;

const AmountText = styled.span`
  font-family:'Pretendard Variable';;
  font-size: 13px;
  @media only screen and (max-width: 768px) {
    font-size: 11px;
  }
`;

const PriceWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const PriceWrapMobile = styled.div`
  display: none;
  flex-direction: row;
  align-items: center;
  @media only screen and (max-width: 768px) {
    display: flex;
    margin-top: 5px;
  }
`;

const PriceText = styled.span`
  font-family:'Pretendard Variable';;
  font-size: 16px;
  margin-right: 20px;
  font-weight: 510;
  @media only screen and (max-width: 768px) {
    font-size: 13px;
    margin-right: 0;
  }
`;

export default OrderCard;
