import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import OrderCard from '../../components/Shop/OrderCard';
import { replaceString } from '../../util/Price';
import dayjs from 'dayjs';
import { APIOrderMobile } from '../../api/ShopAPI';
import { TPaymentInfo } from './OrderCompleted';
import { useNavigate } from 'react-router-dom';

function OrderCompletedMobile() {
  const navigate = useNavigate();
  const [paymentInfo, setPaymentInfo] = useState<TPaymentInfo>();

  const onOrderMobile = async (merchant_uid: string) => {
    const data = {
      merchant_uid: merchant_uid,
    };
    try {
      const res = await APIOrderMobile(data);
      // alert(res);
      setPaymentInfo(res);
    } catch (error) {
      console.log(error);
      // alert('모바일결제에러' + error);
      navigate('/cart', { replace: true });
    }
  };

  useEffect(() => {
    const merchant_uid = new URLSearchParams(window.location.search).get('merchant_uid');
    if (merchant_uid) {
      onOrderMobile(merchant_uid);
    }
  }, []);

  return (
    <Container>
      <LeftBox>
        <LeftTopBox>
          <Title>주문완료</Title>
        </LeftTopBox>
      </LeftBox>
      <RightBox>
        {paymentInfo && (
          <>
            <SubTitleBox>
              <SubTitleText>주문 정보</SubTitleText>
            </SubTitleBox>
            <CartCardWrap>
              {paymentInfo.carts.map((item) => (
                <OrderCard cartItem={item} />
              ))}
            </CartCardWrap>
            <SubTitleBox>
              <SubTitleText>수령인 정보</SubTitleText>
            </SubTitleBox>
            <ContentBox>
              <ContentTextRowWrap>
                <ContentLeftText>이름</ContentLeftText>
                <ContentRightText>{paymentInfo.recipient}</ContentRightText>
              </ContentTextRowWrap>
              <ContentTextRowWrap last>
                <ContentLeftText>휴대폰번호</ContentLeftText>
                <ContentRightText>{paymentInfo.hp}</ContentRightText>
              </ContentTextRowWrap>
            </ContentBox>
            <SubTitleBox>
              <SubTitleText>배송 정보</SubTitleText>
            </SubTitleBox>
            <ContentBox>
              <ContentTextRowWrap>
                <ContentLeftText>배송지</ContentLeftText>
                <ContentRightText>{paymentInfo.address1 + ' ' + paymentInfo.address2}</ContentRightText>
              </ContentTextRowWrap>
              <ContentTextRowWrap last>
                <ContentLeftText>배송 메모</ContentLeftText>
                <ContentRightText>{paymentInfo.memo ? paymentInfo.memo : '-'}</ContentRightText>
              </ContentTextRowWrap>
            </ContentBox>
            <SubTitleBox>
              <SubTitleText>결제 정보</SubTitleText>
            </SubTitleBox>
            <ContentBox>
              <ContentTextRowWrap>
                <ContentLeftText>결제 수단</ContentLeftText>
                <ContentRightText>
                  {paymentInfo.payment === 'vbank' ? '무통장입금' : paymentInfo.payment === 'card' ? '카드결제' : '계좌이체'}
                </ContentRightText>
              </ContentTextRowWrap>
              {paymentInfo.payment === 'vbank' && (
                <>
                  <ContentTextRowWrap>
                    <ContentLeftText>입금 기한</ContentLeftText>
                    <ContentRightText>{dayjs(paymentInfo.vbankDate).format('YYYY-MM-DD')}</ContentRightText>
                  </ContentTextRowWrap>
                  <ContentTextRowWrap last>
                    <ContentLeftText>입금 은행/계좌</ContentLeftText>
                    <ContentRightText>
                      {paymentInfo.vbankName} / {paymentInfo.vbankNum}
                    </ContentRightText>
                  </ContentTextRowWrap>
                </>
              )}
            </ContentBox>
            <SubTitleBox>
              <SubTitleText>최종 결제 정보</SubTitleText>
            </SubTitleBox>
            <ContentBox last>
              <OrderInfoBox>
                <OrderInfoTopBox>
                  <TextRowWrap>
                    <LeftText>상품 금액</LeftText>
                    <RightText>{replaceString(paymentInfo.price)} 원</RightText>
                  </TextRowWrap>
                  <TextRowWrap>
                    <LeftText>배송비</LeftText>
                    <RightText>{replaceString(paymentInfo.delivery)} 원</RightText>
                  </TextRowWrap>
                </OrderInfoTopBox>
                <OrderInfoBottomBox>
                  <TextRowWrap>
                    <LeftText>최종 결제 금액</LeftText>
                    <RightText>{replaceString(paymentInfo.price + paymentInfo.delivery)} 원</RightText>
                  </TextRowWrap>
                </OrderInfoBottomBox>
              </OrderInfoBox>
            </ContentBox>
          </>
        )}
      </RightBox>
      <SideBox />
      <EmptyBox />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  min-height: calc(100vh - 80px);
  flex-direction: row;
  border-top: 1px solid #121212;
  background-color: #ffffff;
  @media only screen and (max-width: 1100px) {
    flex-direction: column;
    border-top: 0;
  }
`;

const LeftBox = styled.div`
  display: flex;
  min-width: 290px;
  width: 400px;
  flex-direction: column;
  text-align: left;
  border-right: 1px solid #121212;
  @media only screen and (max-width: 1600px) {
    width: 300px;
  }
  @media only screen and (max-width: 1400px) {
    display: none;
  }

  @media only screen and (max-width: 1100px) {
    display: flex;
    width: 100%;
    border-bottom: 1px solid #121212;
    border-right: 0;
  }
`;

const RightBox = styled.div`
  display: flex;
  flex: 1;
  min-width: 700px;
  flex-direction: column;
  @media only screen and (max-width: 1100px) {
    min-width: 300px;
  }
`;

const LeftTopBox = styled.div`
  width: 100%;
  padding: 10px 50px;
  @media only screen and (max-width: 1100px) {
    padding: 0 18px;
  }
`;

const Title = styled.h3`
  font-family:'Pretendard Variable';;
  font-weight: 700;
  color: #121212;
  font-size: 36px;
  @media only screen and (max-width: 1600px) {
    font-size: 32px;
  }
  @media only screen and (max-width: 1100px) {
    font-size: 22px;
  }
`;

const EmptyBox = styled.div`
  width: 280px;
  display: flex;
  border-left: 1px solid #121212;
`;

const SideBox = styled.div`
  width: 400px;
  display: flex;
  border-left: 1px solid #121212;
  flex-direction: column;
  text-align: left;
  @media only screen and (max-width: 1100px) {
    width: 100%;
    border-left: 0;
  }
`;

const OrderInfoBox = styled.div``;

const OrderInfoTopBox = styled.div`
  border-bottom: 1px solid #121212;
  @media only screen and (max-width: 768px) {
  }
`;

const OrderInfoBottomBox = styled.div`
  padding: 20px 0;
  @media only screen and (max-width: 768px) {
    padding: 20px 0 0px;
  }
`;

const TextRowWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 13px;
  @media only screen and (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const LeftText = styled.span`
  font-family:'Pretendard Variable';;
  color: #121212;
  font-size: 14px;
  font-weight: 410;
  width: 200px;
  @media only screen and (max-width: 1100px) {
  }
  @media only screen and (max-width: 768px) {
    font-size: 13px;
  }
`;

const RightText = styled.span`
  font-family:'Pretendard Variable';;
  font-weight: 510;
  font-size: 15px;
  @media only screen and (max-width: 1100px) {
  }
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const CartCardWrap = styled.div`
  /* padding: 0 30px; */
  @media only screen and (max-width: 768px) {
    /* padding: 0 20px; */
  }
`;

const SubTitleBox = styled.div`
  height: 65px;
  border-bottom: 1px solid #121212;
  display: flex;
  align-items: center;
  padding-left: 20px;
  @media only screen and (max-width: 768px) {
    height: 48px;
  }
`;

const SubTitleText = styled.span`
  font-size: 15px;
  font-weight: 510;
  color: #121212;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const ContentBox = styled.div<{ last?: boolean }>`
  width: 100%;
  padding: 30px 20px;
  border-bottom: ${(props) => (props.last ? 0 : '1px solid #121212')};
  text-align: left;
  @media only screen and (max-width: 768px) {
    padding: 18px 20px;
  }
`;

const ContentTextRowWrap = styled.div<{ last?: boolean }>`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${(props) => (props.last ? 0 : '7px')};
`;

const ContentLeftText = styled.span`
  font-family:'Pretendard Variable';;
  color: #121212;
  font-size: 14px;
  font-weight: 410;
  width: 100px;
  @media only screen and (max-width: 768px) {
    width: 80px;
    font-size: 12px;
  }
`;

const ContentRightText = styled.span`
  display: flex;
  flex: 1;
  font-family:'Pretendard Variable';;
  color: #121212;
  font-size: 14px;
  font-weight: 410;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

export default OrderCompletedMobile;
