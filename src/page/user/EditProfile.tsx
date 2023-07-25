import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, FileButton, Image } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@mantine/core';
import { APIChangeProfile, APICheckPassword, APILink, APILinkAdd, APILinkDelete, APILinkModify, APISnsProfile, APIUserDetails } from '../../api/UserAPI';
import { UserContext } from '../../context/user';
import { LinkListType, TImage, TProductListItem, UserType } from '../../types/Types';
import RightArrowImage from '../../asset/image/right.svg'
import linkImage from '../../asset/image/rink.svg';
import profileImage from '../../asset/image/Profile.svg';
import TopTextButton from '../../components/Layout/TopTextButton';
import ButtonContainer from '../../components/Layout/ButtonBox';
import { DndList, dndData } from '../../components/DnD/DnD';
import AlertModal from '../../components/Modal/AlertModal';
import AddLink from './AddLink';
import EditLink from './EditLink';
import { NoDoubleEmptySpace } from '../../util/Reg';

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
  const [ChangeImage, setChangeImage] = useState<dndData>();
  const [ChangeImageFormData, setChangeImageFormData] = useState<any>();
  const [images, setImages] = useState<any>();
  const [showContentModal, setShowContentModal] = useState(false);
  const [alertType, setAlertType] = useState<string>();

  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);

  const [isSnsUser, setIsSnsUser] = useState(false);
  const [userDetails, setUserDetails] = useState<UserType>();
  const [name, setName] = useState<string>('');
  const [About, setAbout] = useState<string>('');
  const [LinkList, setLinkList] = useState<LinkListType[]>([]);
  const { user } = useContext(UserContext);
  const [LinkModal, setLinkModal] = useState<boolean>(false);
  const [EditModal, setEditModal] = useState<boolean>(false);
  const [checkidx, setcheckidx] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const SaveButton = ()=>{
    const formData = new FormData();
    if(ChangeImage?.file){
      formData.append('images', ChangeImage.file);
      try {
      const res = APIChangeProfile(formData);
      console.log('Profile_change_ress',res);
      
      // setUserDetails(res);
      // setIsSnsUser(res.type !== 1 ? true : false);
      } catch (error) {
        console.log(error);
        // navigate('/signin', { replace: true });
      }
    } 
    if(name || About){
      const data = {
        brand_name:name,
        about:About
      }
      try {
      const res = APISnsProfile(data)
      console.log(res)
      } catch (error) {
        console.log(error);
      }
    } 
    setAlertType('저장되었습니다.')
    setShowAlertModal(true)
  }

  const Delete = async () =>{
    const data = {
      idx:checkidx
    };
    try {
      const res = await APILinkDelete(data);
      setAlertType('삭제되었습니다.')
      setEditModal(false)
      getLinks()
      setShowContentModal(true)
    } catch (error) {
      // console.log(error);
      // navigate('/signin', { replace: true });
    }
  }

  const ModifyLink = async (name:string,url:string) => {
    if (!name) return setAlertType('Title을 입력해주세요.'),setShowContentModal(true);
    if (!url) return setAlertType('Url을 입력해주세요.'),setShowContentModal(true);
    const data = {
      title:name,
      url:url,
      idx:checkidx
    };
    try {
      const res = await APILinkModify(data);
      setAlertType('변경되었습니다.')
      setEditModal(false)
      getLinks()
      setShowContentModal(true)
      // console.log(res)
    } catch (error) {
      // console.log(error);
      // navigate('/signin', { replace: true });
    }
};

  const LinkAdd = async (name:string,url:string) => {
    if (!name) return setAlertType('Title을 입력해주세요.'),setShowContentModal(true);
    if (!url) return setAlertType('Url을 입력해주세요.'),setShowContentModal(true);
    const data = {
      title:name,
      url: url
    };
    try {
      const res = await APILinkAdd(data);
      console.log(res)
      setLinkModal(false)
      getLinks()
      setAlertType('추가되었습니다.')
      setShowContentModal(true)
      // navigate(-1)
      // setIsSnsUser(res.type !== 1 ? true : false);
    } catch (error) {
      // console.log(error);
      // navigate('/signin', { replace: true });
    }
  };

  const getUserDetails = async () => {
    let data = {
      idx:user.idx
    }
    try {
      const res = await APIUserDetails(data);
      // console.log(res);
      setUserDetails(res);
      setName(res.brand_name)
      setAbout(res.about)
      setIsSnsUser(res.type !== 1 ? true : false);
    } catch (error) {
      // console.log(error);
      // navigate('/signin', { replace: true });
    }
  };
  const getLinks = async () => {
    const data = {
      page: 1
    };
    try {
      const {list,total} = await APILink(data);
      setLinkList(list);
    } catch (error) {
    }
  };
  const getBase64 = (file: File, cb: (value: string | ArrayBuffer | null) => void) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  };

  const onUpload = (value: File) => {
    console.log(value)
    getBase64(value, (url) => {
      const file = { url: url as string, name: value.name, symbol: String(Date.now()), file: value };
      setChangeImage(file);
    });
  };

  useEffect(() => {
    getUserDetails();
    getLinks()
  }, []);
  
  return (
    <Container>
      <TopTextButton text='Save' onClick={SaveButton}/>
      <ProfileContainer>
        
        <FileButton onChange={onUpload} accept="image/png,image/jpeg">
          {(props) => (
          <div {...props}>
          <ImageWrap Image={ChangeImage? true : userDetails?.image? true : false}>
            {ChangeImage ?
            <ProfileImage src={ChangeImage.url}/>
            :
            userDetails?.image?.file_name?
            <ProfileImage src={userDetails?.image.file_name}/>
            :
            <BasicProfileImage src={profileImage}/>
            }
          </ImageWrap>
          <EditPhotoButton style={{paddingLeft:10,paddingRight:10}} htmlFor='Change'>
            Edit Photo
            {/* <HideInput type='file' accept='image/*' ref={inputRef} onChange={(e:any) => onUpload(e)} name='Change'/> */}
          </EditPhotoButton>
          </div>
          )}
        </FileButton>
        <InputBox>
          <InputWrap>
            <InputTitle>BRNAD NAME</InputTitle>
            <TextInput
              maxLength={20}
              value={name}
              onChange={(e) => {
                setName(NoDoubleEmptySpace(e.target.value));
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
              maxLength={500}
              value={About}
              onChange={(e) => {
                setAbout(NoDoubleEmptySpace(e.target.value));
              }}
              placeholder="Add a brief bio"
            />
          </InputWrap>
        </InputBox>
      <BoxWrap>
        <BoxTitle>
          LINK
        </BoxTitle>
        <LayoutWrap onClick={()=>{
          if(LinkList.length < 3){
            setLinkModal(true)
          } else {
            setShowAlertModal(true);
            setAlertType('링크는 3개 이상 추가 할 수 없습니다.')
          }
        }}>
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
        {LinkList.map((item,index)=>{
          return(
          <LayoutWrap key={index} onClick={()=>{setEditModal(true);setcheckidx(item.idx)}}>
            <LinkImageWrap>
              <LinksImage src={linkImage}/>
            </LinkImageWrap>
            <LinkItemBox>
              <LinkTitleBox>
                <LinkName>
                  {item.title}
                </LinkName>
                <LinkUrl>
                  {item.url}
                </LinkUrl>
              </LinkTitleBox>
              <ArrowImageWrap>
                <ArrowImage src={RightArrowImage}/>
              </ArrowImageWrap>
            </LinkItemBox>
          </LayoutWrap>
          )
        })}
        <Modal opened={EditModal} onClose={() => setEditModal(false)} overlayOpacity={0.5} size="auto" centered withCloseButton={false}>
          <EditLink Check={(name,url)=>{ModifyLink(name,url)}} Cancel={()=>setEditModal(false)} Delete={Delete}/>
        </Modal>
      </BoxWrap>
        <Modal opened={LinkModal} onClose={() => setLinkModal(false)} overlayOpacity={0.5} size="auto" centered withCloseButton={false}>
          <AddLink Check={(name,url)=>LinkAdd(name,url)} Cancel={()=>setLinkModal(false)}/>
        </Modal>

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
      <AlertModal
        visible={showAlertModal}
        setVisible={setShowAlertModal}
        onClick={() => {
          if(alertType == '링크는 3개 이상 추가 할 수 없습니다.'){
            setShowAlertModal(false)
          }else{
            navigate(-1);
          }
        }}
        text={alertType? alertType : '확인되었습니다.'}
      />
      <AlertModal
        visible={showContentModal}
        setVisible={setShowContentModal}
        onClick={() => {
          setShowContentModal(false);
        }}
        text={alertType? alertType : '확인되었습니다'}
      />
      </ProfileContainer>
    </Container>
  );
}

const Container = styled.div`
  /* display: flex; */
  max-width: 1000px;
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
  cursor: pointer;
`;

const EditPhotoButton = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration : underline;
  /* border-bottom:2px solid #c7c7c7; */
  margin:20px 0 44px;
  font-size:16px;
  font-weight: 360;
  white-space:nowrap;
  @media only screen and (max-width: 768px) {
  }
`;

const BoxTitle = styled.p`
font-family:'Pretendard Variable';
  font-size:16px;
  font-weight: 410;
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
  font-weight: 410;
  text-align:start;
  color:#b8b8b8;
  margin:0;
  @media only screen and (max-width: 768px) {
    font-size:12px;
  }
  `;
const ImageWrap = styled.div<{Image:boolean}>`
  display:flex;
  justify-content:center;
  align-items:center;
  border-radius:50%;
  width:160px;
  height:160px;
  aspect-ratio: 1.0;
  border:1px solid #e0e0e0;
  background-color:${props => props.Image?  'none': '#DBDBDB'} ;
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
const HideInput = styled.input`
  display:none;
`
const ProfileImage = styled.img`
  width:100%;
  height:100%;
  border-radius:50%;
  border:1px solid #e0e0e0;
  object-fit:cover;
`;
const BasicProfileImage = styled.img`
  width:50%;
  height:50%;
  /* border-radius:50%; */
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
