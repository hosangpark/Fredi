import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { Checkbox, Loader, Modal } from '@mantine/core';
import { APIGetTerms } from '../../api/SettingAPI';
import { APICheckNickname, APISendAuthNumber, APISignInUsingSns, APISignUp, APIVerifyAuthNumber } from '../../api/UserAPI';
import { phoneReg } from '../../util/Reg';
import { DatePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import API from '../../api/default';
import AlertModal from '../../components/Modal/AlertModal';
import axios from 'axios';
import { UserContext } from '../../context/user';
import { useRef } from 'react';

function Naver() {
  const location = useLocation();
  const { patchUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const [tab, setTab] = useState<1 | 2>(1);

  const [termsOfUse, setTermsOfUse] = useState<string>('');
  const [privacyPolicy, setPrivacyPolicy] = useState<string>('');

  const [name, setName] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [authNumber, setAuthNumber] = useState<string>('');
  const [birth, setBirth] = useState<Date>();
  const [gender, setGender] = useState<1 | 2>(1);
  const [agree, setAgree] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<string[] | undefined>();
  const [receivedNumber, setReceivedNumber] = useState<string>('');
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isDuplicatedNickname, setIsDuplicatedNickname] = useState<boolean>(true);
  const [naverId, setNaverId] = useState<string>('');
  const [agreeModal, setAgreeModal] = useState(false);
  const countRef = useRef<any>(null);
  const [timer, setTimer] = useState(0);
  const testPhoneReg = phoneReg.test(phone);

  const checkUser = async () => {
    try {
      const access_token = location.hash.split('=')[1].split('&')[0];
      console.log(access_token);
      const res = await API.get('/user/auth-naver', { params: { access_token } });
      console.log('authNaver', res);
      setNaverId(res.data.id);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          onSignInWithNaver(error.response.data.id);
        }
      }
    }
  };

  const onSignInWithNaver = async (naverId: string) => {
    if (!naverId) return alert('No naverId');
    const uuid = sessionStorage.getItem('_u');
    const data = {
      user_id: naverId,
      uuid,
    };
    try {
      const res = await APISignInUsingSns(data);
      console.log(res);
      setAlertType(undefined);
      const token = res.token;
      patchUser(res.userInfo.idx, res.userInfo.level);
      sessionStorage.setItem('token', token);
      navigate('/', { replace: true });
    } catch (error) {
      console.log(error);
      alert('falid Login');
    }
  };

  const onCheckNickname = async () => {
    if (!nickname) return setAlertType(['nicknameEmpty']);
    try {
      const data = {
        nickname: nickname,
      };
      const res = await APICheckNickname(data);
      console.log(res);
      setAlertType(undefined);
      setIsDuplicatedNickname(false);
    } catch (error) {
      console.log(error);
      setIsDuplicatedNickname(true);
      setAlertType(['nickname']);
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
      setAlertType(['auth']);
    }
  };

  const onSendAuthNumber = async () => {
    if (!phone) return setAlertType(['send']);
    if (!testPhoneReg) return setAlertType(['send']);
    try {
      const data = {
        phone_number: phone,
      };
      const res = await APISendAuthNumber(data);
      console.log(res);
      setAlertType(undefined);
      setReceivedNumber(res.auth_number);
      setTimer(180);
    } catch (error) {
      console.log(error);
      setAlertType(['member']);
    }
  };

  const getTerms = async () => {
    const data = {
      type: tab,
    };
    try {
      const resData = await APIGetTerms(data);
      if (tab === 1) {
        setTermsOfUse(resData);
      } else {
        setPrivacyPolicy(resData);
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const onSignUpWithNaver = async () => {
    let type: string[] = [];
    if (!agree) return alert('동의 필요');
    if (isDuplicatedNickname) type.push('nickname');
    if (!name) type.push('nameEmpty');
    if (!isAuth) type.push('auth');
    if (!birth) type.push('birth');
    if (type.length > 0) {
      return setAlertType(type);
    }
    setAlertType(undefined);

    const data = {
      type: 3,
      user_id: naverId,
      password: 'No Password',
      name: name,
      nickname: nickname,
      phone: phone,
      birth: dayjs(birth).format('YYYY-MM-DD'),
      gender: gender,
    };
    try {
      const res = await APISignUp(data);
      console.log(res);
      setShowSuccessModal(true);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    getTerms();
  }, [tab]);

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

  const clearAlert = (alert: any) => {
    setAlertType((prev) => prev?.filter((item) => item !== alert));
  };

  if (!naverId) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }

  return (
    <Container>
      <SignUpBox>
        <Title>JOIN</Title>
        <InputBox>
          <InputTitle>이름</InputTitle>
          <InputWrap>
            <TextInput
              maxLength={10}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearAlert('nameEmpty');
              }}
              placeholder="이름을 입력해 주세요."
            />
          </InputWrap>
          {alertType?.includes('nameEmpty') && <AlertText>*이름을 입력해 주세요.</AlertText>}
        </InputBox>
        <InputBox>
          <InputTitle>닉네임</InputTitle>
          <InputWrap>
            <TextInput
              maxLength={10}
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                clearAlert('nickname' || 'nicknameEmpty');
                setIsDuplicatedNickname(true);
              }}
              placeholder="닉네임을 입력해 주세요."
            />
            <UnderlineTextButton onClick={onCheckNickname}>중복확인</UnderlineTextButton>
          </InputWrap>
          {alertType?.includes('nicknameEmpty') && <AlertText>*닉네임을 입력해 주세요.</AlertText>}
          {isDuplicatedNickname && alertType?.includes('nickname') && <AlertText>*중복된 닉네임입니다.</AlertText>}
          {!isDuplicatedNickname && <AlertTextGreen>*사용 가능한 닉네임입니다.</AlertTextGreen>}
        </InputBox>

        <InputBox>
          <InputTitle>성별</InputTitle>
          <CheckboxWrap>
            <CheckboxWrap style={{ marginRight: 20 }}>
              <Checkbox
                checked={gender === 1}
                onChange={() => setGender(1)}
                styles={{
                  input: { cursor: 'pointer', borderColor: '#121212', '&:checked': { backgroundColor: '#121212', borderColor: '#121212' } },
                }}
              />
              <CheckboxText>남자</CheckboxText>
            </CheckboxWrap>
            <CheckboxWrap>
              <Checkbox
                checked={gender === 2}
                onChange={() => setGender(2)}
                styles={{
                  input: { cursor: 'pointer', borderColor: '#121212', '&:checked': { backgroundColor: '#121212', borderColor: '#121212' } },
                }}
              />
              <CheckboxText>여자</CheckboxText>
            </CheckboxWrap>
          </CheckboxWrap>
        </InputBox>
        <InputBox>
          <InputTitle>생년월일</InputTitle>
          <InputWrap>
            <DatePicker
              onChange={(value: Date) => {
                setBirth(value);
                clearAlert('birth');
              }}
              locale="ko"
              inputFormat="YYYY년 MM월 DD일"
              styles={{
                root: { width: '100%' },
                wrapper: { height: 36, width: '100%' },
                input: {
                  display: 'flex',
                  felx: 1,
                  height: 36,
                  border: 0,
                  borderRadius: 0,
                  paddingBottom: 4,
                  marginTop: -10,
                  '&,&:focus': {
                    borderColor: '#121212 !important',
                  },
                  '::placeholder': {
                    color: '#777',
                    fontWeight: 400,
                    fontSize: 16,
                    '@media (max-width: 768px)': { fontSize: 13 },
                  },
                  '@media (max-width: 768px)': { fontSize: 13 },
                },
              }}
              placeholder="생년월일을 선택해 주세요."
              maxDate={dayjs(new Date()).toDate()}
            />
          </InputWrap>
          {alertType?.includes('birth') && <AlertText>*생년월일을 선택해 주세요.</AlertText>}
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
                clearAlert('send' || 'member');
              }}
              placeholder="'-'를 제외한 휴대폰 번호를 입력해 주세요."
            />
            {timer === 0 && !isAuth && <UnderlineTextButton onClick={onSendAuthNumber}>인증번호 발송</UnderlineTextButton>}
          </InputWrap>
          {alertType?.includes('send') && <AlertText>* 휴대폰 번호를 올바르게 입력해 주세요.</AlertText>}
          {alertType?.includes('member') && <AlertText>* 이미 가입된 번호입니다.</AlertText>}
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
                clearAlert('auth');
                setIsAuth(false);
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

        <CheckboxWrap>
          <Checkbox
            checked={agree}
            onChange={(e) => setAgree(e.currentTarget.checked)}
            styles={{
              input: { cursor: 'pointer', borderColor: '#121212', '&:checked': { backgroundColor: '#121212', borderColor: '#121212' } },
            }}
          />
          <CheckboxText>
            <UnderLinedText onClick={() => setShowModal(true)}>이용약관 및 개인정보 처리방침</UnderLinedText>에 동의합니다.
          </CheckboxText>
        </CheckboxWrap>
        <BlackButton onClick={onSignUpWithNaver}>
          <BlackButtonText>회원가입</BlackButtonText>
        </BlackButton>
        <WhiteButton onClick={() => navigate(-1)}>
          <WhiteButtonText>취소</WhiteButtonText>
        </WhiteButton>
      </SignUpBox>
      <Modal opened={showModal} onClose={() => setShowModal(false)} overlayOpacity={0.5} size="auto" centered withCloseButton={false}>
        <ModalBox>
          <ModalTitle>이용약관 및 개인정보 처리방침</ModalTitle>
          <TabButtonWrap>
            <TabButton onClick={() => setTab(1)}>
              <TabButtonText selected={tab === 1}>이용약관</TabButtonText>
            </TabButton>
            <TabButton onClick={() => setTab(2)}>
              <TabButtonText selected={tab === 2}>개인정보 처리방침</TabButtonText>
            </TabButton>
          </TabButtonWrap>
          <ModalContentBox value={tab === 1 ? termsOfUse : privacyPolicy} disabled />
          <ModalBlackButton
            onClick={() => {
              setShowModal(false);
            }}
          >
            <BlackButtonText>확인</BlackButtonText>
          </ModalBlackButton>
        </ModalBox>
      </Modal>
      <AlertModal visible={agreeModal} setVisible={setAgreeModal} text={'약관에 동의해주세요.'} onClick={() => setAgreeModal(false)} />
      <AlertModal
        visible={showSuccessModal}
        setVisible={setShowSuccessModal}
        text={'회원가입이 완료되었습니다.'}
        onClick={() => {
          setShowSuccessModal(false);
          navigate('/signin', { replace: true });
        }}
      />
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
    border-top: 0;
  }
