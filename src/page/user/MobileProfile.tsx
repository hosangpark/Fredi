import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal } from '@mantine/core';
import { APICheckPassword, APILink, APIUserDetails } from '../../api/UserAPI';
import { UserContext } from '../../context/user';
import ImageCard from '../../components/Shop/ImageCard';
import { LinkListType, SnsList, TImage, TProductListItem, UserType } from '../../types/Types';
import Sheet,{SheetRef} from 'react-modal-sheet';
import RightArrowImage from '../../asset/image/right.svg'
import LinksIcon from '../../asset/image/m10_home.svg';
import BrandIcon from '../../asset/image/Brand.png';
import ArtistIcon from '../../asset/image/Artist.png';
import qrImage from '../../asset/image/qr.svg';
import linkImage from '../../asset/image/rink.svg';
import xImage from '../../asset/image/close.svg';
import profileImage from '../../asset/image/Profile.svg';
import QrModal from '../../components/Modal/QrModal';
import img01 from '../../asset/image/img01.png';
import img03 from '../../asset/image/img03.png';
import img04 from '../../asset/image/img05.png';
import { APISnsList } from '../../api/ProductAPI';



function MobileProfile() {
  const navigate = useNavigate();
  const { idx } = useParams();
  const [isSnsUser, setIsSnsUser] = useState(false);
  const [linkList, setLinkList] = useState<LinkListType[]>([]);
  const [SnsList, setSnsList] = useState<SnsList[]>([]);
  const [userDetails, setUserDetails] = useState<UserType>();
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

  const getproductList = async () => {
    const data = {
      page: 1,
      user_idx: idx
    };
    try {
      const { list } = await APISnsList(data);
      setSnsList(list);
      // console.log('shop', list, page);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserDetails = async () => {
    let data = {
      idx:idx
    }
    try {
      const res = await APIUserDetails(data);
      console.log('APIUserDetails',res);
      setUserDetails(res);
      setIsSnsUser(res.type !== 1 ? true : false);
    } catch (error) {
    }
  };

  
  const saveHistory = (e: React.MouseEvent, idx: number) => {
    const div = document.getElementById('root');
    if (div) {
      // sessionStorage.setItem('y', String(y ?? 0));
      navigate(`/personalpage/${idx}`,{state:idx});
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
      // console.log(error);
      // navigate('/signin', { replace: true });
    }
  };


  useLayoutEffect(() => {
    console.log('useparamsIdxType',idx)
    console.log('useparamsIdx',String(user.idx))
    getUserDetails();
    getproductList()
    getLinks()
    
    
  }, [idx]);
  

  return (
    <Container>
      <Sheet isOpen={bottomSheetModal} onClose={() => setBottomSheetModal(false)}
        detent={'content-height'}
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
                <LayoutWrap key={index}>
                  <LinkImageWrap>
                    <LinksImage src={linkImage}/>
                  </LinkImageWrap>
                  <LinkItemBox onClick={() => window.open(`${item.url}`, '_blank')}>
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
              <IconNameBox userlevel={user.level}>
              <UserTypeIcon userlevel={user.level} src={user.level == 1? BrandIcon : user.level == 2? ArtistIcon : 'none'}/>
              <NameText>{userDetails? userDetails.nickname : 'no name'}</NameText>
              </IconNameBox>
              <SubTextBox>
                {/* <span>79 works · </span> */}
                <span>{userDetails?.followers} followers · </span>
                <span>{userDetails?.following} following</span>
              </SubTextBox>
            </NameBox>
            <ImageWrap Image={userDetails?.image? true : false}>
              {userDetails?.image?
              <ProfileImage src={userDetails?.image.file_name}/>
              :
              <BasicImage src={profileImage}/>
              }
            </ImageWrap>
          </HeaderLeft>
          {user.idx !== userDetails?.idx ?
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
            <FollowButtonBox onClick={()=>{setQrModal(true)}}>
              Share Profile
            </FollowButtonBox>
          </ButtonBox>
          }
        </ProfileHeaderWrap>
        <DescriptionText>
          {userDetails?.about? userDetails.about : ''}
        </DescriptionText>
      </ProfileContainer>
      <FlexBox>

      <WorksLengthBox>
        {SnsList.length}works
      </WorksLengthBox>
      <UploadButton onClick={()=>navigate('/AddPhoto')}>
        UpLoad
      </UploadButton>
      </FlexBox>
      <ProductListWrap>
        {SnsList.length > 0 &&
          SnsList.map((item,index)=>{
            return(
              <ImageCard
                item={item}
                key={item.idx}
                onClick={(e) => saveHistory(e, item.idx)}
                index={index}
              />
            )
            })
          }
          <PlusButton onClick={()=>navigate('/AddPhoto')}>
            <PlusH></PlusH>
            <PlusV></PlusV>
          </PlusButton>
          {SnsList.length == 0 &&
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
const UserTypeIcon = styled.img<{userlevel:number}>`
  display:${props => props.userlevel !== 3 ? 'block' : 'none'};
  width:25px;
  height:25px;
`
const IconNameBox = styled.div<{userlevel:number}>`
  display:flex;
  padding-right:${props => props.userlevel == 3 ? 0 : 25}px;
  align-items:center;
  justify-content:center;
`
const NameText = styled.p`
  font-family:'Pretendard Variable';
  font-size:16px;
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
display:flex;
justify-content:center;
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
  min-height:100px;
  max-height:500px;
  text-align:start;
  color:#000000;
  margin:30px 0;
  font-size:14px;
  @media only screen and (max-width: 768px) {
    font-size:12px;
  }
  `;
const ImageWrap = styled.div<{Image:boolean}>`
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
  background-color:${props => props.Image?  'none': '#DBDBDB'} ;
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
  border-bottom:1px solid #353535;
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
  border-right:1px solid #353535;
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
const ProfileImage = styled.img`
  width:100%;
  height:100%;
  border-radius:50%;
  border:1px solid #e0e0e0;
  object-fit:cover;
`;
const BasicImage = styled.img`
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
  border:1px solid #3b3b3b;
  border-radius:50%;
  font-weight: 410;
  display:none;
  background:#ffffff;
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
font-weight: 310;
  text-align:start;
  margin-left:20px;
  margin-bottom:10px;
  font-size:16px;
  color:#000000;
  @media only screen and (max-width: 450px) {
    font-size:12px;
  }
  `;
const UploadButton = styled.div`
font-family:'Pretendard Variable';
font-weight: 460;
  display:block;
  border:1px solid rgb(180, 180, 180);
  padding:12px 60px;
  border-radius:5px;
  @media only screen and (max-width: 768px) {
    padding:10px 40px;
    display:none;
  }
`
const FlexBox = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:flex-end;
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


export default MobileProfile;
