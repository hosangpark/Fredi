import React, { useCallback, useContext, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import logoImage from '../../asset/image/logo.png';
import AlertModal from '../Modal/AlertModal';
import menuheart from '../../asset/image/heart.svg';
import menuselling from '../../asset/image/selling.svg';
import menucontact from '../../asset/image/contact.svg';
import menusetting from '../../asset/image/Settings.svg';

import profileImage from '../../asset/image/web_my.svg';
import likeOffImage from '../../asset/image/heart.svg';
import menuicon from '../../asset/image/threecircle.svg';
import { UserContext } from '../../context/user';
import ConfirmModal from '../Modal/ConfirmModal';
import backButtonImage from '../../asset/image/back.svg';
import { APICheckPassword, APIUserDetails } from '../../api/UserAPI';
import { Modal } from '@mantine/core';
import Sheet,{SheetRef} from 'react-modal-sheet';

export const removeHistory = () => {
  sessionStorage.removeItem('signin');
  sessionStorage.removeItem('products');
  sessionStorage.removeItem('producers');
  sessionStorage.removeItem('shop');
  sessionStorage.removeItem('page');
  sessionStorage.removeItem('y');
  sessionStorage.removeItem('type');
  sessionStorage.removeItem('tab');
};
export const removeSNSHistory = () => {
  sessionStorage.removeItem('SNSListType');
};

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

function Header() {
  const location = useLocation();
  const pathName = location.pathname.split('/')[1];
  // console.log('pathName', pathName);
  const ref = useRef<SheetRef>();
  const navigate = useNavigate();
  const { user, patchUser } = useContext(UserContext);

  const token = sessionStorage.getItem('token');
  const [showLogin, setShowLogin] = useState(false);
  const [check, setCheck] = useState<{ product: boolean; producer: boolean }>();
  const [showModal, setShowModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [isMouseOveredLikeButton, setIsMouseOveredLikeButton] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [showsendMessage, showSendMessage] = useState(false);
  const [pageName, setPageName] = useState(false);
  const [noButton, setNoButton] = useState(false);
  const [userDetails, setUserDetails] = useState<TUserDetails>();
  const [isSnsUser, setIsSnsUser] = useState(false);
  const [password, setPassword] = useState<string>('');
  const [passwordAlert, setPasswordAlert] = useState(false);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [bottomSheetModal, setBottomSheetModal] = useState(false);

  const goHome = useCallback(() => {
    removeHistory();
    navigate('/');
    navigate(0);
  }, []);


  // useEffect(() => {
  //   getUserDetails();
  // }, []);
  
  // const getUserDetails = async () => {
  //   try {
  //     const res = await APIUserDetails();
  //     console.log(res);
  //     setUserDetails(res);
  //     setIsSnsUser(res.type !== 1 ? true : false);
  //   } catch (error) {
  //     console.log(error);
  //     // navigate('/signin', { replace: true });
  //   }
  // };

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


  const goLikeList = useCallback(() => {
    setBottomSheetModal(false)
    if(!token){
      setShowLogin(true);
    } else{
      removeHistory();
      navigate('/LikeArtwork');
    }
  }, [token]);


  const goContact = useCallback(() => {
    removeHistory();
    setBottomSheetModal(false)
    if (!token) {
      setShowLogin(true);
    } else {
      navigate('/contact');
    }
    
  }, [token]);

  const goFair = useCallback(() => {
    setBottomSheetModal(false)
    removeHistory();
    navigate('/MainTab/FairTab');
  }, []);
  const goArtwork = useCallback(() => {
    setBottomSheetModal(false)
    removeHistory();
    navigate('/MainTab/ArtworkTab');
  }, []);
  
  const goArtist = useCallback(() => {
    setBottomSheetModal(false)
    removeHistory();
    navigate('/MainTab/ArtistTab');
  }, []);

  const goCommunity = useCallback(() => {
    removeHistory();
    navigate('/Community/FeedTab');
  }, [token]);

  const goMyPage = useCallback(() => {
    removeHistory();
    if (!token) {
      setShowLogin(true);
    } else if(user.idx===0){
      getIdx()
    } else{
      navigate(`/MobileProfile/${user.idx}`,{state:user.idx})
    }
  }, [token])

  const getIdx = async()=>{
    const result = await APIUserDetails()
      patchUser(result.idx, result.level)
      navigate(`/MobileProfile/${result.idx}`,{state:user.idx})
  }

  const goAdmin = useCallback(() => {
    
    removeHistory();
    navigate('/adm');
  }, []);

  const goSelling = useCallback(() => {
    setBottomSheetModal(false)
    removeHistory();
    if (!token) {
      return setShowLogin(true);
    }
    navigate('/askinfo');
  }, [token]);

  const goSignIn = useCallback(() => {
    if (!token) {
      removeHistory();
      navigate('/signin');
    } else {
      setConfirmModal(true);
    }
  }, [token]);

  const closeAlertModal = useCallback(() => {
    setShowModal(false);
  }, []);


  const closeLoginAlertModal = useCallback(() => {
    removeHistory();
    navigate('/signin');
    setShowLogin(false);
  }, []);

  const onLogout = () => {
    sessionStorage.clear();
    patchUser(0, 3);
    window.location.replace('/');
  };

  const BackbuttonHandle = () => {
    if(pathName === 'AddPhoto'){
      navigate(-1)
    } else if (pathName === 'AddPhoto2'){
      navigate(-2)
    
    } else{
      navigate(-1)
    }
  };
  
  useEffect(() => {
    if (
      pathName === 'modifyuserinfo' ||
      pathName === 'EditProfile' ||
      pathName === 'EditLink' ||
      pathName === 'AddLink' 
    ) {
      setPageName(true)
    }else{
      setPageName(false)
    }
  }, [pathName]);

  useEffect(() => {
    if (
      pathName === 'registerask' ||
      pathName === 'deleteAccount' ||
      pathName === 'changeAddress' ||
      pathName === 'changePassword' ||
      pathName === 'changePhone'
    ) {
      setNoButton(true)
    }else{
      setNoButton(false)
    }
  }, [pathName]);
  

  useEffect(() => {
    if (
      pathName === 'SignUp1' ||
      pathName === 'SignUp2' ||
      pathName === 'SignUp3' ||
      pathName === 'AddPhoto' ||
      pathName === 'AddPhoto2' ||
      pathName === 'EditProfile' ||
      pathName === 'EditLink' ||
      pathName === 'asklist' ||
      pathName === 'modifyuserinfo' ||
      pathName === 'AddLink'
    ) {
      if(innerWidth < 768){
        setNoButton(true)
        // setShowSave(true)
      } else {
        setNoButton(false)
      }
    }
  }, [innerWidth,pathName]);



  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    if(innerWidth > 768){
      setShowBackButton(false);
      setPageName(false)
      showSendMessage(false)
    } else {
      if (
        pathName === 'SignUp1' ||
        pathName === 'SignUp2' ||
        pathName === 'SignUp3' ||
        pathName === 'productdetails' ||
        pathName === 'shopdetails' ||
        // pathName === 'cart' ||
        pathName === 'order' ||
        pathName === 'shopdetails' ||
        pathName === 'WeeklyEdition' ||
        pathName === 'orderdetails' ||
        pathName === 'request' ||
        pathName === 'modifyuserinfo' ||
        pathName === 'finduserid' ||
        pathName === 'findpassword' ||
        pathName === 'signup' ||
        pathName === 'producerdetails' ||
        pathName === 'kakao' ||
        pathName === 'naver' ||
        pathName === 'asklist-shop' ||
        pathName === 'ArtistProducts' ||
        pathName === 'personalpage' ||
        pathName === 'FairContent' ||
        pathName === 'EditProfile' ||
        pathName === 'AddPhoto' ||
        pathName === 'AddPhoto2' ||
        pathName === 'EditLink' ||
        pathName === 'deleteAccount' ||
        pathName === 'changeAddress' ||
        pathName === 'changePassword' ||
        pathName === 'changePhone' ||
        pathName === 'asklist' ||
        pathName === 'askinfo' ||
        pathName === 'faqlist' ||
        pathName === 'registerask' ||
        pathName === 'AddLink'
      ) {
        setShowBackButton(true);
      } else {
        setShowBackButton(false);
      }
    }
    // console.log("innerWidth", innerWidth);
    window.addEventListener("resize", resizeListener);
  }, [innerWidth,pathName]);

  return (
    <>
    
      <Sheet isOpen={bottomSheetModal} onClose={() => setBottomSheetModal(false)}
        detent={'content-height'}
        ref={ref}
        >
          <Sheet.Container>
            <Sheet.Header>
              <EmptyHeightBox onClick={() => setBottomSheetModal(false)}>
              <HeaderButtom/>
              </EmptyHeightBox>
            </Sheet.Header>
            <Sheet.Content>
              <SheetWrap> 
                <SheetMenu onClick={goLikeList}>
                  <IconWrap>
                  <HeartIconImage src={menuheart}/>
                  </IconWrap>
                  Like
                </SheetMenu>
                <SheetMenu onClick={goSelling}>
                  <IconWrap>
                  <SellingIconImage src={menuselling}/>
                  </IconWrap>
                  Selling
                </SheetMenu>
                <SheetMenu onClick={goContact}>
                  <IconWrap>
                  <ContactIconImage src={menucontact}/>
                  </IconWrap>
                  {/* 문의내역 */}
                  Contact
                </SheetMenu>
                <SheetMenu onClick={() => {
                  setBottomSheetModal(false)
                  if(!token){
                    setShowLogin(true);
                  } else {
                    if (!isSnsUser) {
                      // setShowModal(true);
                      navigate('/modifyuserinfo');
                    } else {
                      navigate('/modifyuserinfo');
                    }
                  } 
                }}>
                  <IconWrap>
                  <SettingsIconImage src={menusetting}/>
                  </IconWrap>
                  {/* 개인정보수정 */}
                  Settings
                </SheetMenu>
                <SheetLogoutMenu>
                  {token ?
                  <LogBox onClick={()=>{
                    setBottomSheetModal(false)
                    setConfirmModal(true)
                    }}>
                    Logout
                  </LogBox>
                  :
                  <LogBox onClick={()=>{
                    setBottomSheetModal(false)
                    navigate('/signin');
                    }}>
                    Login
                  </LogBox>
                  }
                  {/* <IconImage src={LogoutImage}/> */}
                </SheetLogoutMenu>
              </SheetWrap>
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop />
      </Sheet>
      {bottomSheetModal &&
      <SheetBackground onClick={() => setBottomSheetModal(false)}></SheetBackground>
      }
      <HeaderBox>
        {showBackButton && <BackButton onClick={BackbuttonHandle} src={backButtonImage} />}
        {pathName === ''&& <Logo onClick={goHome} src={logoImage} /> || innerWidth > 768 && <Logo onClick={goHome} src={logoImage} />}

        <WebMenuWrap>
          <MenuButton On={pathName === 'FairTab'} onClick={goFair}>
            <MenuButtonText>Fair</MenuButtonText>
          </MenuButton>
          <MenuButton On={pathName === 'ArtworkTab'} onClick={goArtwork}>
            <MenuButtonText>Artwork</MenuButtonText>
          </MenuButton>
          <MenuButton On={pathName === 'ArtistTab'} onClick={goArtist}>
            <MenuButtonText>Artist</MenuButtonText>
          </MenuButton>
          <MenuButton On={pathName === 'Community'} onClick={goCommunity}>
            <MenuButtonText>Discover</MenuButtonText>
          </MenuButton>
          {/* {token && user.level === 0 && (
            <MenuButton onClick={goAdmin}>
              <MenuButtonText>MANAGER</MenuButtonText>
            </MenuButton>
          )} */}
        </WebMenuWrap>
        {pageName?
        <PageNameWrap>
          {pathName === 'EditProfile'&& 'Edit Profile'}
          {pathName === 'AddLink'&& 'Add Link'}
          {pathName === 'EditLink'&& 'Edit Link'}
          {pathName === 'modifyuserinfo'&& 'Settings'}
          {pathName === 'deleteAccount'&& 'Delete Account'}
          {pathName === 'changeAddress'&& 'Change Address'}
          {pathName === 'changePassword'&& 'Change Password'}
          {pathName === 'changePhone'&& 'Change Phone number'}
        </PageNameWrap>
        :
        null
        }
        <ButtonWraps>
          {
          noButton?
          <>
          </>
          :
          <>
          {innerWidth > 768 &&
          <ProfileButton onClick={goMyPage}>
            <ProfileImage src={profileImage}/>
          </ProfileButton>
          }
          {
            innerWidth < 768 &&
            pathName == 'MobileProfile' || 
            pathName == 'community' ?
            <>
            </>
            :
            <HeartButton onClick={goLikeList} src={likeOffImage} onMouseOver={() => setIsMouseOveredLikeButton(true)} onMouseOut={() => setIsMouseOveredLikeButton(false)} />
          }
            <MyPageButton onClick={()=>setBottomSheetModal(true)}>
              <LikeButton src={menuicon}/>
            </MyPageButton>
          </>
          }
          {/* <SigninButton onClick={goSignIn} src={!token ? signIn : signOut} /> */}
        </ButtonWraps>
      </HeaderBox>
      <AlertModal visible={showModal} setVisible={setShowModal} onClick={closeAlertModal} text="You don't have access" />
      <AlertModal visible={showLogin} setVisible={setShowLogin} onClick={closeLoginAlertModal} text="Available after Sign up" />
      <ConfirmModal visible={confirmModal} setVisible={setConfirmModal} text="Are you sure you want to log out?" onOk={onLogout} />
      <Modal opened={showModal} onClose={() => setShowModal(false)} overlayOpacity={0.5} size="auto" centered withCloseButton={false}>
        <ModalBox>
          <ModalTitle>개인정보 수정을 위해서</ModalTitle>
          <ModalTitle>비밀번호를 입력해 주세요.</ModalTitle>
          <InputWrap>
            <TextInput maxLength={16} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter" />
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
    </>
  );
}

