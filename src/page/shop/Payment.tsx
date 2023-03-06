import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { APIOrder } from '../../api/ShopAPI';

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const propsData = location.state;

  const insertPaymentInfo = async (rsp: any) => {
    const data = {
      payment: propsData.orderInfo.payment,
      idxs: propsData.orderInfo.idxs,
      price: propsData.orderInfo.price,
      delivery: propsData.orderInfo.delivery,
      imp: rsp.imp_uid,
      recipient: propsData.orderInfo.recipient,
      hp: propsData.orderInfo.hp,
      zipcode: propsData.orderInfo.zipcode,
      address1: propsData.orderInfo.address1,
      address2: propsData.orderInfo.address2,
      memo: propsData.orderInfo.memo,
    };
    try {
      const res = await APIOrder(data);
      navigate('/ordercompleted', { state: { paymentInfo: res }, replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  function requestPay() {
    const IMP = window.IMP;
    IMP.init('imp33306030');
    IMP.request_pay(
      {
        //pg: 'html5_inicis.INIpayTest',
        pg: 'html5_inicis',
        pay_method: propsData.orderInfo.payment,
        merchant_uid: propsData.uid,
        name: propsData.orderInfo.name,
        amount: propsData.orderInfo.price + propsData.orderInfo.delivery,
        buyer_name: propsData.orderInfo.recipient,
        buyer_tel: propsData.orderInfo.hp,
        buyer_addr: propsData.orderInfo.address1 + ' ' + propsData.orderInfo.address2,
        buyer_postcode: propsData.orderInfo.zipcode,
        buyer_email: '',
        m_redirect_url: 'https://fredi.co.kr/ordercompleted-mobile',
      },
      function (rsp: any) {
        if (rsp.success) {
          console.log('결제 성공', rsp);
          insertPaymentInfo(rsp);
        } else {
          console.log('결제 실패', rsp);
          navigate('/cart', { replace: true });
          // alert(`결제 실패: ${rsp.error_msg}`);
        }
      }
    );
  }

  const iosPostMessage = useCallback((e: any) => {
    window.ReactNativeWebView.postMessage(JSON.stringify(e));
    const response = JSON.parse(e.data);
    // alert(response.action);
    if (response.action === 'complete') {
      insertPaymentInfo(response);
    } else {
      navigate('/cart', { replace: true });
    }
  }, []);

  const androidPostMessage = useCallback((e: any) => {
    if (document) {
      window.ReactNativeWebView.postMessage(JSON.stringify(e));
      const response = JSON.parse(e.data);
      // alert(response.action);
      if (response.action === 'complete') {
        insertPaymentInfo(response);
      } else {
        navigate('/cart', { replace: true });
      }
    }
  }, []);

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    if (userAgent === 'APP-android') {
      const message = document.addEventListener('message', androidPostMessage);
      window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'payment', pg: 'html5_inicis.INIpayTest', ...propsData }));
    } else if (userAgent === 'APP-ios') {
      const message = window.addEventListener('message', iosPostMessage);
      window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'payment', pg: 'html5_inicis.INIpayTest', ...propsData }));
    } else {
      requestPay();
    }

    return () => {
      if (userAgent === 'APP-android') {
        document.removeEventListener('message', androidPostMessage);
      }
      if (userAgent === 'APP-ios') {
        window.removeEventListener('message', iosPostMessage);
      }
    };
  }, []);

  return (
    <Container>
      <LeftBox>
        <LeftTopBox>
          <Title>결제하기</Title>
        </LeftTopBox>
      </LeftBox>
      <RightBox>
        <Text>결제 진행 중...</Text>
      </RightBox>
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
  font-family: 'NotoSans';
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

const Text = styled.p`
  font-family: 'NotoSans';
  font-weight: 500;
  color: #121212;
  font-size: 15px;
  margin-top: 50px;
`;

export default Payment;
