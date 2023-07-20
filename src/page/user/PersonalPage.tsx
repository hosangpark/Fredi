import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import likeOnImage from '../../asset/image/heart_on.svg';
import likeOffImage from '../../asset/image/heart.svg';
import bookmarkOnImage from '../../asset/image/bookon.svg';
import bookmarkOffImage from '../../asset/image/Bookoff.svg';
import { Carousel, Embla, useAnimationOffsetEffect } from '@mantine/carousel';
import { createStyles, Modal } from '@mantine/core';
import { SnsList, SnsdetailsType, TImage, TProductListItem } from '../../types/Types';
import AlertModal from '../../components/Modal/AlertModal';
import reporticon from '../../asset/image/threecircle.png';
import { UserContext } from '../../context/user';
import { useRef } from 'react';
import { createBrowserHistory } from 'history';
import profileImage from '../../asset/image/Profile.svg';
import cart from '../../asset/image/cart.png';
import ask from '../../asset/image/home05.png';
import { APIAddCartItem, APILikeShop, } from '../../api/ShopAPI';
import { removeHistory } from '../../components/Layout/Header';
import axios from 'axios';
import { Virtual,Pagination,Navigation, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Sheet,{SheetRef} from 'react-modal-sheet';
import { APIGetBanner } from '../../api/SettingAPI';
import { APIArtistFollowAdd, APIBookMarkLike, APISnsCount, APISnsDetails, APISnsLike } from '../../api/ProductAPI';

function PersonalPage() {
  const { idx } = useParams();
  const navigate = useNavigate();
  const history = createBrowserHistory();
  const location = useLocation();
  const { user } = useContext(UserContext);
  const [Snsdetails, setSnsdetails] = useState<SnsdetailsType>();
  const [showLogin, setShowLogin] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [addOption, setAddOption] = useState<any>([]); // 선택 누적 리스트
  const [showOption, setShowOption] = useState<boolean>(false);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [bannerListMobile, setBannerListMobile] = useState<TImage[]>([]);
  const [ ip , setIp ] = useState();


  const leftBoxRef = useRef<HTMLDivElement>(null);
  const Leftheight = leftBoxRef.current ? leftBoxRef.current?.offsetHeight : 0;
  const [embla, setEmbla] = useState<Embla | null>(null);
  const TRANSITION_DURATION = 200;
  useAnimationOffsetEffect(embla, TRANSITION_DURATION);

 

  const getSnsDetails = async () => {
    if (user.idx) {
      const data = {
        idx: location.state,
      };
      try {
        const res = await APISnsDetails(data);
        setSnsdetails(res);
        // SNSCount()
      } catch (error) {
        console.log(error);
      }
    }
  }

  const UserFollow = async() =>{
    if (user.idx) {
      const data = {
        designer_idx: Snsdetails?.user.idx,
      };
      try {
        const res = await APIArtistFollowAdd(data);
        console.log(res);
        getSnsDetails()
      } catch (error) {
        console.log(error);
      }
    } else {
      setShowLogin(true);
    }
  }
      
  const LikeSns = async () => {
    if (user.idx) {
      const data = {
        idx: location.state,
      };
      try {
        const res = await APISnsLike(data);
        console.log(res);
        getSnsDetails()
      } catch (error) {
        console.log(error);
      }
    } else {
      setShowLogin(true);
    }
  };

  const LikeBookMark = async () => {
    if (user.idx) {
      const data = {
        idx: location.state,
      };
      try {
        const res = await APIBookMarkLike(data);
        console.log(res);
        getSnsDetails()
      } catch (error) {
        console.log(error);
      }
    } else {
      setShowLogin(true);
    }
  };

  const SNSCount = async() => {
    let stringip = JSON.stringify(ip)
    
    const data = {
      res: ip,
      sns_idx: location.state
    };
    try {
      const res = await APISnsCount(data);
      console.log('resresresresresresresres',res);
    } catch (error) {
      console.log(error);
    }
  }
  

  const onAddCartItem = async () => {
    if (user.idx) {
      const data = {
        idx: Snsdetails?.idx,
        options: addOption.length > 0 ? addOption : [],
        // amount: 1,
      };
      try {
        const res = await APIAddCartItem(data);
        console.log(res);
        setShowModal(true);
      } catch (error) {
        console.log(error);
      }
    } else {
      setShowLogin(true);
    }
  };

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => setIp(data.ip))
      .catch(error => console.log(error))
  }, []);

  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", resizeListener);
  }, [innerWidth]);

  useEffect(() => {
    getSnsDetails();
    // console.log('Snsdetails', Snsdetails);
  }, []);


  useEffect(() => {
    // console.log(history.action);
    const backCheck = history.listen(({ location, action }) => {
      // console.log(action);
      if (action === 'POP') {
        console.log('뒤로');
      }
    });
    return backCheck;
  }, []);


  return (
    <ContainerWrap id="productContainer">
      <Container>
        <ProfileHeaderWrap>
          <HeaderLeft>
            <ImageWrap Image={Snsdetails?.user.image.file_name? true : false}>
              {Snsdetails?.user.image.file_name ?
              <ProfileImage src={Snsdetails?.user.image.file_name}/>
              :
              <BasicImage src={profileImage}/>
              }
            </ImageWrap>
            <NameBox>
            <FlexBox>
              <NameText>{Snsdetails?.user.name}</NameText>
              
            </FlexBox>
            <ButtonBox>
              <FollowButtonBox follow={Snsdetails?.user.isLike? Snsdetails?.user.isLike : false} onClick={UserFollow}>
                Follow
              </FollowButtonBox>
              <ReportImageWrap onClick={()=>{alert('구현예정')}}>
                <ImageRotate src={reporticon}/>
              </ReportImageWrap>
            </ButtonBox>

            </NameBox>
          </HeaderLeft>
          
        </ProfileHeaderWrap>
      <Swiper
        // install Swiper modules
        modules={[Navigation, Pagination, Scrollbar]}
        // slidesPerView={ProductViews}
        navigation= {false
        //   {
        //   prevEl: prevRef.current,
        //   nextEl: nextRef.current,
        // }
        // :
        // false
        }
        // spaceBetween={30}
        scrollbar={{hide:true}}
        // pagination={{ type: "progressbar" }}
        style={{paddingBottom:2.5,}}
      >
        {Snsdetails?.imageList  ?
        Snsdetails?.imageList.map((item:TImage) => {
          // console.log('item', item);
          return(
            <SwiperSlide key={item.idx}>
              <ImageBox2 innerWidth={innerWidth}>
                <SliderImage src={item.file_name} />
              </ImageBox2>
            </SwiperSlide>
          );
        })
        :
        <ImageBox2 innerWidth={innerWidth}>
        </ImageBox2>
        }
      </Swiper>
      <LinkUrlBox >
        <LinkTitle>
          {Snsdetails?.link_title}
        </LinkTitle>
        <LinkUrl href={Snsdetails?.link_url}>
          {Snsdetails?.link_url}
        </LinkUrl>
      </LinkUrlBox>
      <LikeButtonWrap>
        <LikeBox>
          <LikeButton onClick={LikeSns} src={Snsdetails?.isLike ? likeOnImage : likeOffImage} />
          <BookMarkButton onClick={LikeBookMark}src={Snsdetails?.isBookmark ? bookmarkOnImage : bookmarkOffImage} />
        </LikeBox>
      </LikeButtonWrap>
      <DescriptionWrap>
        {Snsdetails?.about} 
      </DescriptionWrap>
        <AlertModal
          visible={showLogin}
          setVisible={setShowLogin}
          onClick={() => {
            removeHistory();
            setShowLogin(false);
            navigate('/signin');
          }}
          text="회원가입 후 이용 가능합니다."
        />
        <AlertModal
          visible={showOption}
          setVisible={setShowOption}
          onClick={() => {
            setShowOption(false);
          }}
          text="옵션을 선택해주세요"
        />
      </Container>
      <AlertModal
        visible={showModal}
        setVisible={setShowModal}
        onClick={() => {
          setShowModal(false);
        }}
        text="장바구니에 상품이 추가되었습니다."
      />
    </ContainerWrap>
  );
}

