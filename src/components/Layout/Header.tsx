import React, { memo, useCallback, useContext, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import logoImage from '../../asset/image/logo.png';
import AlertModal from '../Modal/AlertModal';
import menuheart from '../../asset/image/heart.png';
import menucart from '../../asset/image/menucart.png';
import menuorderlist from '../../asset/image/orderlist.png';
import menutextballoon from '../../asset/image/textballoon.png';
import menucontact from '../../asset/image/contact.png';
import menusetting from '../../asset/image/setting.png';

import likeOffImage from '../../asset/image/heart_off.png';
import likeOnImage from '../../asset/image/heart_on.png';
import menuicon from '../../asset/image/threecircle.png';
import profileImage from '../../asset/image/profile.png';
import cartImage from '../../asset/image/cart.png';
import ContactImage from '../../asset/image/home05.png';
import LogoutImage from '../../asset/image/ico_logout.png';
import { APICheckNew } from '../../api/SettingAPI';
import { UserContext } from '../../context/user';
import newIconImage from '../../asset/image/ico_new.png';
import ConfirmModal from '../Modal/ConfirmModal';
import signIn from '../../asset/image/sign_in.png';
import signOut from '../../asset/image/sign_out.png';
import backButtonImage from '../../asset/image/leftarrow.png';
import { Menu, Button, Text } from '@mantine/core';
import { IconSettings, IconSearch, IconPhoto, IconMessageCircle, IconTrash, IconArrowsLeftRight } from '@tabler/icons';
import { APICheckPassword, APIUserDetails } from '../../api/UserAPI';
import { Modal } from '@mantine/core';
import Sheet,{SheetRef} from 'react-modal-sheet';

export const removeHistory = () => {
  sessionStorage.removeItem('products');
  sessionStorage.removeItem('producers');
  sessionStorage.removeItem('shop');
  sessionStorage.removeItem('page');
  sessionStorage.removeItem('y');
  sessionStorage.removeItem('type');
  sessionStorage.removeItem('tab');
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
  const [showNext, setShowNext] = useState(false);
  const [showSave, setShowSave] = useState(false);
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

  const goProduct = useCallback(() => {
    removeHistory();
    navigate('/');
  }, []);

  const goProducing = useCallback(() => {
    removeHistory();
    if (user.level > 1) {
      setShowModal(true);
    } else {
      navigate('/producer');
    }
  }, [user]);

  useEffect(() => {
    getUserDetails();
  }, []);
  
  const getUserDetails = async () => {
    try {
      const res = await APIUserDetails();
      console.log(res);
      setUserDetails(res);
      setIsSnsUser(res.type !== 1 ? true : false);
    } catch (error) {
      console.log(error);
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

  const goShop = useCallback(() => {
    removeHistory();
    navigate('/admin/registerfaq');
  }, []);

  const goLikeList = useCallback(() => {
    setBottomSheetModal(false)
    removeHistory();
    // if (!token) {
    //   return setShowLogin(true);
    // }
    navigate('/LikeTab');
  }, [token]);

  const go_orderList = useCallback(() => {
    setBottomSheetModal(false)
    removeHistory();
    if (!token) {
      return setShowLogin(true);
    }
    navigate('/orderlist');
  }, [token]);

  const go_requestList = useCallback(() => {
    setBottomSheetModal(false)
    removeHistory();
    if (!token) {
      return setShowLogin(true);
    }
    navigate('/asklist-shop');
  }, [token]);

  const goContact = useCallback(() => {
    setBottomSheetModal(false)
    removeHistory();
    navigate('/contact');
  }, []);

  const goFair = useCallback(() => {
    setBottomSheetModal(false)
    removeHistory();
    navigate('/Fair');
  }, []);
  const goArtwork = useCallback(() => {
    setBottomSheetModal(false)
    removeHistory();
    navigate('/Artwork');
  }, []);
  
  const goArtist = useCallback(() => {
    setBottomSheetModal(false)
    removeHistory();
    navigate('/Artist');
  }, []);

  const goCommunity = useCallback(() => {
    setBottomSheetModal(false)
    removeHistory();
    navigate('/Community');
  }, []);

  const goMyPage = useCallback(() => {
    removeHistory();
    if (!token) {
      setShowLogin(true);
    } else {
      navigate('/profile');
    }
  }, [token]);

  const goAdmin = useCallback(() => {
    removeHistory();
    navigate('/admin');
  }, []);

  const goCart = useCallback(() => {
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
  const nextHandle = () => {
    if(pathName === 'AddPhoto'){
      navigate('/AddPhoto2')
    } else if (pathName === 'AddPhoto2'){
      navigate('/AddPhoto')
    } 
  };
  const saveHandle = () => {
    if(pathName === 'modifyuserinfo'){
      alert('저장되었습니다.')
      navigate('/')
      // navigate('/AddPhoto2')
    } else if (pathName === 'AddPhoto2'){
      alert('저장되었습니다.')
      navigate(-2)
    } else if (pathName === 'EditProfile'){
      navigate(-1)
    } 
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

  // useEffect(() => {
  //   const userAgent = window.navigator.userAgent;
  //   if (userAgent === 'APP-android' || userAgent === 'APP-ios') {
  //     if (
  //       pathName === 'productdetails' ||
  //       pathName === 'shopdetails' ||
  //       pathName === 'cart' ||
  //       pathName === 'order' ||
  //       pathName === 'shopdetails' ||
  //       pathName === 'orderlist' ||
  //       pathName === 'orderdetails' ||
  //       pathName === 'request' ||
  //       pathName === 'modifyuserinfo' ||
  //       pathName === 'finduserid' ||
  //       pathName === 'findpassword' ||
  //       pathName === 'signup' ||
  //       pathName === 'producerdetails' ||
  //       pathName === 'kakao' ||
  //       pathName === 'naver' ||
  //       pathName === 'asklist-shop'
  //     ) {
  //       setShowBackButton(true);
  //     } else {
  //       setShowBackButton(false);
  //     }
  //   } else {
  //     setShowBackButton(false);
  //   }
  // }, [pathName]);

  useEffect(() => {
    if (
      pathName === 'asklist'
    ) {
      showSendMessage(true)
    }else{
      showSendMessage(false)
    }
  }, [pathName]);
  
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
      pathName === 'AddPhoto' ||
      pathName === 'AddLink'
    ) {
      setShowNext(true)
      setShowSave(false)
    }else{
      setShowNext(false)
    }
  }, [pathName]);

  useEffect(() => {
    if (
      pathName === 'AddPhoto2' ||
      pathName === 'EditProfile' ||
      pathName === 'modifyuserinfo' ||
      pathName === 'AddLink'
    ) {
      setShowSave(true)
      setShowNext(false)
    }else{
      setShowSave(false)
    }
  }, [pathName]);

  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    if(innerWidth > 768){
      setShowBackButton(false);
      setPageName(false)
      setShowSave(false)
      setShowNext(false)
      showSendMessage(false)
    } else {
      if (
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
        pathName === 'MainTab' ||
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
        // snapPoints={[700, 400, 100, 50]}
        // initialSnap={3}
        // onClick={() => setBottomSheetModal(false)}
        >
          <Sheet.Container>
            <Sheet.Header>
              <EmptyHeightBox onClick={() => setBottomSheetModal(false)}>
              <HeaderButtom/>
              </EmptyHeightBox>
            </Sheet.Header>
            <Sheet.Content>
              <SheetWrap> 
                {/* goMyPage */}
                <SheetMenu onClick={goLikeList}>
                  <IconImage src={menuheart}/>
                  {/* 찜한작품 */}
                  Like
                </SheetMenu>
                <SheetMenu onClick={goCart}>
                  <IconImage src={menucart}/>
                  
                  Selling
                </SheetMenu>
                {/* <SheetMenu onClick={go_orderList}>
                  <IconImage src={menuorderlist}/>
                  Order List
                  
                </SheetMenu>
                <SheetMenu onClick={()=>{}}>
                  <IconImage src={menutextballoon}/>
                  
                  Product Q & A
                </SheetMenu> */}
                <SheetMenu onClick={goContact}>
                  <IconImage src={menucontact}/>
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
                  <IconImage src={menusetting}/>
                  {/* 개인정보수정 */}
                  Settings
                </SheetMenu>
                <SheetLogoutMenu>
                  <div onClick={go_requestList}>
                    Logout
                  </div>
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
          <MenuButton onClick={goFair}>
            <MenuButtonText>Fair</MenuButtonText>
          </MenuButton>
          <MenuButton onClick={goArtwork}>
            <MenuButtonText>Artwork</MenuButtonText>
          </MenuButton>
          <MenuButton onClick={goArtist}>
            <MenuButtonText>Artist</MenuButtonText>
          </MenuButton>
          <MenuButton onClick={goCommunity}>
            <MenuButtonText>Discover</MenuButtonText>
          </MenuButton>
          {/* goShop goLikeList go_orderList go_requestList goContact goMyPage goAdmin goCart */}

          {/* {user.level <= 1 && (
            <MenuButton onClick={goProducing}>
              <MenuButtonText>Producing</MenuButtonText>
            </MenuButton>
          )} */}

          {/* <MenuButton onClick={goShop}>
            <MenuButtonText>Shop</MenuButtonText>
          </MenuButton> */}
          {/* <MenuButton onMouseOver={() => setIsMouseOveredLikeButton(true)} onMouseOut={() => setIsMouseOveredLikeButton(false)}>
            <LikeButton onClick={goLikeList} src={!isMouseOveredLikeButton ? likeOffImage : likeOnImage} />
          </MenuButton> */}
          {/* <MenuButton onClick={goContact}>
            <MenuButtonText>고객센터</MenuButtonText>
          </MenuButton> */}

          {/* <MenuButton onClick={goMyPage}>
            <MenuButtonText>마이페이지</MenuButtonText>
          </MenuButton> */}

          {token && user.level === 0 && (
            <MenuButton onClick={goAdmin}>
              <MenuButtonText>MANAGER</MenuButtonText>
            </MenuButton>
          )}
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
          {/* <MenuButton onMouseOver={() => setIsMouseOveredLikeButton(true)} onMouseOut={() => setIsMouseOveredLikeButton(false)}>
            <LikeButton onClick={goLikeList} src={!isMouseOveredLikeButton ? likeOffImage : likeOnImage} onMouseOver={() => setIsMouseOveredLikeButton(true)} onMouseOut={() => setIsMouseOveredLikeButton(false)} />
          </MenuButton> */}
          {
          noButton?
          <>
          </>
          :
          showNext?
            <MyPageButton onClick={nextHandle}>next</MyPageButton>
          :
          showSave?
            <MyPageButton onClick={saveHandle}>save</MyPageButton>
          :
          showsendMessage?
            <MyPageButton onClick={()=>navigate('/registerask')}>send message</MyPageButton>
          :
          <>
          {innerWidth > 768 &&
            <LikeButton stylewidth={true} onClick={()=>navigate(`/MobileProfile/${user}`)} src={profileImage}/>
          }
            <LikeButton onClick={goLikeList} src={likeOffImage} onMouseOver={() => setIsMouseOveredLikeButton(true)} onMouseOut={() => setIsMouseOveredLikeButton(false)} />
            <MyPageButton onClick={()=>setBottomSheetModal(true)}>
              <LikeButton stylewidth={true} src={menuicon}/>
            </MyPageButton>
          </>
          }
          {/* <SigninButton onClick={goSignIn} src={!token ? signIn : signOut} /> */}
        </ButtonWraps>
      </HeaderBox>
      <AlertModal visible={showModal} setVisible={setShowModal} onClick={closeAlertModal} text="접근 권한이 없습니다." />
      <AlertModal visible={showLogin} setVisible={setShowLogin} onClick={closeLoginAlertModal} text="회원가입 후 이용 가능합니다." />
      <ConfirmModal visible={confirmModal} setVisible={setConfirmModal} text="로그아웃 하시겠습니까?" onOk={onLogout} />
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
    </>
  );
}

const HeaderBox = styled.div`
  position: fixed;
  width: 100%;
  display: flex;
  height: 80px;
  background-color: #ffffff;

  align-items: center;
  justify-content: space-between;
  z-index: 99;
  @media only screen and (max-width: 1440px) {
  }
  @media only screen and (max-width: 768px) {
    height: 50px;
  }
`;

const Logo = styled.img`
  position:absolute;
  left:50px;
  width: 150px;
  height: 38px;
  cursor: pointer;
  object-fit: contain;
  /* 1440px */
  /* @media only screen and (max-width: 1440px) {
    left:20px;
  } */
  @media only screen and (max-width: 768px) {
    left:20px;
    width: 80px;
  }
`;

const WebMenuWrap = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  align-items: center;
  justify-content: center;
  padding: 0 30px;
  @media only screen and (max-width: 1000px) {
    padding: 0 15px;
    flex-wrap: wrap;
  }
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;
const PageNameWrap = styled.div`
font-family:'Pretendard Variable';
  font-weight:normal;
  position:absolute;
  left:50%;
  font-weight:500;
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
  padding:20px 8%;
@media only screen and (max-width: 768px) {
}
`;
const SheetMenu = styled.div`
// tranform: translateY(-1px);
font-family:'Pretendard Variable';
  width:100%;
  font-weight:400;
  margin:25px 0;
@media only screen and (max-width: 768px) {
  font-size:14px;
}
@media only screen and (max-width: 450px) {
  font-size:14px;
  margin:20px 0;
}
`;
const SheetLogoutMenu = styled.div`
// tranform: translateY(-1px);
display:flex;
font-family:'Pretendard Variable';
  justify-content:flex-end;
  padding: 20px 20px 20px 0;
  font-weight:350;
  text-align:right;
@media only screen and (max-width: 768px) {
}
@media only screen and (max-width: 450px) {
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

const LikeButton = styled.img<{stylewidth?:boolean}>`
  width: ${(props)=>props.stylewidth? 24 : 26}px;
  cursor: pointer;
  object-fit:cover;
  transition: all 0.5s ease;
  margin-left: 30px;
  @media only screen and (max-width: 1440px) {
    width: ${(props)=>props.stylewidth? 20 : 23}px;
    margin-left: 20px;
  }
  @media only screen and (max-width: 768px) {
    margin-left: 10px;
    width: ${props=>props.stylewidth? 19 : 22}px;
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

const MyPageButton = styled.div`
font-family:'Pretendard Variable';
  font-weight: 500;
  color: #121212;
  cursor: pointer;
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

const MenuButton = styled.div`
  display: flex;
  align-items: center;
  margin: 0 65px;
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
  font-weight: 400;
  color: #121212;
  font-size: 16px;
  &:hover {
    color: #398049;
  }
  transition: all 0.3s ease;

  @media only screen and (max-width: 1024px) {
    font-size: 14px;
  }

`;

const IconImage = styled.img`
  width: 22px;
  height: 22px;
  margin-right:35px;
@media only screen and (max-width: 450px) {
  margin-right:25px;
  width: 18px;
  height: 18px;
}
`;
const NewIcon = styled.img`
  width: 12px;
  height: 12px;
  position: absolute;
  left: -15px;
  top: 0px;
`;

const MenuButtonImage = styled.img`
  width: 28px;
  height: 28px;
  margin-bottom: 3px;
`;

const BackButton = styled.img`
  position:absolute;
  left:20px;
  
  width: 10px;
  height: 15px;
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
  font-weight: 400;
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
    right:10px;
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
  font-weight: 400;
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
  font-weight: 400;
  @media only screen and (max-width: 768px) {
    font-size: 11px;
  }
`;

const WhiteButtonText = styled(BlackButtonText)`
  color: #121212;
`;
const EmptyHeightBox = styled.div`
  width:100%;
  height:50px;
`;
const HeaderButtom = styled.div`
// tranform: translateY(-1px);
  position:absolute;
  top:20px;
  left:50%;
  transform:translate(-50%,0);
  width:45px;
  border:1px solid #d3d3d3;
  border-radius:20px;
  @media only screen and (max-width: 768px) {
    width:35px;
  }
`;


export default Header;
