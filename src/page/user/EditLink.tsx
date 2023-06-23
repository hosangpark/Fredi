import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal } from '@mantine/core';
import { APICheckPassword, APIUserDetails } from '../../api/UserAPI';
import { UserContext } from '../../context/user';
import ImageCard from '../../components/Shop/ImageCard';
import { TImage } from '../admin/ProducerList';
import RightArrowImage from '../../asset/image/ico_next_mobile.png'

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

function EditLink() {
  const navigate = useNavigate();
  const types = useLocation();
  const propsData = types.state;
  const [showModal, setShowModal] = useState(false);
  const [passwordAlert, setPasswordAlert] = useState(false);
  const [isSnsUser, setIsSnsUser] = useState(false);
  const [imageList, setimageList] = useState<ImageItem[]>([]);
  const [showType, setShowType] = useState<1 | 2>(1);
  const [userDetails, setUserDetails] = useState<TUserDetails>();
  const [name, setName] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [alertType, setAlertType] = useState<string[] | undefined>();
  const { user } = useContext(UserContext);

  const getUserDetails = async () => {
    try {
      const res = await APIUserDetails();
      console.log(res);
      setUserDetails(res);
      setIsSnsUser(res.type !== 1 ? true : false);
    } catch (error) {
      // console.log(error);
      // navigate('/signin', { replace: true });
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
  
  const saveHistory = (e: React.MouseEvent, idx: number) => {
    const div = document.getElementById('root');
    if (div) {
      console.log(div.scrollHeight, globalThis.scrollY);
      const y = globalThis.scrollY;
      // sessionStorage.setItem('shop', JSON.stringify(shopList));
      // sessionStorage.setItem('page', String(page));
      sessionStorage.setItem('type', String(showType));
      sessionStorage.setItem('y', String(y ?? 0));
      navigate(`/shopdetails/${idx}`);
    }
  };

  return (
    <Container>
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
        {alertType?.includes('nameEmpty') && <AlertText>*이름을 입력해 주세요.</AlertText>}
        <DeleteText>Delete</DeleteText>
      </ProfileContainer>
    </Container>
  );
}

const Container = styled.div`
  /* display: flex; */
  flex: 1;
  min-height: calc(100vh - 80px);
  /* flex-direction: row; */
  border-top: 1px solid #121212;
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
const InputBox = styled.div`
  width:100%;
  justify-content:space-between;
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
  border-bottom:1px solid #c7c7c7;
`;
const DeleteText = styled.p`
  color:#b40000;
`;
const LinkBox = styled.div`
  width:100%;
  display: flex;
  flex-direction: column;
`;
const LayoutWrap = styled.div`
  display: flex;
`;
const EditInputWrap = styled.div`
  display: flex;
  padding-bottom: 3px;
  align-items: center;
  border-bottom: 1px solid #121212;
`;
const EditPhotoButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration : underline;
  /* border-bottom:2px solid #c7c7c7; */
  margin:10px 0 0 0;
  font-size:14px;
  font-weight:400;
  white-space:nowrap;
  @media only screen and (max-width: 768px) {
  }
  `;
const SubTextBox = styled.p`
  font-size:14px;
  font-weight:400;
  text-align:start;
  color:#a1a1a1;
  margin:0;
  @media only screen and (max-width: 768px) {
  }
  `;
const DescriptionText = styled.p`
  font-size:14px;
  font-weight:400;
  text-align:start;
  color:#2b2b2b;
  margin:30px 0;
  @media only screen and (max-width: 768px) {
  }
  `;
const LinkTitle = styled.p`
  font-size:16px;
  font-weight:500;
  text-align:start;
  color:#2b2b2b;
  margin:30px 0;
  @media only screen and (max-width: 768px) {
  }
`
const LinkName = styled.p`
  font-size:15px;
  font-weight:500;
  text-align:start;
  color:#2b2b2b;
  margin:0;
  @media only screen and (max-width: 768px) {
  }
`
const LinkUrl = styled.p`
  font-size:13px;
  font-weight:500;
  text-align:start;
  color:#b8b8b8;
  margin:0;
  @media only screen and (max-width: 768px) {
  }
  `;
const ImageWrap = styled.div`
  width:210px;
  aspect-ratio: 1.1;
  /* width:15%; */
  @media only screen and (max-width: 768px) {
    width:160px;
  }
`;
const LinkImageWrap = styled.div`
  min-width:70px;
  min-height:70px;
  margin-right:50px;
  /* width:40%; */
  @media only screen and (max-width: 768px) {
    margin-right:20px;
    width:50px;
  }
`;
const ArrowImageWrap = styled.div`
  width:40px;
  height:40px;
  @media only screen and (max-width: 768px) {
    width:25px;
    height:25px;
  }
`;
const ArrowImage = styled.img`
  width:100%;
  height:100%;
`;
const LinkItemBox = styled.div`
  width:100%;
  display:flex;
  justify-content:space-between;
  align-items:center;
  @media only screen and (max-width: 768px) {
  }
`;
const LinkTitleBox = styled.div`
  display:flex;
  flex-direction:column;
  justify-content:center;
  @media only screen and (max-width: 768px) {
  }
`;

const Image = styled.img`
  width:100%;
  height:100%;
  border-radius:5px;
  background:#313131;
  @media only screen and (max-width: 768px) {
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

const BlackButtonText = styled.span`
  color: #ffffff;
  font-size: 16px;
  font-weight: 400;
  @media only screen and (max-width: 768px) {
    font-size: 11px;
  }
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
  margin: 20px 0;
  @media only screen and (max-width: 768px) {
  }
`;
const InputTitle = styled.div`
font-family:'Pretendard Variable';
  white-space:nowrap;
  width:25%;
  margin-right:30px;
  max-width:250px;
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
  font-weight: 400;
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

const ModalWhiteButton = styled(ModalBlackButton)`
  background-color: #ffffff;
  margin-left: 10px;
  @media only screen and (max-width: 768px) {
    margin-left: 0;
    margin-top: 5px;
  }
`;

const AlertText = styled.span`
  font-weight: 400;
  font-size: 12px;
  color: #d82c19;
  margin-top: 8px;
  padding-left: 10px;
`;

export default EditLink;
