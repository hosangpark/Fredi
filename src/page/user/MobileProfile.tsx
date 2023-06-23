import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@mantine/core';
import { APICheckPassword, APIUserDetails } from '../../api/UserAPI';
import { UserContext } from '../../context/user';
import ImageCard from '../../components/Shop/ImageCard';
import { TImage } from '../admin/ProducerList';
import Sheet,{SheetRef} from 'react-modal-sheet';
import RightArrowImage from '../../asset/image/ico_next_mobile.png'
import cameraImage from '../../asset/image/camera.png';
import qrImage from '../../asset/image/qricon.png';
import linkImage from '../../asset/image/links.png';
import profileImage from '../../asset/image/profile.png';
import QrModal from '../../components/Modal/QrModal';

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

function MobileProfile() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [passwordAlert, setPasswordAlert] = useState(false);
  const [isSnsUser, setIsSnsUser] = useState(false);
  const [imageList, setimageList] = useState<ImageItem[]>([]);
  const [linkList, setlinkList] = useState<{linktitle:string,linkurl:string}[]>([]);
  const [showType, setShowType] = useState<1 | 2>(1);
  const [userDetails, setUserDetails] = useState<TUserDetails>();
  const [password, setPassword] = useState<string>('');
  const [bottomSheetModal, setBottomSheetModal] = useState(false);
  const [qrmodal,setQrModal] = useState(false);
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
  
  const saveHistory = (e: React.MouseEvent, name: string) => {
    const div = document.getElementById('root');
    if (div) {
      // console.log(div.scrollHeight, globalThis.scrollY);
      // const y = globalThis.scrollY;
      // // sessionStorage.setItem('shop', JSON.stringify(shopList));
      // // sessionStorage.setItem('page', String(page));
      // sessionStorage.setItem('type', String(showType));
      // sessionStorage.setItem('y', String(y ?? 0));
      navigate(`/personalpage/${name}`);
    }
  };

  const gotoLink = (e:string)=>{

  }

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
    setlinkList([
      {
        linktitle:'Website(FREDI)',
        linkurl:'www.fredi.co.kr'
      },
      {
        linktitle:'Website(FREDI)',
        linkurl:'www.fredi.co.kr'
      },
      {
        linktitle:'Website(FREDI)',
        linkurl:'www.fredi.co.kr'
      },
      {
        linktitle:'Website(FREDI)',
        linkurl:'www.fredi.co.kr'
      },
    ])
  }, []);
  

  return (
    <Container>
      <Sheet isOpen={bottomSheetModal} onClose={() => setBottomSheetModal(false)}
        detent={'content-height'}
        // snapPoints={[700, 400, 100, 50]}
        // initialSnap={3}
        // onClick={() => setBottomSheetModal(false)}
        >
          <Sheet.Container>
            <Sheet.Content>
              <Sheet.Header>
                <EmptyHeightBox onClick={() => setBottomSheetModal(false)}>
                <HeaderButtom/>
                </EmptyHeightBox>
              </Sheet.Header>
              <SheetWrap>
                {/* 링크 최대갯수 알아야함 */}
                {linkList.map((item)=>{
                  return(
                <LayoutWrap onClick={()=>gotoLink('aaa')}>
                  <LinkImageWrap>
                    <LinksImage src={linkImage}/>
                  </LinkImageWrap>
                  <LinkItemBox>
                    <LinkTitleBox>
                      <LinkName>
                        {item.linktitle}
                      </LinkName>
                      <LinkUrl>
                        {item.linkurl}
                      </LinkUrl>
                    </LinkTitleBox>
                    <ArrowImageWrap>
                      <ArrowImage src={RightArrowImage}/>
                    </ArrowImageWrap>
                  </LinkItemBox>
                </LayoutWrap>
                  )
                })}
                
              </SheetWrap>
              {/* 링크 갯수에 따라 빈박스 삭제 */}
              {linkList.length < 4 &&
                <EmptyBox/>
              }
            </Sheet.Content>
          </Sheet.Container>

          <Sheet.Backdrop />
      </Sheet>
      {bottomSheetModal &&
      <SheetBackground onClick={() => setBottomSheetModal(false)}></SheetBackground>
      }
      <ProfileContainer>
        <ProfileHeaderWrap>
          <HeaderLeft>
            <ImageWrap>
              <Image src={profileImage}/>
            </ImageWrap>
            <NameBox>
              <NameText>SEOYOON SHIN</NameText>
              <SubTextBox>
                {/* <span>79 works · </span> */}
                <span>951 followers · </span>
                <span>12 following</span>
              </SubTextBox>
            </NameBox>
          </HeaderLeft>
          {!user?
          <ButtonBox>
            <ImageFlexBox>
              <ButtonImageWrap onClick={() => setBottomSheetModal(true)} style={{marginRight:10}}>
                <ButtonImage src={cameraImage}/>
              </ButtonImageWrap>
              <ButtonImageWrap onClick={()=>setQrModal(true)}>
                <ButtonImage src={qrImage}/>
              </ButtonImageWrap>
            </ImageFlexBox>
            <FollowButtonBox style={{marginTop:10}}>
              Follow
            </FollowButtonBox>
          </ButtonBox>
          :
          <ButtonBox>
            <FollowButtonBox style={{paddingLeft:8,paddingRight:8}} onClick={()=>{navigate('/EditProfile')}}>
              Edit Profile
            </FollowButtonBox>
            <FollowButtonBox style={{paddingLeft:8,paddingRight:8,marginTop:10}} onClick={()=>{navigate('/EditProfile')}}>
              Share Profile
            </FollowButtonBox>
          </ButtonBox>
          }
        </ProfileHeaderWrap>
        <DescriptionText>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam perferendis facere non eligendi numquam aperiam dolores quos saepe, ex sint repudiandae ad dolorem adipisci? Dolores obcaecati ipsa animi. Aliquid facilis molestias distinctio culpa, deserunt vitae dolorem ab. Velit ipsa odio animi, debitis, beatae molestias ipsum neque dolores incidunt commodi itaque aperiam recusandae ut error ratione placeat quidem excepturi explicabo non natus voluptate hic minima! Eos, mollitia cupiditate. Natus, ipsam, quam blanditiis ipsa porro illo ratione laborum officia repudiandae ab neque quae amet eveniet commodi repellat beatae nostrum. Quod aut veritatis, neque perferendis porro laudantium deserunt earum similique, eius, nemo molestias?</DescriptionText>
      </ProfileContainer>
      <WorksLengthBox>
        {imageList.length} works
      </WorksLengthBox>
      <ProductListWrap>
        {imageList.length > 0 &&
          imageList.map((item,index)=>{
            return(
              <ImageCard
                item={item}
                key={item.idx}
                onClick={(e) => saveHistory(e, item.name)}
                // onClickLike={(e) => {
                //   if (user.idx) {
                //     e.stopPropagation();
                //     onLikeShop(item.idx);
                //   } else {
                //     e.stopPropagation();
                //     setShowLogin(true);
                //   }
                // }}
                index={0}
                showType={showType}
              />
            )
            })
          }
          {imageList.length < 4 &&
          <PlusImage onClick={()=>navigate('/AddPhoto')}>
            <PlusText>+</PlusText>
          </PlusImage>
          }
          
      </ProductListWrap>
      {/* {imageList.length > 0 &&
      <PlusButton onClick={()=>navigate('/AddPhoto')}>
        <PlusText>+</PlusText>
      </PlusButton>
      } */}
      {/* <LeftBox>
        <LeftTopBox>
          <Title>Profile</Title>
        </LeftTopBox>
      </LeftBox>
      <RightBox>
        {user.level !== 0 ? (
          <>
            <RowWap>
              <LeftText>아이디</LeftText>
              <RightText>{userDetails?.user_id}</RightText>
            </RowWap>
            <RowWap>
              <LeftText>회원등급</LeftText>
              <RightText>
                {userDetails?.level === 1
                  ? '입점업체회원'
                  : userDetails?.level === 2
                  ? '일반회원2'
                  : userDetails?.level === 3
                  ? '일반회원1'
                  : userDetails?.level === 0
                  ? '관리자'
                  : ''}
              </RightText>
            </RowWap>
            <RowWap>
              <LeftText>이름</LeftText>
              <RightText>{userDetails?.name}</RightText>
            </RowWap>
            <RowWap>
              <LeftText>닉네임</LeftText>
              <RightText>{userDetails?.nickname}</RightText>
            </RowWap>
            <RowWap>
              <LeftText>휴대폰번호</LeftText>
              <RightText>{userDetails?.phone}</RightText>
            </RowWap>
            <RowWap>
              <LeftText>성별</LeftText>
              <RightText>{userDetails?.gender === 1 ? '남자' : userDetails?.gender === 2 ? '여자' : '-'}</RightText>
            </RowWap>
            <RowWap>
              <LeftText>생년월일</LeftText>
              <RightText>{userDetails?.birth ?? '-'}</RightText>
            </RowWap>
            <BottomRowWrap>
              <GreenButton onClick={() => navigate('/orderlist')}>
                <BlackButtonText>주문내역</BlackButtonText>
              </GreenButton>
              <WhiteButton onClick={() => navigate('/asklist-shop')}>
                <GreenBorderbuttonText>상품문의내역</GreenBorderbuttonText>
              </WhiteButton>
              <BlackButton
                onClick={() => {
                  if (!isSnsUser) {
                    setShowModal(true);
                  } else {
                    navigate('/modifyuserinfo');
                  }
                }}
              >
                <BlackButtonText>개인정보수정</BlackButtonText>
              </BlackButton>
            </BottomRowWrap>
          </>
        ) : (
          <>
            <RowWap>
              <LeftText>아이디</LeftText>
              <RightText>admin</RightText>
            </RowWap>
            <RowWap>
              <LeftText>회원 등급</LeftText>
              <RightText>관리자</RightText>
            </RowWap>
          </>
        )}
      </RightBox> */}
      {/* <EmptyBox /> */}
      <QrModal
        visible={qrmodal}
        setVisible={setQrModal}
        onClick={() => {
          setQrModal(false);
        }}
      />
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

const ArrowImageWrap = styled.div`
  width:20px;
  height:20px;
  display:flex;
  align-items:center;
  @media only screen and (max-width: 768px) {
    width:15px;
    height:15px;
  }
`;
const ArrowImage = styled.img`
  width:100%;
  height:100%;
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
const SheetWrap = styled.div`
// tranform: translateY(-1px);
  width:100%;
  padding:30px 15px;
  @media only screen and (max-width: 768px) {
  }
`;
const LayoutWrap = styled.div`
  display: flex;
  margin: 10px 0 ;
`;
const LinkImageWrap = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  width:70px;
  height:70px;
  margin-right:30px;
  /* width:40%; */
  @media only screen and (max-width: 768px) {
    margin-right:20px;
    width:45px;
    height:45px;
  }
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

const LinkName = styled.p`
  font-family:'Pretendard Variable';
  font-weight:normal;
  text-align:start;
  color:#2b2b2b;
  margin:0;
  @media only screen and (max-width: 768px) {
    font-size:14px;
  }
`
const LinkUrl = styled.p`
  font-family:'Pretendard Variable';
  font-weight:normal;
  text-align:start;
  color:#7c7c7c;
  font-size:14px;
  margin:0;
  @media only screen and (max-width: 768px) {
    font-size:12px;
  }
  `;
const IconImage = styled.img`
  width: 40px;
  height: 40px;
  margin-right:20px;
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
const ProfileContainer = styled.div`
  margin:20px;
  @media only screen and (max-width: 768px) {
  }
`;
const ProfileHeaderWrap = styled.div`
  display:flex;
  justify-content:space-between;
  @media only screen and (max-width: 768px) {
  }
`;
const HeaderLeft = styled.div`
width:100%;
  display:flex;
  margin:0 ;
  @media only screen and (max-width: 768px) {
  }
`;
const NameBox = styled.div`
  /* width:100%; */
  display:flex;
  flex-direction:column;
  @media only screen and (max-width: 768px) {
  }
  `;
const NameText = styled.p`
  font-family:'Pretendard Variable';
  font-weight:400;
  font-size:24px;
  text-align:start;
  line-height:31px;
  margin:0;
  @media only screen and (max-width: 768px) {
    font-size:22px;
  }
  @media only screen and (max-width: 450px) {
    font-size:20px;
    margin:0;
  }
`;
const FollowButtonBox = styled.div`
font-family:'Pretendard Variable';
  font-weight:normal;
  display: flex;
  justify-content: center;
  align-items: center;
  height:50%;
  border:0.5px solid #B4B4B4;;
  border-radius:7px;
  margin:0;
  padding:2px 0;
  font-weight:300;
  white-space:nowrap;
  @media only screen and (max-width: 768px) {
    font-size:14px;
  }
`;
const SubTextBox = styled.p`
  font-family:'Pretendard Variable';
  font-weight:normal;
  font-size:14px;
  text-align:start;
  color:#383838;
  margin:0;
  @media only screen and (max-width: 768px) {
    font-size:12px;
  }
`;
const PlusText = styled.p`
  margin:0;
  `;
const DescriptionText = styled.p`
  font-family:'Pretendard Variable';
  font-weight:normal;
  text-align:start;
  color:#2b2b2b;
  margin:30px 0;
  font-size:14px;
  @media only screen and (max-width: 768px) {
    font-size:12px;
  }
  `;
const ImageWrap = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  border-radius:50%;
  width:75px;
  aspect-ratio: 1;
  /* width:15%; */
  margin-right:15px;
  background-color: #DBDBDB;
`;
const PlusImage = styled.div`
  /* border:1px solid #a1a1a1;; */
  display:flex;
  justify-content:center;
  align-items:center;
  aspect-ratio: 1.2;
  background-color:#d1d1d1;
  width: 24.25%;
  cursor: pointer;
  overflow: hidden;
  margin-bottom: 30px;
  @media only screen and (max-width: 1440px) {
    /* width: 24.25%; */
    width: 32.66%
  }
  @media only screen and (max-width: 768px) {
    width: 49.5%;
    margin-bottom: 10px;
  }
`;
const ButtonImageWrap = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  border:0.5px solid #B4B4B4;
  box-sizing:border-box;
  border-radius:5px;
  width:50px;
  @media only screen and (max-width: 768px) {
    width:40px;
  }
  @media only screen and (max-width: 450px) {
    width:35px;
  }
`;
const Image = styled.img`
  width:50%;
  height:50%;
  object-fit:contain;
`;
const LinksImage = styled.img`
  width:100%;
  height:100%;
  object-fit:contain;
`;
const ButtonImage = styled.img`
  border-radius:7px;
  width:70%;
  height:70%;
  object-fit:contain;
`;
const ImageFlexBox = styled.div`
  display:flex;
  height:40px;
  justify-content:space-between;

  @media only screen and (max-width: 768px) {
  }
`;
const PlusButton = styled.div`
  position:sticky;
  bottom:100px;
  border:1px solid black;
  border-radius:50%;
  font-weight:400;
  display:none;
  @media only screen and (max-width: 768px) {
    display:block;
    left:calc(100% - 100px);
    width:50px;
    height:50px;
    font-size:30px;
  }
  @media only screen and (max-width: 450px) {
    left:calc(100% - 70px);
    width:40px;
    height:40px;
    font-size:25px;
  }
`;
const ButtonBox = styled.div`
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  @media only screen and (max-width: 450px) {
  }
`;
const ProductListWrap = styled.div`
  display: flex;
  gap:1%;
  flex-wrap: wrap;
  align-items: center;
`;

const WorksLengthBox = styled.div`
  text-align:start;
  margin-left:20px;
  font-size:16px;
  color:#6b6b6b;
  @media only screen and (max-width: 450px) {
    font-size:14px;
  }
`;

const RightBox = styled.div`
  display: flex;
  flex: 1;
  /* min-width: 734px; */
  flex-direction: column;
  @media only screen and (max-width: 768px) {
    min-width: 300px;
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
  font-size: 36px;
  @media only screen and (max-width: 768px) {
    font-size: 22px;
  }
`;

const RowWap = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #121212;
  height: 80px;
  @media only screen and (max-width: 768px) {
    height: 50px;
  }
`;

const LeftText = styled.span`
  color: #121212;
  font-size: 16px;
  font-weight: 700;
  width: 200px;
  min-width: 200px;
  border-right: 1px solid #121212;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 18px;
  @media only screen and (max-width: 768px) {
    width: 100px;
    min-width: 100px;
    font-size: 13px;
    text-align: left;
  }
`;

const RightText = styled(LeftText)`
  min-width: 400px;
  font-weight: 400;
  border: 0;
  text-align: left;
  font-size: 16px;
  padding-left: 20px;
  @media only screen and (max-width: 768px) {
    font-size: 13px;
    min-width: 220px;
  }
`;

const BottomRowWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 20px;
  @media only screen and (max-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    margin: 15px;
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

const GreenButton = styled(BlackButton)`
  background-color: #398049;
`;

const WhiteButton = styled(BlackButton)`
  background-color: #fff;
  border: 1px solid #398049;
`;

const BlackButtonText = styled.span`
  color: #ffffff;
  font-size: 16px;
  font-weight: 400;
  @media only screen and (max-width: 768px) {
    font-size: 11px;
  }
`;

const GreenBorderbuttonText = styled(BlackButtonText)`
  color: #398049;
`;

const EmptyBox = styled.div`
  height:15vh;
`;
const EmptyHeightBox = styled.div`
  width:100%;
  height:50px;
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

export default MobileProfile;
