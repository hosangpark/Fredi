import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import logoImage from '../../asset/image/logo.png';
import AlertModal from '../Modal/AlertModal';
import likeOffImage from '../../asset/image/heart_off.png';
import likeOnImage from '../../asset/image/heart_on.png';
import cart from '../../asset/image/cart.png';
import { APICheckNew } from '../../api/SettingAPI';
import { UserContext } from '../../context/user';
import newIconImage from '../../asset/image/ico_new.png';
import ConfirmModal from '../Modal/ConfirmModal';
import signIn from '../../asset/image/sign_in.png';
import signOut from '../../asset/image/sign_out.png';
import backButtonImage from '../../asset/image/back.png';
import { Menu, Button, Text } from '@mantine/core';
import { IconSettings, IconSearch, IconPhoto, IconMessageCircle, IconTrash, IconArrowsLeftRight } from '@tabler/icons';
import { APICheckPassword, APIUserDetails } from '../../api/UserAPI';
import { Modal } from '@mantine/core';

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
  console.log('pathName', pathName);

  const navigate = useNavigate();
  const { user, patchUser } = useContext(UserContext);

  const token = sessionStorage.getItem('token');
  const [showLogin, setShowLogin] = useState(false);
  const [check, setCheck] = useState<{ product: boolean; producer: boolean }>();
  const [showModal, setShowModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [isMouseOveredLikeButton, setIsMouseOveredLikeButton] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [userDetails, setUserDetails] = useState<TUserDetails>();
  const [isSnsUser, setIsSnsUser] = useState(false);
  const [password, setPassword] = useState<string>('');
  const [passwordAlert, setPasswordAlert] = useState(false);

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
    navigate('/shop');
  }, []);

  const goLikeList = useCallback(() => {
    removeHistory();
    if (!token) {
      return setShowLogin(true);
    }
    navigate('/likelist');
  }, [token]);

  const go_orderList = useCallback(() => {
    removeHistory();
    if (!token) {
      return setShowLogin(true);
    }
    navigate('/orderlist');
  }, [token]);

  const go_requestList = useCallback(() => {
    removeHistory();
    if (!token) {
      return setShowLogin(true);
    }
    navigate('/asklist-shop');
  }, [token]);

  const goContact = useCallback(() => {
    removeHistory();
    navigate('/contact/asklist');
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
    removeHistory();
    if (!token) {
      return setShowLogin(true);
    }
    navigate('/cart');
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

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    if (userAgent === 'APP-android' || userAgent === 'APP-ios') {
      if (
        pathName === 'productdetails' ||
        pathName === 'shopdetails' ||
        pathName === 'cart' ||
        pathName === 'order' ||
        pathName === 'shopdetails' ||
        pathName === 'orderlist' ||
        pathName === 'orderdetails' ||
        pathName === 'request' ||
        pathName === 'modifyuserinfo' ||
        pathName === 'finduserid' ||
        pathName === 'findpassword' ||
        pathName === 'signup' ||
        pathName === 'producerdetails' ||
        pathName === 'kakao' ||
        pathName === 'naver' ||
        pathName === 'asklist-shop'
      ) {
        setShowBackButton(true);
      } else {
        setShowBackButton(false);
      }
    } else {
      setShowBackButton(false);
    }
  }, [pathName]);

  // const checkNew = async () => {
  //   const result = await APICheckNew();
  //   setCheck(result);
  // };

  // useEffect(() => {
  //   checkNew();
  // }, []);

  return (
    <>
      <HeaderBox>
        {showBackButton ? <BackButton onClick={() => navigate(-1)} src={backButtonImage} /> : <Logo onClick={goHome} src={logoImage} />}

        <WebMenuWrap>
          {/* <MenuButton>
            <MenuButtonText>커뮤니티</MenuButtonText>
          </MenuButton> */}
          <MenuButton onClick={goProduct}>
            <MenuButtonText>작품보기</MenuButtonText>
          </MenuButton>

          {user.level <= 1 && (
            <MenuButton onClick={goProducing}>
              <MenuButtonText>Producing</MenuButtonText>
            </MenuButton>
          )}

          <MenuButton onClick={goShop}>
            <MenuButtonText>Shop</MenuButtonText>
          </MenuButton>
          {/* <MenuButton onMouseOver={() => setIsMouseOveredLikeButton(true)} onMouseOut={() => setIsMouseOveredLikeButton(false)}>
            <LikeButton onClick={goLikeList} src={!isMouseOveredLikeButton ? likeOffImage : likeOnImage} />
          </MenuButton> */}
          <MenuButton onClick={goContact}>
            <MenuButtonText>고객센터</MenuButtonText>
          </MenuButton>

          {/* <MenuButton onClick={goMyPage}>
            <MenuButtonText>마이페이지</MenuButtonText>
          </MenuButton> */}

          {token && user.level === 0 && (
            <MenuButton onClick={goAdmin}>
              <MenuButtonText>MANAGER</MenuButtonText>
            </MenuButton>
          )}
        </WebMenuWrap>
        <ButtonWraps>
          {/* <MenuButton onMouseOver={() => setIsMouseOveredLikeButton(true)} onMouseOut={() => setIsMouseOveredLikeButton(false)}>
            <LikeButton onClick={goLikeList} src={!isMouseOveredLikeButton ? likeOffImage : likeOnImage} onMouseOver={() => setIsMouseOveredLikeButton(true)} onMouseOut={() => setIsMouseOveredLikeButton(false)} />
          </MenuButton> */}
          <LikeButton onClick={goLikeList} src={!isMouseOveredLikeButton ? likeOffImage : likeOnImage} onMouseOver={() => setIsMouseOveredLikeButton(true)} onMouseOut={() => setIsMouseOveredLikeButton(false)} />
          <CartButton onClick={goCart} src={cart} />
          <LayoutLine>{` | `}</LayoutLine>
          <Menu shadow="md" width={150} styles={(theme) => ({
            item: {
              fontFamily: 'NotoSans',
              fontWeight: 500,
              color: '#121212',
            },
            divider: {
              width: '90%',
              justifyContent: 'cneter',
              margin: 'auto',
              borderTopColor: '#121212',
              marginTop: 10,
              marginBottom: 10,
            },
          })}>  
            <Menu.Target>
              <MyPageButton>MY</MyPageButton>
            </Menu.Target>

            <Menu.Dropdown>
              {user.level !== 0 ? (
                <>
                <Menu.Item onClick={goMyPage}>MY</Menu.Item>
                <Menu.Item onClick={() => {
                  if(!token){
                    setShowLogin(true);
                  } else {
                  if (!isSnsUser) {
                    setShowModal(true);
                  } else {
                    navigate('/modifyuserinfo');
                  }
                } 
                }}>개인정보수정</Menu.Item>
              <Menu.Item onClick={goLikeList}>찜한작품</Menu.Item>
              <Menu.Item onClick={goCart}>장바구니</Menu.Item>
              <Menu.Item onClick={go_orderList}>구매내역</Menu.Item>
              <Menu.Item onClick={go_requestList}>문의내역</Menu.Item></>
              ) : (
                <>
                <Menu.Item onClick={goMyPage}>MY</Menu.Item>
                </>
              )}

              <Menu.Divider />

              <Menu.Item onClick={goSignIn}>{!token ? 'LOGIN' : 'LOGOUT'}</Menu.Item>
            </Menu.Dropdown>
          </Menu>
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
  padding: 0 50px;
  align-items: center;
  justify-content: space-between;
  z-index: 99;
  @media only screen and (max-width: 960px) {
    padding: 0 30px;
  }
  @media only screen and (max-width: 768px) {
    padding: 0 18px;
    height: 50px;
  }
`;

const Logo = styled.img`
  width: 150px;
  height: 38px;
  cursor: pointer;
  @media only screen and (max-width: 1290px) {
    width: 130px;
    object-fit: contain;
  }
  @media only screen and (max-width: 960px) {
    width: 110px;
  }
  @media only screen and (max-width: 768px) {
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

const ButtonWrap = styled.div`
  display: flex;
  align-items: center;
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

const LikeButton = styled.img`
  width: 23px;
  cursor: pointer;

  transition: all 0.5s ease;

  @media only screen and (max-width: 1290px) {
    width: 23px;
  }
  @media only screen and (max-width: 960px) {
    margin-left: 10px;
    width: 22px;
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
  font-family: 'NotoSans';
  font-weight: 500;
  color: #121212;
  cursor: pointer;
  margin-left: 20px;
    @media only screen and (max-width: 768px) {
      margin-left: 5px;
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
  margin: 0 30px;
  position: relative;
  cursor: pointer;
  @media only screen and (max-width: 1290px) {
    margin: 0 22px;
  }
  @media only screen and (max-width: 1180px) {
    margin: 0 15px;
  }
`;

const MenuButtonText = styled.span`
  font-family: 'NotoSans';
  font-weight: 500;
  color: #121212;
  font-size: 15px;
  &:hover {
    color: #398049;
  }
  transition: all 0.3s ease;
  @media only screen and (max-width: 1290px) {
    font-size: 14px;
  }
  @media only screen and (max-width: 1050px) {
    font-size: 13px;
  }
  @media only screen and (max-width: 960px) {
    font-size: 12px;
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
  width: 25px;
  height: 25px;
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
  font-weight: 400;
  outline: 0;
  border-radius: 0;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const ButtonWraps = styled.div`
  display: flex;
  // margin-top: 10px;
  @media only screen and (max-width: 768px) {
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


export default Header;
