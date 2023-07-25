import React, { useContext, useEffect, useState,MouseEvent } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import likeOnImage from '../../asset/image/heart_on.svg';
import likeOffImage from '../../asset/image/heart.svg';
import ximage from '../../asset/image/close.svg';
import { Carousel, Embla, useAnimationOffsetEffect } from '@mantine/carousel';
import { createStyles, Modal } from '@mantine/core';
import { ArtworkDetailsType, TImage, TProductListItem } from '../../types/Types';
import AlertModal from '../../components/Modal/AlertModal';
import { UserContext } from '../../context/user';
import { useRef } from 'react';
import { createBrowserHistory } from 'history';
import { APIAddCartItem, APILikeShop, APIShopDetails } from '../../api/ShopAPI';
import { replaceString } from '../../util/Price';
import { removeHistory } from '../../components/Layout/Header';
import { Select } from '@mantine/core';
import arrDownImage from '../../asset/image/arr_down.png';
import { Virtual,Pagination,Navigation, Scrollbar ,FreeMode, Thumbs } from 'swiper';
import SwiperCore, { Keyboard, Mousewheel } from "swiper";
import { Swiper, SwiperSlide } from 'swiper/react';
import Sheet,{SheetRef} from 'react-modal-sheet';
import './ProductDetails.css'
import { APIGetBanner } from '../../api/SettingAPI';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import { APILikeProduct, APIProductDetails } from '../../api/ProductAPI';
import ContactModal from '../../components/Modal/ContactModal';

SwiperCore.use([Keyboard, Mousewheel]);