const HeaderBox = styled.div`
  position: fixed;
  width: 100%;
  display: flex;
  height: 100px;
  background-color: #ffffff;

  align-items: center;
  justify-content: space-between;
  z-index: 99;
  @media only screen and (max-width: 768px) {
    height: 60px;
  }
`;

const Logo = styled.img`
  position:absolute;
  left:50px;
  width: 142px;

  cursor: pointer;
  object-fit: contain;
  /* 1440px */
  /* @media only screen and (max-width: 1440px) {
    left:20px;
  } */
  @media only screen and (max-width: 768px) {
    left:18.42px;
    width: 73.61px;
  }
`;

const WebMenuWrap = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  align-items: center;
  justify-content: center;
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;
const PageNameWrap = styled.div`
font-family:'Pretendard Variable';
  font-weight: 410;
  position:absolute;
  left:50%;
  transform:translate(-50%,0);
  @media only screen and (max-width: 768px) {
    font-size:14px;
  }
`;

const ButtonWrap = styled.div`
  display: flex;
  align-items: center;
`;

const SheetWrap = styled.div`
// tranform: translateY(-1px);
  width:100%;
  padding:20px 50px;
  @media only screen and (max-width: 768px) {
  padding:27.58px 0 0 21.69px;
}
`;
const LogBox = styled.div`
  cursor: pointer;
  padding:5px;
`
const IconWrap = styled.div`
display:flex;
align-items:center;
justify-content:center;
  width:25px;
  height:25px;
  margin-right:14px;
  object-fit:contain;
@media only screen and (max-width: 768px) {

}
`
const SheetMenu = styled.div`
// tranform: translateY(-1px);
font-family:'Pretendard Variable';
display:flex;
align-items:center;
  width:100%;
  font-weight: 410;
  margin:30px 0;
  cursor: pointer;
@media only screen and (max-width: 768px) {
  font-size:14px;
  margin:21px 0;
}
`;
const SheetLogoutMenu = styled.div`
// tranform: translateY(-1px);
display:flex;
font-family:'Pretendard Variable';
  justify-content:flex-end;
  padding: 21.69px 20px 70px 0;
  font-weight: 410;
  text-align:right;
@media only screen and (max-width: 768px) {
  font-size:14px;
}
`;

