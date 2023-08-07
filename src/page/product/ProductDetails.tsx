import React, { useContext, useEffect, useState,MouseEvent, useLayoutEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import likeOnImage from '../../asset/image/heart_on.svg';
import likeOffImage from '../../asset/image/heart.svg';
import ximage from '../../asset/image/close.svg';
import { Carousel, Embla, useAnimationOffsetEffect } from '@mantine/carousel';
import { createStyles, Modal } from '@mantine/core';
import { ArtworkDetailsType, ArtworkLinkListType, LinkListType, TImage, TProductListItem } from '../../types/Types';
import AlertModal from '../../components/Modal/AlertModal';
import { UserContext } from '../../context/user';
import { useRef } from 'react';
import { createBrowserHistory } from 'history';
import { removeHistory } from '../../components/Layout/Header';
import { Pagination,Navigation, Scrollbar ,FreeMode, Thumbs } from 'swiper';
import SwiperCore, { Keyboard, Mousewheel } from "swiper";
import { Swiper, SwiperSlide } from 'swiper/react';
import profileImage from '../../asset/image/Profile.svg';
import Sheet,{SheetRef} from 'react-modal-sheet';
import './ProductDetails.css'
import Draggable from 'react-draggable';
import { APIArtistFollowAdd, APILikeProduct, APILinkMyAccount, APIProductDetails } from '../../api/ProductAPI';
import ContactModal from '../../components/Modal/ContactModal';
import { APILink } from '../../api/UserAPI';
import ArtworkContactModal from '../../components/Modal/ArtworkContactModal';

SwiperCore.use([Keyboard, Mousewheel]);

function ProductDetails() {
  const { idx } = useParams();
  const navigate = useNavigate();
  const history = createBrowserHistory();
  const { user } = useContext(UserContext);
  const [defaultoverlay, setDefaultoverlay] = useState(false)
  const [shopDetails, setShopDetails] = useState<ArtworkDetailsType>();
  const [isLike, setIsLike] = useState<boolean>(false);
  const [Mobile, setMobile] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState(false);
  const [readmore, setReadMore] = useState<boolean>(false)
  const [ShowContact, setShowContact] = useState<boolean>(false);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [bottomSheetModal, setBottomSheetModal] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [alertType, setAlertType] = useState<string>('')
  const [linkList, setLinkList] = useState<ArtworkLinkListType>();
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
      setLinkList({
          sns:resData.sns,
          link_buy:resData.link_buy,
          link_etc1:resData.link_etc1,
          link_sns_title:resData.link_sns_title,
          link_buy_title:resData.link_buy_title,
          link_etc_title1:resData.link_etc_title
      })
      setIsLike(resData.isLike);
    } catch (error) {
      console.log(error);
      alert('존재하지 않는 상품입니다.');
      navigate(-1);
    }
  };
  const UserFollow = async() =>{
    if (user.idx) {
      const data = {
        designer_idx: shopDetails?.designer_idx,
      };
      try {
        const res = await APIArtistFollowAdd(data);
        if(res.message == '좋아요 완료'){
          setAlertType('Followed')
        } else {
          setAlertType('unFollowed')
        }
        setShowLogin(true)
        getProductDetails()
      } catch (error) {
        console.log(error);
      }
    } else {
      setShowLogin(true);setAlertType('Available after Sign up.')
    }
  }

  const AddLike = async (idx: number) => {
    if (user.idx) {
      const data = {
        artwork_idx: idx,
      };
      try {
        const res = await APILikeProduct(data);
        getProductDetails()
        console.log(res)
        if(res.message == '좋아요 완료'){
          setAlertType('Liked')
        } else {
          setAlertType('unLiked')
        }
        setShowLogin(true)
      } catch (error) {
        console.log(error);
      }
    } else {
      setAlertType("Available after Sign up.")
      setShowLogin(true);
    }
  };

  const LinkMyAccount = async (idx: number) => {
    console.log('user.level',user.level)
    if (user.idx) {
      if(user.level !== 3){
        const data = {
          artwork_idx: idx,
        };
        try {
          const res = await APILinkMyAccount(data);
          getProductDetails()
          console.log(res)
          setAlertType('Link 요청 하였습니다.')
          setShowLogin(true)
        } catch (error) {
          console.log(error);
        }
      } else {
        setAlertType("Customor 회원은 신청 불가합니다.")
        setShowLogin(true);
      }
    } else {
      setAlertType("Available after Sign up.")
      setShowLogin(true);
    }
  };


  useEffect(() => {
    getProductDetails();
    getLinks()
  }, []);



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

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    if (userAgent === 'APP-android' || userAgent === 'APP-ios') {
      setMobile(true)
      return;
    }
  }, []);


  const getLinks = async () => {
    const data = {
      page: 1,
      idx: shopDetails?.designer_idx
    };
    try {
      const {list,total} = await APILink(data);
      setLinkList(list);
    } catch (error) {
      // console.log(error);
      // navigate('/signin', { replace: true });
    }
  };

  useLayoutEffect(()=>{
    const Drag = sessionStorage.getItem('ProductDrag')
    if(Drag == 'true'){
      setDefaultoverlay(true)
      sety(window.innerHeight-225)
    } else {
      setDefaultoverlay(false)
      sety(window.innerHeight-170)
    }
    return () =>{
      
    }
  },[])

  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    if(innerWidth > 768){
      setBottomSheetModal(false)
      document.body.style.overflow = "unset"
    } else{
      setBottomSheetModal(true)
      document.body.style.overflow = "hidden"
    }
    // console.log("innerWidth", innerWidth);
    window.addEventListener("resize", resizeListener);
    return ()=>{
      document.body.style.overflow = "unset"
    }
  }, [innerWidth]);

  /** draggabletouch */
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);

    const handleTouchStart = (event:any) => {
      const touch = event.touches[0];
      setStartX(touch.clientX);
      setStartY(touch.clientY);
    };

    type DraggableData = {
    node: HTMLElement,
    // lastX + deltaX === x
    x: number, y: number,
    deltaX: number, deltaY: number,
    lastX: number, lastY: number
  };
    const [y,sety] = useState(!defaultoverlay? window.innerHeight-225 : window.innerHeight-168)
    const DraggableEventHandler = (e: any, data: DraggableData) => {
      sety(data.y)
    }

    const handleTouchEnd = (event:any,type:string) => {
      const touch = event.changedTouches[0];
      const endX = touch.clientX;
      const endY = touch.clientY;
      const distance = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
      if (distance < 5) {
        if(type == '0'){
          sessionStorage.setItem('ProductDrag',JSON.stringify(!defaultoverlay))
          sety(!defaultoverlay? window.innerHeight-225 : window.innerHeight-170 )
          setDefaultoverlay(!defaultoverlay)
        } else if (type == '1'){
          if(shopDetails?.idx)AddLike(shopDetails?.idx)
        } else if (type == '2'){
          setReadMore(true)
        } else if (type == '3'){
          UserFollow()
        } else if (type == '4'){
          if(shopDetails?.isLink == false){
            LinkMyAccount(shopDetails?.idx)
          } else {
            setAlertType("이미 요청되었습니다.")
            setShowLogin(true);
          }
        } else if (type == '5'){
          if (user.idx) {
            setShowContact(true);
          } else {
            setAlertType("Available after Sign up.")
            setShowLogin(true);
          }
        }
      }
    };


  return (
    <ContainerWrap>
      <Container>
        {bottomSheetModal && 
        <Draggable 
        bounds={{left: 0, top: 1, right: 0, bottom: defaultoverlay? window.innerHeight-225 : window.innerHeight-170 }}
        axis="y"
        onDrag={(e,data)=>DraggableEventHandler(e,data)}
        position={{x:0,y:y}}
        defaultPosition={{x: 0, y: defaultoverlay? window.innerHeight-225 : window.innerHeight-170}}
        >
          <ModalInfromBox Mobile={Mobile}>
            <EmptyHeightBox height={35}>
              <HeaderButtom/>
              <Ximage onTouchStart={handleTouchStart} onTouchEnd={(e)=>handleTouchEnd(e,'0')} src={ximage}/>
            </EmptyHeightBox>
            <LeftTopBox>
              <TitleBox>
                <NameBox>
                  <NameDesigner>
                    <ProductName>{shopDetails?.name}</ProductName>
                    <Designer>{shopDetails?.designer_name}</Designer>
                  </NameDesigner>
                  <LikeButton onTouchStart={handleTouchStart} onTouchEnd={(e)=>handleTouchEnd(e,'1')}
                  src={shopDetails?.isLike ? likeOnImage : likeOffImage} />
                </NameBox>
                <BottomBoxContent onTouchStart={handleTouchStart} readmore={readmore} >{shopDetails?.description}
                </BottomBoxContent>
                {!readmore &&
                <ReadMore onTouchStart={handleTouchStart} onTouchEnd={(e)=>handleTouchEnd(e,'2')}>Read More</ReadMore>
                }
              </TitleBox>
              <ContentBox>
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
            {shopDetails?.user?
            <LinkWrap>
              <ImageWrap Image={shopDetails?.user.image?.file_name? true : false}>
              {shopDetails?.user.image?.file_name ?
                <ProfileImage src={shopDetails?.user.image?.file_name}/>
                :
                <BasicImage src={profileImage}/>
                  }
                </ImageWrap>
                <NameBox>
                <FlexBox>
                  <NameText>{shopDetails?.user.name}</NameText>
                  
                </FlexBox>
                <FollowButtonBox  onTouchStart={handleTouchStart} onTouchEnd={(e)=>handleTouchEnd(e,'3')} follow={shopDetails?.user.isLike? shopDetails?.user.isLike : false}>
                  Follow
                </FollowButtonBox>
                </NameBox>
              </LinkWrap>
              :
              <LinkWrap>
                <LinkText>
                Is this your workpiece?
                </LinkText>
                <LinkButtonBox onTouchStart={handleTouchStart} onTouchEnd={(e)=>handleTouchEnd(e,'4')}>
                Link my Account
                </LinkButtonBox>
              </LinkWrap>
              }
                <AskButton
                  onTouchStart={handleTouchStart} onTouchEnd={(e)=>handleTouchEnd(e,'5')}>
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
              <BottomBoxContent readmore={readmore}>&nbsp;{shopDetails?.description}</BottomBoxContent>
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
                <Content>{shopDetails?.materials}</Content>
              </ContentRowWrap>
            </ContentBox>
            <RowWrap Mobile={Mobile}>
              {shopDetails?.user?
              <LinkWrap>
                <ImageWrap Image={shopDetails?.user.image?.file_name? true : false}>
                {shopDetails?.user.image?.file_name ?
                <ProfileImage src={shopDetails?.user.image?.file_name}/>
                :
                <BasicImage src={profileImage}/>
                  }
                </ImageWrap>
                <NameBox>
                <FlexBox>
                  <NameText>{shopDetails?.user.name}</NameText>
                  
                </FlexBox>

                <FollowButtonBox follow={shopDetails?.user.isLike? shopDetails?.user.isLike : false} onClick={UserFollow}>
                  Follow
                </FollowButtonBox>

                </NameBox>
              </LinkWrap>
              :
              <LinkWrap>
                <LinkText>
                Is this your artwork?
                </LinkText>
                <LinkButtonBox onClick={()=>{
                  if(shopDetails?.isLink == false){
                    LinkMyAccount(shopDetails?.idx)
                  } else {
                    setAlertType("이미 요청되었습니다.")
                    setShowLogin(true);
                  }
                }}>
                Link Account
                </LinkButtonBox>
              </LinkWrap>
              }
                <AskButton
                  onClick={() => {
                    if (user.idx) {
                      setShowContact(true);
                    } else {
                      setAlertType("Available after Sign up.")
                      setShowLogin(true);
                    }
                  }}
                >
                  Contact
                </AskButton>
            </RowWrap>
          </LeftTopBox>
          
        </LeftBox>
        <RightBox>
          <SwiperWrap>
            <Swiper 
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
                maxHeight:innerWidth <= 768? window.innerHeight-150 : window.innerHeight*1,backgroundColor:'white'
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
                position:'absolute',top:0,right:-20,width:'10%',minWidth:'30px'
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
          {shopDetails?.user?
            <LinkWrapWeb Direction={true}>
              <ImageWrap Image={shopDetails?.user.image?.file_name? true : false}>
              {shopDetails?.user.image?.file_name ?
              <ProfileImage src={shopDetails?.user.image?.file_name}/>
              :
              <BasicImage src={profileImage}/>
                }
              </ImageWrap>
              <NameBox>
              <FlexBox>
                <NameText>{shopDetails?.user.name}</NameText>
                
              </FlexBox>
              <FollowButtonBox follow={shopDetails?.user.isLike? shopDetails?.user.isLike : false} onClick={UserFollow}>
                Follow
              </FollowButtonBox>
              </NameBox>
            </LinkWrapWeb>
            :
          <LinkWrapWeb>
            <LinkText>
            Is this your workpiece?
            </LinkText>
            <LinkButtonBox onClick={()=>{
              if(shopDetails?.isLink == false){
                LinkMyAccount(shopDetails?.idx)
              } else {
                setAlertType("이미 요청되었습니다.")
                setShowLogin(true);
              }
              }}>
            Link my Account
            </LinkButtonBox>
          </LinkWrapWeb>
          }
        </RightBox>
        <AlertModal
          visible={showLogin}
          setVisible={setShowLogin}
          onClick={() => {
            if(alertType == "Available after Sign up."){
              removeHistory();
              setShowLogin(false);
              navigate('/signin');
            }else{
              setShowLogin(false);
            }
          }}
          text={alertType}
        />
        <ArtworkContactModal
          visible={ShowContact}
          setVisible={setShowContact}
          onClick={() => {
            setShowContact(false);
          }}
          contactUrl={linkList}
        />
      </Container>
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
  padding: 0 50px 0 50px;
  display: flex;
  min-width:28.12%;
  max-width:540px;
  /* min-width: 540px; */
  max-height:850px;
  flex-direction: column;
  justify-content:space-between;
  text-align: left;
  /* border-right: 1px solid #121212; */
  @media only screen and (max-width: 1440px) {
    padding: 0 50px 0 50px;

  }
  @media only screen and (max-width: 768px) {
    width: 100%;
    /* border-right: 0;
    position:absolute;
    bottom:500px;
    z-index:9999; */
    display:none
  }
`;

const RightBox = styled.div`
  display: flex;
  width:100%;
  @media only screen and (max-width: 768px) {
    width:100%;
  }
`;
const PaginationBox = styled.div`
   @media only screen and (max-width: 768px) {
    display:none;
  }
`;

const ModalInfromBox = styled.div<{Mobile:boolean}>`
  width:100%;
  position:absolute;
  /* overflow:hidden; */
  /* border-radius:10px; */
  z-index:99;
  background:rgba(255,255,255,0.93);
  /* ${props => props.Mobile ? 'height:calc(100vh - 240px)' : "height:calc(100vh - 150px)"} */
  height:calc(100vh - 150px);
`;

const EmptyHeightBox = styled.div<{height:number}>`
  width:100%;
  height:${props => props.height}px;
  border-bottom:1px solid #D9D9D9;
`;

const HeaderButtom = styled.div`
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
  padding: 0;
  @media only screen and (max-width: 768px) {
    width: 100%;
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
  align-items:center;
  margin-bottom:5px;
  @media only screen and (max-width: 1920px) {
  }
  @media only screen and (max-width: 768px) {
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
  padding:7px;
  width:27px;
  height:27px;
  cursor: pointer;
  top:5px;
  right:13px;
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
    right:15px;
    width:22.37px;
    height:18.73px;
  }
`;

const ContentBox = styled.div`
  margin:65px 3.48px 60.85px 6.63px;
  @media only screen and (max-width: 1440px) {
    margin:65px 3.48px 40.85px 6.63px;
  }
  @media only screen and (max-width: 768px) {
    margin:25px 0 0 0;
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
  white-space:pre-line;
  display: ${props => props.readmore? 'block':'-webkit-box'};
  -webkit-line-clamp: ${props => props.readmore? 10:5}; // 원하는 라인수
  -webkit-box-orient: vertical;
    overflow:hidden; 
  /* white-space:nowrap; */
  text-overflow:ellipsis;
  margin-top:30px;
  @media only screen and (max-width: 768px) {
    margin-top:0px;
    overflow-y:scroll;
    display: -webkit-box;
    -webkit-line-clamp: ${props => props.readmore? 10:5};
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
const LinkWrap = styled.div`
  width:100%;
  align-items:center;
  display:none;
  @media only screen and (max-width: 1920px) {
    padding:0 10px;
    display:flex;
    justify-content:space-between;
    margin-bottom: 20px;
  }
  @media only screen and (max-width: 768px) {
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    margin-bottom: 20px;
  }
`;
const LinkWrapWeb = styled.div<{Direction?:boolean}>`
  width:350px;
  margin-left:1.5%;
  display:flex;
  flex-direction:${props => props.Direction? 'row' : 'column'};
  align-items:center;
  justify-content:center;
  @media only screen and (max-width: 1920px) {
    display:none;
  }

`;

const LinkButtonBox = styled.div`
  font-family: "Pretendard Variable";
  font-weight:310;
  display:flex;
  justify-content:center;
  align-items:center;
  cursor: pointer;
  border-radius:5px;
  border:1px solid #000000;
  padding:15px 80px;
  @media only screen and (max-width: 1920px) {
    padding:5px 20px;
  }

`
const LinkText = styled.span`
  font-family: "Pretendard Variable";
  font-weight:310;
  font-size:16px;
  margin-bottom:20px;
  @media only screen and (max-width: 1920px) {
    margin-bottom:0px;
  }
  @media only screen and (max-width: 768px) {
    font-size:14px;
  }
`

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

const RowWrap = styled.div<{Mobile?:boolean}>`
  align-items: flex-end;
  justify-content:flex-end;
  margin-bottom:30px;
  padding-bottom:30px;
  @media only screen and (max-width: 768px) {
    width:100%;
    margin-top: ${props => props.Mobile? 70 : 40}px;
    bottom:0px;
    margin-bottom:0px;
  }
`;

const SwiperWrap = styled.div`
  position:relative;
  /* background-color:#cecece; */
  width:80%;
  max-width:1000px;
  height:100%;
  /* max-height:800px; */
  /* width:100%; */
  @media only screen and (max-width: 1440px) {
    width:65%;
    min-width:49.27%;
    max-width:1000px;
  }
  @media only screen and (max-width: 768px) {
    width:100%;
  }
`;

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

const ProfileImage = styled.img`
  width:100%;
  height:100%;
  border-radius:50%;
  border:1px solid #e0e0e0;
  object-fit:contain;
`;
const FlexBox = styled.div`
  display:flex;
  align-items:center;
`
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


export default ProductDetails;
