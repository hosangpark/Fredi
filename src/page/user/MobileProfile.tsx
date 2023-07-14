import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@mantine/core';
import { APICheckPassword, APIUserDetails } from '../../api/UserAPI';
import { UserContext } from '../../context/user';
import ImageCard from '../../components/Shop/ImageCard';
import { TImage, TProductListItem } from '../../types/Types';
import Sheet,{SheetRef} from 'react-modal-sheet';
import RightArrowImage from '../../asset/image/right.svg'
import LinksIcon from '../../asset/image/m10_home.svg';
import qrImage from '../../asset/image/qr.svg';
import linkImage from '../../asset/image/rink.svg';
import xImage from '../../asset/image/close.svg';
import profileImage from '../../asset/image/Profile.svg';
import QrModal from '../../components/Modal/QrModal';
import img01 from '../../asset/image/img01.png';
import img03 from '../../asset/image/img03.png';
import img04 from '../../asset/image/img05.png';

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
  const token = sessionStorage.getItem('token');
  const [isSnsUser, setIsSnsUser] = useState(false);
  const [imageList, setimageList] = useState<ImageItem[]>([]);
  const [linkList, setlinkList] = useState<{linktitle:string,linkurl:string}[]>([]);
  const [userDetails, setUserDetails] = useState<TUserDetails>();
  const [bottomSheetModal, setBottomSheetModal] = useState(false);
  const [qrmodal,setQrModal] = useState(false);
  const { user } = useContext(UserContext);

  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", resizeListener);
  }, [innerWidth]);

  const getUserDetails = async () => {
    try {
      const res = await APIUserDetails();
      console.log('APIUserDetails',res);
      setUserDetails(res);
      setIsSnsUser(res.type !== 1 ? true : false);
    } catch (error) {
      // console.log(error);
      // navigate('/signin', { replace: true });
    }
  };

  // const onCheckPassword = async () => {
  //   if (!password) return setPasswordAlert(true);
  //   const data = {
  //     password: password,
  //   };
  //   try {
  //     const res = await APICheckPassword(data);
  //     console.log(res);
  //     navigate('/modifyuserinfo');
  //   } catch (error) {
  //     console.log(error);
  //     setPasswordAlert(true);
  //   }
  // };
  
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
            file_name: img01
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
            file_name: img03
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
            file_name: img04
          }
        ],
      },
    ]);
    setlinkList([
      {
        linktitle:'Website (FREDI)',
        linkurl:'www.fredi.co.kr'
      },
      {
        linktitle:'Website (FREDI)',
        linkurl:'www.fredi.co.kr'
      },
      {
        linktitle:'Website (FREDI)',
        linkurl:'www.fredi.co.kr'
      },
      {
        linktitle:'Website (FREDI)',
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
                <XIcon src={xImage}/>
                </EmptyHeightBox>
              </Sheet.Header>
              <SheetWrap>
                {/* 링크 최대갯수 알아야함 */}
                {linkList.map((item,index)=>{
                  return(
                <LayoutWrap key={index} onClick={()=>gotoLink('aaa')}>
                  <LinkImageWrap>
                    <LinksImage src={linkImage}/>
                  </LinkImageWrap>
                  <LinkItemBox href={'https://www.naver.com'}>
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
            <NameBox>
              <NameText>{userDetails?.nickname}</NameText>
              <SubTextBox>
                {/* <span>79 works · </span> */}
                <span>951 followers · </span>
                <span>12 following</span>
              </SubTextBox>
            </NameBox>
            <ImageWrap>
              <Image src={profileImage}/>
            </ImageWrap>
          </HeaderLeft>
          {!token?
          <ButtonBox>
            <ButtonImageWrap style={{marginRight:10}} onClick={() => setBottomSheetModal(true)}>
              <ButtonImage src={LinksIcon}/>
            </ButtonImageWrap>
            <ButtonImageWrap  style={{marginRight:6}} onClick={()=>setQrModal(true)}>
              <ButtonImage src={qrImage}/>
            </ButtonImageWrap>
            <FollowButtonBox style={{marginLeft:6}}>
              Follow
            </FollowButtonBox>
          </ButtonBox>
          :
          <ButtonBox>
            <FollowButtonBox style={{marginRight:12}} onClick={()=>{navigate('/EditProfile')}}>
              Edit Profile
            </FollowButtonBox>
            <FollowButtonBox onClick={()=>{navigate('/EditProfile')}}>
              Share Profile
            </FollowButtonBox>
          </ButtonBox>
          }
        </ProfileHeaderWrap>
        <DescriptionText>
          임시 설명글 입니다.
        </DescriptionText>
      </ProfileContainer>
      <WorksLengthBox>
        {imageList.length}works
      </WorksLengthBox>
      <ProductListWrap>
        {imageList.length > 0 &&
          imageList.map((item,index)=>{
            return(
              <ImageCard
                item={item}
                key={item.idx}
                onClick={(e) => saveHistory(e, item.name)}
                index={index}
              />
            )
            })
          }
          {imageList.length < 4 &&
          <PlusImage onClick={()=>navigate('/AddPhoto')} height={innerWidth}>
            <PlusH></PlusH>
            <PlusV></PlusV>
          </PlusImage>
          }
      </ProductListWrap>
      <QrModal
        visible={qrmodal}
        setVisible={setQrModal}
        onClick={() => {
          setQrModal(false);
        }}
      />
    </Container>
  );
}

const Container = styled.div`
  /* display: flex; */
  max-width: 1000px;
  margin: 0 auto;
  flex: 1;
  min-height: calc(100vh - 80px);
  /* flex-direction: row; */
  /* border-top: 1px solid #121212; */
  background-color: #ffffff;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
    border-top: 0;
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
`;
const ArrowImage = styled.img`
  width:100%;
  height:100%;
`;
const XIcon = styled.img`
position:absolute;
top:20px;
right:20px;
  width:20px;
  height:20px;
`;


const HeaderButtom = styled.div`
// tranform: translateY(-1px);
  position:absolute;
  top:15px;
  left:50%;
  transform:translate(-50%,0);
  width:41.94px;
  border-bottom:1px solid #000000;

  @media only screen and (max-width: 768px) {
    width:41.94px;
  }
`;
const SheetWrap = styled.div`
// tranform: translateY(-1px);
  width:100%;
  min-height:250px;
  padding:25px 20px 50px;
  @media only screen and (max-width: 768px) {
    padding:25px 20px 30px;
  }
`;
const LayoutWrap = styled.div`
  display: flex;
  margin:10px 0;
`;
const LinkImageWrap = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  width:60px;
  height:60px;
  margin-right:30px;
  border: 1px solid #B8B7B8;
  border-radius:50%;
  /* width:40%; */
  @media only screen and (max-width: 768px) {
    margin-right:20px;
    width:45px;
    height:45px;
  }
`;
const LinkItemBox = styled.a`
  text-decoration:none;
  flex:1;
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
  font-weight: 310;
  text-align:start;
  color:#7c7c7c;
  font-size:14px;
  margin:0;
  @media only screen and (max-width: 768px) {
    font-size:12px;
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
const ProfileContainer = styled.div`
  margin:20px;
  @media only screen and (max-width: 768px) {
  }
`;
const ProfileHeaderWrap = styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
  @media only screen and (max-width: 768px) {
  }
`;
const HeaderLeft = styled.div`
width:100%;
  display:flex;
  flex-direction:column;
  align-items:center;
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
  font-weight: 500;
  text-align:center;
  line-height:31px;
  margin:0;
  @media only screen and (max-width: 768px) {
    font-size:14px;
  }
`;
const FollowButtonBox = styled.div`
font-family:'Pretendard Variable';
  font-weight: 310;
  display: flex;
  justify-content: center;
  cursor: pointer;
  align-items: center;
  border:0.5px solid #B4B4B4;;
  border-radius:7px;
  font-size:15px;
  white-space:nowrap;
  width:120px;
  margin:2px 0;
  @media only screen and (max-width: 768px) {
    height:30px;
    font-size:14px;
    width:94px;
    margin:1px 0;
  }
`;
const SubTextBox = styled.p`
  font-family:'Pretendard Variable';
  font-weight: 310;
  font-size:14px;
  text-align:start;
  color:#383838;
  margin:0;
  @media only screen and (max-width: 768px) {
    font-size:12px;
  }
`;
const PlusIcon = styled.img`
  margin:0;
  `;
const DescriptionText = styled.p`
  font-family:'Pretendard Variable';
  font-weight: 310;
  text-align:start;
  color:#000000;
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
  width:120px;
  height:120px;
  aspect-ratio: 1;
  margin:20px 0;
  /* width:15%; */
  /* margin-right:15px; */
  background-color: #DBDBDB;
`;
const PlusImage = styled.div<{height:number}>`
  /* border:1px solid #a1a1a1;; */
  position:relative;
  display:flex;
  justify-content:center;
  align-items:center;
  aspect-ratio: 1;
  background-color:#d1d1d1;
  width: calc(25% - 10px);
  cursor: pointer;
  overflow: hidden;
  margin-bottom: 30px;
  @media only screen and (max-width: 1440px) {
    margin-bottom: 10px;
    /* width: 24.25%; */
    width: calc(33.3333% - 5px)
  }
  @media only screen and (max-width: 768px) {
    width: calc(50% - 1px);
    margin-bottom: 5px;
    height:${props => (props.height/2-1)}px;
  }
`;
const PlusH = styled.div`
  position:absolute;
  left:50%;
  top:50%;
  width:30px;
  transform:translate(-50%,-50%);
  border-bottom:1px solid #585858;
  @media only screen and (max-width: 768px) {
    width:20px;
  }
`
const PlusV = styled.div`
  position:absolute;
  left:50%;
  top:50%;
  height:30px;
  transform:translate(-50%,-50%);
  border-right:1px solid #585858;
  @media only screen and (max-width: 768px) {
    height:20px;
  }
`
const ButtonImageWrap = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  cursor: pointer;
  border:0.5px solid #B4B4B4;
  box-sizing:border-box;
  border-radius:5px;
  width:45px;
  @media only screen and (max-width: 768px) {
    width:35px;
  }
`;
const Image = styled.img`
  width:50%;
  height:50%;
  object-fit:contain;
`;
const LinksImage = styled.img`
  width:45%;
  height:45%;
  object-fit:contain;
`;
const ButtonImage = styled.img`

  width:65%;
  height:65%;
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
  font-weight: 410;
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
  height:45px;
  /* flex-direction:column; */
  /* justify-content:space-between; */
  @media only screen and (max-width: 768px) {
    height:35px;
  }
`;
const ProductListWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom:100px;
  @media only screen and (max-width: 768px) {
    margin-bottom:100px;
  }
`;

const WorksLengthBox = styled.div`
font-family:'Pretendard Variable';
  text-align:start;
  margin-left:20px;
  font-weight: 310;
  margin-bottom:10px;
  font-size:16px;
  color:#000000;
  @media only screen and (max-width: 450px) {
    font-size:12px;
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
  font-weight: 410;
  @media only screen and (max-width: 768px) {
    font-size: 11px;
  }
`;


const EmptyBox = styled.div`
  height:15vh;
`;
const EmptyHeightBox = styled.div`
  width:100%;
  height:50px;
  background-color:#ffff;
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
  font-weight: 410;
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
  font-weight: 410;
  font-size: 12px;
  color: #d82c19;
  margin-top: 8px;
  padding-left: 10px;
`;

export default MobileProfile;
