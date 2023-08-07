import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '@mantine/core';
import OrderListCard from '../../components/Shop/OrderListCard';
import { APIConfirm, APIOrderList } from '../../api/ShopAPI';
import { TImage } from '../../types/Types';
import ConfirmModal from '../../components/Modal/ConfirmModal';
import AlertModal from '../../components/Modal/AlertModal';

type TOrderListCartItem = {
  idx: number;
  option: string;
  amount: number;
  code: string;
  color: string;
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
  sale_product: {
    idx: number;
    name: string;
    designer: string;
    image: TImage[];
  };
};

export type TOrderListItem = {
  idx: number;
  option: string;
  code: string;
  carts: TOrderListCartItem[];
  createdAt: Date;
  vbankDate: string | null;
  vbankName: string | null;
  vbankNum: string | null;
};

function OrderList() {
  const navigate = useNavigate();
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [selectedIdx, setSelectedIdx] = useState<number>();

  const [orderList, setOrderList] = useState<TOrderListItem[]>([]);

  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [cancelVbankModal, setCancelVbankModal] = useState<boolean>(false);

  const onConfirm = async () => {
    if (!selectedIdx) return;
    const data = {
      idx: selectedIdx,
    };
    try {
      const res = await APIConfirm(data);
      console.log(res);
      getOrderList();
      setShowModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const getOrderList = async () => {
    const data = {
      page: page,
    };
    try {
      const { list, total } = await APIOrderList(data);
      setTotal(total);
      setOrderList(list);
      console.log('shop', list, page);
    } catch (error) {
      console.log(error);
      navigate('/signin', { replace: true });
    }
  };
  const date = new Date()
  useEffect(() => {
    // getOrderList();
    setOrderList([
      {
        idx: 1,
        option: 'ss',
        code: 'ss',
        carts: [{
          idx: 1,
          option: 'dssdd',
          amount: 2,
          code: 'ds',
          color: 'dsd',
          price: 3,
          logisticsCompany: 'ddsa',
          logisticsNum: 'dsada',
          state:
            '입금대기',
            // | '결제완료'
            // | '주문취소'
            // | '주문거부'
            // | '배송준비중'
            // | '배송중'
            // | '배송완료'
            // | '구매확정'
            // | '교환요청'
            // | '반품요청'
            // | '교환승인'
            // | '반품승인'
            // | '교환완료'
            // | '반품완료'
            // | '교환거부'
            // | '반품거부'
            // | '교환중',
          sale_product: {
            idx: 222,
            name: 'dadadada',
            designer: 'sdfsdfsdf',
            image: [
              {
                idx: 4444,
                file_name: '432423fd',
              }
            ]
          }
        }],
        createdAt: date,
        vbankDate: 'dd',
        vbankName: 'dd',
        vbankNum: 'dd'
      },
      {
        idx: 1,
        option: 'ss',
        code: 'ss',
        carts: [{
          idx: 1,
          option: 'dd',
          amount: 2,
          code: 'ds',
          color: 'dsd',
          price: 3,
          logisticsCompany: 'ddsa',
          logisticsNum: 'dsada',
          state:
            '입금대기',
            // | '결제완료'
            // | '주문취소'
            // | '주문거부'
            // | '배송준비중'
            // | '배송중'
            // | '배송완료'
            // | '구매확정'
            // | '교환요청'
            // | '반품요청'
            // | '교환승인'
            // | '반품승인'
            // | '교환완료'
            // | '반품완료'
            // | '교환거부'
            // | '반품거부'
            // | '교환중',
          sale_product: {
            idx: 222,
            name: 'dadadada',
            designer: 'sdfsdfsdf',
            image: [
              {
                idx: 4444,
                file_name: '432423fd',
              }
            ]
          }
        }],
        createdAt: date,
        vbankDate: 'dd',
        vbankName: 'dd',
        vbankNum: 'dd'
      },
      {
        idx: 1,
        option: 'ss',
        code: 'ss',
        carts: [{
          idx: 1,
          option: 'dd',
          amount: 2,
          code: 'ds',
          color: 'dsd',
          price: 3,
          logisticsCompany: 'ddsa',
          logisticsNum: 'dsada',
          state:
            '입금대기',
            // | '결제완료'
            // | '주문취소'
            // | '주문거부'
            // | '배송준비중'
            // | '배송중'
            // | '배송완료'
            // | '구매확정'
            // | '교환요청'
            // | '반품요청'
            // | '교환승인'
            // | '반품승인'
            // | '교환완료'
            // | '반품완료'
            // | '교환거부'
            // | '반품거부'
            // | '교환중',
          sale_product: {
            idx: 222,
            name: 'dadadada',
            designer: 'sdfsdfsdf',
            image: [
              {
                idx: 4444,
                file_name: '432423fd',
              }
            ]
          }
        }],
        createdAt: date,
        vbankDate: 'dd',
        vbankName: 'dd',
        vbankNum: 'dd'
      },
      {
        idx: 1,
        option: 'ss',
        code: 'ss',
        carts: [{
          idx: 1,
          option: 'dd',
          amount: 2,
          code: 'ds',
          color: 'dsd',
          price: 3,
          logisticsCompany: 'ddsa',
          logisticsNum: 'dsada',
          state:
            '입금대기',
            // | '결제완료'
            // | '주문취소'
            // | '주문거부'
            // | '배송준비중'
            // | '배송중'
            // | '배송완료'
            // | '구매확정'
            // | '교환요청'
            // | '반품요청'
            // | '교환승인'
            // | '반품승인'
            // | '교환완료'
            // | '반품완료'
            // | '교환거부'
            // | '반품거부'
            // | '교환중',
          sale_product: {
            idx: 222,
            name: 'dadadada',
            designer: 'sdfsdfsdf',
            image: [
              {
                idx: 4444,
                file_name: '432423fd',
              }
            ]
          }
        }],
        createdAt: date,
        vbankDate: 'dd',
        vbankName: 'dd',
        vbankNum: 'dd'
      },
      {
        idx: 1,
        option: 'ss',
        code: 'ss',
        carts: [{
          idx: 1,
          option: 'ddd',
          amount: 2,
          code: 'ds',
          color: 'dsd',
          price: 3,
          logisticsCompany: 'ddsa',
          logisticsNum: 'dsada',
          state:
            '입금대기',
            // | '결제완료'
            // | '주문취소'
            // | '주문거부'
            // | '배송준비중'
            // | '배송중'
            // | '배송완료'
            // | '구매확정'
            // | '교환요청'
            // | '반품요청'
            // | '교환승인'
            // | '반품승인'
            // | '교환완료'
            // | '반품완료'
            // | '교환거부'
            // | '반품거부'
            // | '교환중',
          sale_product: {
            idx: 222,
            name: 'dadadada',
            designer: 'sdfsdfsdf',
            image: [
              {
                idx: 4444,
                file_name: '432423fd',
              }
            ]
          }
        }],
        createdAt: date,
        vbankDate: 'dd',
        vbankName: 'dd',
        vbankNum: 'dd'
      },
    ])
  }, [page]);

  return (
    <Container>
      <LeftBox>
        <LeftTopBox>
          <Title>Order List</Title>
        </LeftTopBox>
      </LeftBox>
      <RightBox>
        {orderList.length > 0 ? (
          orderList.map((item) => (
            <OrderListCard
              key={item.idx}
              item={item}
              onClickConfirm={(idx) => {
                setSelectedIdx(idx);
                setConfirmModal(true);
              }}
              onClickOrderDetails={() => navigate(`/orderdetails/${item.idx}`)}
              onClickRequesCancellation={(itemInfo) => {
                console.log('무통장인가', item.vbankNum);
                if (item.vbankNum) {
                  setCancelVbankModal(true);
                } else {
                  navigate(`/request/cancellation/${itemInfo.idx}`, { state: itemInfo });
                }
              }}
              onClickRequestRefund={(itemInfo) => navigate(`/request/refund/${itemInfo.idx}`, { state: itemInfo })}
              onClickRequesExchange={(itemInfo) => navigate(`/request/exchange/${itemInfo.idx}`, { state: itemInfo })}
            />
          ))
        ) : (
          <EmptyText>주문 내역이 없습니다.</EmptyText>
        )}
        {orderList.length > 0 && (
          <Pagination
            page={page}
            total={Math.ceil(total / 10)}
            position="center"
            onChange={(number) => setPage(number)}
            styles={(theme) => ({
              item: {
                fontFamily: 'NotoSans',
                margin: '30px 0',
                border: 'none',
                color: '#ccc',
                fontSize: 13,
                '&[data-active]': {
                  backgroundColor: 'transparent',
                  color: '#121212',
                  fontWeight: 600,
                },
              },
            })}
          />
        )}
      </RightBox>
      <SideBox />
      <EmptyBox />
      <ConfirmModal
        visible={confirmModal}
        setVisible={setConfirmModal}
        text="구매확정 하시겠습니까?"
        onOk={() => {
          setConfirmModal(false);
          onConfirm();
        }}
      />
      <AlertModal
        visible={showModal}
        setVisible={setShowModal}
        onClick={() => {
          getOrderList();
          setShowModal(false);
        }}
        text="구매확정 처리되었습니다."
      />
      <AlertModal
        visible={cancelVbankModal}
        setVisible={setCancelVbankModal}
        onClick={() => {
          setCancelVbankModal(false);
        }}
        text="무통장입금 거래 시 환불은 고객센터로 문의해 주세요."
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
  @media only screen and (max-width: 768px) {
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
  padding: 0 20px;
  @media only screen and (max-width: 1100px) {
    width: 300px;
  }
  @media only screen and (max-width: 768px) {
    display: flex;
    width: 100%;
    /* border-bottom: 1px solid #121212; */
    border-right: 0;
  }
`;

const RightBox = styled.div`
  display: flex;
  flex: 1;
  min-width: 700px;
  flex-direction: column;
  @media only screen and (max-width: 768px) {
    min-width: 300px;
  }
`;

const LeftTopBox = styled.div`
  width: 100%;
  padding:20px 0;
  @media only screen and (max-width: 768px) {
    
    border-bottom:1px solid #C9C9C9;
  }
`;

const Title = styled.h3`
font-family:'Pretendard Variable';
  font-weight: 410;
  color: #121212;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
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
  @media only screen and (max-width: 768px) {
    width: 100%;
    border-left: 0;
  }
`;

const EmptyText = styled.span`
  font-family:'Pretendard Variable';;
  font-size: 14px;
  color: #121212;
  margin-top: 100px;
`;

export default OrderList;