function ProductDetails() {
  const { idx } = useParams();
  const navigate = useNavigate();
  const history = createBrowserHistory();
  const { user } = useContext(UserContext);
  const [defaultoverlay, setDefaultoverlay] = useState(false)
  const [shopDetails, setShopDetails] = useState<ArtworkDetailsType>();
  const [isLike, setIsLike] = useState<boolean>(false);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [initcar, setInitCar] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState(false);
  const [height, setHeight] = useState(0);
  const [value, setValue] = useState(); // 현재 선택값
  const [option, setOption] = useState<any>(); // 기존 옵션 리스트
  const [addOption, setAddOption] = useState<any>([]); // 선택 누적 리스트
  const [readmore, setReadMore] = useState<boolean>(false)
  const [ShowContact, setShowContact] = useState<boolean>(false);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [bottomSheetModal, setBottomSheetModal] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [alertType, setAlertType] = useState<string>('')
  const ref = useRef<SheetRef>();


  const leftBoxRef = useRef<HTMLDivElement>(null);
  const Leftheight = leftBoxRef.current ? leftBoxRef.current?.offsetHeight : 0;
  const [embla, setEmbla] = useState<Embla | null>(null);
  const TRANSITION_DURATION = 200;
  useAnimationOffsetEffect(embla, TRANSITION_DURATION);
  // 업데이트 되는 값을 set 해줌
  




  const getProductDetails = async () => {
    const data = {
      idx: idx,
    };
    try {
      const resData = await APIProductDetails(data);
      console.log('resDataresData',resData);
      setShopDetails({ ...resData, imageList: resData.imageList.slice(0,10)});
      setIsLike(resData.isLike);
    } catch (error) {
      console.log(error);
      alert('존재하지 않는 상품입니다.');
      navigate(-1);
    }
  };

  const AddLike = async (idx: number) => {
    if (user.idx) {
      const data = {
        artwork_idx: idx,
      };
      try {
        const res = await APILikeProduct(data);
        getProductDetails()
        console.log(res)
        setAlertType(res.message)
        setShowLogin(true)
      } catch (error) {
        console.log(error);
      }
    } else {
      setAlertType("회원가입 후 이용 가능합니다.")
      setShowLogin(true);
    }

  };
  

  useEffect(() => {
    console.log('productidx',idx)
    getProductDetails();
    // getShopDetails();
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

  const onChangeOption = (data: any) => {
    const result = option.filter((word: any) => word.value === data); //idx 값으로 기존값에서 컬럼 데이터 가져옴
    setValue(data);

    const array = addOption;
    //누적값에 동일 값이 들어왔는지 체크
    const result2 = array.filter((word: any) => word.value === data);
    if (result2.length > 0) {
      //동일값이 있으면 인덱스값을 구해서 인덱스 배열 카운트 추가
      const index = array.findIndex((word: any) => word.value === data);
      array[index].count = array[index].count + 1;
    } else {
      //동일값이 없으면 새로 추가
      result[0].count = 1;
      array.push(result[0]);
    }
    console.log('array===>', array);
    // setAddOption(array);
    // getTotal();
    // getShopDetails();
    return result;
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
      // return '<span class="' + className + '">' + array[index] + "</span>";
      // return '<span class="' + className + '"><img src="' + array[index] + '}/>"</span>";
      return '<span class="' + className + '"><img src="' + array[index] +'"/></span>';
    },
  };
  const Click = () => {
    
  }

  useEffect(() => {
    console.log('addOption', addOption);
    console.log(shopDetails?.isLike);
  }, [addOption]);

  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    if(innerWidth > 768){
      setBottomSheetModal(false)
    } else{
      setBottomSheetModal(true)
    }
    // console.log("innerWidth", innerWidth);
    window.addEventListener("resize", resizeListener);
  }, [innerWidth]);

  return (
    <ContainerWrap>
      <Container>
        {bottomSheetModal && 
        <Draggable 
        bounds={{left: 0, top: 1, right: 0, bottom: !defaultoverlay? window.innerHeight-240 : window.innerHeight-170 }}
        axis="y"
        // handle={scrollable}
        defaultPosition={{x: 0, y: !defaultoverlay? window.innerHeight-240 : window.innerHeight-170}}
        >
          <ModalInfromBox>
            <EmptyHeightBox height={35}>
              <HeaderButtom/>
              <Ximage src={ximage}/>
            </EmptyHeightBox>
            <LeftTopBox>
              <TitleBox>
                <NameBox>
                  <NameDesigner>
                    <ProductName>{shopDetails?.name}</ProductName>
                    <Designer>{shopDetails?.designer_name}</Designer>
                  </NameDesigner>
                  <LikeButton onClick={()=>{if(shopDetails?.idx){AddLike(shopDetails?.idx)}}} src={shopDetails?.isLike ? likeOnImage : likeOffImage} />
                </NameBox>
                <BottomBoxContent readmore={readmore} >value={shopDetails?.description}
                </BottomBoxContent>
                {!readmore &&
                <ReadMore onClick={()=>{setReadMore(true)}}>Read More</ReadMore>
                }
              </TitleBox>
              <ContentBox>
                {/* <ContentRowWrap>
                  <Title>price</Title>
                  <Content>{shopDetails && replaceString(shopDetails?.price)} ₩</Content>
                </ContentRowWrap> */}
              <ContentRowWrap>
                <Title>Size(cm)</Title>
                <Content>{shopDetails?.size}</Content>
              </ContentRowWrap>
              <ContentRowWrap>
                <Title>Materials</Title>
                <Content>{shopDetails?.materials}</Content>
              </ContentRowWrap>
              
              </ContentBox>
              <RowWrap>
                {/* <BottomBoxTitle>디자이너 & 작품설명</BottomBoxTitle> */}
                <AskButton
                  onClick={() => {
                    if (user.idx) {
                      setShowContact(true);
                      // navigate('/contact/registerask-shop', {
                      //   state: { idx: shopDetails?.idx, name: shopDetails?.name, designer: shopDetails?.designer },
                      // });
                    } else {
                      setAlertType("회원가입 후 이용 가능합니다.")
                      setShowLogin(true);
                    }
                  }}
                >
                  Contact
                </AskButton>
              </RowWrap>
            </LeftTopBox>
          </ModalInfromBox>
        </Draggable>
        }
        
        <LeftBox ref={leftBoxRef}>
          <LeftTopBox>
            <TitleBox>
              <NameBox>
                <NameDesigner>
                  <ProductName>{shopDetails?.name}</ProductName>
                  <Designer>{shopDetails?.designer_name}</Designer>
                </NameDesigner>
                <LikeButton onClick={()=>{if(shopDetails?.idx){AddLike(shopDetails?.idx)}}} src={isLike ? likeOnImage : likeOffImage} />
              </NameBox>
              <BottomBoxContent readmore={readmore}>{shopDetails?.description}</BottomBoxContent>
              {!readmore &&
                <ReadMore onClick={()=>{setReadMore(true)}}>Read More</ReadMore>
              }
              <CategoryBox>
                <CategoryItem>Furniture</CategoryItem>
                <CategoryItem>Side Table</CategoryItem>
                <CategoryItem>Object</CategoryItem>
              </CategoryBox>
            </TitleBox>
            <ContentBox>
              <ContentRowWrap>
                <Title>Size(cm)</Title>
                <Content>{shopDetails?.size}</Content>
              </ContentRowWrap>
              <ContentRowWrap>
                <Title>Materials</Title>
                <Content>{shopDetails?.height}</Content>
              </ContentRowWrap>
              {option && option.length > 0 && (
                <ContentRowWrap>
                  <Title>옵션</Title>
                  <Select
                    placeholder="옵션을 선택해주세요"
                    rightSection={<DownIcon src={arrDownImage} />}
                    styles={(theme) => ({
                      rightSection: { pointerEvents: 'none' },
                      root: { width: '70%', display: 'inline-block' },
                    })}
                    variant="unstyled"
                    value={value}
                    data={option}
                    onChange={(data) => {
                      onChangeOption(data);
                    }}
                  />
                </ContentRowWrap>
              )}
            </ContentBox>
            <RowWrap>
                {/* <BottomBoxTitle>디자이너 & 작품설명</BottomBoxTitle> */}
                <AskButton
                  onClick={() => {
                    if (user.idx) {
                      setShowContact(true);
                    } else {
                      setAlertType("회원가입 후 이용 가능합니다.")
                      setShowLogin(true);
                    }
                  }}
                >
                  Contact
                  {/* <OrderButtonText>문의하기</OrderButtonText> */}
                </AskButton>
            </RowWrap>
          </LeftTopBox>
          
        </LeftBox>
        <RightBox>
          <SwiperWrap>
            <Swiper 
              onMouseEnter={Click}
              // modules={[Navigation,Pagination]}
              // mousewheel={true}
              modules={[Pagination,Scrollbar,FreeMode,Thumbs]}
              thumbs={{ swiper: thumbsSwiper }}
              scrollbar={innerWidth <= 768? false : true}
              loop={false}
              mousewheel={true} 
              // onSlideChange={() => {/*...*/}}
              // allowTouchMove={false}
              // noSwiping={false}
              // oneWayMovement={true}
              // pagination={{
              //   clickable: true,
              // }}
              // simulateTouch={false}
              // shortSwipes={false}
              // setWrapperSize={true}
              // pagination={innerWidth <= 768? false :pagination}
              style={{
                maxHeight:innerWidth <= 1000? window.innerHeight : window.innerHeight*1,backgroundColor:'white'
              }}
              // slidesPerView={innerWidth <= 768? 990/innerWidth : innerWidth <= 1440? 1700/innerWidth :1800/innerWidth}
              slidesPerView={'auto'}
              // navigation={true}
              // pagination={{ clickable: true }}
              // scrollbar={ true }
              direction={'vertical'}
              // slidesPerView={3}
              spaceBetween={0}
            >
              {shopDetails?.imageList.map((item, index) => (
                <SwiperSlide key={index} virtualIndex={index}>
                  {/* {slideContent} */}
                  <ImageBox1>
                    <ProductImage src={item.file_name}/>
                    {/* {item.file_name} */}
                  </ImageBox1>
                </SwiperSlide>
              ))}
            </Swiper>
            <PaginationBox>
            <Swiper
              onSwiper={setThumbsSwiper}
              style={{
                position:'absolute',top:0,right:0,width:'8%',minWidth:'30px'
              }}
              freeMode={true}
              scrollbar={false}
              direction={'vertical'}
              slidesPerView={'auto'}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="mySwiper"
            >
              {shopDetails?.imageList.map((item, index) => (
                <SwiperSlide key={index} virtualIndex={index}>
                  {/* {slideContent} */}
                  <ImageBox2>
                    <ProductImage src={item.file_name}/>
                    {/* {item.file_name} */}
                  </ImageBox2>
                </SwiperSlide>
              ))}
            </Swiper>
            </PaginationBox>

          </SwiperWrap>
        </RightBox>
        <AlertModal
          visible={showLogin}
          setVisible={setShowLogin}
          onClick={() => {
            if(alertType == "회원가입 후 이용 가능합니다."){
              removeHistory();
              setShowLogin(false);
              navigate('/signin');
            }else{
              setShowLogin(false);
            }
          }}
          text={alertType}
        />
        <ContactModal
          visible={ShowContact}
          setVisible={setShowContact}
          onClick={() => {
            setShowContact(false);
          }}
          contactUrl={[
            {
            title:'Fredi',
            url:'www.fredi.co.kr'
            },
            {
            title:'Naver',
            url:'www.naver.com'
            },
          ]}
        />
      </Container>
      {/* <AlertModal
        visible={showModal}
        setVisible={setShowModal}
        onClick={() => {
          setShowModal(false);
        }}
        text="장바구니에 상품이 추가되었습니다."
      /> */}
    </ContainerWrap>
  );
}