const ContainerWrap = styled.div`
  display: flex;
  flex-direction: column;
  width:100%;
  flex:1;
  /* margin-bottom:100px; */
`;

const Container = styled.div`
  max-width: 768px;
  width:100%;
  margin: 0 auto;
  flex: 1;
  @media only screen and (max-width: 768px) {
    
  }
`;

const ProfileImage = styled.img`
  width:100%;
  height:100%;
  border-radius:50%;
  border:1px solid #e0e0e0;
  object-fit:contain;
`;
const LikeButtonWrap = styled.div`
  width:100%;
  display:flex;
  justify-content:flex-end;
`;

const LikeBox = styled.div`
  display: flex;
  align-items: center;
  margin:20px 20px 0;
  @media only screen and (max-width: 768px) {
    margin:20px 20px 0;
  }
`;
const DescriptionWrap = styled.div`
font-family:'Pretendard Variable';
font-weight: 300;
font-size:16px;
  margin:25.14px 38px 150px 22px;
  text-align:start;
  @media only screen and (max-width: 768px) {
    margin:25.14px 38px 51.36px 22px;
    font-size:12px;
  }
`;
const LikeButton = styled.img`
  width: 23px;
    height: 19px;
  object-fit:contain;
  @media only screen and (max-width: 768px) {
    width: 23.28px;
    height: 19.49px;
  }
`;
const BookMarkButton = styled.img`
  width: 15px;
    height: 19px;
  margin-left:24px;
  object-fit:contain;
  @media only screen and (max-width: 768px) {
    width: 15.54px;
    height: 19.49px;
  }
`;

