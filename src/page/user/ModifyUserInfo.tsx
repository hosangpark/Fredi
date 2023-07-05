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

function ModifyUserInfo() {
  const navigate = useNavigate();
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [terms, setTerms] = useState<string>('');
  const [reason, setReason] = useState<string | null>('');
  const [reasonText, setReasonText] = useState<string>('');
  const [agree, setAgree] = useState<boolean>(false);
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

  const [userDetails, setUserDetails] = useState<TUserDetails>();

  const [originalNickname, setOriginalNickname] = useState<string>('');
  const [originalPhone, setOriginalPhone] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [isDuplicatedNickname, setIsDuplicatedNickname] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>('');
  const [authNumber, setAuthNumber] = useState<string>('');
  const [isSend, setIsSend] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isVerifiedPassword, setIsVerifiedPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newPassword2, setNewPassword2] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [showSaveAddressModal, setShowSaveAddressModal] = useState<boolean>(false);

  const [zipCode, setZipCode] = useState<string>('');
  const [address1, setAddress1] = useState<string>('');
  const [address2, setAddress2] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [recipientPhone, setRecipientPhone] = useState<string>('');
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);

  const countRef = useRef<any>(null);
  const isOriginalNickname = nickname === originalNickname;
  const isOriginalPhone = phone === originalPhone;
  const isVerified = !isDuplicatedNickname && isAuth;

  const testPasswordReg = passwordReg.test(newPassword);
  const testPhoneReg = phoneReg.test(phone);

  const getUserDetails = async () => {
    try {
      const res = await APIUserDetails();
      
      setUserDetails(res);
      setNickname(res.nickname);
      setOriginalNickname(res.nickname);
      setOriginalPhone(res.phone);
      console.log('ddddd',res)
      // const addressData = res.address;
      // setZipCode(addressData.zipcode);
      // setAddress1(addressData.address1);
      // setAddress2(addressData.address2);
      // setRecipient(addressData.recipient);
      // setRecipientPhone(addressData.hp);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const onCheckNickname = async () => {
    if (isOriginalNickname) return setAlertType('originalNickname');
    if (!nickname) return setAlertType('nicknameEmpty');
    try {
      const data = {
        nickname: nickname,
      };
      const res = await checkNicknameExcludeUser(data);
      setAlertType('nicknameAvailable');
      setIsDuplicatedNickname(false);
    } catch (error) {
      console.log(error);
      setIsDuplicatedNickname(true);
      setAlertType('nicknameDuplicated');
      setNickname('');
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

  const onModifyUserInfo = async () => {
    if (!isVerified) return setAlertType('faild');
    const data = {
      nickname: nickname,
      phone: phone,
    };
    try {
      const res = await APIModifyUserDetails(data);
      
      setAlertType('modified');
      setNewPassword('');
      setNewPassword2('');
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

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

  const onDeleteAccount = async () => {
    if (!reason) return setAlertType('reason');
    if (reason === '기타' && !reasonText) return setAlertType('reason');
    if (!agree) return setAlertType('agree');
    const data = {
      reason: reason === '기타' ? reasonText : reason,
    };
    console.log(data);
    try {
      const res = await APIDeleteAccount(data);
      
      sessionStorage.clear();
      setDeleteAccountModal(true);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const getTerms = async () => {
    const data = {
      type: 3,
    };
    try {
      const res = await APIGetTerms(data);
      setTerms(res);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const onAddress = (value: { address: string; zonecode: string }) => {
    console.log('zonecode', value.zonecode);
    console.log('address', value.address);
    setZipCode(value.zonecode);
    setAddress1(value.address);
  };

  const onSaveAddress = async () => {
    const data = {
      zipcode: zipCode,
      address1: address1,
      address2: address2,
      recipient: recipient,
      hp: recipientPhone,
    };
    try {
      const res = await APISaveAddress(data);
      
      setShowSaveAddressModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // getTerms();
    getUserDetails();
  }, []);

  useEffect(() => {
    console.log(reason);
  }, [reason]);

  useEffect(() => {
    if (alertType) {
      setAlertModal(true);
    }
  }, [alertType]);

  useEffect(() => {
    if (isOriginalNickname) {
      setIsDuplicatedNickname(false);
    } else {
      setIsDuplicatedNickname(true);
    }
  }, [nickname]);

  useEffect(() => {
    if (isOriginalPhone) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, [phone]);

  useEffect(() => {
    console.log('phone인증', isAuth);
    console.log('nickname중복', isDuplicatedNickname);
  }, [isDuplicatedNickname, isAuth]);

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
    <Container style={{ overflow: 'hidden' }}>
      
      
      {/* <LeftBox>
        <LeftTopBox>
          <Title>개인정보수정</Title>
        </LeftTopBox>
      </LeftBox> */}
      <RightBox>
        <RowWap>
          <LeftText>ID</LeftText>
          <RightText marginR={35}>{userDetails?.user_id? userDetails?.user_id : 'Id'}</RightText>
        </RowWap>
        <RowWap>
          <LeftText>Full name</LeftText>
          <RightText marginR={35}>{userDetails?.name ? userDetails?.name : 'Name'  }</RightText>
        </RowWap>
        <RowWap>
          <LeftText>User name</LeftText>
          <RightText marginR={35}>{userDetails?.nickname ? userDetails?.nickname : 'NickName'  }</RightText>
          {/* <TextInput maxLength={10} value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="닉네임 입력" /> */}
          {/* <UnderlineTextButton onClick={onCheckNickname}>중복확인</UnderlineTextButton> */}
        </RowWap>
        <RowWap>
          <LeftText>Phone</LeftText>
          {/* <RightText marginR={35}>{userDetails?.phone? userDetails?.phone : 'Number'}</RightText> */}
          <RightText onClick={()=> navigate('/changePhone')}>
            {originalPhone}
            <RightArrow src={rightArrowImage}/>
          </RightText>
        </RowWap>
        <RowWap>
          <LeftText>Password</LeftText>
          <RightText onClick={()=> navigate('/changePassword')}>
            Edit
            <RightArrow src={rightArrowImage}/>
          </RightText>
        </RowWap>
        <RowWap style={{paddingTop:100}}>
          <LeftText>Address</LeftText>
          <RightText onClick={()=> navigate('/changeAddress')}>
            Edit
            <RightArrow src={rightArrowImage}/>
          </RightText>
        </RowWap>
        <RowWap style={{paddingTop:100}}>
          <LeftText style={{color:'#9C343F'}}>Delete Account</LeftText>
          <RightText onClick={()=>setShowAccountModal(true)}>
            Delete
            <RightArrow src={rightArrowImage}/>
          </RightText>
        </RowWap>
        
        {/* {userDetails?.type === 1 && (
          <>
            <RowWap>
              <LeftText>Password</LeftText>
              <TextInput
                maxLength={16}
                disabled={isVerifiedPassword}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="기존 비밀번호"
                type="password"
              />
              {!isVerifiedPassword && <UnderlineTextButton onClick={onCheckPassword}>인증하기</UnderlineTextButton>}
            </RowWap>
          </>
        )} */}
        {/* <EmptyRowWrap last style={{ height: '100%', alignItems: 'flex-start' }}>
          <EmptyRowLeftBox />
          <EmptyRowRightWrap>
            {userDetails?.type === 1 && (
              <>
                <EmptyRowInputWrap>
                  <EmptyRowTextInput
                    maxLength={16}
                    disabled={!isVerifiedPassword}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="새 비밀번호"
                    type="password"
                  />
                </EmptyRowInputWrap>
                <EmptyRowInputWrap>
                  <EmptyRowTextInput
                    maxLength={16}
                    disabled={!isVerifiedPassword}
                    value={newPassword2}
                    onChange={(e) => setNewPassword2(e.target.value)}
                    placeholder="새 비밀번호 확인"
                    type="password"
                  />
                  <UnderlineTextButton onClick={onModifyPassword}>변경하기</UnderlineTextButton>
                </EmptyRowInputWrap>
              </>
            )}

            <ButtonRowWrap>
              <Button onClick={onModifyUserInfo} type="black">
                <ButtonText type="black">수정</ButtonText>
              </Button>
              <BackButton type="white" onClick={() => navigate(-1)}>
                <ButtonText type="white">이전</ButtonText>
              </BackButton>
              <AddressModalButton type="white" onClick={() => setShowAddressModal(true)}>
                <ButtonText type="white">배송지 설정</ButtonText>
              </AddressModalButton>
              <Button onClick={() => setShowAccountModal(true)} type="green">
                <ButtonText type="green">회원탈퇴</ButtonText>
              </Button>
            </ButtonRowWrap>
          </EmptyRowRightWrap>
        </EmptyRowWrap> */}
      </RightBox>

      <Modal opened={showAccountModal} onClose={() => setShowAccountModal(false)} overlayOpacity={0.5} size="auto" centered withCloseButton={false}>
        <ModalBox>
          <ModalTitle>회원탈퇴를 진행하시겠습니까?</ModalTitle>
          <ModalTitle>해당 사이트의 회원서비스의 이용이 종료됩니다.</ModalTitle>
          <ModalContentBox disabled>{terms}</ModalContentBox>
          <UnderLineBox>
            <Select
              rightSection={<DownIcon src={arrDownImage} />}
              styles={(theme) => ({
                rightSection: { pointerEvents: 'none' },
                root: { width: '100%' },
                item: {
                  '&[data-selected]': {
                    '&, &:hover': {
                      backgroundColor: '#121212',
                      color: '#fff',
                    },
                  },
                },
              })}
              variant="unstyled"
              value={reason}
              data={REASONLIST}
              onChange={setReason}
            />
          </UnderLineBox>
          {reason === '기타' && <ReasonInput value={reasonText} onChange={(e) => setReasonText(e.target.value)} placeholder="탈퇴 사유 입력" />}
          <CheckboxWrap>
            <Checkbox
              checked={agree}
              onChange={(e) => setAgree(e.currentTarget.checked)}
              label="유의사항을 모두 확인하였으며, 회원 탈퇴합니다."
              styles={{
                label: { cursor: 'pointer' },
                input: { cursor: 'pointer', borderColor: '#121212', '&:checked': { backgroundColor: '#121212', borderColor: '#121212' } },
              }}
            />
          </CheckboxWrap>
          <ButtonWrap>
            <ModalBlackButton onClick={onDeleteAccount}>
              <BlackButtonText>Delete</BlackButtonText>
            </ModalBlackButton>
            {/* <ModalWhiteButton onClick={() => setShowAccountModal(false)}>
              <WhiteButtonText>닫기</WhiteButtonText>
            </ModalWhiteButton> */}
          </ButtonWrap>
        </ModalBox>
      </Modal>
      <Modal opened={showAddressModal} onClose={() => setShowAddressModal(false)} overlayOpacity={0.5} size="auto" centered withCloseButton={false}>
        <AddressModalBox>
          <AddressModalTitle>배송지 설정</AddressModalTitle>
          <ModifyDeliveryInfoBox>
            <InputWrap>
              <SearchAddressInputWrap>
                <AddressModalTextInput value={zipCode} disabled placeholder="우편번호" style={{ backgroundColor: '#fff' }} />
                <SearchButton onClick={() => setShowModal(true)}>
                  <SearchButtonText>검색</SearchButtonText>
                </SearchButton>
              </SearchAddressInputWrap>
              <AddressModalTextInput value={address1} onChange={(e) => setAddress1(e.target.value)} placeholder="주소를 검색해 주세요." />
              <AddressModalTextInput value={address2} onChange={(e) => setAddress2(e.target.value)} placeholder="상세 주소 입력" />
            </InputWrap>
            <RecipientInputRowWrap>
              <RecipientInputLeftText>이름</RecipientInputLeftText>
              <RecipientInput value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="수령인 입력" />
            </RecipientInputRowWrap>
            <RecipientInputRowWrap last>
              <RecipientInputLeftText>휴대폰번호</RecipientInputLeftText>
              <RecipientInput
                value={recipientPhone}
                onChange={(e) => {
                  setRecipientPhone(e.target.value.replace(/[^0-9]/g, ''));
                }}
                placeholder="휴대폰 번호 입력"
              />
            </RecipientInputRowWrap>
          </ModifyDeliveryInfoBox>
          <AddressModalButtonWrap>
            <AddresModalBlackButton onClick={onSaveAddress}>
              <BlackButtonText>저장하기</BlackButtonText>
            </AddresModalBlackButton>
            <ModalWhiteButton onClick={() => setShowAddressModal(false)}>
              <WhiteButtonText>닫기</WhiteButtonText>
            </ModalWhiteButton>
          </AddressModalButtonWrap>
        </AddressModalBox>
      </Modal>
      <Modal opened={showModal} onClose={() => setShowModal(false)} overlayOpacity={0.5} size="auto" centered withCloseButton={false}>
        <ModalBox>
          <ModalTitle>개인정보 수정을 위해서</ModalTitle>
          <ModalTitle>비밀번호를 입력해 주세요.</ModalTitle>
          <InputWrap>
            <TextInput maxLength={16} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="입력해 주세요" />
            {alertType === 'passwordFaild' && <AlertText>*비밀번호를 확인해 주세요.</AlertText>}
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
      <AlertModal
        visible={deleteAccountModal}
        setVisible={setDeleteAccountModal}
        onClick={() => {
          setDeleteAccountModal(false);
          navigate('/');
        }}
        text={'회원 탈퇴가 완료되었습니다.'}
      />

      <PostModal visible={showModal} setVisible={setShowModal} setAddress={onAddress} />
      <AlertModal
        visible={showAlertModal}
        setVisible={setShowAlertModal}
        onClick={() => {
          setShowAlertModal(false);
        }}
        text={'배송지를 입력해 주세요.'}
      />
      <AlertModal
        visible={showSaveAddressModal}
        setVisible={setShowSaveAddressModal}
        onClick={() => {
          setShowSaveAddressModal(false);
          setShowAddressModal(false);
        }}
        text={'배송지가 저장되었습니다.'}
      />
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
const SaveButton = styled.div`
  position:absolute;
  right:30px;
  top:20px;
  z-index:101;
  font-family:'Pretendard Variable';
  font-weight: 310;
  color: #121212;
  cursor: pointer;
  display:none;
  @media only screen and (max-width: 768px) {
      display:block;
      font-size:14px;
  }
`;
const LeftBox = styled.div`
  display: flex;
  min-width: 290px;
  width: 400px;
  flex-direction: column;
  text-align: left;

  @media only screen and (max-width: 768px) {
    width: 100%;

  }
`;

const RightBox = styled.div`
  display: flex;
  flex: 1;
  max-width: 768px;
  flex-direction: column;
  padding:0 20px;
margin:30px auto;
  @media only screen and (max-width: 768px) {
    /* min-width: 300px; */
    margin: 30px 0;

    /* border-top:1px solid #d4d4d4; */
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
  font-size: 30px;
  @media only screen and (max-width: 768px) {
    font-size: 22px;
  }
`;

const RowWap = styled.div<{ last?: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  justify-content:space-between;
  border-bottom:1px solid #ECECEC;
  @media only screen and (max-width: 768px) {
    padding:20px 0;
  }
`;

const EmptyRowWrap = styled(RowWap)`
  height: auto;
`;


const EmptyRowLeftBox = styled.div`
  min-width: 200px;
  max-width: 300px;
  
  height: 100%;
  @media only screen and (max-width: 768px) {
    width: 120px;
    min-width: 79px;
  }
`;

const LeftText = styled.span`
display:flex;
align-items:center;
  font-family:'Pretendard Variable';
    font-weight:normal;
    color: #000000;
    font-size: 16px;
    font-weight: 500;
    flex:4;
    height: 100%;
    text-align: left;
    @media only screen and (max-width: 768px) {
      font-size: 12px;
  }
`;
const RightText = styled(LeftText)<{marginR?:number}>`
justify-content:flex-end;
font-family:'Pretendard Variable';
  font-weight: 310;
  color:#000000;
  width:100%;
  border: 0;
  flex:6;
  font-size: 14px;
  text-align: right;
  margin-right:${(props)=> props.marginR ? props.marginR : 0}px;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;
const RightArrow = styled.img`
  width:15px;
  height:15px;
  margin:0 10px;
`

const BlackButtonText = styled.span`
  color: #ffffff;
  font-size: 16px;
  font-weight: 410;
  line-height: 60px;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const EmptyBox = styled.div`
  width: 280px;
  display: flex;

`;

const WhiteButtonText = styled(BlackButtonText)`
  color: #121212;
`;

const ModalBox = styled.div`
  width: 550px;
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

const AddressModalBox = styled(ModalBox)`
  width: 550px;

  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;

const ModalTitle = styled.span`
font-family:'Pretendard Variable';
  font-size: 16px;
  color: #000000;
  font-weight: 450;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const ButtonWrap = styled.div`
  display: flex;
  width:100%;
  margin-top: 10px;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const ModalBlackButton = styled.div`
  width: 100%;
  height: 60px;
  background-color: #121212;
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  @media only screen and (max-width: 768px) {
    flex: none;
    width: 100%;
    height: 45px;
    margin-bottom: 5px;
  }
`;

const ModalWhiteButton = styled(ModalBlackButton)`
  background-color: #ffffff;
  margin-left: 10px;
  @media only screen and (max-width: 768px) {
    margin-left: 0;
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

const ButtonRowWrap = styled.div`
  display: flex;
  margin: 20px 10px 50px;
  align-self: flex-end;
  flex-wrap: wrap;
  @media only screen and (max-width: 768px) {
    margin: 20px 10px 30px 20px;
  }
`;

const Button = styled.div<{ type: 'black' | 'white' | 'green' }>`
  width: 140px;
  height: 60px;

  background-color: ${(props) => (props.type === 'black' ? '#121212' : '#fff')};
  border-color: ${(props) => (props.type === 'green' ? '#398049' : '#121212')};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    width: 90px;
    height: 40px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
`;
const BackButton = styled.div<{ type: 'black' | 'white' | 'green' }>`
  width: 140px;
  height: 60px;

  background-color: ${(props) => (props.type === 'black' ? '#121212' : '#fff')};
  border-color: ${(props) => (props.type === 'green' ? '#398049' : '#121212')};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const ButtonText = styled.span<{ type: 'black' | 'white' | 'green' }>`
  color: ${(props) => (props.type === 'black' ? '#ffffff' : props.type === 'white' ? '#121212' : '#398049')};
  font-size: 16px;
  font-weight: 410;
  @media only screen and (max-width: 768px) {
    font-size: 13px;
  }
`;

const UnderLineBox = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  padding: 0px 10px;

`;

const DownIcon = styled.img`
  width: 14px;
  height: 14px;
  cursor: pointer;
`;

const TextInput = styled.input`
  color: #121212;
  font-size: 16px;
  font-weight: 410;
  border: 0;
  height: 100%;
  padding: 10px;
  padding-left: 20px;
  outline: 0;
  flex: 1;

  @media only screen and (max-width: 768px) {
    font-size: 13px;
    min-width: 240px;
  }
`;

const EmptyRowRightWrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media only screen and (max-width: 768px) {
  }
`;

const EmptyRowTextInput = styled(TextInput)<{ last?: boolean }>`
  border-bottom: 1px solid #121212;
  height: 80px;
  border-radius: 0;
  @media only screen and (max-width: 768px) {
    height: 50px;
    line-height: 50px;
    font-size: 13px;
    min-width: 240px;

  }
`;

const UnderlineTextButton = styled.span`
  font-weight: 410;
  font-size: 15px;
  color: #121212;
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  text-decoration: underline;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    font-size: 11px;
    right: 10px;
  }
`;

const EmptyRowInputWrap = styled.div`
  text-align: left;
  position: relative;
  width: 100%;
  display: flex;
`;

const ModalContentBox = styled.textarea`
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
  margin-top: 10px;
  background-color: #fff;
  -webkit-text-fill-color: #121212;
  opacity: 1;

  @media only screen and (max-width: 768px) {
    width: 260px;
    height: 250px;
    font-size: 12px;
    line-height: 20px;
    margin-top: 10px;
  }
`;

const CheckboxWrap = styled.div`
  display: flex;
  align-self: flex-start;
  margin: 20px 0;
`;

const ReasonInput = styled.textarea`
  width: 100%;
  height: 120px;

  padding: 10px;
  font-size: 14px;
  font-weight: 410;
  color: #121212;
  vertical-align: top;
  resize: none;
  outline: 0;
  margin-top: 20px;
`;

const InputWrap = styled.div<{ last?: boolean }>`
  margin-bottom: ${(props) => (props.last ? 0 : 30)}px;
`;

const SearchAddressInputWrap = styled.div`
  display: flex;
`;

const SearchButton = styled.div`
  width: 80px;
  height: 35px;
  background-color: #121212;
  margin-left: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
  }
`;

const SearchButtonText = styled.span`
  font-weight: 410;
  color: #ffffff;
  font-size: 12px;
  @media only screen and (max-width: 768px) {
    font-size: 11px;
  }
`;

const ModifyDeliveryInfoBox = styled.div`
  padding: 30px 0 0;
  @media only screen and (max-width: 768px) {
    padding: 25px 0 0;
  }
`;

const SaveAddressButtonText = styled(SearchButtonText)`
  font-size: 10px;
`;

const ContentTextRowWrap = styled.div<{ last?: boolean }>`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${(props) => (props.last ? 0 : '7px')};
`;

const RecipientInputRowWrap = styled(ContentTextRowWrap)<{ last?: boolean }>`
  align-items: center;
`;

const ContentLeftText = styled.span`
  font-family:'Pretendard Variable';;
  color: #121212;
  font-size: 14px;
  font-weight: 500;
  width: 100px;
  @media only screen and (max-width: 768px) {
    width: 80px;
    font-size: 12px;
  }
`;

const RecipientInputLeftText = styled(ContentLeftText)`
  @media only screen and (max-width: 768px) {
    width: 100px;
  }
`;

const AddressModalTextInput = styled.input`
  width: 100%;
  height: 35px;
  padding: 10px;
  border: 0;
  border-radius: 0;

  font-size: 14px;
  font-weight: 410;
  outline: 0;
  margin-bottom: 10px;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const RecipientInput = styled(AddressModalTextInput)`
  width: 250px;

  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;

const AddressModalButtonWrap = styled.div`
  display: flex;
  margin-top: 46px;
  @media only screen and (max-width: 768px) {
    margin-top: 35px;
  }
`;

const AddresModalBlackButton = styled(ModalBlackButton)`
  @media only screen and (max-width: 768px) {
    margin-right: 10px;
  }
`;

const AddressModalTitle = styled(ModalTitle)`
  font-size: 20px;
  margin-bottom: 5px;
  @media only screen and (max-width: 768px) {
    font-size: 17px;
  }
`;

const AddressModalButton = styled(Button)``;

export default ModifyUserInfo;
