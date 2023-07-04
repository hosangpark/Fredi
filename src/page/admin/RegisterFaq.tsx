import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { APIRegisterFaq } from '../../api/FaqAPI';
import AlertModal from '../../components/Modal/AlertModal';

function RegisterFaq() {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);

  const onRegisterFaq = async () => {
    if (!title) return setShowTitleModal(true);
    if (!question) return setShowContentModal(true);
    if (!answer) return setShowContentModal(true);
    const data = {
      title: title,
      question: question,
      answer: answer,
    };
    try {
      const res = await APIRegisterFaq(data);
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
        <LeftText>제목</LeftText>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력해 주세요." />
      </InputRowWrap>
      <ContentInputRowWrap>
        <LeftText>질문 내용</LeftText>
        <ContentTextArea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="질문을 입력해 주세요." />
      </ContentInputRowWrap>
      <ContentInputRowWrap>
        <LeftText>답변 내용</LeftText>
        <ContentTextArea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="답변을 입력해 주세요." />
      </ContentInputRowWrap>
      <ButtonWrap>
        <BlackButton onClick={onRegisterFaq}>
          <BlackButtonText>등록</BlackButtonText>
        </BlackButton>
        <WhiteButton onClick={() => navigate(-1)}>
          <WhiteButtonText>목록</WhiteButtonText>
        </WhiteButton>
      </ButtonWrap>
      <AlertModal
        visible={showModal}
        setVisible={setShowModal}
        onClick={() => {
          setShowModal(false);
          navigate(-1);
        }}
        text="FAQ가 등록되었습니다."
      />
      <AlertModal
        visible={showTitleModal}
        setVisible={setShowTitleModal}
        onClick={() => {
          setShowTitleModal(false);
        }}
        text="제목을 입력해 주세요."
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
`;

const ContentInputRowWrap = styled(InputRowWrap)`
  height: 240px;
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
`;

const ButtonWrap = styled.div`
  display: flex;
  align-self: flex-end;
  margin: 30px;
`;

const BlackButton = styled.div`
  width: 160px;
  height: 60px;
  background-color: #121212;
  border: 1px solid #121212;
  cursor: pointer;
`;
const BlackButtonText = styled.span`
  color: #ffffff;
  font-size: 16px;
  font-weight: 410;
  line-height: 60px;
  cursor: pointer;
`;

const WhiteButton = styled(BlackButton)`
  background-color: #ffffff;
  margin-left: 10px;
`;

const WhiteButtonText = styled(BlackButtonText)`
  color: #121212;
`;

const Input = styled.input`
  display: flex;
  flex: 1;
  height: 100%;
  border: 0;
  padding-left: 30px;
  font-size: 16px;
  font-weight: 410;
  color: #121212;
  outline: 0;
`;

const ContentTextArea = styled.textarea`
  display: flex;
  flex: 1;
  height: 100%;
  border: 0;
  padding: 30px;
  font-size: 16px;
  font-weight: 410;
  color: #121212;
  vertical-align: top;
  resize: none;
  outline: 0;
`;

export default RegisterFaq;