const LinkUrlBox = styled.div`
  width:100%;
  display:flex;
  flex-direction:column;
  padding:5px 0;
  background:#000000;
`;
const LinkTitle = styled.a`
font-family:'Pretendard Variable';
font-weight: 410;
  color:#ffffff;
   font-size:14px;
`
const LinkUrl = styled.a`
font-family:'Pretendard Variable';
font-size:12px;
  color:#ffffff;
  font-weight: 210;
  text-decoration:none;
`;

const ImageBox2 = styled.div<{innerWidth:number}>`
  width: 768px;
  height: 768px;
  background:#c7c7c7;
  /* max-height:800px; */
  object-fit:contain;
  /* overflow: hidden; */
  /* background-color:aqua; */
  /* aspect-ratio: 0.8; */
  @media only screen and (max-width: 768px) {
    width: ${props=>props.innerWidth}px;
    height: ${props=>props.innerWidth}px;
  }
`;

const SliderImage = styled.img`
  cursor: pointer;
  object-fit: cover;
  height: 100%;
  max-height: 1096px;
  max-width: 100%;
  @media only screen and (max-width: 768px) {
    width: 100%;
    height:100%;
  }
`;

const ProfileHeaderWrap = styled.div`
  display:flex;
  justify-content:space-between;
  margin:10px 20px 40px;
  @media only screen and (max-width: 768px) {
  }
`;
const HeaderLeft = styled.div`
width:100%;
  display:flex;
  @media only screen and (max-width: 768px) {
  }
`;
const NameBox = styled.div`
  width:100%;
  display:flex;
  align-items:center;
  justify-content:space-between;

`;
const NameText = styled.p`
font-family:'Pretendard Variable';
  font-size:16px;
  font-weight: 410;
  text-align:start;
  line-height:31px;
  margin:0 10px 0 0;
  @media only screen and (max-width: 768px) {
    font-size:14px;
  }
`;
const FollowButtonBox = styled.div<{follow:boolean}>`
font-family:'Pretendard Variable';
  display: flex;
  justify-content: center;
  align-items: center;
  width:100%;
  cursor: pointer;
  background-color:${props=>props.follow? '#505050':'#ffffff'};
  color:${props=>props.follow? '#ffffff': '#505050'};
  border:1px solid #c7c7c7;;
  border-radius:4.93px;
  font-size:12px;
    width:90px;
    height:38px;
  font-weight: 300;
  white-space:nowrap;
  @media only screen and (max-width: 768px) {
    width:60px;
    height:25px;
    font-size:10px;
  }
`;
const FlexBox = styled.div`
  display:flex;
  align-items:center;
`
const ImageWrap = styled.div<{Image:boolean}>`
  width:65px;
  height:65px;
  margin-right:10px;
  display:flex;
  justify-content:center;
  align-items:center;
  border-radius:50%;
  aspect-ratio: 1.0;
  background-color:${props => props.Image?  'none': '#DBDBDB'} ;
  @media only screen and (max-width: 768px) {
    width:36px;
    height:36px;
  }
`;
const BasicImage = styled.img`
  width:50%;
  height:50%;
  object-fit:contain;
`;
const ReportImageWrap = styled.div`
  margin-left:10px;
  display:flex;
  align-items:center;
  cursor: pointer;
`
const ImageRotate = styled.img`
  width:24px;
  height: 6px;
  aspect-ratio:1.0;
  transform:rotate(90deg);
  @media only screen and (max-width: 768px) {
    width:14px;
    height: 3px;
  }
`
const ButtonBox = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;

  /* background-color:black; */
`;
export default PersonalPage;