const SheetBackground = styled.div`
// tranform: translateY(-1px);
  position:absolute;
  display:flex;
  flex:1;
  width:100%;
  height:100%;
  z-index: 100;
@media only screen and (max-width: 768px) {
}
`;

const LayoutLine = styled.div`
margin-left: 20px;
// tranform: translateY(-1px);
@media only screen and (max-width: 960px) {
  margin-left: 20px;
  width: 22px;
}
@media only screen and (max-width: 768px) {
  margin-left: 5px;
}
`;

const ProfileImage = styled.img`
  width:21px;
  height:24px;
  margin:5px 15px;
  @media only screen and (max-width: 768px) {
  margin:5px 5px;
}
`

const LikeButton = styled.img`
  width: 23px;
  cursor: pointer;
  object-fit:cover;
  transition: all 0.5s ease;
  /* margin-left: 30px; */
  margin: 5px 15px;
  /* @media only screen and (max-width: 1440px) {
    margin-left: 30px;
  } */
  @media only screen and (max-width: 768px) {
    margin:5px 5px 5px 12.63px;
    width: 17.93px;
  }
`;

const HeartButton = styled.img<{stylewidth?:boolean}>`
  width: 24.78px;
  height: 21.75px;
  cursor: pointer;

  transition: all 0.5s ease;
  /* @media only screen and (max-width: 1440px) {
    width: ${(props)=>props.stylewidth? 20 : 23}px;
    margin-left: 20px;
  } */
  margin:5px 15px;
  @media only screen and (max-width: 768px) {
    margin:5px 5px;
    width:18.89px;
    height:15.82px;
  }
`;

