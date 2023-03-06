import React, { useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AlertModal from '../../components/Modal/AlertModal';
import { APICancel, APIExchange, APIRefund } from '../../api/ShopAPI';
import arrDownImage from '../../asset/image/arr_down.png';
import { Select } from '@mantine/core';

const CATEGORY_CANCELLATION = [
  { value: 'mistake', label: '주문 실수' },
  { value: 'mind', label: '단순 변심' },
  { value: 'delay', label: '배송 지연' },
  { value: 'service', label: '서비스 불만족' },
];

const CATEGORY_EXCHANGE = [
  { value: 'mistake', label: '주문 실수' },
  { value: 'mind', label: '단순 변심' },
  { value: 'defective', label: '파손 및 불량' },
  { value: 'delay', label: '오배송 및 지연' },
];

function Request() {
  const { type, idx } = useParams();
  const location = useLocation();
  const { name, designer } = location.state;
  console.log(type, idx);
  const navigate = useNavigate();
  const [content, setContent] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  // const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [category, setCategory] = useState<string | null>('mistake');

  const onCancel = async () => {
    // if (!content) return setShowAlertModal(true);
    const data = {
      idx: idx,
      reason: content,
      cagtegory: category,
    };
    try {
      const res = await APICancel(data);
      console.log(res);
      setShowModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const onRequestRefund = async () => {
    const data = {
      idx: idx,
      reason: content,
    };
    try {
      const res = await APIRefund(data);
      console.log(res);
      setShowModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const onRequestExchange = async () => {
    const data = {
      idx: idx,
      reason: content,
    };
    try {
      const res = await APIExchange(data);
      console.log(res);
      setShowModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <LeftBox>
        <LeftTopBox>
          <Title>{type === 'refund' ? '반품 요청' : type === 'exchange' ? '교환 요청' : type === 'cancellation' ? '주문 취소' : 'No Type'}</Title>
        </LeftTopBox>
      </LeftBox>
      <RightBox>
        <InputRowWrap>
          <LeftText>디자이너/상품명</LeftText>
          <RightText>{`${designer}/${name}`}</RightText>
        </InputRowWrap>
        <InputRowWrap>
          <LeftText>카테고리 선택</LeftText>
          <Select
            rightSection={<DownIcon src={arrDownImage} />}
            styles={(theme) => ({
              rightSection: { pointerEvents: 'none' },
              root: { width: '100%', display: 'flex', flex: 1, alignItems: 'center' },
              input: {
                paddingLeft: 20,
                width: '100%',
                display: 'flex',
                flex: 1,
                textAlign: 'left',
                fontSize: 16,
                '@media (max-width: 1000px)': { fontSize: 13 },
                '@media (max-width: 768px)': { fontSize: 12 },
                '@media (max-width: 450px)': { fontSize: 11 },
              },
              item: {
                fontSize: 16,
                '@media (max-width: 1000px)': { fontSize: 13 },
                '@media (max-width: 768px)': { fontSize: 12 },
                '@media (max-width: 450px)': { fontSize: 11 },
                '&[data-selected]': {
                  '&, &:hover': {
                    backgroundColor: '#121212',
                    color: '#fff',
                  },
                },
              },
            })}
            variant="unstyled"
            value={category}
            data={type === 'cancellation' ? CATEGORY_CANCELLATION : CATEGORY_EXCHANGE}
            onChange={setCategory}
          />
        </InputRowWrap>
        <ContentInputRowWrap>
          <LeftText>
            {type === 'refund' ? '반품 요청' : type === 'exchange' ? '교환 요청' : type === 'cancellation' ? '주문 취소' : 'No Type'} 사유
          </LeftText>
          <ContentTextArea value={content} onChange={(e) => setContent(e.target.value)} placeholder="사유를 입력해 주세요." />
        </ContentInputRowWrap>
        <ButtonWrap>
          <BlackButton
            onClick={type === 'refund' ? onRequestRefund : type === 'exchange' ? onRequestExchange : type === 'cancellation' ? onCancel : () => {}}
          >
            <BlackButtonText>
              {type === 'refund' ? '반품 요청' : type === 'exchange' ? '교환 요청' : type === 'cancellation' ? '주문 취소' : 'No Type'}
            </BlackButtonText>
          </BlackButton>
          <WhiteButton onClick={() => navigate(-1)}>
            <WhiteButtonText>뒤로</WhiteButtonText>
          </WhiteButton>
        </ButtonWrap>
      </RightBox>
      <EmptyBox />
      <AlertModal
        visible={showModal}
        setVisible={setShowModal}
        onClick={() => {
          setShowModal(false);
          navigate('/orderlist', { replace: true });
        }}
        text={`${
          type === 'refund' ? '반품 요청' : type === 'exchange' ? '교환 요청' : type === 'cancellation' ? '주문 취소' : 'No Type'
        } 처리되었습니다.`}
      />
      {/* <AlertModal
        visible={showAlertModal}
        setVisible={setShowAlertModal}
        onClick={() => {
          setShowAlertModal(false);
        }}
        text="사유를 입력해 주세요."
      /> */}
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
  @media only screen and (max-width: 1000px) {
    flex-direction: column;
    border-top: 0;
  }
`;

const RightBox = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  position: relative;
  @media only screen and (max-width: 1000px) {
    min-width: 300px;
  }
`;

const EmptyBox = styled.div`
  width: 280px;
  display: flex;
  border-left: 1px solid #121212;
  @media only screen and (max-width: 1600px) {
    display: none;
  }
`;

const LeftBox = styled.div`
  display: flex;
  min-width: 290px;
  width: 400px;
  flex-direction: column;
  text-align: left;
  border-right: 1px solid #121212;
  @media only screen and (max-width: 1400px) {
    width: 370px;
  }
  @media only screen and (max-width: 1000px) {
    width: 100%;
    border-right: 0;
  }
`;

const LeftTopBox = styled.div`
  width: 100%;
  padding: 10px 50px;
  @media only screen and (max-width: 1000px) {
    padding: 0 18px;
    border-bottom: 1px solid #121212;
  }
`;

const Title = styled.h3`
  font-weight: 700;
  color: #121212;
  font-size: 36px;
  @media only screen and (max-width: 1000px) {
    font-size: 22px;
  }
`;

const InputRowWrap = styled.div`
  display: flex;
  border-bottom: 1px solid #121212;
  height: 80px;
  @media only screen and (max-width: 1000px) {
    height: 50px;
  }
`;

const ContentInputRowWrap = styled(InputRowWrap)`
  height: 250px;
`;

const LeftText = styled.span`
  color: #121212;
  font-size: 17px;
  font-weight: 700;
  width: 300px;
  border-right: 1px solid #121212;
  display: inline-block;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  @media only screen and (max-width: 1000px) {
    width: 150px;
    min-width: 120px;
    font-size: 13px;
    text-align: left;
    padding: 0 18px;
    line-height: 50px;
  }
  @media only screen and (max-width: 450px) {
    width: 100px;
    font-size: 11px;
  }
`;

const ButtonWrap = styled.div`
  display: flex;
  align-self: flex-end;
  margin: 30px;
  @media only screen and (max-width: 1000px) {
    margin: 20px 20px 50px;
  }
`;

const BlackButton = styled.div`
  width: 160px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #121212;
  border: 1px solid #121212;
  cursor: pointer;
  @media only screen and (max-width: 1000px) {
    width: 100px;
    height: 40px;
  }
`;
const BlackButtonText = styled.span`
  color: #ffffff;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  @media only screen and (max-width: 1000px) {
    font-size: 13px;
  }
  @media only screen and (max-width: 450px) {
    font-size: 12px;
  }
`;

const WhiteButton = styled(BlackButton)`
  background-color: #ffffff;
  margin-left: 10px;
`;

const WhiteButtonText = styled(BlackButtonText)`
  color: #121212;
`;

const RightText = styled.span`
  display: flex;
  flex: 1;
  height: 100%;
  border: 0;
  padding-left: 20px;
  font-size: 16px;
  font-weight: 400;
  color: #121212;
  align-items: center;
  @media only screen and (max-width: 1000px) {
    font-size: 13px;
  }
  @media only screen and (max-width: 450px) {
    font-size: 11px;
  }
`;

const ContentTextArea = styled.textarea`
  display: flex;
  flex: 1;
  height: 100%;
  border: 0;
  padding: 20px;
  font-size: 16px;
  font-weight: 400;
  color: #121212;
  vertical-align: top;
  resize: none;
  outline: 0;
  @media only screen and (max-width: 1000px) {
    font-size: 13px;
    padding: 20px;
    line-height: 18px;
  }
  @media only screen and (max-width: 450px) {
    font-size: 11px;
  }
`;

const DownIcon = styled.img`
  width: 14px;
  height: 14px;
  cursor: pointer;
`;

export default Request;