const ContainerWrap = styled.div`
  display: flex;
  flex-direction: column;
  width:100%;
  /* margin-bottom:100px; */
  /* background-color: palegoldenrod; */
  @media only screen and (max-width: 768px) {
    
  }
`;

const Container = styled.div`
  display: flex;
  height:100%;
  flex-direction: row;
  /* border-top: 1px solid #e0e0e0; */
  background-color: #ffffff;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
    border-top: 0;
  }
`;

const LeftBox = styled.div`
  padding: 0 4.21875% 0 2.708333%;
  display: flex;
  min-width:28.12%;
  max-width:540px;
  /* min-width: 540px; */
  max-height:850px;
  flex-direction: column;
  justify-content:space-between;
  text-align: left;
  /* border-right: 1px solid #121212; */
  @media only screen and (max-width: 768px) {
    width: 100%;
    /* border-right: 0;
    position:absolute;
    bottom:500px;
    z-index:9999; */
    display:none
  }
`;
const PaginationMap = styled.div`
  position:absolute;
  top:0;
  right:0;
  width:10%;
`
const RightBox = styled.div`
  display: flex;
  width:100%;
  flex-direction: column;
  overflow: hidden;
  @media only screen and (max-width: 768px) {
    width:100%;
  }
`;
const PaginationBox = styled.div`
   @media only screen and (max-width: 768px) {
    display:none;
  }
`;

