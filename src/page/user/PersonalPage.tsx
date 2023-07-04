import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import likeOnImage from '../../asset/image/heart_on.png';
import likeOffImage from '../../asset/image/heart.svg';
import bookmarkOnImage from '../../asset/image/Bookoff.svg';
import bookmarkOffImage from '../../asset/image/Bookoff.svg';
import leftButtonImage from '../../asset/image/ico_prev.png';
import rightButtonImage from '../../asset/image/ico_next.png';
import { Carousel, Embla, useAnimationOffsetEffect } from '@mantine/carousel';
import { createStyles, Modal } from '@mantine/core';
import { TImage } from '../admin/ProducerList';
import AlertModal from '../../components/Modal/AlertModal';
import reporticon from '../../asset/image/threecircle.png';
import { UserContext } from '../../context/user';
import { useRef } from 'react';
import { createBrowserHistory } from 'history';
import profileImage from '../../asset/image/profile.png';
import cart from '../../asset/image/cart.png';
import ask from '../../asset/image/home05.png';
import { APIAddCartItem, APILikeShop, APIShopDetails } from '../../api/ShopAPI';
import { replaceString } from '../../util/Price';
import { removeHistory } from '../../components/Layout/Header';
import { TextInput, Select } from '@mantine/core';
import arrDownImage from '../../asset/image/arr_down.png';
import CartCard from '../../components/Shop/CartCard';
import { read } from 'fs';
import { getConstantValue } from 'typescript';
import { count } from 'console';
import { Virtual,Pagination,Navigation, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Sheet,{SheetRef} from 'react-modal-sheet';
import { APIGetBanner } from '../../api/SettingAPI';

export type TShopDetails = {
  idx: number;
  category: 1 | 2 | 3 | 4 | 5 | 6;
  name: string;
  price: number;
  size: string;
  weight: string;
  country: string;
  description: string;
  designer: string;
  sns: string;
  email: string;
  website: string;
  delivery_info: string;
  like_count: number;
  imageList: TImage[];
  optionList: OptionDetailList[];
  isLike: boolean;
};

export type OptionDetailList = {
  idx: number;
  name: string;
};

const useStyles = createStyles((theme, _params, getRef) => ({
  carousel: {
    width: '100%',
    // height: '100%',
    // aspectRatio: '1/1',
  },
  carouselControls: {
    ref: getRef('carouselControls'),
    padding: '0px 50px',
    boxShadow: 'unset',
    '@media (max-width: 768px)': { padding: '0 18px' },
  },
  carouselControl: {
    ref: getRef('carouselControl'),
    boxShadow: 'none',
    outline: 0,
  },
  carouselIndicator: {
    width: 8,
    height: 8,
    transition: 'width 250ms ease',
    borderRadius: '100%',
    backgroundColor: '#121212',
    opacity: 0.4,
    '&[data-active]': {
      width: 8,
      borderRadius: '100%',
    },
    '@media (max-width: 768px)': {
      '&[data-active]': {
        width: 4,
        borderRadius: '100%',
      },
      width: 4,
      height: 4,
    },
  },
  carouselImages: {
    width: '100%',
    maxHeight: 700,
  },
}));

function PersonalPage() {
  const { idx } = useParams();
  const navigate = useNavigate();
  const { classes } = useStyles();
  const history = createBrowserHistory();
  const { user } = useContext(UserContext);
  const [shopDetails, setShopDetails] = useState<TShopDetails>();
  const [isLike, setIsLike] = useState<boolean>(false);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [initcar, setInitCar] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState(false);
  const [height, setHeight] = useState(0);
  const [imageIdx, setImageIdx] = useState(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [option, setOption] = useState<any>(); // 기존 옵션 리스트
  const [value, setValue] = useState(); // 현재 선택값
  const [addOption, setAddOption] = useState<any>([]); // 선택 누적 리스트
  const [total, setTotal] = useState<number>(0);
  const [showOption, setShowOption] = useState<boolean>(false);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [bottomSheetModal, setBottomSheetModal] = useState(false);
  const [bannerList, setBannerList] = useState<TImage[]>([]);
  const [bannerListMobile, setBannerListMobile] = useState<TImage[]>([]);
  const [isLikeList,setIsLikeList] = useState(false)
  const [isBookMark,setIsBookMark] = useState(false)
  const [followed,setFollowed] = useState(false)


  const leftBoxRef = useRef<HTMLDivElement>(null);
  const Leftheight = leftBoxRef.current ? leftBoxRef.current?.offsetHeight : 0;
  const [embla, setEmbla] = useState<Embla | null>(null);
  const TRANSITION_DURATION = 200;
  useAnimationOffsetEffect(embla, TRANSITION_DURATION);

  const getShopDetails = async () => {
    setShopDetails({
      idx: 1,
      category: 1,
      name: '이름',
      price: 8000,
      size: '사이즈',
      weight: '무게',
      country: '지역',
      description: '종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 ',
      designer: '제작자(디자이너)',
      sns: 'SNS',
      email: '이메일',
      website: '웹사이트',
      delivery_info: '배송정보',
      like_count: 11,
      imageList: [
          {
            idx: 1,
            file_name: '이미지1',
          },
          {
            idx: 2,
            file_name: '이미지2',
          },
          {
            idx: 3,
            file_name: '이미지3',
          },
        ],
      optionList: [
        {
          idx: 1,
          name: '옵션1번',
        },
        {
          idx: 2,
          name: '옵션2번',
        },
      ],
      isLike: true,
      }
      )
  }
      
  const onLikeShop = async () => {
    if (user.idx) {
      const data = {
        idx: shopDetails?.idx,
      };
      try {
        const res = await APILikeShop(data);
        console.log(res);
        setIsLike((prev) => !prev);
      } catch (error) {
        console.log(error);
      }
    } else {
      setShowLogin(true);
    }
  };

  const onAddCartItem = async () => {
    if (user.idx) {
      const data = {
        idx: shopDetails?.idx,
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
    getShopDetails();
    // console.log('shopDetails', shopDetails);
  }, []);

  useEffect(() => {
    setInitCar(showImageModal);
  }, [showImageModal]);

  useEffect(() => {
    setHeight(Leftheight);
  }, [Leftheight]);

  useEffect(() => {
    console.log(history.action);
    const backCheck = history.listen(({ location, action }) => {
      console.log(action);
      if (action === 'POP') {
        console.log('뒤로');
      }
    });
    return backCheck;
  }, []);

  const getBannerList = async () => {
    var array1 = new Array(); //pc
    var array2 = new Array(); //mobile
    try {
      const res = await APIGetBanner();
      console.log('banner@@@@@@@@', res);
      res.forEach((list:any) => {
        if(list.type === 'P'){
          array1.push(list);
        } else {
          array2.push(list);
        }
      });
      // console.log(array1, array2);
      setBannerList(array1);
      setBannerListMobile(array2);
    } catch (error) {
      console.log('Banner', error);
    }
  };

  const getTotal = () => {
    const count = addOption.reduce((a: any, v: any) => (a = a + v.count), 0);
    return count;
  };

  const getPrice = () => {
    const count = getTotal();
    console.log(getTotal(), shopDetails?.price);
    const price = Number(count) * Number(shopDetails?.price);
    console.log(price);
    return price;
  };

  var bullet = ['1번', '2번', '3번'];

  const pagination = {
    // el:<PaginationBox/>,
    clickable: true,
    renderBullet: function (index:number, className:string) {
      let array : string[] = []
      shopDetails?.imageList.map((item)=>{
        array.push(item.file_name);
      })
      return '<span class="' + className + '">' + array[index] + "</span>";
    },
  };

  const slides = shopDetails?.imageList.map((item, index) => (
    <Carousel.Slide key={item.idx}>
      <ImageBox2>
        <SliderImage src={item.file_name} />
      </ImageBox2>
    </Carousel.Slide>
  ));

  const slidesMobile = bannerListMobile.map((item:any) => {
    // console.log('item', item);
    return(
      <Carousel.Slide key={item.idx}>
      <a href={item?.link}>
        <SliderImage src={item.file_name} className={classes.carouselImages} />
      </a>
    </Carousel.Slide>
    );
  });
  

  useEffect(() => {
    console.log('addOption', addOption);
  }, [addOption]);

  useEffect(() => {
    getBannerList();
  }, []);

  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    if(innerWidth > 768){
      setBottomSheetModal(false)
    }
    // console.log("innerWidth", innerWidth);
    window.addEventListener("resize", resizeListener);
  }, [innerWidth]);

  return (
    <ContainerWrap id="productContainer">
      <Container>
        <ProfileHeaderWrap>
          <HeaderLeft>
            <ImageWrap>
              <ProfileImage src={profileImage}/>
            </ImageWrap>
            <NameBox>
            <FlexBox>
              <NameText>SEOYOON SHIN</NameText>
              
            </FlexBox>
            <ButtonBox>
              <FollowButtonBox onClick={()=>{setFollowed(!followed)}}>
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
        {bannerListMobile.map((item:any) => {
          // console.log('item', item);
          return(
            <SwiperSlide>
              <ImageBox2>
                <SliderImage src={item.file_name} />
              </ImageBox2>
            </SwiperSlide>
          );
        })
        }
      </Swiper>
      <LinkUrlBox >
        <LinkTitle>
          Link Title
        </LinkTitle>
        <LinkUrl href={'/'}>
          Link Url
        </LinkUrl>
      </LinkUrlBox>
      <LikeButtonWrap>
        <LikeBox>
          <LikeButton style={{marginRight:10}} onClick={()=>{setIsLikeList(!isLikeList)}
            // e.stopPropagation();
            // onCancelLikeProduct(item.product.idx);
          } src={isLikeList ? likeOnImage : likeOffImage} />
          <LikeButton onClick={()=>{setIsBookMark(!isBookMark)}
            // e.stopPropagation();
            // onCancelLikeProduct(item.product.idx);
          } src={isBookMark ? bookmarkOnImage : bookmarkOffImage} />
        </LikeBox>
      </LikeButtonWrap>
      <DescriptionWrap>
        종이접기와 풍선과 종이접기와 풍선과 종이접기와 풍선과 종이접기와 풍선과 종이접기와 풍선과 종이접기와 풍선과 종이접기와 풍선과 
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
  width:100%;
  flex: 1;
`;

const ProfileImage = styled.img`
  width:50%;
  height:50%;
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
  margin:10px;
`;
const DescriptionWrap = styled.div`
font-family:'Pretendard Variable';
font-weight:310;
  margin:25px 22px 45px;
  padding-right:10px;
  text-align:start;
  @media only screen and (max-width: 768px) {
    font-size:12px;
  }
`;
const LikeButton = styled.img`
  width: 22px;
  height: 22px;
  object-fit:contain;
  @media only screen and (max-width: 768px) {
    width: 20px;
    height: 20px;
  }
`;

const Title = styled.span`
  font-weight: 410;
  color: #121212;
  font-size: 15px;
  display: inline-block;
  width: 80px;
  @media only screen and (max-width: 768px) {
    width: 60px;
    font-size: 12px;
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

const ImageBox2 = styled.div`
  width: 100%;
  height:100%;
  /* max-height:800px; */
  object-fit:contain;
  /* overflow: hidden; */
  /* background-color:aqua; */
  /* aspect-ratio: 0.8; */
  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;
const PagenationDiv = styled.div`
  /* width: 100%; */
  width: 100px;
  height:100px;
  /* max-height:800px; */
  /* object-fit:contain; */
  /* overflow: hidden; */
  /* background-color:aqua; */
  /* aspect-ratio: 0.8; */
`;
const ControlImage = styled.img`
  width: 40px;
  @media only screen and (max-width: 768px) {
    width: 15px;
  }
`;

const LeftLabelBox = styled.div`
  display: flex;
  width: 60%;
  font-size: 16px;
  padding: 0.4rem 0rem;
  align-items: center;
  float: left;
  @media only screen and (max-width: 768px) {
    padding: 0.4rem 0rem;
    font-size: 14px;
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
  font-weight:500;
  text-align:start;
  line-height:31px;
  margin:0 10px 0 0;
  @media only screen and (max-width: 768px) {
    font-size:14px;
  }
`;
const FollowButtonBox = styled.div`
font-family:'Pretendard Variable';
  display: flex;
  justify-content: center;
  align-items: center;
  width:100%;
  border:1px solid #c7c7c7;;
  border-radius:4.93px;
  font-size:12px;
  padding:2px 10px;
  font-weight: 310;
  white-space:nowrap;
  @media only screen and (max-width: 768px) {
    font-size:10px;
  }
`;
const FlexBox = styled.div`
  display:flex;
  align-items:center;
`
const ImageWrap = styled.div`
  /* width:65px;
  height:65px; */
  margin-right:10px;
  display:flex;
  justify-content:center;
  align-items:center;
  border-radius:50%;
  aspect-ratio: 1.0;
  background-color: #DBDBDB;
  @media only screen and (max-width: 768px) {
    width:36px;
    height:36px;
  }
`;
const ReportImageWrap = styled.div`
  margin-left:10px;
  display:flex;
  align-items:center;
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
const Image = styled.img`
  width:100%;
  height:100%;
  border-radius:7px;
  background:#313131;
  @media only screen and (max-width: 768px) {
  }
`;
const ButtonBox = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;

  /* background-color:black; */
`;
const SubTextBox = styled.p`
  font-size:14px;
  font-weight: 410;
  text-align:start;
  color:#a1a1a1;
  margin:0;
  @media only screen and (max-width: 768px) {
    font-size:12px;
  }
  @media only screen and (max-width: 768px) {
    font-size:10px;
  }
`;
export default PersonalPage;
