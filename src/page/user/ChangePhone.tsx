import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { APIGetTerms } from '../../api/SettingAPI';
import {
  APIModifyUserDetails,
  APISendAuthNumber,
  APIUserDetails,
  APIVerifyAuthNumber,
  checkNicknameExcludeUser,
} from '../../api/UserAPI';
import { passwordReg, phoneReg } from '../../util/Reg';
import AlertModal from '../../components/Modal/AlertModal';

const REASONLIST = [
  { value: '', label: '탈퇴 사유 선택' },
  { value: '사용빈도 낮음', label: '사용빈도 낮음' },
  { value: '서비스 불만', label: '서비스 불만' },
  { value: '개인정보 유출 우려', label: '개인정보 유출 우려' },
  { value: '기타', label: '기타' },
];

function ChangePhone() {
  const navigate = useNavigate();
  const [alertModal, setAlertModal] = useState(false);
   const [alertType, setAlertType] = useState<
    | 'nicknameEmpty'
    | 'nicknameDuplicated'
    | 'nicknameAvailable'
    | 'authFaild'
    | 'send'
    | 'sendFaild'
    | 'member'
    | 'auth'
    | 'modified'
    | 'faild'
    | 'originalPhone'
    | 'originalNickname'
    | 'passwordEmpty'
    | 'passwordFaild'
    | 'passwordAuth'
    | 'passwordReg'
    | 'passwordDiffrent'
    | 'password'
    | 'needPasswordAuth'
    | 'reason'
    | 'agree'
    | 'deleted'
  >();

  const [originalPhone, setOriginalPhone] = useState<string>('');
  const [originalNickname, setOriginalNickname] = useState<string>('');
  const [timer, setTimer] = useState(0);
  const [phone, setPhone] = useState<string>('');
  const [isSend, setIsSend] = useState(false);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [authNumber, setAuthNumber] = useState<string>('');
  const isOriginalPhone = phone === originalPhone;
  const testPhoneReg = phoneReg.test(phone);
  const countRef = useRef<any>(null);

  const getUserDetails = async () => {
    try {
      const res = await APIUserDetails();
      
      setOriginalNickname(res.nickname);
      setOriginalPhone(res.phone);
      console.log('ddddd',res.nickname)
      console.log('ddddd',res.phone)
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const onSendAuthNumber = async () => {
    // if (isOriginalPhone) return setAlertType('originalPhone');
    // if (!phone) return setAlertType('sendFaild');
    // if (!testPhoneReg) return setAlertType('sendFaild');
    try {
      const data = {
        phone_number: phone,
      };
      const res = await APISendAuthNumber(data);
      console.log(res)
      setAlertType('send');
      setTimer(180);
      setIsSend(true);
    } catch (error) {
      console.log(error);
      setAlertType('member');
    }
  };

  const onModifyUserInfo = async () => {
    if (!isAuth) return setAlertType('faild');
    const data = {
      nickname: originalNickname,
      phone: phone,
    };
    try {
      const res = await APIModifyUserDetails(data);
      setAlertType('modified');
      navigate(-1)
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const onCheckAuth = async () => {
    if (!authNumber) return setAlertType('authFaild');
    try {
      const data = {
        phone_number: phone,
        auth_number: authNumber,
      };
      const res = await APIVerifyAuthNumber(data);
      setIsAuth(true);
      // setAlertType('auth');
      // setTimer(0);
    } catch (error) {
      console.log(error);
      setIsAuth(false);
      // setAlertType('authFaild');
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

  useEffect(() => {
    if (authNumber.length > 0) {
      onCheckAuth()
    }
  }, [authNumber]);

  useEffect(() => {
    getUserDetails()
  }, []);
  
  return (
    <Container style={{ overflow: 'hidden' }}>
      <ContainerWrap>
        <TitleText>Change Phone number</TitleText>
        <SelectBox>
          <CustomSelect>
            <CustomOption>
                +82
            </CustomOption>
            {/* <CustomOption>
                +02
            </CustomOption>
            <CustomOption>
                +01
            </CustomOption> */}
          </CustomSelect>
        </SelectBox>
        <RowWap>
          <EmptyRowTextInput
            maxLength={11}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="01012345678"
          />
          <UnderlineTextButton disabled={isSend} onClick={
            ()=>{
              onSendAuthNumber()
            }
            }>
            Send Verification number
          </UnderlineTextButton>
        </RowWap>
        <RowWap>
          <EmptyRowTextInput last maxLength={6} value={authNumber} onChange={(e) => setAuthNumber(e.target.value)} placeholder="[인증번호 입력]" />
          <TimerWrap>
            {timer > 0 && Math.floor(timer / 60) + ':' + (timer % 60 > 10 ? timer % 60 : '0' + (timer % 60))}
          </TimerWrap>
        </RowWap>
        {isSend && authNumber.length > 0  ?
        <TimerBox>
           {
             isAuth ?
             <AuthText color='blue'>
            인증되었습니다.
            </AuthText>
            : 
            // timer > 0 ?
            <AuthText>
            인증번호를 잘못 입력하셨습니다.
            </AuthText>
            // :
            // <AuthText>
            // 인증유효기간이 만료되었습니다. 재전송하여 다시 인증번호를 입력해주세요
            // </AuthText>
            }
        </TimerBox>
          :
        <Emptybox/>
        }
              
              
        <BlackButton disabled={!isSend} onClick={()=>{
          onModifyUserInfo()
          
        }}>
          Save
        </BlackButton>
      </ContainerWrap>

  
    </Container>
  );
}


const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
    max-width: 768px;
    margin:0 auto;  
  background-color: #ffffff;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
    border-top: 0;
  }
`;
const LeftText = styled.span`
font-family:'Pretendard Variable';
  font-weight:normal;
  color: #121212;
  font-size: 16px;
  font-weight: 410;
  flex:4;
  height: 100%;
  text-align: left;
  line-height: 80px;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
    line-height: 50px;
  }
`;
const RightText = styled(LeftText)<{marginR?:number}>`
font-family:'Pretendard Variable';
  font-weight: 310;
  width:100%;
  border: 0;
  font-size: 14px;
  text-align: right;
  margin-right:${(props)=> props.marginR ? props.marginR : 0}px;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const ContainerWrap = styled.div`
  display: flex;
  flex: 1;
  min-width: 734px;
  flex-direction: column;
  padding:0 20px;
  @media only screen and (max-width: 768px) {
    min-width: 300px;
    /* border-top:1px solid #d4d4d4; */
  }
`;
const UnderlineTextButton = styled.button`
font-family:'Pretendard Variable';
  font-weight: 310;
  color: #000000;
  background-color:#ffff;
  border:1px solid #000000;
  border-radius:5px;
  padding: 8px 10px;
  margin-top:17px;
  cursor: pointer;
  font-size: 14px;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;
const TimerWrap = styled.span`
font-family:'Pretendard Variable';
  font-weight: 310;
  color: #000000;
  padding-right:5px;
  cursor: pointer;
  font-size: 14px;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;
const AlertText = styled.span`
  font-weight: 410;
  font-size: 15px;
  color: #d82c19;
  margin-top: 8px;
  padding-left: 10px;
  @media only screen and (max-width: 768px) {
    padding-left: 0;
    font-size: 13px;
  }
`;
const RowWap = styled.div<{ last?: boolean }>`
  display: flex;
  align-items: flex-end;
  position: relative;
  justify-content:space-between;
  border-bottom:1px solid #d4d4d4;
  padding: 20px 10px 16px;
  @media only screen and (max-width: 768px) {
    padding: 20px 10px 11px;
  }
`;
const SelectBox = styled.div`
  display:flex;
  justify-content:flex-start;
  height:38px;
  padding:1px 0;
  box-sizing:border-box;
`
const CustomSelect = styled.select`
font-family:'Pretendard Variable';
font-weight: 310;
border:0;
font-size:14px;
box-sizing:border-box;
width:60px;
margin-left:20px;
@media only screen and (max-width:768){
    margin-left:10px;
    font-size:12px;
  }
`
const CustomOption = styled.option`
font-family:'Pretendard Variable';
font-weight: 310;
border:0;
`
const TimerBox = styled.div`
  height:30px;
  text-align:start;
  margin-left:15px;
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

const TitleText = styled.span`
font-family:'Pretendard Variable';
  font-weight: 410;
  font-size: 16px;
  text-align: left;
  margin:50px 0;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const BlackButton = styled.button<{disabled:boolean}>`
font-family:'Pretendard Variable';
background-color:${props => props.disabled? '#494949' : '#000000'};
color:white;
border:0;
cursor: pointer;
  margin-top:20px;
  font-weight:200;
  border-radius:10px;
  height:50px;
  display:flex;
  align-items:center;
  justify-content:center;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`
const TextInput = styled.input`
  color: #000000;
  font-size: 16px;
  font-weight: 310;
  border: 0;
  outline: 0;
  flex: 1;
  @media only screen and (max-width: 768px) {

    font-size: 14px;
  }
`;

const EmptyRowTextInput = styled(TextInput)<{ last?: boolean }>`
  font-family:'Pretendard Variable';
  font-weight: 310;
  border-radius: 0;
  background:white;
  ::placeholder {
      color: #828282;
  }
`;

export default ChangePhone;
