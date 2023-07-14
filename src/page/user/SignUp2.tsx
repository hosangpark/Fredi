import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Checkbox, Modal, PasswordInput } from '@mantine/core';
import { APIGetTerms } from '../../api/SettingAPI';
import { APICheckNickname, APICheckUserId, APISendAuthNumber, APISignUp, APIVerifyAuthNumber } from '../../api/UserAPI';
import { emailRegEx, passwordReg, phoneReg } from '../../util/Reg';
import { DatePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

function SignUp2() {
  const navigate = useNavigate();
  const location = useLocation();
  const [Email, setEmail] = useState('')
  const [password, setpassword] = useState('')
  const [password2, setpassword2] = useState('')
  const [alertType, setAlertType] = useState<string[] | undefined>();

  const StateData = {
    type: location.state.type,
    user_id: Email,
    password: password,
  };

  const CheckNext = async() => {
    let type: string[] = [];
    if(!emailRegEx.test(Email)) type.push('NoEmail')
    if(!passwordReg.test(password)) type.push('NoPassWord')
    if(!passwordReg.test(password2)) type.push('NoPassWord')
    if(password !== password2) type.push('NoEquale')

    try {
      const data = {
        user_id: Email,
      };
      const res = await APICheckUserId(data);
      clearAlert('UsedEmail')
    } catch (error) {
      // console.log(error);
      if(error) type.push('UsedEmail')
      // setIsDuplicatedUserId(true);
      // setAlertType(['userId']);
    }
    

    if (type.length > 0) {
    return setAlertType(type);
    } 
    else {
        setAlertType(undefined);
        navigate('/SignUp3',{state:StateData})
    }
  }


  const clearAlert = (alert: any) => {
    setAlertType((prev) => prev?.filter((item) => item !== alert));
  };
  const handleOnKeyPress = (e:any) => {
  if (e.key === 'Enter') {
    CheckNext(); // Enter 입력이 되면 클릭 이벤트 실행
  }
};

  return (
    <Container>
      <SignUpTitle>
        Sign Up
      </SignUpTitle>
      <TypeContainer>
        <InputWrap>
          <Input
            // maxLength={25}
            value={Email}
            onChange={e=>{
              setEmail(e.target.value);
              clearAlert('NoEmail');
              
              }}
            placeholder="E-mail"
          />
          <TimerBox>
            {alertType?.includes('NoEmail') ?
            <AuthText>
              이메일을 확인해주세요.
            </AuthText>
            :
            alertType?.includes('UsedEmail') &&
            <AuthText>
              이미 가입된 계정입니다.
            </AuthText>
            }
          </TimerBox>
        </InputWrap>
            <Input
              // maxLength={25}
              value={password}
              onChange={e=>{
                setpassword(e.target.value)
                }}
              placeholder="Password"
              type={'password'}
            />
            <Input
              // maxLength={25}
              value={password2}
              onChange={e=>{
                setpassword2(e.target.value)
                clearAlert('NoPassWord');
                }}
              placeholder="Confirm Password"
              type={'password'}
              onKeyDown={handleOnKeyPress}
            />
            <TimerBox>
            {alertType?.includes('NoPassWord') ?
            <AuthText>
              비밀번호를 확인해주세요.
            </AuthText>
            :
            alertType?.includes('NoEquale') &&
            <AuthText>
              비밀번호를 일치해주세요.
            </AuthText>
            }
            </TimerBox>
          <NextButton onClick={CheckNext}>
            <ButtonText>
              Next
            </ButtonText>
          </NextButton>
      </TypeContainer>
      
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction:column;
  flex: 1;
  max-width:728px;
  margin:0 auto;
  min-height: calc(100vh - 80px);
  text-align: left;
  @media only screen and (max-width: 768px) {
    margin:40px 20px 0;
  }
`;

const SignUpTitle = styled.h1`
font-family:'Pretendard Variable';
  font-weight: 510;
  font-size: 26px;
  color: #121212;
  text-align: left;
  margin-bottom: 100px;
  @media only screen and (max-width: 768px) {
    margin-bottom: 50px;
    font-size: 24px;
  }
`;

const Input = styled.input`
font-family:'Pretendard Variable';
  width:100%;
  border: 0;
  font-size: 16px;
  color: #121212;
  font-weight: 410;
  outline: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 70px;
  border-bottom:1px solid #c0c0c0;
    padding:0 10px;
  @media only screen and (max-width: 768px) {
    font-size: 15px;
  }
`
const InputWrap = styled.div`
  display:flex;
  flex-direction:column;
  margin-bottom:100px;
  @media only screen and (max-width: 769px){
    margin-bottom:50px;
  }
`
const TimerBox = styled.div`
  height:30px;
  text-align:start;
  margin-left:10px;
`
const Emptybox = styled.div`
  height:30px;
`
const AuthText = styled.span<{color?:string}>`
color:${props => props.color? '#006eff' : '#e00d0d'} ;
   font-size:10px;
 @media only screen and (max-width:768){
    font-size:8px;
  }
`
const TypeContainer = styled.div`
  width:100%;
`;
const NextButton = styled.div`
  background-color: #121212;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius:10px;
  height:70px;
  justify-content: center;
  margin-top: 150px;
  @media only screen and (max-width: 769px){
    margin-top: 100px;
  }
`
const ButtonText = styled.span`
  font-weight: 360;
  color: #ffffff;
  font-size: 18px;
  @media only screen and (max-width: 769px){
    font-size: 16px;
  }`

export default SignUp2;
