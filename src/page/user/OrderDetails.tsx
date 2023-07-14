import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { APIOrderDetails } from '../../api/ShopAPI';
import dayjs from 'dayjs';
import { replaceString } from '../../util/Price';
import OrderDetailsCard, { TOrderDetailsCard } from '../../components/Shop/OrderDetailsCard';
import CheckBox from '../../components/Shop/CheckBox';
import { isTemplateSpan } from 'typescript';
import { IconTent } from '@tabler/icons';
import { APICancelOrder } from '../../api/ShopAPI';
import AlertModal from '../../components/Modal/AlertModal';

type TOrderDetails = {
  address1: string;
  address2: string;
  carts: TOrderDetailsCard[];
  code: string;
  idx: number;
  delivery: number;
  memo: string;
  recipient: string;
  hp: string;
  payment: 'card' | 'vbank' | 'trans';
  price: number;
  vbankDate: Date | null;
  vbankName: string | null;
  vbankNum: string | null;
  zipcode: string;
};

function OrderDetails() {
  const navigate = useNavigate();
  const { idx } = useParams();

  const [orderDetails, setOrderDetails] = useState<TOrderDetails>();
  const [optionDetails, setOptionDetails] = useState<any>();
  const [allCheck, setAllCheck] = useState(false);
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [message, setMessage] = useState('');

  const getOrderDetails = async () => {
    const data = {
      idx: idx,
    };
    try {
      const array = new Array();
      const res = await APIOrderDetails(data);
      console.log('주문상세', res);
      setOrderDetails(res);

      //카트 정보만 따로 담음 (체크상태 받기 위해서)
      res.carts.map((data:any) => {
        console.log('data => ', data);
        //checked 상태값이 있는지 체크 (기존에 체크를 했었을 때)
        data.checked = false;
        if(data.state === '입금대기' || data.state === '결제완료'){
          data.disabled = false;
        } else {
          data.disabled = true;
        }
        array.push(data);
      });
      setOptionDetails(array);
      console.log('array', array);
    } catch (error) {
      console.log(error);
      navigate('/signin', { replace: true });
    }
  };

  useEffect(() => {
    getOrderDetails();
  }, []);

  useEffect(() => {
    console.log('optionsDetail .', optionDetails);
  }, [optionDetails, allCheck]);


  const allChangeBox = useCallback((type:any) => {
    console.log(optionDetails);
    console.log('allCheck', type);
    optionDetails.map((data:any) => {
      if(!data.disabled){
        console.log('fff');
        //체크 변환 가능 상품 : 입금대기 | 결제완료 상태일 때
        if(type){
          //전체 선택 상품일 때
          data.checked = true;
        } else {
          data.checked = false;
        }
      }
    });
    console.log('allChangeBox OptionDetails => ', optionDetails);
    return optionDetails;
  }, [optionDetails]);

  const onPressCancleOption = async() => {
    console.log('fdskl');
    const array = new Array();
    optionDetails.map((data:any) => {
      if(data.checked === true){
        array.push(data.idx);
      }
    });
    if(array.length <= 0){
      setModal2(true);
      setMessage('취소할 상품을 선택해주세요');
      return false;
    }
    console.log('array ', array);
      const data = {
      order_idx: orderDetails?.idx,
      cart_idx: array,
    };
    try {
      setModal(true);
      const res = await APICancelOrder(data);
      console.log('res', res);
      setMessage(res);

    } catch (error) {
      console.log(error);
    }
  };


  return (
    <Container>
      <LeftBox>
        <LeftTopBox>
          <Title>주문 상세</Title>
        </LeftTopBox>
      </LeftBox>
      <RightBox>
        {orderDetails && (
          <>
            <SubTitleBoxMain>
              <div>
              <CheckBox checked={allCheck} onClick={() => {setAllCheck(allCheck ? false : true); allChangeBox(allCheck ? false : true);}} />
              <SubTitleText> 주문 정보</SubTitleText>
              </div>
              <WhiteButton onClick={()=>onPressCancleOption()}><WhiteButtonText>주문 취소</WhiteButtonText></WhiteButton>
            </SubTitleBoxMain>
            <CartCardWrap>
              {optionDetails.map((item:TOrderDetailsCard) => 
              (
                <OrderDetailsCard item={item} select={() => {
                  console.log('feafe');
                  item.checked === false ? item.checked = true : item.checked = false;
                  console.log(optionDetails);
                }}/>
              )
              )}
            </CartCardWrap>
            <SubTitleBox>
              <SubTitleText>수령인 정보</SubTitleText>
            </SubTitleBox>
            <ContentBox>
              <ContentTextRowWrap>
                <ContentLeftText>이름</ContentLeftText>
                <ContentRightText>{orderDetails?.recipient}</ContentRightText>
              </ContentTextRowWrap>
              <ContentTextRowWrap last>
                <ContentLeftText>휴대폰번호</ContentLeftText>
                <ContentRightText>{orderDetails?.hp}</ContentRightText>
              </ContentTextRowWrap>
            </ContentBox>
            <SubTitleBox>
              <SubTitleText>배송 정보</SubTitleText>
            </SubTitleBox>
            <ContentBox>
              <ContentTextRowWrap>
                <ContentLeftText>배송지</ContentLeftText>
                <ContentRightText>{orderDetails?.address1 + ' ' + orderDetails?.address2}</ContentRightText>
              </ContentTextRowWrap>
              <ContentTextRowWrap last>
                <ContentLeftText>배송 메모</ContentLeftText>
                <ContentRightText>{orderDetails?.memo ? orderDetails.memo : '-'}</ContentRightText>
              </ContentTextRowWrap>
            </ContentBox>
            <SubTitleBox>
              <SubTitleText>결제 정보</SubTitleText>
            </SubTitleBox>
            <ContentBox>
              <ContentTextRowWrap last={orderDetails?.payment === 'vbank' ? false : true}>
                <ContentLeftText>결제 수단</ContentLeftText>
                <ContentRightText>
                  {orderDetails?.payment === 'vbank' ? '무통장입금' : orderDetails?.payment === 'card' ? '카드결제' : '계좌이체'}
                </ContentRightText>
              </ContentTextRowWrap>
              {orderDetails?.payment === 'vbank' && (
                <>
                  <ContentTextRowWrap>
                    <ContentLeftText>입금 기한</ContentLeftText>
                    <ContentRightText>{dayjs(orderDetails.vbankDate).format('YYYY-MM-DD')}</ContentRightText>
                  </ContentTextRowWrap>
                  <ContentTextRowWrap last>
                    <ContentLeftText>입금 은행/계좌</ContentLeftText>
                    <ContentRightText>
                      {orderDetails.vbankName} / {orderDetails.vbankNum}
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
                    <RightText>{orderDetails && replaceString(orderDetails?.price)} 원</RightText>
                  </TextRowWrap>
                  <TextRowWrap>
                    <LeftText>배송비</LeftText>
                    <RightText>{orderDetails && replaceString(orderDetails?.delivery)} 원</RightText>
                  </TextRowWrap>
                </OrderInfoTopBox>
                <OrderInfoBottomBox>
                  <TextRowWrap>
                    <LeftText>최종 결제 금액</LeftText>
                    <RightText>{orderDetails && replaceString(orderDetails?.price + orderDetails?.delivery)} 원</RightText>
                  </TextRowWrap>
                </OrderInfoBottomBox>
              </OrderInfoBox>
            </ContentBox>
          </>
        )}
      </RightBox>
      <SideBox />
      <EmptyBox />
      <AlertModal
        visible={modal}
        setVisible={setModal}
        onClick={() => {
          setModal(false);
          window.location.reload();
        }}
        text={message}
      />
      <AlertModal
        visible={modal2}
        setVisible={setModal2}
        onClick={() => {
          setModal2(false);
        }}
        text={message}
      />
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
  padding: 10px 0;
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

const CartCardWrap = styled.div``;

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

const SubTitleBoxMain = styled.div`
  height: 65px;
  border-bottom: 1px solid #121212;
  display: flex;
  align-items: center;
  padding-left: 20px;
  justify-content: space-between;
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

const WhiteButton = styled.div`
  width: 95px;
  height: 35px;
  border: 1px solid #121212;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    width: 85px;
    height: 33px;
    margin-right: 5px;
    margin-bottom: 5px;
  }
`;

const WhiteButtonText = styled.span`
  font-family:'Pretendard Variable';;
  color: #121212;
  font-size: 12px;
  @media only screen and (max-width: 768px) {
    font-size: 11px;
  }
`;


export default OrderDetails;
