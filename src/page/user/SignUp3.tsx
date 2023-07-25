import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal } from '@mantine/core';
import { APIGetTerms } from '../../api/SettingAPI';
import { APISendAuthNumber, APISignUp, APIVerifyAuthNumber } from '../../api/UserAPI';
import 'dayjs/locale/ko';
import CheckBox from '../../components/Shop/CheckBox';
import AlertModal from '../../components/Modal/AlertModal';

function SignUp3() {
  const navigate = useNavigate();
  const location = useLocation();
  const [Name, setName] = useState('')
  const [Phone, setPhone] = useState('')
  const [authnumber, setAuthNumber] = useState('')
  const [timer, setTimer] = useState(0);
  const [isSend, setIsSend] = useState(false);
  // const [isAuth, setIsAuth] = useState<boolean>(false);
  const [Checked, setChecked] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<string[] | undefined>();
  const [showModal, setShowModal] = useState(false);
  const [termsOfUse, setTermsOfUse] = useState<string>('');
  const [privacyPolicy, setPrivacyPolicy] = useState<string>('');
  const countRef = useRef<any>(null);
  const [tab, setTab] = useState<1 | 2>(1);
  const [confirm, setConfirm] = useState(false);
  const [Signed, setSigned] = useState(false);

  const onSendAuthNumber = async () => {
    // if (isOriginalPhone) return setAlertType('originalPhone');
    // if (!phone) return setAlertType('sendFaild');
    // if (!testPhoneReg) return setAlertType('sendFaild');
    try {
      const data = {
        phone_number: Phone,
      };
      const res = await APISendAuthNumber(data);
      console.log(res)
      // setAlertType('send');
      setTimer(180);
      setIsSend(true);
    } catch (error) {
      setSigned(true)
      console.log(error);
      setAlertType(['member']);
    }
  };

  const CheckNext = async() => {
    let type: string[] = [];
    if(!Name) type.push('NoName')
    if(!Checked) type.push('NoCheck')
    if(!authnumber) type.push('NoAuthNumber')

    
    if (type.length > 0) {
      return setAlertType(type);
    } else {
        setAlertType(undefined);
        // navigate('/')
        const data = {
          type: location.state.type,
          user_id: location.state.user_id,
          password: location.state.password,
          name: Name,
          phone: Phone,
          level: location.state.type
      };
      try {
        const res = await APISignUp(data);
        console.log(res);
        setConfirm(true);
      } catch (error) {
        console.log(error);
        alert(error);
      }
    }
  }

  // const onCheckAuth = async () => {
  //   try {
  //     const data = {
  //       phone_number: Phone,
  //       auth_number: authnumber,
  //     };
  //     const res = await APIVerifyAuthNumber(data);
  //     setIsAuth(true);
  //     // setAlertType('auth');
  //     // setTimer(0);
  //   } catch (error) {
  //     console.log(error);
  //     setIsAuth(false);
  //     // setAlertType('authFaild');
  //   }
  // };

  const clearAlert = (alert: any) => {
    setAlertType((prev) => prev?.filter((item) => item !== alert));
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
    if(timer < 170){
      setIsSend(false)
    }
  }, [timer]);

  // useEffect(() => {
  //   if (authnumber.length > 0) {
  //     onCheckAuth()
  //   }
  // }, [authnumber]);
  

  return (
    <Container>
      <SignUpTitle>
        Sign Up
      </SignUpTitle>
      <TypeContainer>
        <InputWrap>
        <RowWrap>
          <Input
            maxLength={10}
            value={Name}
            onChange={e=>{
              setName(e.target.value);
              clearAlert('NoName');
              }}
            placeholder="Name"
          />
        </RowWrap>
        <TimerBox>
        </TimerBox>
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
        </InputWrap>
        <RowWrap>
          <Input
            // maxLength={25}
            value={Phone}
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
        </RowWrap>
        <RowWrap>
          <Input
            // maxLength={25}
            value={authnumber}
            onChange={e=>{
              setAuthNumber(e.target.value)
              clearAlert('NoAuthNumber');
              }}
            placeholder="Verification Number"
          />
        </RowWrap>
        <TimerBox>
        {timer > 0 && Math.floor(timer / 60) + ':' + (timer % 60 > 10 ? timer % 60 : '0' + (timer % 60))}
        {alertType?.includes('NoAuthNumber') && 
        <AuthText>
          인증번호를 확인해주세요.
        </AuthText>
        }
        </TimerBox>
        <CheckSign>
        <CheckBox  onClick={()=>setChecked(!Checked)} checked={Checked} size={23}/>
          <TextBox>
            <span  onClick={()=>setChecked(!Checked)}>By Checking this box, you consent to our </span>&nbsp;<UnderLineText onClick={()=>{setShowModal(true);setTab(1)}}>Terms of Use</UnderLineText>&nbsp; and &nbsp;<UnderLineText onClick={()=>{setShowModal(true);setTab(2)}}>&nbsp;Privacy Policy</UnderLineText>
          </TextBox>
        </CheckSign>
        <TimerBox>
        {alertType?.includes('NoCheck') && 
        <AuthText>
          약관에 동의해주세요.
        </AuthText>
        }
        </TimerBox>
        <NextButton onClick={CheckNext}>
          <ButtonText>
            Sign Up
          </ButtonText>
        </NextButton>
      </TypeContainer>
      <Modal opened={showModal} onClose={() => setShowModal(false)} overlayOpacity={0.5} size="auto" centered withCloseButton={false}>
      <ModalBox>
      <ModalTitle>{tab === 1? '이용약관' : '개인정보 처리방침'}</ModalTitle>
        <ModalContentBox value={tab === 1? termsOfUse : privacyPolicy} disabled />
        <ModalBlackButton
          onClick={() => {
            setShowModal(false);
          }}
        >
        <BlackButtonText>확인</BlackButtonText>
      </ModalBlackButton>
      </ModalBox>
      </Modal>
      <AlertModal
        visible={Signed}
        setVisible={setSigned}
        text={'이미 가입된 번호입니다.'}
        onClick={() => {
          setSigned(false);
        }}
      />
      <AlertModal
        visible={confirm}
        setVisible={setConfirm}
        text={'회원가입이 완료되었습니다.'}
        onClick={() => {
          setConfirm(false);
          navigate('/signin', { replace: true });
        }}
      />
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
  padding:0 10px;
  border: 0;
  font-size: 16px;
  color: #121212;
  font-weight: 410;
  outline: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 69px;
  @media only screen and (max-width: 768px) {
    font-size: 15px;
  }
`
const CheckSign = styled.div`
font-family:'Pretendard Variable';
display:flex;
height:70px;
padding:10px 0 0 5px;
@media only screen and (max-width: 769px){
}

`
const TextBox = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 2; // 원하는 라인수
  -webkit-box-orient: vertical;
  overflow:hidden;
  text-overflow:hidden;
  margin-left:10px;
`
const UnderLineText = styled.span`
font-family:'Pretendard Variable';
font-weight:510;
  text-decoration:underline;
  white-space:nowrap;
`
const UnderlineTextButton = styled.button`
  font-family:'Pretendard Variable';
  font-weight: 310;
  width:250px;
  color: #000000;
  background-color:#ffff;
  border:1px solid #000000;
  border-radius:5px;
  padding: 0px;
  height:36px;
  cursor: pointer;
  font-size: 14px;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;
const InputWrap = styled.div`
  display:flex;
  flex-direction:column;
  margin-bottom:60px;
  @media only screen and (max-width: 769px){
    margin-bottom:10px;
  }
`
const RowWrap = styled.div`
  display: flex;
  align-items:center;
  justify-content:space-between;
  border-bottom:1px solid #c0c0c0;
  box-sizing:border-box;
`
const TimerBox = styled.div`
  display:flex;
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
  margin-top:50px;
  height:70px;
  justify-content: center;

`
const ButtonText = styled.span`
  font-weight: 360;
  color: #ffffff;
  font-size: 18px;
  @media only screen and (max-width: 769px){
    font-size: 16px;
}`
const SelectBox = styled.div`
  display:flex;
  justify-content:flex-start;
  height:40px;
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
const ModalBox = styled.div`
  background-color: #fff;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media only screen and (max-width: 768px) {
    padding: 10px 10px;
  }
`;

const ModalTitle = styled.span`
  font-family:'Pretendard Variable';
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
const ModalContentBox = styled.textarea`
  font-family:'Pretendard Variable';
  width: 600px;
  height: 700px;
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
    width: 400px;
    height: 400px;
    font-size: 12px;
    line-height: 20px;
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
export default SignUp3;
