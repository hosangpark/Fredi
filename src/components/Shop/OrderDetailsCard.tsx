import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TImage } from '../../page/admin/ProducerList';
import { replaceString } from '../../util/Price';
import CheckBox from '../../components/Shop/CheckBox';
import CheckBoxs from '../../components/Shop/CheckBoxs';
import AlertModal from '../../components/Modal/AlertModal';

export type TOrderDetailsCard = {
  idx: number;
  amount: number;
  code: string;
  color: string;
  option: string;
  name: string;
  designer: string;
  price: number;
  logisticsCompany: string | null;
  logisticsNum: string | null;
  state:
    | '입금대기'
    | '결제완료'
    | '주문취소'
    | '주문거부'
    | '배송준비중'
    | '배송중'
    | '배송완료'
    | '구매확정'
    | '교환요청'
    | '반품요청'
    | '교환승인'
    | '반품승인'
    | '교환완료'
    | '반품완료'
    | '교환거부'
    | '반품거부'
    | '교환중';
  image: TImage[];
  checked: boolean;
  disabled: boolean; // 입금대기 | 결제완료 상태일 때는 체크박스 활성화 , 이외 비활성화
};

interface Props {
  item: TOrderDetailsCard;
  select: () => void;
}

function OrderDetailsCard({ item, select }: Props) {
  const [selected, setSelected] = useState(item.checked);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    console.log('item.checked', item.checked);
  }, [item.checked]);

  return (
    <OrderCardWrap>
      {!item.disabled && (
        <CheckBox checked={item.checked} onClick={() => {
          setSelected(selected ? false : true);
          select();
        }} />
      )}
      {item.disabled && (
        <CheckBoxs checked={selected} onClick={() => {setVisible(true)}} />
      )}
      <CartItemImage src={item.image[0].file_name} />
      <SpaceWrap>
        <CartItemTitleWrap>
          <CartItemAuthor>[{item.designer} 디자이너] </CartItemAuthor>
          <CartItemTitle> {item.name}</CartItemTitle>
        </CartItemTitleWrap>
        <AmountText>
          옵션 {item.option} {item.amount}개
        </AmountText>
        <PriceText>{replaceString(item.price)} 원</PriceText>
        <StatusWrap>
          <Status color={item.color}> {item.state}</Status>
          {(item.state === '배송중' || item.state === '배송완료' || item.state === '교환중') && (
            <DeliveryInfo>
              {' '}
              {item.logisticsCompany} ({item.logisticsNum})
            </DeliveryInfo>
          )}
        </StatusWrap>
      </SpaceWrap>
      <AlertModal
          visible={visible}
          setVisible={setVisible}
          onClick={() => {
            setVisible(false);
          }}
          text="주문 취소를 할 수 없는 상품입니다."
        />
    </OrderCardWrap>
  );
}

const OrderCardWrap = styled.div`
  position: relative;
  align-items: center;
  padding: 25px 20px;
  border-bottom: 1px solid #121212;
  display: flex;
  flex-direction: row;
  @media only screen and (max-width: 768px) {
    padding: 20px 20px;
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
  font-weight: 500;
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
  font-weight: 500;
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
  font-weight: 600;
  @media only screen and (max-width: 768px) {
    font-size: 13px;
    margin-right: 0;
  }
`;

const StatusWrap = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
  @media only screen and (max-width: 768px) {
    /* flex-direction: column;
    align-items: flex-start; */
  }
`;

const Status = styled(CartItemAuthor)<{ color?: string }>`
  color: ${(props) => props.color};
  font-size: 14px;
  margin-right: 13px;
  @media only screen and (max-width: 768px) {
    font-size: 11px;
    margin-right: 8px;
  }
`;

const DeliveryInfo = styled(Status)`
  color: #121212;
`;

export default OrderDetailsCard;
