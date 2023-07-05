import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Checkbox, Modal, Select } from '@mantine/core';
import arrDownImage from '../../asset/image/arr_down.png';
import rightArrowImage from '../../asset/image/pager_right.png';
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
import AlertModal from '../../components/Modal/AlertModal';
import { TUserDetails } from './Profile';
import { passwordReg, phoneReg } from '../../util/Reg';
import { useRef } from 'react';
import { APISaveAddress } from '../../api/ShopAPI';
import PostModal from '../../components/Modal/PostModal';

const REASONLIST = [
  { value: '', label: '탈퇴 사유 선택' },
  { value: '사용빈도 낮음', label: '사용빈도 낮음' },
  { value: '서비스 불만', label: '서비스 불만' },
  { value: '개인정보 유출 우려', label: '개인정보 유출 우려' },
  { value: '기타', label: '기타' },
];

function ChangePassword() {
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

  const [isVerifiedPassword, setIsVerifiedPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newPassword2, setNewPassword2] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const countRef = useRef<any>(null);
  const testPasswordReg = passwordReg.test(newPassword);


  const onCheckPassword = async () => {
    if (!password) return setAlertType('passwordEmpty');
    const data = {
      password: password,
    };
    try {
      const res = await APICheckPassword(data);
      setAlertType('passwordAuth');
      setIsVerifiedPassword(true);
    } catch (error) {
      console.log(error);
      setAlertType('passwordFaild');
      setIsVerifiedPassword(false);
    }
  };

  const onModifyPassword = async () => {
    if (!isVerifiedPassword) return setAlertType('needPasswordAuth');
    if (!newPassword) return setAlertType('passwordReg');
    if (!testPasswordReg) return setAlertType('passwordReg');
    if (newPassword !== newPassword2) return setAlertType('passwordDiffrent');
    try {
      const data = {
        password: newPassword,
      };
      const res = await APIModifyPassword(data);
      
      setAlertType('password');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (newPassword2.length > 0) {
      onCheckPassword()
    }
  }, [newPassword2]);

  return (
    <Container style={{ overflow: 'hidden' }}>
      <ContainerWrap>
        <TitleText>Change Password</TitleText>
        <RowWap>
          <EmptyRowTextInput
            maxLength={16}
            disabled={false}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            type="password"
          />
        </RowWap>
        <RowWap>
          <EmptyRowTextInput
            maxLength={16}
            disabled={false}
            value={newPassword2}
            onChange={(e) => setNewPassword2(e.target.value)}
            placeholder="Confirm your Password again"
            type="password"
          />
        </RowWap>
        {/* {isSend && authNumber.length > 0  ?
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
        } */}

        <BlackButton onClick={()=>{
          alert('수정되었습니다.')
          navigate(-1)
        }}>
          Save
        </BlackButton>
      </ContainerWrap>

      {/* <AlertModal
        visible={alertModal}
        setVisible={setAlertModal}
        onClick={() => {
          setAlertModal(false);
          setAlertType(undefined);
        }}
        text={
          alertType === 'nicknameDuplicated'
            ? '중복된 닉네임입니다.'
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
      /> */}
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

const RowWap = styled.div<{ last?: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  justify-content:space-between;
  border-bottom:1px solid #ECECEC;
  @media only screen and (max-width: 768px) {
  }
`;


const TitleText = styled.span`
font-family:'Pretendard Variable';
  font-weight: 360;
  font-size: 16px;
  text-align: left;
  margin:50px 0;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;
const BlackButton = styled.div`
font-family:'Pretendard Variable';
  background-color:#000000;
  color:white;
  margin-top:50px;
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
  font-weight: 410;
  border: 0;
  height: 100%;
  padding: 50px 10px 20px;
  outline: 0;
  flex: 1;
  @media only screen and (max-width: 768px) {
    padding: 47px 10px 16px;
    font-size: 14px;
  }
`;

const EmptyRowTextInput = styled(TextInput)<{ last?: boolean }>`
  font-family:'Pretendard Variable';
  font-weight:normal;
  border-radius: 0;
  background:white;
  ::placeholder {
      color: #828282
  }

`;
const TimerBox = styled.div`
  height:30px;
  text-align:start;
  margin-left:15px;
`
const Emptybox = styled.div`
  height:30px;
`

export default ChangePassword;
