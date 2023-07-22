import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal } from '@mantine/core';
import { APICheckPassword, APILinkDelete, APILinkModify, APIUserDetails } from '../../api/UserAPI';
import { UserContext } from '../../context/user';
import { TImage, TProductListItem } from '../../types/Types';
import RightArrowImage from '../../asset/image/ico_next_mobile.png'
import TopTextButton from '../../components/Layout/TopTextButton';
import ButtonContainer from '../../components/Layout/ButtonBox';
import AlertModal from '../../components/Modal/AlertModal';


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
export type ImageItem = {
  idx:number;
  category: 1 | 2 | 3 | 4 | 5 | 6;
  name: string;
  image: TImage[];
};

function EditLink({Check,Cancel,Delete}:{Check:(name:string,url:string)=>void,Cancel:()=>void,Delete:()=>void}) {
  const navigate = useNavigate();
  const LinkIdx = useLocation();
  const [name, setName] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [alertType, setAlertType] = useState('');
  const [showContentModal, setShowContentModal] = useState(false);
  const { user } = useContext(UserContext);

  const Save = ()=>{
    Check(name,url)
  }




  return (
    <Container>
      {/* <TopTextButton text={'Save'} onClick={ModifyLink}/> */}
      <ProfileContainer>
        <InputWrap>
          <InputTitle>Title</InputTitle>
          {/* <InputTitle>{propsData}</InputTitle> */}
          <TextInput
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              // console.log(propsData)
            }}
            placeholder="Website Name"
          />
        </InputWrap>
        <InputWrap>
          <InputTitle>URL</InputTitle>
          <TextInput
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
            }}
            placeholder="Website URL"
          />
        </InputWrap>
        <TextBox onClick={Delete}>
          <DeleteText>Delete</DeleteText>
        </TextBox>
        <ButtonContainer
          text1={'Save'}
          text2={'Cancle'}
          onClick1={()=>{}}
          onClick2={Save}
          cancle={Cancel}
          marginT={50}
          marginB={50}
          width={500}
          visible={false}
        />
      </ProfileContainer>
      <AlertModal
      visible={showContentModal}
      setVisible={setShowContentModal}
      onClick={() => {
        setShowContentModal(false);
        if(alertType == '변경되었습니다.' ||
          alertType =='삭제되었습니다.'
        ){
          navigate(-1)
        }
      }}
      text={alertType}
      />
    </Container>
  );
}


const Container = styled.div`
  /* display: flex; */
  width: 700px;
  /* min-height: calc(100vh - 80px); */
  
  /* flex-direction: row; */
  background-color: #ffffff;
  @media only screen and (max-width: 768px) {
    width: 400px;
    flex-direction: column;
    border-top: 0;
  }
`;
const ProfileContainer = styled.div`
  margin: 20px 10px 20px 20px;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  @media only screen and (max-width: 768px) {
  }
`;
const InputBox = styled.div`
  width:100%;
  justify-content:space-between;
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
  border-bottom:1px solid #c7c7c7;
`;
const TextBox = styled.div`
  display:flex;
  @media only screen and (max-width: 768px) {
  }
`
const DeleteText = styled.p`
font-family:'Pretendard Variable';
font-weight : 310;
color:#9C343F;
font-size:14px;
  @media only screen and (max-width: 768px) {
    font-size:12px;
    margin-top:15px;
  }
`;

const InputWrap = styled.div`
  display: flex;
  width: 100%;
  margin: 20px 0;
  @media only screen and (max-width: 768px) {
  }
`;
const InputTitle = styled.div`
font-family:'Pretendard Variable';
  white-space:nowrap;
  width:40%;
  max-width:300px;
  text-align:start;
  @media only screen and (max-width: 768px) {
    font-size:14px;
  }
`;

const TextInput = styled.input`
font-family:'Pretendard Variable';
  border: 0;
  width:100%;
  font-size: 16px;
  color: #121212;
  font-weight: 410;
  text-align:start;
  border-radius: 0;
  margin:0;
  border-bottom:1px solid #ECECEC;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;


export default EditLink;
