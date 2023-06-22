import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { APIGetTerms } from '../../api/SettingAPI';
import {
  APICheckPassword,
  APIDeleteAccount,
  APIModifyPassword,
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

  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [originalPhone, setOriginalPhone] = useState<string>('');
  const [timer, setTimer] = useState(0);
  const [phone, setPhone] = useState<string>('');
  const [isSend, setIsSend] = useState(false);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [authNumber, setAuthNumber] = useState<string>('');
  const isOriginalPhone = phone === originalPhone;
  const testPhoneReg = phoneReg.test(phone);
  const countRef = useRef<any>(null);

  const onSendAuthNumber = async () => {
    if (isOriginalPhone) return setAlertType('originalPhone');
    if (!phone) return setAlertType('sendFaild');
    if (!testPhoneReg) return setAlertType('sendFaild');
    try {
      const data = {
        phone_number: phone,
      };
      const res = await APISendAuthNumber(data);
      
      setAlertType('send');
      setTimer(180);
      setIsSend(true);
    } catch (error) {
      console.log(error);
      setAlertType('member');
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
      setAlertType('auth');
      setTimer(0);
    } catch (error) {
      console.log(error);
      setIsAuth(false);
      setAlertType('authFaild');
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
    if (alertType) {
      setAlertModal(true);
    }
  }, [alertType]);
  
  return (
    <Container style={{ overflow: 'hidden' }}>
      <ContainerWrap>
        <TitleText>Change Phone number</TitleText>
        <SelectBox>
          <CustomSelect>
            <CustomOption>
                +82
            </CustomOption>
            <CustomOption>
                +02
            </CustomOption>
            <CustomOption>
                +01
            </CustomOption>
          </CustomSelect>
        </SelectBox>
        <RowWap>
          <EmptyRowTextInput
            maxLength={11}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="New Number"
          />
          <UnderlineTextButton onClick={
            ()=>{
              // onSendAuthNumber
              setIsSend(true)
              setIsAuth(true)
              setTimer(1)
            }
            }>
            Send Verification number</UnderlineTextButton>
        </RowWap>
        <RowWap>
          <EmptyRowTextInput last maxLength={6} value={authNumber} onChange={(e) => setAuthNumber(e.target.value)} placeholder="[인증번호 입력]" />
        </RowWap>
        <TimerBox>
          {isSend &&
          (timer > 0
            ? Math.floor(timer / 60) + ':' + (timer % 60 > 10 ? timer % 60 : '0' + (timer % 60))
            : isAuth
            ? 
            <AuthText color='blue'>
            인증되었습니다.
            </AuthText>
            : 
            isAuth?
            <AuthText>
            인증번호를 잘못 입력하셨습니다.
            </AuthText>
            :
            <AuthText>
            인증유효기간이 만료되었습니다. 재전송하여 다시 인증번호를 입력해주세요
            </AuthText>
            )}
        </TimerBox>
              
              

        <BlackButton onClick={()=>{
          alert('수정되었습니다.')
          navigate(-1)
        }}>
          Save
        </BlackButton>
      </ContainerWrap>

      
      <AlertModal
        visible={alertModal}
        setVisible={setAlertModal}
        onClick={() => {
          setAlertModal(false);
          setAlertType(undefined);
        }}
        text={
          alertType === 'nicknameDuplicated'
            ? '중복된 닉네임입니다.'
            : alertType === 'nicknameEmpty'
            ? '닉네임을 입력해 주세요.'
            : alertType === 'nicknameAvailable'
            ? '사용 가능한 닉네임입니다.'
            : alertType === 'sendFaild'
            ? '휴대폰 번호를 올바르게 입력해 주세요.'
            : alertType === 'send'
            ? '인증번호가 발송되었습니다.'
            : alertType === 'auth'
            ? '인증되었습니다.'
            : alertType === 'authFaild'
            ? '인증번호를 확인해 주세요.'
            : alertType === 'member'
            ? '이미 가입된 번호입니다.'
            : alertType === 'modified'
            ? '프로필이 수정되었습니다.'
            : alertType === 'faild'
            ? '닉네임 중복 확인과 휴대폰 인증을 완료해 주세요.'
            : alertType === 'originalPhone'
            ? '기존 휴대폰 번호와 같습니다.'
            : alertType === 'originalNickname'
            ? '기존 닉네임과 같습니다.'
            : alertType === 'passwordEmpty'
            ? '비밀번호를 입력해 주세요.'
            : alertType === 'passwordFaild'
            ? '기존 비밀번호와 일치하지 않습니다.'
            : alertType === 'passwordAuth'
            ? '기존 비밀번호가 인증되었습니다. 새로운 비밀번호를 입력해 주세요.'
            : alertType === 'passwordReg'
            ? '비밀번호는 8-16자 영문, 숫자로 구성되어야 합니다.'
            : alertType === 'password'
            ? '비밀번호가 변경되었습니다.'
            : alertType === 'needPasswordAuth'
            ? '기존 비밀번호 인증을 먼저 완료해 주세요.'
            : alertType === 'reason'
            ? '탈퇴 사유를 입력해 주세요.'
            : alertType === 'agree'
            ? '탈퇴 약관에 동의해 주세요.'
            : alertType === 'deleted'
            ? '회원 탈퇴가 완료되었습니다.'
            : alertType === 'passwordDiffrent'
            ? '새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다.'
            : ''
        }
      />

      {/* <PostModal visible={showModal} setVisible={setShowModal} setAddress={onAddress} /> */}
    </Container>
  );
}


const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  border-top: 1px solid #121212;
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
  font-weight: 500;
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
  font-weight: 300;
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
  margin: 30px 0;
  padding:0 20px;
  @media only screen and (max-width: 768px) {
    min-width: 300px;

    /* border-top:1px solid #d4d4d4; */
  }
`;
const UnderlineTextButton = styled.span`
font-family:'Pretendard Variable';
  font-weight: 400;
  color: #000000;
  border:2px solid #292929;
  border-radius:5px;
  padding: 5px 10px;
  margin-top:17px;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;
const AlertText = styled.span`
  font-weight: 400;
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
  align-items: center;
  position: relative;
  justify-content:space-between;
  border-bottom:1px solid #d4d4d4;
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
border:0;
font-size:14px;
font-weight:500;
box-sizing:border-box;
width:60px;
margin-left:20px;
  @media only screen and (max-width:768){
    font-size:12px;
  }
`
const CustomOption = styled.option`
  border:0;
`
const TimerBox = styled.div`
  height:30px;
  text-align:start;
  margin-left:20px;
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
  font-weight:500;
  font-size: 16px;
  text-align: left;
  line-height: 80px;
  margin-bottom:20px;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
    line-height: 50px;
  }
`;
const BlackButton = styled.div`
font-family:'Pretendard Variable';
  background-color:#000000;
  color:white;
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
  color: #121212;
  font-size: 16px;
  font-weight: 400;
  border: 0;
  height: 100%;
  padding: 20px 0 0px 20px;
  outline: 0;
  flex: 1;

  @media only screen and (max-width: 768px) {
    font-size: 13px;
  }
`;

const EmptyRowTextInput = styled(TextInput)<{ last?: boolean }>`
  font-family:'Pretendard Variable';
  font-weight:normal;
  height: 80px;
  border-radius: 0;
  background:white;
  @media only screen and (max-width: 768px) {
    height: 50px;
    line-height: 50px;
    font-size: 13px;
  }
`;

export default ChangePhone;