`;

const SignUpBox = styled.div`
  width: 400px;
  margin: 120px 0;
  @media only screen and (max-width: 768px) {
    width: 280px;
    margin: 0;
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

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
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
  display: flex;
  flex: 1;
  border: 0;
  font-size: 16px;
  color: #121212;
  font-weight: 410;
  outline: 0;
  height: 36px;
  padding-left: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

const UnderLinedText = styled.span`
  text-decoration: underline;
  text-decoration-color: #121212;
  cursor: pointer;
`;

const CheckboxWrap = styled.div`
  display: flex;
`;

const CheckboxText = styled.span`
  margin-left: 10px;
  font-size: 14px;
  color: #121212;
  font-weight: 410;
  @media only screen and (max-width: 768px) {
    font-size: 13px;
  }
`;

const ModalBox = styled.div`
  background-color: #fff;
  padding: 40px 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media only screen and (max-width: 768px) {
    padding: 10px 10px;
  }
`;

const ModalTitle = styled.span`
  font-family: 'NotoSans' !important;
  font-size: 24px;
  color: #121212;
  font-weight: 700;
  margin-bottom: 30px;
  @media only screen and (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 10px;
  }
`;

const ModalBlackButton = styled.div`
  width: 130px;
  height: 50px;
  background-color: #121212;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid #121212;
  margin-top: 20px;
`;

const TabButtonWrap = styled.div`
  display: flex;
  width: 100%;
`;

const TabButton = styled.div`
  padding: 5px 10px;
  cursor: pointer;
`;

const TabButtonText = styled.span<{ selected: boolean }>`
  font-family: 'NotoSans' !important;
  font-weight: ${(props) => (props.selected ? 700 : 400)};
  color: ${(props) => (props.selected ? '#121212' : '#888888')};
  font-size: 16px;
  @media only screen and (max-width: 768px) {
    font-size: 13px;
  }
`;

const ModalContentBox = styled.textarea`
  font-family: 'NotoSans' !important;
  width: 400px;
  height: 300px;
  border: 1px solid #121212;
  padding: 15px;
  overflow-y: scroll;
  margin: 5px 0;
  resize: none;
  font-size: 14px;
  font-weight: 410;
  color: #121212;
  outline: 0;
  line-height: 25px;
  background-color: #fff;
  -webkit-text-fill-color: #121212;
  opacity: 1;

  @media only screen and (max-width: 768px) {
    width: 260px;
    height: 250px;
    font-size: 12px;
    line-height: 20px;
  }
`;

const UnderlineTextButton = styled.span`
  font-family: 'NotoSans' !important;
  font-weight: 410;
  font-size: 14px;
  color: #121212;
  text-decoration: underline;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    top: 2px;
    font-size: 13px;
  }
`;

const CountText = styled.span`
  font-weight: 410;
  font-size: 14px;
  color: #d82c19;
  padding: 0px 5px;
  @media only screen and (max-width: 768px) {
    top: 2px;
    font-size: 13px;
  }
`;

const AlertTextGreen = styled(AlertText)`
  color: #398049;
`;

export default Naver;
