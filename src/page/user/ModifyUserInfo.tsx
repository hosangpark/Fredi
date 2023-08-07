import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Checkbox, Modal, Select } from '@mantine/core';
import arrDownImage from '../../asset/image/arr_down.png';
import rightArrowImage from '../../asset/image/pager_right.png';
import { APIGetTerms } from '../../api/SettingAPI';
import {
  APIDeleteAccount,
  APIModifyName,
  APIUserDetails,
  checkNicknameExcludeUser,
} from '../../api/UserAPI';
import AlertModal from '../../components/Modal/AlertModal';
import { TUserDetails } from './Profile';
import { useRef } from 'react';
import { APISaveAddress } from '../../api/ShopAPI';
import PostModal from '../../components/Modal/PostModal';
import TopTextButton from '../../components/Layout/TopTextButton';
import ButtonContainer from '../../components/Layout/ButtonBox';
import { UserContext } from '../../context/user';
import axios from 'axios';

const REASONLIST = [
  { value: '', label: 'Select reason' },
  { value: '사용빈도 낮음', label: 'Infrequently used' },
  { value: '서비스 불만', label: 'Dissatisfied with service' },
  { value: '개인정보 유출 우려', label: 'Privacy concerns' },
  { value: '기타', label: 'Others' },
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
    | 'nameEmpty'
    | 'nicknameAvailable'
    | 'authFaild'
    | 'send'
    | 'sendFaild'
    | 'member'
    | 'auth'
    | 'modified'
    | 'faild'
    | 'Modify'
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
  const [name, setname] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [isDuplicatedNickname, setIsDuplicatedNickname] = useState<boolean>(false);
  const [timer, setTimer] = useState(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [showSaveAddressModal, setShowSaveAddressModal] = useState<boolean>(false);
  const [UserType, setUserType] = useState<number>(1);

  const [zipCode, setZipCode] = useState<string>('');
  const [address1, setAddress1] = useState<string>('');
  const [address2, setAddress2] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [recipientPhone, setRecipientPhone] = useState<string>('');
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);

  const countRef = useRef<any>(null);
  const isOriginalNickname = nickname === originalNickname;

  const { user } = useContext(UserContext);

  const getUserDetails = async () => {
    const data = {
      idx: user.idx
    }
    console.log(user.idx)
    try {
      const res = await APIUserDetails(data);
      
      setUserDetails(res);
      setname(res.name);
      setNickname(res.nickname);
      setOriginalNickname(res.nickname);
      setOriginalPhone(res.phone);
      setUserType(res.type)
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

  const SaveButton = async () => {

    if (!name) return setAlertType('nameEmpty');
    if (!nickname) return setAlertType('nicknameEmpty');
    try {
      const data = {
        nickname: nickname,
        user_idx: user.idx
      };
      const res = await checkNicknameExcludeUser(data);
      console.log(res)
      // setAlertType('nicknameAvailable');
      setIsDuplicatedNickname(false);
      ModifyName()
    } catch (error) {
      console.log(error);
      setIsDuplicatedNickname(true);
      // setAlertType('nicknameDuplicated');
      setNickname('');
    }
  };
// const res = await checkNicknameExcludeUser(data);

  const ModifyName = async() => {
    // if (isOriginalNickname) return setAlertType('originalNickname');

    try {
      const data = {
        nickname: nickname,
        name: name
      };
      const res = await APIModifyName(data);
      setAlertType('Modify')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
            alert(error.response.data.message);
        }
      }
    }
  }

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
    <Title>Settings</Title>
      <TopTextButton text='Save' onClick={SaveButton}/>
      <RightBox>
        <RowWap>
          <LeftText>ID</LeftText>
          <RightText>{userDetails?.user_id? userDetails?.user_id : 'Id'}
          <EmptyBox></EmptyBox></RightText>
        </RowWap>
        <RowWap>
          <LeftText>Full name</LeftText>
          <RightTextInput value={name} onChange={e=>setname(e.target.value)} maxLength={10}/>
          <EmptyBox></EmptyBox>
        </RowWap>
        <RowWap>
          <LeftText>User name</LeftText>
          <RightTextInput value={nickname} onChange={e=>setNickname(e.target.value)} maxLength={20}/>
          <EmptyBox></EmptyBox>
          {/* <TextInput maxLength={10} value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="닉네임 입력" /> */}
          {/* <UnderlineTextButton onClick={onCheckNickname}>중복확인</UnderlineTextButton> */}
        </RowWap>
        <RowWap>
          <LeftText>Phone</LeftText>
          {/* <RightText marginR={35}>{userDetails?.phone? userDetails?.phone : 'Number'}</RightText> */}
          <RightText cursor onClick={()=> navigate('/changePhone')}>
            {originalPhone}
            <EmptyBox>
            <RightArrow src={rightArrowImage}/>
            </EmptyBox>
          </RightText>
        </RowWap>
        {UserType == 1 &&
        <RowWap>
          <LeftText>Password</LeftText>
          <RightText cursor onClick={()=> navigate('/changePassword')}>
            Edit
            <EmptyBox>
            <RightArrow src={rightArrowImage}/>
            </EmptyBox>
          </RightText>
        </RowWap>
        }
        {/* <RowWap style={{paddingTop:100}}>
          <LeftText>Address</LeftText>
          <RightText cursor onClick={()=> setShowAddressModal(true)}>
            Edit
            <EmptyBox>
            <RightArrow src={rightArrowImage}/>
            </EmptyBox>
          </RightText>
        </RowWap> */}
        <RowWap style={{paddingTop:100}}>
          <LeftText style={{color:'#9C343F'}}>Delete Account</LeftText>
          <RightText cursor onClick={()=>setShowAccountModal(true)}>
            Delete
            <EmptyBox>
            <RightArrow src={rightArrowImage}/>
            </EmptyBox>
          </RightText>
        </RowWap>
      </RightBox>
      <ButtonContainer
        text1={'Save'}
        text2={'Cancle'}
        onClick1={()=>{}}
        onClick2={SaveButton}
        cancle={()=>navigate(-1)}
        marginT={50}
        marginB={100}
        visible={true}
      />

      <Modal opened={showAccountModal} onClose={() => setShowAccountModal(false)} overlayOpacity={0.5} size="auto" centered withCloseButton={false}>
        <ModalBox>
          <ModalTitle>You want to cancel your account?</ModalTitle>
          <ModalSubTitle>Your account and membership services will be terminated.</ModalSubTitle>
          <ModalContentBox>{terms}</ModalContentBox>
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
              label="I've read all the terms and conditions."
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
      <AlertModal
        visible={alertModal}
        setVisible={setAlertModal}
        onClick={() => {
          setAlertModal(false);
          setAlertType(undefined);
        }}
        text={
          alertType === 'nicknameEmpty'
            ? '닉네임을 입력해 주세요.'
            : alertType === 'nameEmpty'
            ? '이름을 입력해 주세요.'
            : alertType === 'Modify'
            ? '변경이 완료 되었습니다.'
            : alertType === 'reason'
            ? '탈퇴 사유를 입력해 주세요.'
            : alertType === 'agree'
            ? '탈퇴 약관에 동의해 주세요.'
            : ""
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
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  min-width: 290px;
  width: 100%;
  flex-direction: column;
  text-align: left;
  padding:30px;
  @media only screen and (max-width: 1000px) {
    width: 100%;
    padding:20px;
    border-right: 0;
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
  width:768px;
  margin:0 auto;
  padding:0 20px 50px;
  @media only screen and (max-width: 768px) {
    width:100%;
    padding:0 20px 50px;
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
font-family:'Pretendard Variable';
  font-weight: 410;
  color: #121212;
  font-size: 16px;
  border-bottom: 1px solid  #ECECEC;
  
  @media only screen and (max-width: 768px) {
  padding-bottom:40px;
    font-size: 14px;
  }
`;

const RowWap = styled.div<{ last?: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  justify-content:space-between;
  border-bottom:1px solid #ECECEC;
  padding:20px 0;
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
    font-weight:310;
    color: #000000;
    font-size: 14px;
    font-weight: 360;
    flex:4;
    height: 100%;
    text-align: left;
    @media only screen and (max-width: 768px) {
      font-size: 12px;
  }
`;
const RightText = styled(LeftText)<{marginR?:number,cursor?:boolean}>`
justify-content:flex-end;
  cursor:${props => props.cursor && 'pointer'};
  color:#000000;
  width:100%;
  border: 0;
  flex:6;
  text-align: right;
  margin-right:${(props)=> props.marginR ? props.marginR : 0}px;
`;
const RightTextInput = styled.input`
display:flex;
align-items:center;
justify-content:flex-end;
font-family:'Pretendard Variable';
  font-weight: 310;
  color:#000000;
  width:100%;
  border: 0;
  flex:6;
  font-size: 14px;
  text-align: right;
  margin-right:0px;
  ::placeholder{
    color:#000000;
  }
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;
const RightArrow = styled.img`
  width:15px;
  height:15px;
`

const BlackButtonText = styled.span`
font-family:'Pretendard Variable';
  color: #ffffff;
  font-size: 16px;
  font-weight: 410;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const EmptyBox = styled.div`
  width: 42px;
  display: flex;
  align-items:center;
  justify-content:center;
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
  text-align:center;
  color: #000000;
  font-weight: 410;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;
const ModalSubTitle = styled.span`
font-family:'Pretendard Variable';
  font-size: 16px;
  text-align:center;
  white-space:nowrap;
  color: #000000;
  font-weight: 410;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
    white-space:inherit;
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
flex: none;
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
  height: 150px;
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
    height: 125px;
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
  height: 60px;

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
font-family:'Pretendard Variable';
  font-family:'Pretendard Variable';;
  color: #121212;
  font-size: 14px;
  font-weight: 410;
  width: 100px;
  @media only screen and (max-width: 768px) {
    width: 80px;
    font-size: 12px;
  }
`;

const RecipientInputLeftText = styled(ContentLeftText)`
font-family:'Pretendard Variable';
margin-bottom:10px;
  @media only screen and (max-width: 768px) {
    width: 100px;
  }
`;

const AddressModalTextInput = styled.input`
font-family:'Pretendard Variable';
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
width:100%;
flex: none;
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