const ModalInfromBox = styled.div`
  width:100%;
  position:absolute;
  height:100vh;
  /* overflow:hidden; */
  /* border-radius:10px; */
  z-index:99;
  background:rgba(255,255,255,0.95);
`;
const EmptyHeightBox = styled.div<{height:number}>`
  width:100%;
  height:${props => props.height}px;
  border-bottom:1px solid #D9D9D9;
`;

const HeaderButtom = styled.div`
// tranform: translateY(-1px);
  position:absolute;
  top:15px;
  left:50%;
  transform:translate(-50%,0);
  width:41.94px;
  border:1px solid #a5a5a5;
  border-radius:20px;
  @media only screen and (max-width: 768px) {
    width:41.94px;
  }
`;
const LeftTopBox = styled.div`
  position: relative;
  width: 100%;
  height: calc(100vh - 200px);
  padding: 0;
  @media only screen and (max-width: 768px) {
    padding: 0 20px;
    /* position: static;
    bottom:0; */
  }
`;


const LeftBottomBox = styled.div`
  width: 100%;
  position: relative;
  padding: 0 50px 50px 50px;
  @media only screen and (max-width: 768px) {
    padding: 0 18px 30px;
  }
`;

const DeliveryInfoWrap = styled(LeftBottomBox)`
  padding-top: 50px;
  border: 0;
  @media only screen and (max-width: 768px) {
    padding: 30px 20px;
    border-top: 1px solid #121212;
  }
`;
const OverlayBox = styled.div`
  padding:35px 20px 10px;
`
const NameBox = styled.div`
  width:100%;
  display:flex;
  justify-content:space-between;
  margin-top:100px;
  margin-bottom:70px;
  @media only screen and (max-width: 1440px) {
    margin-top:70px;
    margin-bottom:50px;
  }
  @media only screen and (max-width: 768px) {
    margin-top:0px;
    margin-bottom:46px;
    font-size:14px;
  }
`;
const CategoryBox = styled.div`
  display:flex;
  flex-wrap:wrap;
  margin-top:49px;
  @media only screen and (max-width: 1440px) {
    margin-top:65px;
  }

`
const CategoryItem = styled.span`
  font-size:17px;
  font-weight: 410;
  padding:10px 17px;
  border-radius:5px;
  margin:0 11px 11px 0;
  border:1px solid #B4B4B4;
  @media only screen and (max-width: 1440px) {
    font-size:15px;
  }
  @media only screen and (max-width: 768px) {
    padding:5px 10px;
    font-size:14px;
  }
`
const Ximage = styled.img`
  position:absolute;
  width:12px;
  height:12px;
  top:11px;
  right:14.19px;
`

