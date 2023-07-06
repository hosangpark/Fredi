import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@mantine/core';
import { APICheckPassword, APIUserDetails } from '../../api/UserAPI';
import { UserContext } from '../../context/user';
import { TImage, TProductListItem } from '../../types/Types';
import RightArrowImage from '../../asset/image/right.svg'
import CategoryItem from '../../components/Shop/CategoryItem';
import linkImage from '../../asset/image/rink.svg';
import profileImage from '../../asset/image/Profile.svg';
import SaveButton from '../../components/Layout/SaveButton';

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

function EditProfile() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [passwordAlert, setPasswordAlert] = useState(false);
  const [isSnsUser, setIsSnsUser] = useState(false);
  const [imageList, setimageList] = useState<ImageItem[]>([]);
  const [showType, setShowType] = useState<1 | 2>(1);
  const [userDetails, setUserDetails] = useState<TUserDetails>();
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [alertType, setAlertType] = useState<string[] | undefined>();
  const { user } = useContext(UserContext);

  const [categoryitemList,setcategoriitemList] = useState([
    {
      item:'Home & styling',
      checked:false
    },
    {
      item:'Furniture',
      checked:false
    },
    {
      item:'Lighting',
      checked:false
    },
    {
      item:'Fabric',
      checked:false
    },
    {
      item:'Object',
      checked:false
    },
    {
      item:'Tableware',
      checked:false
    },
    {
      item:'Chair',
      checked:false
    },
    {
      item:'Table',
      checked:false
    },
  ])

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

  useEffect(() => {
    getUserDetails();
    setimageList([
      {
        idx: 1,
        category: 1,
        name: '일름이름이름1',
        image: [
          {
            idx: 11,
            file_name: ''
          }
        ],
      },
      {
        idx: 2,
        category: 1,
        name: '일름이름이름2',
        image: [
          {
            idx: 11,
            file_name: ''
          }
        ],
      },
      {
        idx: 3,
        category: 1,
        name: '일름이름이름3',
        image: [
          {
            idx: 11,
            file_name: ''
          }
        ],
      },
    ]);
  }, []);
  

  return (
    <Container>
      <SaveButton onClick={()=>{}}/>
      <ProfileContainer>
        <ImageWrap>
          <ProfileImage src={profileImage}/>
        </ImageWrap>
        <EditPhotoButton style={{paddingLeft:10,paddingRight:10}} onClick={()=>{console.log('adad')}}>
          Edit Photo
        </EditPhotoButton>
        <InputBox>
          <InputWrap>
            <InputTitle>BRNAD NAME</InputTitle>
            <TextInput
              // onResize={}
              maxLength={10}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder="Brand name or Nickname"
            />
          </InputWrap>
        </InputBox>
        <InputBox>
          <InputWrap>
            <InputTitle>ABOUT</InputTitle>
            <TextInput
              style={{minHeight:200,wordWrap:'break-word',wordBreak:'break-all'}}
              // align="top"
              
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              placeholder="Add a brief bio"
            />
          </InputWrap>
        </InputBox>
      <BoxWrap>
        <BoxTitle>
          LINK
        </BoxTitle>
        <LayoutWrap onClick={()=>{navigate('/AddLink', { state: 'Add' });}}>
          <LinkImageWrap>
            <PlusH></PlusH>
            <PlusV></PlusV>
            {/* <LinksImage src={linkImage}/> */}
          </LinkImageWrap>
          <LinkItemBox>
            <LinkTitleBox>
              Add Links
            </LinkTitleBox>
          </LinkItemBox>
        </LayoutWrap>
        <LayoutWrap onClick={()=>{navigate('/EditLink', { state: 'Edit' });}}>
          <LinkImageWrap>
            <LinksImage src={linkImage}/>
          </LinkImageWrap>
          <LinkItemBox>
            <LinkTitleBox>
              <LinkName>
                Website (FREDI)
              </LinkName>
              <LinkUrl>
                www.fredi.co.kr
              </LinkUrl>
            </LinkTitleBox>
            <ArrowImageWrap>
              <ArrowImage src={RightArrowImage}/>
            </ArrowImageWrap>
          </LinkItemBox>
        </LayoutWrap>
      </BoxWrap>
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
  margin:20px 30px;
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
  margin-bottom: 20px;
  border-bottom:1px solid #ECECEC;
`;
const BoxWrap = styled.div`
  width:100%;
  display: flex;
  flex-direction: column;
  margin-bottom:50px;
`;

const LayoutWrap = styled.div`
  display: flex;
  margin:10px 0;
`;

const EditPhotoButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration : underline;
  /* border-bottom:2px solid #c7c7c7; */
  margin:20px 0 44px;
  font-size:16px;
  font-weight: 410;
  white-space:nowrap;
  @media only screen and (max-width: 768px) {
  }
`;

const BoxTitle = styled.p`
font-family:'Pretendard Variable';
  font-size:16px;
  font-weight:500;
  text-align:start;
  color:#2b2b2b;
  margin:20px 0 10px 0;
  @media only screen and (max-width: 768px) {
    font-size:14px;
  }
`
const LinkName = styled.p`
font-family:'Pretendard Variable';
  font-weight: 410;
  text-align:start;
  color:#2b2b2b;
  margin:0;
  @media only screen and (max-width: 768px) {
    font-size:14px;
  }
`
const LinkUrl = styled.p`
font-family:'Pretendard Variable';
  font-size:14px;
  font-weight:500;
  text-align:start;
  color:#b8b8b8;
  margin:0;
  @media only screen and (max-width: 768px) {
    font-size:12px;
  }
  `;
const ImageWrap = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  border-radius:50%;
  width:160px;
  height:160px;
  aspect-ratio: 1.0;
  background-color: #DBDBDB;
  /* width:15%; */
  @media only screen and (max-width: 768px) {
    width:120px;
    height:120px;
  }
`;
const LinkImageWrap = styled.div`
  position:relative;
  display:flex;
  justify-content:center;
  align-items:center;
  width:50px;
  height:50px;
  margin-right:30px;
  border: 1px solid #B8B7B8;
  border-radius:50%;
  /* width:40%; */
  @media only screen and (max-width: 768px) {
    width:40px;
    height:40px;
  }
`;
const ArrowImageWrap = styled.div`
  width:9px;
  height:18px;
  display:flex;
  align-items:center;
  @media only screen and (max-width: 768px) {
    width:6px;
    height:12px;
  }
`
const ArrowImage = styled.img`
  width:100%;
  height:100%;
`;
const LinkItemBox = styled.div`
  flex:1;
  display:flex;
  justify-content:space-between;
  align-items:center;
  @media only screen and (max-width: 768px) {
  }
`;
const LinkTitleBox = styled.div`
font-family:'Pretendard Variable';
  display:flex;
  font-weight: 410;
  flex-direction:column;
  justify-content:center;
  @media only screen and (max-width: 768px) {
    font-size:14px;
  }
`;

const ProfileImage = styled.img`
  width:50%;
  height:50%;
  object-fit:contain;
`;
const LinksImage = styled.img`
  width:45%;
  height:45%;
  object-fit:contain;
`;

const PlusH = styled.div`
  position:absolute;
  left:50%;
  top:50%;
  width:20px;
  transform:translate(-50%,-50%);
  border-bottom:1px solid #585858;
  @media only screen and (max-width: 768px) {
    width:17px;
  }
`
const PlusV = styled.div`
  position:absolute;
  left:50%;
  top:50%;
  height:20px;
  transform:translate(-50%,-50%);
  border-right:1px solid #585858;
  @media only screen and (max-width: 768px) {
    height:17px;
  }
`

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
  margin: 10px 0px;
  @media only screen and (max-width: 768px) {
    margin: 0px;
  }
`;
const InputTitle = styled.div`
font-family:'Pretendard Variable';
font-weight: 310;
  white-space:nowrap;
  width:40%;
  max-width:250px;
  text-align:start;
  @media only screen and (max-width: 768px) {
    font-size:14px;
  }
`;

const TextInput = styled.textarea`
font-family:'Pretendard Variable';
  border: 0;
  width:60%;
  height:26px;
  font-size: 16px;
  color: #121212;
  font-weight: 310;
  text-align:start;
  border-radius: 0;
  resize:none;
  /* padding:5px 10px; */
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
font-family:'Pretendard Variable';
  font-weight: 410;
  font-size: 12px;
  color: #d82c19;
  margin-top: 8px;
  padding-left: 10px;
`;

export default EditProfile;
