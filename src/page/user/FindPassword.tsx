import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@mantine/core';
import { APIFindPassword, APIResetPassword, APIVerifyAuthNumber } from '../../api/UserAPI';
import AlertModal from '../../components/Modal/AlertModal';
import { passwordReg } from '../../util/Reg';

function FindPassword() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [authNumber, setAuthNumber] = useState<string>('');
  const [alertType, setAlertType] = useState<'userId' | 'phone' | 'send' | 'auth'>();
  const [modalAlertType, setModalAlertType] = useState<'newPassword' | 'auth' | 'reg'>();
  const [receivedNumber, setReceivedNumber] = useState<string>('');
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [userIdx, setUserIdx] = useState<number>();
  const [newPassword, setNewPassword] = useState<string>('');
  const [newPassword2, setNewPassword2] = useState<string>('');
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [timer, setTimer] = useState(0);
  const countRef = useRef<any>(null);

  const testReg = passwordReg.test(newPassword);

  const onFindPassword = async () => {
    if (!userId) return setAlertType('userId');
    if (!phone) return setAlertType('phone');
    try {
      const data = {
        user_id: userId,
        phone_number: phone,
      };
      const res = await APIFindPassword(data);
      console.log(res);
      setAlertType(undefined);
      setReceivedNumber(res.auth_number);
      setUserIdx(res.idx);
      setTimer(180);
    } catch (error) {
      console.log(error);
      setAlertType('send');
    }
  };

  const onModifyPassword = async () => {
    if (!testReg) return setModalAlertType('reg');
    if (!newPassword2) return setModalAlertType('newPassword');
    if (newPassword !== newPassword2) return setModalAlertType('auth');
    try {
      const data = {
        idx: userIdx,
        password: newPassword,
      };
      const res = await APIResetPassword(data);
      console.log(res);
      setModalAlertType(undefined);
      setShowModal(false);
      setShowAlertModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const onCheckAuth = async () => {
    try {
      const data = {
        phone_number: phone,
        auth_number: authNumber,
      };
      const res = await APIVerifyAuthNumber(data);
      console.log(res);
      setIsAuth(true);
      setTimer(0);
    } catch (error) {
      console.log(error);
      setAlertType('auth');
    }
  };

  const onShowPassworddModal = () => {
    if (isAuth) {
      setShowModal(true);
    }
  };

  useEffect(() => {
    if (timer > 0) {
      if (!countRef.current) {
        countRef.current = setInterval(() => {
          setTimer((prev) => prev - 1);
        }, 1000);
      }
    } else {
      clearInterval(countRef.current);
      countRef.current = null;
    }
  }, [timer]);

  return (
    <Container>
      <FindPasswordBox>
        <Title>비밀번호 찾기</Title>
        <InputBox>
          <InputTitle>아이디</InputTitle>
          <InputWrap>
            <TextInput maxLength={20} value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="아이디를 입력해 주세요." />
          </InputWrap>
          {alertType === 'userId' && <AlertText>*아이디를 입력해 주세요.</AlertText>}
        </InputBox>
        <InputBox>
          <InputTitle>휴대폰 번호</InputTitle>
          <InputWrap>
            <TextInput
              maxLength={11}
              value={phone}
              disabled={timer > 0 || isAuth}
              onChange={(e) => {
                setPhone(e.target.value.replace(/[^0-9]/g, ''));
              }}
              placeholder="'-'를 제외한 휴대폰 번호를 입력해 주세요."
            />
            {timer === 0 && !isAuth && <UnderlineTextButton onClick={onFindPassword}>인증번호 발송</UnderlineTextButton>}
          </InputWrap>
          {alertType === 'phone' && <AlertText>*휴대폰 번호를 입력해 주세요.</AlertText>}
          {alertType === 'send' && <AlertText>*회원을 찾을 수 없습니다.</AlertText>}
        </InputBox>
        <InputBox>
          <InputTitle>인증 번호</InputTitle>
          <InputWrap>
            <TextInput
              maxLength={6}
              value={authNumber}
              disabled={isAuth}
              onChange={(e) => {
                setAuthNumber(e.target.value);
              }}
              placeholder="인증 번호를 입력해 주세요."
            />
            {receivedNumber && (
              <>
                {timer > 0 && (
                  <CountText>
                    {Math.floor(timer / 60)}:{timer % 60 > 10 ? timer % 60 : '0' + (timer % 60)}
                  </CountText>
                )}
                {!isAuth && <UnderlineTextButton onClick={onCheckAuth}>인증하기</UnderlineTextButton>}
              </>
            )}
          </InputWrap>
          {!isAuth && alertType?.includes('auth') && <AlertText>*인증번호를 확인해 주세요.</AlertText>}
          {isAuth && <AlertTextGreen>*인증되었습니다.</AlertTextGreen>}
        </InputBox>
        <BlackButton aria-disabled={!isAuth} onClick={onShowPassworddModal}>
          <BlackButtonText>다음</BlackButtonText>
        </BlackButton>
        <WhiteButton onClick={() => navigate(-1)}>
          <WhiteButtonText>취소</WhiteButtonText>
        </WhiteButton>
      </FindPasswordBox>
      <Modal opened={showModal} onClose={() => setShowModal(false)} overlayOpacity={0.5} size="auto" centered withCloseButton={false}>
        <ModalBox>
          <ModalTitle>비밀번호 재설정</ModalTitle>
          <InputBox>
            <InputTitle>비밀번호</InputTitle>
            <InputWrap>
              <TextInput
                maxLength={16}
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="입력해 주세요"
              />
            </InputWrap>
            {modalAlertType === 'reg' && <AlertText>*비밀번호는 8-16자 영문, 숫자로 구성되어야 합니다.</AlertText>}
          </InputBox>
          <InputBox>
            <InputTitle>비밀번호 재확인</InputTitle>
            <InputWrap>
              <TextInput
                maxLength={16}
                type="password"
                value={newPassword2}
                onChange={(e) => setNewPassword2(e.target.value)}
                placeholder="입력해 주세요"
              />
            </InputWrap>
            {modalAlertType === 'auth' && <AlertText>*비밀번호를 확인해 주세요.</AlertText>}
            {modalAlertType === 'newPassword' && <AlertText>*비밀번호를 입력해 주세요.</AlertText>}
          </InputBox>
          <ButtonWrap>
            <ModalBlackButton onClick={onModifyPassword}>
              <BlackButtonText>확인</BlackButtonText>
            </ModalBlackButton>
            <ModalWhiteButton onClick={() => setShowModal(false)}>
              <WhiteButtonText>취소</WhiteButtonText>
            </ModalWhiteButton>
          </ButtonWrap>
        </ModalBox>
      </Modal>
      <AlertModal visible={showAlertModal} setVisible={setShowAlertModal} text="비밀번호가 변경되었습니다." onClick={() => navigate('/signin')} />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  border-top: 1px solid #121212;
  text-align: left;
  @media only screen and (max-width: 768px) {
    align-items: flex-start;
    padding-top: 0px;
    border-top: 0;
  }
`;

const FindPasswordBox = styled.div`
  width: 400px;
  @media only screen and (max-width: 768px) {
    width: 280px;
    margin: 30px 0 60px;
  }
`;

const Title = styled.h1`
  font-weight: 700;
  font-size: 38px;
  color: #121212;
  text-align: left;
  margin-bottom: 30px;
  @media only screen and (max-width: 768px) {
    font-size: 28px;
  }
`;

const AlertText = styled.span`
  font-weight: 400;
  font-size: 12px;
  color: #d82c19;
  margin-top: 8px;
  padding-left: 10px;
`;

const BlackButton = styled.div`
  height: 60px;
  background-color: #121212;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  margin: 40px 0 10px;
  cursor: pointer;
`;

const WhiteButton = styled(BlackButton)`
  background-color: #ffffff;
  margin-top: 5px;
`;

const BlackButtonText = styled.span`
  font-weight: 400;
  color: #ffffff;
  font-size: 16px;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const WhiteButtonText = styled(BlackButtonText)`
  color: #121212;
`;

const ModalBox = styled.div`
  background-color: #fff;
  padding: 40px 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media only screen and (max-width: 768px) {
    padding: 20px 10px;
    width: 260px;
  }
`;

const ModalTitle = styled.span`
  font-size: 24px;
  color: #121212;
  font-weight: 700;
  margin-bottom: 30px;
  @media only screen and (max-width: 768px) {
    font-size: 18px;
  }
`;

const InputBox = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-bottom: 25px;
  position: relative;
`;

const InputWrap = styled.div`
  display: flex;
  padding-bottom: 3px;
  align-items: center;
  border-bottom: 1px solid #121212;
`;

const InputTitle = styled.span`
  font-weight: 700;
  color: #121212;
  font-size: 18px;
  margin-bottom: 15px;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 10px;
  }
`;

const TextInput = styled.input`
  border: 0;
  display: flex;
  flex: 1;
  padding-left: 10px;
  padding-bottom: 3px;
  font-size: 16px;
  color: #121212;
  font-weight: 400;
  outline: 0;
  @media only screen and (max-width: 768px) {
    font-size: 13px;
  }
`;

const ButtonWrap = styled.div`
  display: flex;
  margin-top: 10px;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const ModalBlackButton = styled.div`
  width: 160px;
  height: 60px;
  background-color: #121212;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  cursor: pointer;
  border: 1px solid #121212;
  @media only screen and (max-width: 768px) {
    display: block;
    text-align: center;
    padding: 15px 0;
  }
`;

const ModalWhiteButton = styled(ModalBlackButton)`
  background-color: #ffffff;
  margin-left: 10px;
  @media only screen and (max-width: 768px) {
    margin-left: 0;
    margin-top: 10px;
  }
`;

const UnderlineTextButton = styled.span`
  font-weight: 400;
  font-size: 14px;
  color: #121212;
  text-decoration: underline;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    top: 0px;
    font-size: 13px;
  }
`;

const AlertTextGreen = styled(AlertText)`
  color: #398049;
`;

const CountText = styled.span`
  font-weight: 400;
  font-size: 14px;
  color: #d82c19;
  padding: 0px 5px;
  @media only screen and (max-width: 768px) {
    top: 2px;
    font-size: 13px;
  }
`;

export default FindPassword;