const ProductImage = styled.img`
  width: 100%;
  height:100%;
  object-fit:cover;
  @media only screen and (max-width: 768px) {
    object-fit:cover;
  }
  @media only screen and (max-width: 450px) {
    object-fit:contain;
  }
`;
const TitleBox = styled.div`
  margin-bottom: 35px;
  @media only screen and (max-width: 768px) {
    /* margin-bottom: 18px; */
  }
`;
const NameDesigner = styled.div`
  text-align:start;
`
const ProductName = styled.h3`
font-family:'Pretendard Variable';
font-weight: 310;
  color: #121212;
  font-size: 22px;
  margin: 0px;
  flex-wrap: wrap;
  line-height:1;
  margin-bottom:13px;
  margin-top:12px;
  @media only screen and (max-width: 768px) {
    margin-top:12px;
    margin-bottom:13px;
    font-size: 14px;
  }
`;

const Designer = styled.span`
font-family:'Pretendard Variable';
  font-weight: 410;
  color: #121212;
  font-size: 22px;
  line-height:1;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const LikeButton = styled.img`
  width:35px;
  height: 30px;
  cursor: pointer;
  margin-top: 5px;
  @media only screen and (max-width: 768px) {
    margin-top: 0px;
    position:absolute;
    top:11.73px;
    right:9px;
    width:22.37px;
    height:18.73px;
  }
`;

const ContentBox = styled.div`
  margin:65px 3.48px 90.85px 6.63px;
  @media only screen and (max-width: 768px) {
    margin:65px 0 0 0;
  }
`;

const Title = styled.span`
font-family:'Pretendard Variable';
text-align:start;
  font-weight: 310;
  color: #121212;
  display: inline-block;
  width: 80px;
  font-size: 17px;
  @media only screen and (max-width: 1440px) {
    font-size: 14px;
  }
  @media only screen and (max-width: 768px) {
    width: 60px;
    font-size: 12px;
  }
`;

const Content = styled.span`
font-family:'Pretendard Variable';
  font-weight: 310;
  color: #121212;
  font-size: 16px;
  margin-left:20px;
  @media only screen and (max-width: 1440px) {
    font-size: 14px;
  }
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const ReadMore = styled.div`
font-family:'Pretendard Variable';
font-weight : 360;
font-size:14px;
cursor: pointer;
  text-align:start;
  text-decoration:underline;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }

`
const BottomBoxContent = styled.div<{readmore:boolean}>`
font-family:'Pretendard Variable';
text-align:start;
  width: 100%;
  height:100%;
  /* overflow: scroll; */
  line-height: 30px;
  border: 0;
  font-size: 17px;
  font-weight: 310;
  color: #121212;
  /* resize: none; */
  background-color: #fff;
  display: ${props => props.readmore? 'block' : '-webkit-box' };
  -webkit-line-clamp: 5; // 원하는 라인수
  -webkit-box-orient: vertical;
    overflow:hidden; 
  /* white-space:nowrap; */
  text-overflow:ellipsis;
  @media only screen and (max-width: 768px) {
    background-color: transparent;
    max-height: 214px;
    font-size: 12px;
    line-height: 20px;
  }
  /* &::-webkit-scrollbar {
    width: 0;
  } */
`;

const ContentRowWrap = styled.div`
  display:flex;
  width:100%;
  justify-content:space-between;
  @media only screen and (max-width: 768px) {
    margin-top: 10px;
  }
`;

const ImageBox = styled.div`
  height: 100%;
  width: 100%;
  text-align: left;
  overflow: hidden;
`;

const ModalImageBox = styled.div`
  width: 100%;
  height: 90vh;
`;

