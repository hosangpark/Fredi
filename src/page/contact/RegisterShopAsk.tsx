import React, { useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import AlertModal from '../../components/Modal/AlertModal';
import { Select } from '@mantine/core';
import arrDownImage from '../../asset/image/arr_down.png';
import { APIRegisterShopAsk } from '../../api/AskAPI';

const CATEGORY_ASK = [
  { value: 'product', label: '제품 문의' },
  { value: 'pay', label: '결제 문의' },
  { value: 'delivery', label: '배송 문의' },
  { value: 'cs', label: 'CS 문의' },
];

function RegisterShopAsk() {
  const location = useLocation();
  const { idx, name, designer } = location.state;
  const navigate = useNavigate();
  const [content, setContent] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [category, setCategory] = useState<string | null>('product');

  const onRegisterAsk = async () => {
    if (!content) return setShowContentModal(true);
    const data = {
      idx: idx,
      category: category,
      question: content,
    };
    try {
      const res = await APIRegisterShopAsk(data);
      console.log(res);
      setShowModal(true);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  return (
    <>
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
          data={CATEGORY_ASK}
          onChange={setCategory}
        />
      </InputRowWrap>

      <ContentInputRowWrap>
        <LeftText>내용</LeftText>
        <ContentTextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="비방글, 욕설 등 부적절한 내용이 포함된 글은 임의로 삭제될 수 있습니다."
        />
      </ContentInputRowWrap>
      <ButtonWrap>
        <BlackButton onClick={onRegisterAsk}>
          <BlackButtonText>등록</BlackButtonText>
        </BlackButton>
        <WhiteButton onClick={() => navigate(-1)}>
          <WhiteButtonText>취소</WhiteButtonText>
        </WhiteButton>
      </ButtonWrap>
      <AlertModal
        visible={showModal}
        setVisible={setShowModal}
        onClick={() => {
          setShowModal(false);
          navigate(-1);
        }}
        text="1:1 문의가 등록되었습니다."
      />
      <AlertModal
        visible={showContentModal}
        setVisible={setShowContentModal}
        onClick={() => {
          setShowContentModal(false);
        }}
        text="내용을 입력해 주세요."
      />
    </>
  );
}

const InputRowWrap = styled.div`
  display: flex;
  border-bottom: 1px solid #121212;
  height: 80px;
  @media only screen and (max-width: 1000px) {
    height: 50px;
  }
`;

const ContentInputRowWrap = styled(InputRowWrap)`
  height: 465px;
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
  font-weight: 410;
  line-height: 60px;
  cursor: pointer;
  @media only screen and (max-width: 1000px) {
    font-size: 13px;
    line-height: 40px;
  }
`;

const WhiteButton = styled(BlackButton)`
  background-color: #ffffff;
  margin-left: 10px;
`;

const WhiteButtonText = styled(BlackButtonText)`
  color: #121212;
`;

const TextInput = styled.input`
  display: flex;
  flex: 1;
  height: 100%;
  border: 0;
  padding-left: 20px;
  font-size: 16px;
  font-weight: 410;
  color: #121212;
  outline: 0;
  @media only screen and (max-width: 1000px) {
    font-size: 13px;
    min-width: 220px;
  }
`;

const DownIcon = styled.img`
  width: 14px;
  height: 14px;
  cursor: pointer;
`;

const RightText = styled.span`
  display: flex;
  flex: 1;
  height: 100%;
  border: 0;
  padding-left: 20px;
  font-size: 16px;
  font-weight: 410;
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
  font-weight: 410;
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

export default RegisterShopAsk;
