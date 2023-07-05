import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import kakaoImage from '../../asset/image/sns_kakao.png';
import { APISignIn } from '../../api/UserAPI';
import NaverLoginButton from '../../components/Login/NaverLoginButton';
import { UserContext } from '../../context/user';
import { removeHistory } from '../../components/Layout/Header';

const JAVASCRIPT_KEY = '1abc385bc918f8e46dfb85b5128a89d5';
const REDIRECT_URI = 'https://fredi.co.kr/kakao';
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${JAVASCRIPT_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

function SignIn() {
  const navigate = useNavigate();
  const { patchUser } = useContext(UserContext);
  const [userId, setUserId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [alertType, setAlertType] = useState<'emptyUserId' | 'emptyPassword' | 'faild'>();

  const onKakaoLogin = async () => {
    const userAgent = window.navigator.userAgent;
    if (userAgent === 'APP-android' || userAgent === 'APP-ios') {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          action: 'kakao',
        })
      );
      return;
    }
    window.Kakao.Auth.authorize({ redirectUri: REDIRECT_URI });
  };

  const onSignIn = async () => {
    if (!userId) return setAlertType('emptyUserId');
    if (!password) return setAlertType('emptyPassword');
    const uuid = sessionStorage.getItem('_u');
    const data = {
      user_id: userId,
      password: password,
      uuid: uuid,
    };
    try {
      // const res = {token:'dasda',userInfo:{idx:0,level:1}};
      const res = await APISignIn(data);
      console.log(res);
      setAlertType(undefined);
      const token = res.token;
      sessionStorage.setItem('token', token);
      patchUser(res.userInfo.idx, res.userInfo.level);
      removeHistory()
      navigate('/');
    } catch (error) {
      console.log(error);
      setAlertType('faild');
    }
  };

  useEffect(() => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(JAVASCRIPT_KEY);
    }
  }, []);

  const iosPostMessage = useCallback((e: any) => {
    window.ReactNativeWebView.postMessage(JSON.stringify(e));
    const response = JSON.parse(e.data);

    if (response.action === 'kakao') {
      navigate(`/kakao?code=${response.code}`);
    }
  }, []);

  const androidPostMessage = useCallback((e: any) => {
    if (document) {
      window.ReactNativeWebView.postMessage(JSON.stringify(e));
      const response = JSON.parse(e.data);
      if (response.action === 'kakao') {
        navigate(`/kakao?code=${response.code}`);
      } else {
      }
    }
  }, []);

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    if (userAgent === 'APP-android') {
      const message = document.addEventListener('message', androidPostMessage);
    }
    if (userAgent === 'APP-ios') {
      const message = window.addEventListener('message', iosPostMessage);
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
      <SignInBox>
        <Title>로그인</Title>
        <InputWrap>
          <InputTitle>아이디</InputTitle>
          <TextInput
            maxLength={20}
            value={userId}
            autoCapitalize="off"
            onChange={(e) => setUserId(e.target.value)}
            placeholder="아이디를 입력해 주세요."
          />
          {alertType === 'emptyUserId' && <AlertText>*아이디를 입력해 주세요.</AlertText>}
          {alertType === 'faild' && <AlertText>아이디 또는 비밀번호를 확인해 주세요.</AlertText>}
        </InputWrap>
        <InputWrap>
          <InputTitle>비밀번호</InputTitle>
          <TextInput
            maxLength={16}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="비밀번호를 입력해 주세요."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSignIn();
              }
            }}
          />
          {alertType === 'emptyPassword' && <AlertText>*비밀번호를 입력해 주세요.</AlertText>}
          {alertType === 'faild' && <AlertText>아이디 또는 비밀번호를 확인해 주세요.</AlertText>}
        </InputWrap>
        <BlackButton onClick={onSignIn}>
          <BlackButtonText>로그인</BlackButtonText>
        </BlackButton>
        <FindIdRowWrap>
          <FindIdText onClick={() => navigate('/finduserid')}>아이디 찾기</FindIdText>
          <Line />
          <FindIdText onClick={() => navigate('/findpassword')}>비밀번호 찾기</FindIdText>
        </FindIdRowWrap>
        <SnsRowWrap>
          <SnsButton src={kakaoImage} onClick={onKakaoLogin} />
          <NaverLoginButton />
        </SnsRowWrap>
        <BottomText onClick={() => navigate('/signup')}>
          아직 회원이 아니신가요?&nbsp;<UnderLinedText>회원가입</UnderLinedText>
        </BottomText>
      </SignInBox>
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
    border-top: 0;
  }
`;

const SignInBox = styled.div`
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
  flex-direction: column;
  margin-bottom: 20px;
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
  border-bottom: 1px solid #121212;
  border-radius: 0;
  padding-left: 10px;
  padding-bottom: 5px;
  font-size: 16px;
  color: #121212;
  font-weight: 410;
  outline: 0;
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
  margin: 30px 0 20px;
  cursor: pointer;
`;

const BlackButtonText = styled.span`
  font-weight: 410;
  color: #ffffff;
  font-size: 18px;
  @media only screen and (max-width: 768px) {
    font-size: 15px;
  }
`;

const FindIdRowWrap = styled.div`
  display: flex;
  flex: 1;
  height: 60px;
  align-items: center;
  @media only screen and (max-width: 768px) {
    height: 40px;
  }
`;

const FindIdText = styled.span`
  display: flex;
  flex: 1;
  font-size: 14px;
  color: #121212;
  font-weight: 410;
  justify-content: center;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const Line = styled.div`
  width: 1px;
  height: 10px;
  background-color: #121212;
`;

const SnsRowWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
`;

const SnsButton = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 100%;
  margin-right: 20px;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    width: 45px;
    height: 45px;
  }
`;

const BottomText = styled.span`
  font-size: 14px;
  color: #121212;
  font-weight: 410;
  margin-top: 50px;
  display: flex;
  flex: 1;
  justify-content: center;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
    margin-top: 30px;
  }
`;

const UnderLinedText = styled.span`
  text-decoration: underline;
  text-decoration-color: #121212;
  cursor: pointer;
`;

export default SignIn;
