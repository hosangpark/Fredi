import dayjs from 'dayjs';
import React, {useState} from 'react';
import styled from 'styled-components';
import { TOrderListItem } from '../../page/user/OrderList';
import AlertModal from '../../components/Modal/AlertModal';

interface Props {
  item: TOrderListItem;
  onClickOrderDetails: () => void;
  onClickConfirm: (idx: number) => void;
  onClickRequesCancellation: ({ idx, name, designer }: { idx: number; name: string; designer: string }) => void;
  onClickRequestRefund: ({ idx, name, designer }: { idx: number; name: string; designer: string }) => void;
  onClickRequesExchange: ({ idx, name, designer }: { idx: number; name: string; designer: string }) => void;
}

function OrderListCard({ item, onClickOrderDetails, onClickRequesCancellation, onClickRequestRefund, onClickRequesExchange, onClickConfirm }: Props) {
  const [modal, setModal] = useState(false);
  const [message, setMessage] = useState('');

  // const onPressIdx = async () => {
  //   const data = {
  //     order_idx: item.idx,
  //   };
  //   try {
  //     setModal(true);
  //     const res = await APICancelOrder(data);
  //     console.log('res', res);
  //     setMessage(res);

  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  return (
    <OrderCardWrap>
      <SubTitleBox onClick={onClickOrderDetails}>
        <Date>{dayjs(item.createdAt).format('YYYY.MM.DD.')}</Date>
        <OrderNumber> (주문번호: {item.code})</OrderNumber>
      </SubTitleBox>
      {item.carts.map((deepItem, index) => (
        <ContentBox last={item.carts.length === index + 1}>
          <RowWrap>
            <CartItemImage src={deepItem.sale_product.image[0].file_name} />
            <SpaceWrap>
              <CartItemTitleWrap>
                <CartItemAuthor>[{deepItem.sale_product.designer} 디자이너] </CartItemAuthor>
                <CartItemTitle> {deepItem.sale_product.name}</CartItemTitle>
                {/* <CartItemOption> {deepItem.option}</CartItemOption> */}
              </CartItemTitleWrap>
              <>
              <StatusWrap>
                <Status color={deepItem.color}> {deepItem.state}</Status>
                {(deepItem.state === '배송중' || deepItem.state === '배송완료' || deepItem.state === '교환중') && (
                  <DeliveryInfo>
                    {' '}
                    {deepItem.logisticsCompany} ({deepItem.logisticsNum})
                  </DeliveryInfo>
                )}
              </StatusWrap>
              <ButtonWrap>
                <WhiteButton onClick={onClickOrderDetails}>
                  <WhiteButtonText>Detail</WhiteButtonText>
                </WhiteButton>
                {deepItem.state === '결제완료' && (
                  <WhiteButton
                    onClick={() =>
                      onClickRequesCancellation({
                        idx: deepItem.idx,
                        name: deepItem.sale_product.name,
                        designer: deepItem.sale_product.designer,
                      })
                    }
                  >
                    <WhiteButtonText>주문취소</WhiteButtonText>
                  </WhiteButton>
                )}
                {deepItem.state === '배송완료' && (
                  <>
                    <WhiteButton onClick={() => onClickConfirm(deepItem.idx)}>
                      <WhiteButtonText>구매확정</WhiteButtonText>
                    </WhiteButton>
                    <WhiteButton
                      onClick={() =>
                        onClickRequestRefund({
                          idx: deepItem.idx,
                          name: deepItem.sale_product.name,
                          designer: deepItem.sale_product.designer,
                        })
                      }
                    >
                      <WhiteButtonText>반품요청</WhiteButtonText>
                    </WhiteButton>
                    <WhiteButton
                      onClick={() =>
                        onClickRequesExchange({
                          idx: deepItem.idx,
                          name: deepItem.sale_product.name,
                          designer: deepItem.sale_product.designer,
                        })
                      }
                    >
                      <WhiteButtonText>교환요청</WhiteButtonText>
                    </WhiteButton>
                  </>
                )}
              </ButtonWrap>
              </>
            </SpaceWrap>
          </RowWrap>
        </ContentBox>
      ))}
      <AlertModal
        visible={modal}
        setVisible={setModal}
        onClick={() => {
          setModal(false);
          window.location.reload();
        }}
        text={message}
      />
    </OrderCardWrap>
    
  );
}

const OrderCardWrap = styled.div`
  border-bottom: 1px solid #121212;
  display: flex;
  flex-direction: column;
`;

const ContentBox = styled.div<{ last: boolean }>`
  padding: 25px 10px;
  border-bottom: ${(props) => (props.last ? 0 : '1px solid #121212')};
  @media only screen and (max-width: 768px) {
    padding: 20px 10px;
  }
`;

const RowWrap = styled.div`
  display: flex;
  flex-direction: row;
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
  width: 120px;
  height: 120px;
  margin-left: 12px;
  margin-right: 20px;
  @media only screen and (max-width: 768px) {
    width: 110px;
    height: 110px;
    margin-right: 20px;
  }
`;

const CartItemTitle = styled.span`
  font-family:'Pretendard Variable';
  font-size: 15px;
  margin-left: 8px;
  font-weight: 500;
  @media only screen and (max-width: 768px) {
    margin-left: 0;
    font-size: 12px;
  }
`;

const CartItemAuthor = styled.span`
  font-family:'Pretendard Variable';
  font-size: 15px;
  color: #121212;
  font-weight: 500;
  @media only screen and (max-width: 768px) {
    font-size: 11px;
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

const SubTitleBox = styled.div`
  height: 65px;
  /* border-bottom: 1px solid #121212; */
  display: flex;
  align-items: center;
  padding-left: 20px;
  position: relative;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    height: 48px;
  }
`;

const Date = styled.span`
  font-family:'Pretendard Variable';
  font-size: 15px;
  font-weight: 700;
  color: #121212;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const OrderNumber = styled(Date)`
font-family:'Pretendard Variable';
  font-weight: 410;
  color: #777;
  margin-left: 5px;
  font-size:14px;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const ButtonWrap = styled.div`
  display: flex;
  align-items: center;
  margin-top: 15px;
  flex-wrap: wrap;
  @media only screen and (max-width: 768px) {
    /* margin-top: 8px; */
    margin-top: 0px;
  }
`;

const WhiteButton = styled.div`
  width: 95px;
  height: 35px;
  border: 1px solid #121212;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  margin-bottom: 5px;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    width: 85px;
    height: 33px;
    margin-right: 5px;
    margin-bottom: 3px;
  }
`;

const OrderButton = styled.div`
  width: 95px;
  height: 35px;
  border: 1px solid #121212;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  cursor: pointer;
  position: absolute;
  right: 0;
  @media only screen and (max-width: 768px) {
    width: 85px;
    height: 33px;
    margin-right: 5px;
    margin-bottom: 5px;
  }
`;

const WhiteButtonText = styled.span`
  font-family:'Pretendard Variable';
  color: #121212;
  font-size: 12px;
  @media only screen and (max-width: 768px) {
    font-size: 11px;
  }
`;

const CartItemOption = styled.span`
  font-family:'Pretendard Variable';
  font-size: 15px;
  margin-left: 8px;
  font-weight: 500;
  @media only screen and (max-width: 768px) {
    margin-left: 0;
    font-size: 12px;
  }
`;

export default OrderListCard;
