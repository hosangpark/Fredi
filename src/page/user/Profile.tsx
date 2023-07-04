import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@mantine/core';
import { APICheckPassword, APIUserDetails } from '../../api/UserAPI';
import { UserContext } from '../../context/user';

export type TUserDetails = {
  idx: number;
  type: 1 | 2 | 3; // 1: fredi / 2: kakao / 3: naver
  user_id: string;
  password: string;
  name: string;
  nickname: string;
  phone: string;
  gender: 1 | 2;
  birth: string;
  visit_count: number;
  login_time: Date | null;
  created_time: Date;
  suspended_time: Date | null;
  deleted_time: Date | null;
  reason: string;
  level: 0 | 1 | 2 | 3; // 0: 관리자 / 1: 입점업체회원 / 2: 일반회원2 / 3: 일반회원1
  status: 'active' | 'suspended' | 'deleted';
};

function Profile() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [passwordAlert, setPasswordAlert] = useState(false);
  const [isSnsUser, setIsSnsUser] = useState(false);
  const [userDetails, setUserDetails] = useState<TUserDetails>();
  const [password, setPassword] = useState<string>('');
  const { user } = useContext(UserContext);

  const getUserDetails = async () => {
    try {
      const res = await APIUserDetails();
      console.log(res);
      setUserDetails(res);
      setIsSnsUser(res.type !== 1 ? true : false);
    } catch (error) {
      console.log(error);
      navigate('/signin', { replace: true });
    }
  };

  const onCheckPassword = async () => {
    if (!password) return setPasswordAlert(true);
    const data = {
      password: password,
    };
    try {
      const res = await APICheckPassword(data);
      console.log(res);
      navigate('/modifyuserinfo');
    } catch (error) {
      console.log(error);
      setPasswordAlert(true);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <Container>
      <LeftBox>
        <LeftTopBox>
          <Title>Profile</Title>
        </LeftTopBox>
      </LeftBox>
      <RightBox>
        {user.level !== 0 ? (
          <>
            <RowWap>
              <LeftText>아이디</LeftText>
              <RightText>{userDetails?.user_id}</RightText>
            </RowWap>
            <RowWap>
              <LeftText>회원등급</LeftText>
              <RightText>
                {userDetails?.level === 1
                  ? '입점업체회원'
                  : userDetails?.level === 2
                  ? '일반회원2'
                  : userDetails?.level === 3
                  ? '일반회원1'
                  : userDetails?.level === 0
                  ? '관리자'
                  : ''}
              </RightText>
            </RowWap>
            <RowWap>
              <LeftText>이름</LeftText>
              <RightText>{userDetails?.name}</RightText>
            </RowWap>
            <RowWap>
              <LeftText>닉네임</LeftText>
              <RightText>{userDetails?.nickname}</RightText>
            </RowWap>
            <RowWap>
              <LeftText>휴대폰번호</LeftText>
              <RightText>{userDetails?.phone}</RightText>
            </RowWap>
            <RowWap>
              <LeftText>성별</LeftText>
              <RightText>{userDetails?.gender === 1 ? '남자' : userDetails?.gender === 2 ? '여자' : '-'}</RightText>
            </RowWap>
            <RowWap>
              <LeftText>생년월일</LeftText>
              <RightText>{userDetails?.birth ?? '-'}</RightText>
            </RowWap>
            <BottomRowWrap>
              <GreenButton onClick={() => navigate('/orderlist')}>
                <BlackButtonText>주문내역</BlackButtonText>
              </GreenButton>
              <WhiteButton onClick={() => navigate('/asklist-shop')}>
                <GreenBorderbuttonText>상품문의내역</GreenBorderbuttonText>
              </WhiteButton>
              <BlackButton
                onClick={() => {
                  if (!isSnsUser) {
                    setShowModal(true);
                  } else {
                    navigate('/modifyuserinfo');
                  }
                }}
              >
                <BlackButtonText>개인정보수정</BlackButtonText>
              </BlackButton>
            </BottomRowWrap>
          </>
        ) : (
          <>
            <RowWap>
              <LeftText>아이디</LeftText>
              <RightText>admin</RightText>
            </RowWap>
            <RowWap>
              <LeftText>회원 등급</LeftText>
              <RightText>관리자</RightText>
            </RowWap>
          </>
        )}
      </RightBox>
      <EmptyBox />
      <Modal opened={showModal} onClose={() => setShowModal(false)} overlayOpacity={0.5} size="auto" centered withCloseButton={false}>
        <ModalBox>
          <ModalTitle>개인정보 수정을 위해서</ModalTitle>
          <ModalTitle>비밀번호를 입력해 주세요.</ModalTitle>
          <InputWrap>
            <TextInput maxLength={16} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="입력해 주세요" />
            {passwordAlert && <AlertText>*비밀번호를 확인해 주세요.</AlertText>}
          </InputWrap>
          <ButtonWrap>
            <ModalBlackButton onClick={onCheckPassword}>
              <BlackButtonText>확인</BlackButtonText>
            </ModalBlackButton>
            <ModalWhiteButton
              onClick={() => {
                setPassword('');
                setShowModal(false);
              }}
            >
              <WhiteButtonText>취소</WhiteButtonText>
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
  min-height: calc(100vh - 80px);
  flex-direction: row;
  border-top: 1px solid #121212;
  background-color: #ffffff;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
    border-top: 0;
  }
`;

const LeftBox = styled.div`
  display: flex;
  min-width: 290px;
  width: 400px;
  flex-direction: column;
  text-align: left;
  border-right: 1px solid #121212;
  @media only screen and (max-width: 768px) {
    width: 100%;
    border-bottom: 1px solid #121212;
    border-right: 0;
  }
`;

const RightBox = styled.div`
  display: flex;
  flex: 1;
  /* min-width: 734px; */
  flex-direction: column;
  @media only screen and (max-width: 768px) {
    min-width: 300px;
  }
`;

const LeftTopBox = styled.div`
  width: 100%;
  padding: 10px 50px;
  @media only screen and (max-width: 768px) {
    padding: 0 18px;
  }
`;

const Title = styled.h3`
  font-weight: 700;
  color: #121212;
  font-size: 36px;
  @media only screen and (max-width: 768px) {
    font-size: 22px;
  }
`;

const RowWap = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #121212;
  height: 80px;
  @media only screen and (max-width: 768px) {
    height: 50px;
  }
`;

const LeftText = styled.span`
  color: #121212;
  font-size: 16px;
  font-weight: 700;
  width: 200px;
  min-width: 200px;
  border-right: 1px solid #121212;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 18px;
  @media only screen and (max-width: 768px) {
    width: 100px;
    min-width: 100px;
    font-size: 13px;
    text-align: left;
  }
`;

const RightText = styled(LeftText)`
  min-width: 400px;
  font-weight: 410;
  border: 0;
  text-align: left;
  font-size: 16px;
  padding-left: 20px;
  @media only screen and (max-width: 768px) {
    font-size: 13px;
    min-width: 220px;
  }
`;

const BottomRowWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 20px;
  @media only screen and (max-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    margin: 15px;
  }
`;

const BlackButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 60px;
  background-color: #121212;
  cursor: pointer;
  margin-left: 15px;
  @media only screen and (max-width: 768px) {
    width: 90px;
    height: 35px;
    margin-left: 10px;
  }
`;

const GreenButton = styled(BlackButton)`
  background-color: #398049;
`;

const WhiteButton = styled(BlackButton)`
  background-color: #fff;
  border: 1px solid #398049;
`;

const BlackButtonText = styled.span`
  color: #ffffff;
  font-size: 16px;
  font-weight: 410;
  @media only screen and (max-width: 768px) {
    font-size: 11px;
  }
`;

const GreenBorderbuttonText = styled(BlackButtonText)`
  color: #398049;
`;

const EmptyBox = styled.div`
  width: 280px;
  display: flex;
  border-left: 1px solid #121212;
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
    padding: 20px 40px;
  }
`;

const ModalTitle = styled.span`
  font-size: 18px;
  color: #121212;
  font-weight: 700;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const InputWrap = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin: 30px 0 10px;
  @media only screen and (max-width: 768px) {
    margin: 20px 0 10px;
  }
`;

const TextInput = styled.input`
  border: 0;
  border-bottom: 1px solid #121212;
  padding-left: 10px;
  padding-bottom: 3px;
  font-size: 16px;
  color: #121212;
  font-weight: 410;
  outline: 0;
  border-radius: 0;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
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
  cursor: pointer;
  border: 1px solid #121212;
  @media only screen and (max-width: 768px) {
    height: 40px;
  }
`;

const ModalWhiteButton = styled(ModalBlackButton)`
  background-color: #ffffff;
  margin-left: 10px;
  @media only screen and (max-width: 768px) {
    margin-left: 0;
    margin-top: 5px;
  }
`;

const AlertText = styled.span`
  font-weight: 410;
  font-size: 12px;
  color: #d82c19;
  margin-top: 8px;
  padding-left: 10px;
`;

export default Profile;