const CartButton = styled.img`
  margin-left: 20px;
  width: 25px;
  cursor: pointer;
  @media only screen and (max-width: 1290px) {
    width: 23px;
  }
  @media only screen and (max-width: 960px) {
    margin-left: 20px;
    width: 22px;
  }
  @media only screen and (max-width: 768px) {
    margin-left: 10px;
  }
`;
const ProfileButton = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  cursor: pointer;
 
`

const MyPageButton = styled.div`
font-family:'Pretendard Variable';
  font-weight: 310;
  color: #121212;
  cursor: pointer;
  object-fit:contain;
    @media only screen and (max-width: 768px) {
      font-size:14px;
  }
`

const SigninButton = styled(CartButton)`
  margin-left: 20px;
  @media only screen and (max-width: 768px) {
    margin-left: 5px;
  }
`;

const MenuButton = styled.div<{On?:boolean}>`
  display: flex;
  font-weight:${props => props.On ? 510 : 360};
  align-items: center;
  margin: 0 70px;
  position: relative;
  cursor: pointer;
  @media only screen and (max-width: 1440px) {
    margin: 0 45px;
  }
  @media only screen and (max-width: 1024px) {
    margin: 0 25px;
  }
`;

const MenuButtonText = styled.span`
font-family:'Pretendard Variable';
  font-weight: 410;
  color: #121212;
  font-size: 16px;
  &:hover {
    color: #398049;
  }
  transition: all 0.3s ease;
  line-height:1px;
  @media only screen and (max-width: 1440px) {
    font-size: 14px;
  }

