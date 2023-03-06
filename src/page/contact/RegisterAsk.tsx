import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { APIAskDetails, APIModifyAsk, APIRegisterAsk } from '../../api/AskAPI';
import AlertModal from '../../components/Modal/AlertModal';
import { UserContext } from '../../context/user';
import axios from 'axios';

function RegisterAsk() {
  const { idx } = useParams();
  console.log(idx);
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const { patchUser } = useContext(UserContext);

  const getAskDetails = async () => {
    const data = {
      idx: idx,
    };
    try {
      const res = await APIAskDetails(data);
      console.log(res);
      setTitle(res.title);
      setContent(res.question);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const onRegisterAsk = async () => {
    if (!title) return setShowTitleModal(true);
    if (!content) return setShowContentModal(true);
    const data = {
      title: title,
      question: content,
    };
    try {
      const res = await APIRegisterAsk(data);
      console.log(res);
      setShowModal(true);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const onModifyAsk = async () => {
    if (!title) return setShowTitleModal(true);
    if (!content) return setShowContentModal(true);
    const data = {
      idx: idx,
      title: title,
      question: content,
    };
    try {
      const res = await APIModifyAsk(data);
      console.log(res);
      setShowModal(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          sessionStorage.clear();
          patchUser(0, 3);
          window.location.replace('/');
          console.log(error);
          alert(error);
        }
      }
    }
  };

  useEffect(() => {
    if (idx) {
      console.log('수정');
      getAskDetails();
    } else {
      console.log('등록');
    }
  }, []);

  return (
    <>
      <InputRowWrap>
        <LeftText>제목</LeftText>
        <TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력해 주세요." />
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
        <BlackButton onClick={idx ? onModifyAsk : onRegisterAsk}>
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
        text={idx ? '1:1 문의가 수정되었습니다.' : '1:1 문의가 등록되었습니다.'}
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
    font-size: 13px;
    text-align: left;
    padding: 0 18px;
    line-height: 50px;
  }
  @media only screen and (max-width: 500px) {
    width: 68px;
    line-height: 50px;
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
  font-weight: 400;
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
  font-weight: 400;
  color: #121212;
  outline: 0;
  @media only screen and (max-width: 1000px) {
    font-size: 13px;
    min-width: 220px;
  }
`;

const ContentTextArea = styled.textarea`
  display: flex;
  flex: 1;
  height: 100%;
  border: 0;
  padding: 30px;
  font-size: 16px;
  font-weight: 400;
  color: #121212;
  vertical-align: top;
  resize: none;
  outline: 0;
  @media only screen and (max-width: 1000px) {
    font-size: 13px;
    min-width: 220px;
    padding: 20px;
    line-height: 18px;
  }
`;

export default RegisterAsk;