const ImageBox1 = styled.div`
  width: 85%;
  /* aspect-ratio:1; */
  cursor: pointer;
  /* height:100%; */
  /* max-height:800px; */
  /* overflow: hidden; */
  /* aspect-ratio: 0.8; */
  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;
const ImageBox2 = styled.div`
  width: 100%;
  aspect-ratio:1;
  cursor: pointer;
  /* height:100%; */
  /* max-height:800px; */
  /* overflow: hidden; */
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

const LeftButton = styled.img`
  width: 45px;
  cursor: w-resize;
`;

const RightButton = styled.img`
  width: 45px;
  cursor: e-resize;
`;

const LeftButtonMobile = styled(LeftButton)`
  width: 45px;
`;

const RightButtonMobile = styled(RightButton)`
  width: 45px;
`;

const OrderButton = styled.div`
  // position: absolute;
  // right: 49px;
  // bottom: 60px;
  margin-top: 1rem;
  float: right;
  width: 130px;
  height: 40px;
  background-color: #398049;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 510;
  color: #fff;
  @media only screen and (max-width: 768px) {
    right: 19px;
    bottom: 33px;
    width: 100px;
    height: 35px;
    font-size: 13px;
  }
  &:hover {
    background-color: white;
    border: 1px solid #398049;
    color: #398049;
  }
`;

const DownIcon = styled.img`
  width: 10px;
  height: 10px;
  cursor: pointer;
  @media only screen and (max-width: 460px) {
    width: 8px;
    height: 8px;
    margin-left: 15px;
  }
`;

const AskButton = styled.div`
    font-family: "Pretendard Variable";
    width: 100%;
    height: 53.06px;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    border-radius: 7px;
    font-weight: 310;
    cursor: pointer;
    font-size: 17px;
    background-color: rgb(0, 0, 0);
    border: 0;
    color: rgb(236, 236, 236);
  @media only screen and (max-width: 768px) {
    height: 46.91px;
    font-size: 15px;
  }
  &:hover {
    background-color: #2e2e2e;
    color: white;
  }
`;

const RowWrap = styled.div`
  align-items: flex-end;
  justify-content:flex-end;
  margin-bottom:30px;
  padding-bottom:30px;
  @media only screen and (max-width: 768px) {
    position:fixed;
    width:calc(100% - 40px);
    bottom:150px;
    margin-bottom:0px;
  }
`;

const LeftOption = styled.div`
  min-height: 40px;
  line-height: 2;
`;
const CartCardWrap = styled.div``;

const SwiperWrap = styled.div`
  position:relative;
  /* background-color:#cecece; */
  width:80%;
  max-width:1000px;
  height:100%;
  /* max-height:800px; */
  /* width:100%; */
  @media only screen and (max-width: 1440px) {
    min-width:49.27%;
    max-width:1000px;
  }
  @media only screen and (max-width: 768px) {
    width:100%;
  }

`;

const AmountControllerWrap = styled.div`
  display: flex;
  height: 100%;
  flex-direction: row;
  align-items: center;
  // padding: 0.5rem 0;
  justify-content: space-between;
  @media only screen and (max-width: 768px) {
    margin-top: 5px;
    // padding: 0.4rem 0.5rem;
  }
`;

const AmountControllerBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 23px;
  border: 1px solid #121212;
  border-left: 0;
  border-right: 0;
`;

const AmountControllerButton = styled.div`
  display: flex;
  width: 23px;
  height: 23px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid #121212;
`;

const AmountControllerButtonImage = styled.img`
  width: 7px;
  height: 7px;
`;
const AmountControllerButtonImageMinus = styled(AmountControllerButtonImage)`
  height: auto;
`;

const AmountText = styled.span`
  font-family:'Pretendard Variable';;
  font-size: 12px;
  width: 30px;
  text-align: center;
  line-height: 23px;
  @media only screen and (max-width: 768px) {
    font-size: 11px;
  }
`;

const DeleteButton = styled.div`
  margin-right: 5px;
  padding: 5px;
  cursor: pointer;
`;

const DeleteButtonImage = styled.img`
  width: 17px;
  height: 17px;
  margin-top: -2px;
  @media only screen and (max-width: 768px) {
    width: 14px;
    height: 14px;
  }
`;

const LeftMiddleTotal = styled.p`
  position: absolute;
  font-size: 16px;
  bottom: 0;
  right: 4rem;
  padding: 0;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
    right: 2rem;
  }
`;

export default ProductDetails;