`;

const IconImage = styled.img`

  object-fit:contain;

`;
const HeartIconImage = styled(IconImage)`
  width: 23px;

@media only screen and (max-width: 768px) {
  width: 19px;

}
`
const SellingIconImage = styled(IconImage)`
  width: 24px;

@media only screen and (max-width: 768px) {
  width: 23px;

}
`
const ContactIconImage = styled(IconImage)`
  width: 23px;

@media only screen and (max-width: 768px) {
  width: 22.27px;

}
`
const SettingsIconImage = styled(IconImage)`
  width: 23px;

@media only screen and (max-width: 768px) {
  width: 22px;

}
`
const BackButtonWrap = styled.div`
  position:absolute;
  left:15px;
  cursor:pointer;
  padding:5px;
`;
const BackButton = styled.img`
  position:absolute;
  left:15px;
  cursor:pointer;
  padding:5px;
  width: 20px;
  height: 25px;
`;

const ModalBox = styled.div`
  background-color: #fff;
  padding: 30px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media only screen and (max-width: 768px) {
    padding: 10px 20px;
  }
`;

const ModalTitle = styled.span`
font-family:'Pretendard Variable';
  font-weight:normal;
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

const ButtonWraps = styled.div`
  position:absolute;
  right:50px;
  display: flex;
  align-items:center;
  justify-content:center;
  /* 1440px */
  /* @media only screen and (max-width: 1440px) {
    right:20px;
  } */
  @media only screen and (max-width: 768px) {
    right:20px;
    flex-direction: column;
    display: -webkit-inline-box;
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
    max-width:120px;
  }
`;

const ModalWhiteButton = styled(ModalBlackButton)`
  background-color: #ffffff;
  margin-left: 20px;
  @media only screen and (max-width: 768px) {
    margin-left: 10px;
    max-width:120px;
  }
`;

const AlertText = styled.span`
font-family:'Pretendard Variable';
  font-weight:normal;
  font-weight: 410;
  font-size: 12px;
  color: #d82c19;
  margin-top: 8px;
  padding-left: 10px;
`;

const BlackButtonText = styled.span`
font-family:'Pretendard Variable';
  font-weight:normal;
  color: #ffffff;
  font-size: 16px;
  font-weight: 410;
  @media only screen and (max-width: 768px) {
    font-size: 11px;
  }
`;

const WhiteButtonText = styled(BlackButtonText)`
  color: #121212;
`;
const EmptyHeightBox = styled.div`
  width:100%;
  height:35px;
`;
const HeaderButtom = styled.div`
// tranform: translateY(-1px);
  position:absolute;
  top:15px;
  left:50%;
  transform:translate(-50%,0);
  width:45px;
  border-top:4.5px solid #B0B0B0;
  border-radius:20px;
  @media only screen and (max-width: 768px) {
    border-top:4.5px solid #B0B0B0;
    width:36.49px;
  }
`;


export default Header;
