import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal } from '@mantine/core';
import { UserContext } from '../../context/user';
import { TImage, TProductListItem } from '../../types/Types';
import RightArrowImage from '../../asset/image/ico_next_mobile.png'

import { APILinkAdd } from '../../api/UserAPI';
import TopButton from '../../components/Product/TopButton';
import TopTextButton from '../../components/Layout/TopTextButton';
import ButtonContainer from '../../components/Layout/ButtonBox';
import AlertModal from '../../components/Modal/AlertModal';


function AddLink() {

  const navigate = useNavigate();
  const [name, setName] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [alertType, setAlertType] = useState('');
  const [showContentModal, setShowContentModal] = useState(false);
  const { user } = useContext(UserContext);

  const LinkAdd = async () => {
    if (!name) return setAlertType('Title을 입력해주세요.'),setShowContentModal(true);
    if (!url) return setAlertType('Url을 입력해주세요.'),setShowContentModal(true);
    const data = {
      title:name,
      url: url
    };
    try {
      const res = await APILinkAdd(data);
      console.log(res)
      navigate(-1)
      // setIsSnsUser(res.type !== 1 ? true : false);
    } catch (error) {
      // console.log(error);
      // navigate('/signin', { replace: true });
    }
  };


  return (
    <Container>
      <TopTextButton text='Save' onClick={LinkAdd}/>
      <ProfileContainer>
        <InputWrap>
          <InputTitle>Title</InputTitle>
          <TextInput
            maxLength={15}
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
            maxLength={30}
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
            }}
            placeholder="Website URL"
          />
        </InputWrap>
        <ButtonContainer
          text1={'Save'}
          text2={'Cancle'}
          onClick1={()=>{}}
          onClick2={LinkAdd}
          cancle={()=>navigate(-1)}
          marginT={50}
          marginB={100}
          visible={true}
        />
      </ProfileContainer>
      <AlertModal
      visible={showContentModal}
      setVisible={setShowContentModal}
      onClick={() => {
        setShowContentModal(false);
      }}
      text={alertType}
      />
    </Container>
  );
}

const Container = styled.div`
  /* display: flex; */
  max-width: 800px;
  margin:0 auto;
  flex: 1;
  min-height: calc(100vh - 80px);
  /* flex-direction: row; */
  background-color: #ffffff;
  @media only screen and (max-width: 768px) {
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
const TextBox = styled.div`
  display:flex;
  
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
const SaveText = styled.p`
font-family:'Pretendard Variable';
font-weight : 310;
color:#020202;
cursor: pointer;
font-size:17px;
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


export default AddLink;
