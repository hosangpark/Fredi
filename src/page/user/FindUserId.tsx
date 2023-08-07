import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@mantine/core';
import { APIFindUserId, APIVerifyAuthNumber } from '../../api/UserAPI';

function FindUserId() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [authNumber, setAuthNumber] = useState<string>('');
  const [alertType, setAlertType] = useState<'name' | 'phone' | 'send' | 'auth'>();
  const [receivedNumber, setReceivedNumber] = useState<string>('');
  const [receivedUserId, setReceivedUserId] = useState<string>('');
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [timer, setTimer] = useState(0);
  const countRef = useRef<any>(null);

  const onFindUserId = async () => {
    if (!name) return setAlertType('name');
    if (!phone) return setAlertType('phone');
    try {
      const data = {
        name: name,
        phone_number: phone,
      };
      const res = await APIFindUserId(data);
      console.log(res);
      setAlertType(undefined);
      setReceivedNumber(res.auth_number);
      setReceivedUserId(res.userId);
      setTimer(180);
    } catch (error) {
      console.log(error);
      setAlertType('send');
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

  const onShowUserIdModal = () => {
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
      <FindUserIdBox>
        <Title>Find my ID</Title>
        <InputBox>
          <InputTitle>Name</InputTitle>
          <InputWrap>
            <TextInput maxLength={10} value={name} onChange={(e) => setName(e.target.value)} placeholder="이름을 입력해 주세요." />
          </InputWrap>
          {alertType === 'name' && <AlertText>*enter your name.</AlertText>}
        </InputBox>
        <InputBox>
          <InputTitle>Phone number</InputTitle>
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
            {timer === 0 && !isAuth && <UnderlineTextButton onClick={onFindUserId}>Send Code</UnderlineTextButton>}
          </InputWrap>
          {alertType === 'phone' && <AlertText>*enter your cell phone number.</AlertText>}
          {alertType === 'send' && <AlertText>*Member not found.</AlertText>}
        </InputBox>
        <InputBox>
          <InputTitle>Verification code</InputTitle>
          <InputWrap>
            <TextInput
              maxLength={6}
              value={authNumber}
              disabled={isAuth}
              onChange={(e) => {
                setAuthNumber(e.target.value);
              }}
              placeholder="Verification code."
            />
            {receivedNumber && (
              <>
                {timer > 0 && (
                  <CountText>
                    {Math.floor(timer / 60)}:{timer % 60 > 10 ? timer % 60 : '0' + (timer % 60)}
                  </CountText>
                )}
                {!isAuth && <UnderlineTextButton onClick={onCheckAuth}>Confirm</UnderlineTextButton>}
              </>
            )}
          </InputWrap>
          {!isAuth && alertType?.includes('auth') && <AlertText>*check the authentication number.</AlertText>}
          {isAuth && <AlertTextGreen>*certified.</AlertTextGreen>}
        </InputBox>

        <BlackButton aria-disabled={!isAuth} onClick={onShowUserIdModal}>
          <BlackButtonText>Next</BlackButtonText>
        </BlackButton>
        <WhiteButton onClick={() => navigate(-1)}>
          <WhiteButtonText>Cancel</WhiteButtonText>
        </WhiteButton>
      </FindUserIdBox>
      <Modal opened={showModal} onClose={() => setShowModal(false)} overlayOpacity={0.5} size="auto" centered withCloseButton={false}>
        <ModalBox>
          <ModalText>Your e-mail ID is</ModalText>
          <ModalText>
            <ModalTextGreen>{receivedUserId}</ModalTextGreen>.
          </ModalText>
          <ButtonWrap>
            <ModalBlackButton
              onClick={() => {
                navigate('/findpassword');
              }}
            >
              <BlackButtonText>Find Password</BlackButtonText>
            </ModalBlackButton>
            <ModalWhiteButton onClick={() => setShowModal(false)}>
              <WhiteButtonText>OK</WhiteButtonText>
            </ModalWhiteButton>
          </ButtonWrap>
        </ModalBox>
      </Modal>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  text-align: left;
  @media only screen and (max-width: 768px) {
    align-items: flex-start;
    padding-top: 0px;
    border-top: 0;
  }
`;

const FindUserIdBox = styled.div`
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

const InputWrap = styled.div`
  display: flex;
  padding-bottom: 3px;
  align-items: center;
  border-bottom: 1px solid #121212;
`;

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
  position: relative;
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
  font-weight: 410;
  outline: 0;
  @media only screen and (max-width: 768px) {
    font-size: 13px;
  }
`;

const AlertText = styled.span`
  font-weight: 410;
  font-size: 12px;
  color: #d82c19;
  margin-top: 8px;
  padding-left: 10px;
`;

const AlertTextGreen = styled(AlertText)`
  color: #398049;
`;

const BlackButton = styled.div`
  height: 60px;
  background-color: #121212;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  cursor: pointer;
  border: 1px solid #121212;
  margin: 40px 0 10px;
`;

const WhiteButton = styled(BlackButton)`
  background-color: #ffffff;
  margin-top: 10px;
  border: 0;
`;

const ButtonWrap = styled.div`
  display: flex;
  margin-top: 25px;
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

const BlackButtonText = styled.span`
  font-weight: 410;
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
  padding: 50px 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media only screen and (max-width: 768px) {
    padding: 20px 40px;
  }
`;

const ModalText = styled.span`
  font-size: 18px;
  color: #121212;
  font-weight: 700;
  @media only screen and (max-width: 768px) {
    font-size: 15px;
  }
`;

const ModalTextGreen = styled(ModalText)`
  color: #398049;
`;

const UnderlineTextButton = styled.span`
  font-weight: 410;
  font-size: 14px;
  color: #121212;
  text-decoration: underline;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    top: 0px;
    font-size: 13px;
  }
`;

const CountText = styled.span`
  font-weight: 410;
  color: #d82c19;
  font-size: 14px;

  padding: 0px 5px;
  @media only screen and (max-width: 768px) {
    top: 2px;
    font-size: 13px;
  }
`;

export default FindUserId;
