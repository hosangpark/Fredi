import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import leftButtonImage from '../../asset/image/prev.svg';
import rightButtonImage from '../../asset/image/next.svg';
import { createStyles, Image } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { APIArtistFollowAdd, APIFairList, APIProductList, APISnsList } from '../../api/ProductAPI';
import { APIGetBanner } from '../../api/SettingAPI';
import { UserContext } from '../../context/user';
import AlertModal from '../../components/Modal/AlertModal';
import { useLayoutEffect } from 'react';
import ProductCard from '../../components/Product/ProductCard';
import SearchBox from '../../components/Product/SearchBox';
import TopButton from '../../components/Product/TopButton';
import { removeHistory } from '../../components/Layout/Header';
import AppdownModal from '../../components/Modal/AppdownModal';
import ProductMainList from '../../components/Product/ProductMainList';
import WeeklyEditionList from '../../components/Product/WeeklyEditionList';
import Footer from '../../components/Layout/Footer';
import MainArtistList from '../../components/Product/MainArtistList';
import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ArtistList, ArtworkListItem, FairList, FeaturedListType, SnsList, TImage, WeeklyListItem } from '../../types/Types';
import LastestList from '../../components/Product/LastestList';
import FairMainList from '../../components/Product/FairMainList';
import { APIFeaturedWorksList, APIHomeStyleList, APITrendingArtist, APIWeeklyList } from '../../api/ListAPI';
import FeaturedList from '../../components/Product/FeaturedList';
import HomeStyleList from '../../components/Product/HomeStyleList';
import 'swiper/css';
import 'swiper/css/pagination';
import './Home.css';


function Home() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const [FairList, setFairList] = useState<FairList[]>([]);
  const [LatestList, setLatestList] = useState<ArtworkListItem[]>([]);
  const [WeeklyList, setWeeklyList] = useState<WeeklyListItem[]>([]);
  const [HomeList, setHomeList] = useState<SnsList[]>([]);
  const [ArtistList, setArtistList] = useState<ArtistList[]>([]);
  const [Featured, setFeaturedList] = useState<FeaturedListType[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [bannerList, setBannerList] = useState<TImage[]>([]);
  const [bannerListMobile, setBannerListMobile] = useState<TImage[]>([]);
  const [history, setHistory] = useState(false);
  
  const [ShowAlertModal, setShowAlertModal] = useState(false);
  const [alertType, setAlertType] = useState<string>('')


  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [appdownModal, setAppdownModal] = useState(false);

  const { user } = useContext(UserContext);
  const navigationPrevRef = React.useRef(null)
  const navigationNextRef = React.useRef(null)


  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", resizeListener);
  }, [innerWidth]);

  const getFairsList = async () => {
    const data = {
      page: 1,
      category: '',
      keyword: '',
    };
    try {
      const { list, total } = await APIFairList(data);
      setFairList(list.slice(0,10));
    } catch (error) {
      console.log(error);
    }
  };

  const getLatestList = async () => {
    const data = {
      page: 1,
      category: '1',
      keyword: '',
    };
    try {
      if (history) {
        return setHistory(false);
      }
      const { list, total } = await APIProductList(data);
      setLatestList(list.slice(0,10));
      // console.log('product', list,);
    } catch (error) {
      console.log(error);
    }
  };

  const getWeeklyList = async () => {
    try {
      if (history) {
        return setHistory(false);
      }
      const { list } = await APIWeeklyList({page:1});
      let sliceList = list.slice(0,20)
      setWeeklyList(sliceList);
      console.log('product', sliceList);
    } catch (error) {
      console.log(error);
    }
  };
  const getHomeStyleList = async () => {
    try {
      if (history) {
        return setHistory(false);
      }
      const { list } = await APIHomeStyleList({page:1,is_home:"Y"});
      setHomeList(list.slice(0,20));
    } catch (error) {
      console.log(error);
    }
  };

  const getArtistList = async () => {
    try {
      if (history) {
        return setHistory(false);
      }
      const { list } = await APITrendingArtist({page:1});
      setArtistList(list.slice(0,20));
    } catch (error) {
      console.log(error);
    }
  };
  const getFeaturedList = async () => {
    try {
      if (history) {
        return setHistory(false);
      }
      const { list } = await APIFeaturedWorksList({page:1});
      setFeaturedList(list.slice(0,10));
      // console.log('product', list,);
    } catch (error) {
      console.log(error);
    }
  };



  const getBannerList = async () => {
    var array1 = new Array(); //pc
    var array2 = new Array(); //mobile
    try {
      const res = await APIGetBanner();
      // console.log('banner@@@@@@@@', res);
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


  const LinkHandler = (e:React.MouseEvent,title:string,idx?:number,index?:number)=>{
    const y = globalThis.scrollY;
    sessionStorage.setItem('Home_y', String(y ?? 0));
    sessionStorage.setItem('SNSy', 'ScrollOnce');
    if(title === 'Fairs'){
      navigate(`/FairContent/${idx}`)
    } else if (title.includes('Latest')) {
      // sessionStorage.setItem('LatestList', JSON.stringify(LatestList));
      navigate(`/productdetails/${idx}`);
    } else if (title.includes('Home')) {
      // if(!token){
      //   setShowLogin(true)
      // } else {
      // }
      sessionStorage.setItem('SNSy', 'ScrollOnce');
      sessionStorage.setItem('removeSNSHistory', 'SnsFeed');
      navigate(`/personalpage/${idx}`,{state:{idx:idx,page:1,index:index}});
    } else if (title.includes('Weekly')) {
      navigate(`/WeeklyEdition/${idx}`,{state:idx})
    } else if (title.includes('Trending')) {
      if (!token) {
        setShowLogin(true);
      } else {
        navigate(`/MobileProfile/${idx}`,{state:idx})
      }
    } else if (title.includes('Featured')) {
      if (!token) {
        setShowLogin(true);
      } else {
      navigate(`/MobileProfile/${idx}`,{state:idx})
      }
    } else {
      console.log(title,idx)
    }
  }


  useEffect(() => {
    getBannerList();
    getLatestList()
    getFairsList()
    getWeeklyList()
    getHomeStyleList()
    getArtistList()
    getFeaturedList()
  }, []);

  const HOME_VISITED:any = localStorage.getItem("homeVisited");
  const userAgent = window.navigator.userAgent;
  const AAA = JSON.parse(HOME_VISITED)

  useEffect(() => {
      const today = new Date();
  if(innerWidth > 768){
    setAppdownModal(false)
  } else {
    if (userAgent === "APP-android" || userAgent === "APP-ios") {
      const handleMainPop = () => {
        if (AAA && AAA > today) {
          return;
        }
         if (!AAA || AAA < today) {
          setAppdownModal(true);
        }
      };
      window.setTimeout(handleMainPop, 1000); // 1초 뒤 실행
    } 
  }

    
  }, [HOME_VISITED]);

  useLayoutEffect(() => {
    const scrollY = Number(sessionStorage.getItem('Home_y'));
    // console.log('scrollYscrollYscrollY',scrollY)
    if (scrollY) {
      console.log('불러옴', scrollY);
      setTimeout(() => {
        window.scrollTo({
          top: scrollY,
          behavior: 'auto',
        });
      }, 200);
      sessionStorage.removeItem('Home_y');
    }
  }, []);

  const UserFollow = async(itemidx:number) =>{
    if (user.idx) {
      const data = {
        designer_idx: itemidx,
      };
      if(itemidx !== user.idx){
        try {
          const res = await APIArtistFollowAdd(data);
          if(res.message == '좋아요 완료'){
            setAlertType('Followed')
          } else {
            setAlertType('unFollowed')
          }
          setShowAlertModal(true)
          getArtistList()
        } catch (error) {
          console.log(error);
        }
      } else {
        setShowAlertModal(true);setAlertType(`You can't follow yourself`)
      }
    } else {
      setShowAlertModal(true);setAlertType('Available after Sign up.')
    }
  }

  return (
    <Container id="productContainer">
      <CarouselWrap>
        <Swiper
        modules={[Navigation, Pagination, Scrollbar, Autoplay]}
        
        navigation= {
            {
              prevEl: navigationPrevRef.current,
              nextEl: navigationNextRef.current,
            }}
        // spaceBetween={30}
        pagination={{clickable: true}}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log('slide change')}
        // autoplay={{delay: 5000}}
        style={{}}
      >
        {innerWidth <= 768 ? 
        bannerListMobile.map((item,index)=>{
          return(
            <SwiperSlide key={index}>
              <ProductImage height={innerWidth} src={item.file_name} />
            </SwiperSlide>
          )
        })
        : 
        bannerList.map((item,index)=>{
          return(
            <SwiperSlide key={index}>
              <ProductImage height={innerWidth} src={item.file_name} />
            </SwiperSlide>
          )
        })}
      <>
        <LeftArrow ref={navigationPrevRef}>
          <ControlImage left={true} src={leftButtonImage}/>
        </LeftArrow>
        <RightArrow ref={navigationNextRef}>
          <ControlImage src={rightButtonImage}/>
        </RightArrow>
      </>
      </Swiper>
      </CarouselWrap>
      <ProductListWrap>
        <FairMainList
        LinkHandler={LinkHandler}
        title={'Fairs'}
        ProductViews={innerWidth <= 768? 1.35  : innerWidth <= 1440? 2.7: 3.7}
        naviArrow = {innerWidth <= 768? false : true}
        scrollbar = {innerWidth <= 768? false : true}
        ProducList={FairList}
        arrowView={false}
        aspect={495/332}
        paddingnum={innerWidth <= 768? 0:67}
        marginT={innerWidth <= 768? 100:169.97}
        marginB={innerWidth <= 768? 21:55}
        />
        <LastestList
        LinkHandler={LinkHandler}
        title={'Latest'}
        ProductViews={innerWidth <= 768? 2.1  : innerWidth <= 1440? 4.4: 5.9}
        naviArrow = {innerWidth <= 768? false : true}
        scrollbar = {innerWidth <= 768? false : true}
        ProducList={LatestList}
        arrowView={false}
        aspect={300/370}
        titlesize={21}
        paddingnum={innerWidth <= 768? 0:67}
        marginRight={18}
        marginT={innerWidth <= 768? 143:172.22}
        marginB={innerWidth <= 768? 21:56.36}
        />
        <WeeklyEditionList
        LinkHandler={LinkHandler}
        title={'Weekly Edition'}
        ProductViews={innerWidth <= 768? 1.1 : 2.7} // innerWidth <= 1440? 2.7 :3.4
        naviArrow = {false}
        scrollbar = {innerWidth <= 768? false : true}
        ProducList = {WeeklyList}
        arrowView={false}
        paddingnum={innerWidth <= 768? 0:50}
        marginT={innerWidth <= 768? 120:175.22}
        marginB={innerWidth <= 768? 21:51.32}
        />
        <HomeStyleList
        LinkHandler={LinkHandler}
        title={'Home & Styling'}
        ProductViews={innerWidth <= 768? 1.5  : innerWidth <= 1440? 4.4: 5.9}
        // naviArrow = {innerWidth <= 768? false : true}
        naviArrow = {false}
        scrollbar = {innerWidth <= 768? false : true}
        ProducList={HomeList}
        productLink={'Home'}
        arrowView={false}
        paddingnum={innerWidth <= 768? 0:90}
        marginRight={18}
        marginT={innerWidth <= 768? 100:170}
        marginB={innerWidth <= 768? 21:55.12}
        />
        <MainArtistList
        LinkHandler={LinkHandler}
        title={'Trending Artist'}
        ProductViews={innerWidth <= 768? 2.05 : innerWidth <= 1440? 4.4 : 5.7}
        // naviArrow = {innerWidth <= 768? false : true}
        naviArrow = {false}
        scrollbar = {innerWidth <= 768? false : true}
        ProducList={ArtistList}
        productLink={'Trending'}
        arrowView={false}
        paddingnum={innerWidth <= 768? 5:50}
        marginT={innerWidth <= 768? 100:170}
        marginB={innerWidth <= 768? 21:54.38}
        UserFollow={UserFollow}
        />
        <FeaturedList
        getList={getFeaturedList}
        LinkHandler={LinkHandler}
        title={'Featured Works'}
        ProductViews={innerWidth <= 768? 2.05 : innerWidth <= 1440? 4.4 : 5.9}
        // naviArrow = {innerWidth <= 768? false : true}
        naviArrow = {false}
        scrollbar = {innerWidth <= 768? false : true}
        ProducList={Featured}
        arrowView={false}
        aspect={190/230}
        paddingnum={innerWidth <= 768? 50:90}
        marginT={innerWidth <= 768? 100:170}
        marginB={innerWidth <= 768? 21:64.91}
        marginRight={15}
        />
      </ProductListWrap>
      {/* <InterView ref={interSectRef} /> */}
      {appdownModal&&
      <AppdownModal 
        onClose={(e)=>setAppdownModal(e)} 
        // children={}
      />
      }
      <AlertModal
        visible={showLogin}
        setVisible={setShowLogin}
        onClick={() => {
          removeHistory();
          setShowLogin(false);
          navigate('/signin');
        }}
        text="Available after Sign up."
      />
      <AlertModal
        visible={ShowAlertModal}
        setVisible={setShowAlertModal}
        onClick={() => {
          if(
            alertType == 'Available after Sign up.'
          ){
            navigate('/signin');
          } else {
            setShowAlertModal(false);
          }
        }}
        text={alertType}
      />
      <TopButton />
      <Footer />
    </Container>
  );
}

const Container = styled.div`
  width:100%;
  flex: 1;
  /* display: flex;
  flex: 1;
  flex-direction: column; */
`;

const ProductListWrap = styled.div`
  display:flex;
  flex-direction:column;
  /* gap:170px; */
  /* margin: 15px 20px; */
  /* padding-top:100px; */
  margin-left:50px;
  margin-bottom:50px;
  @media only screen and (max-width:1440px) {
    /* padding-top:50px; */
    margin-left:20px;
  }
  @media only screen and (max-width:769px) {
    margin-left:0px;
  }
`;
const ProductImage = styled.img<{height:number}>`
  width: 100%;
  height:${props => (props.height/(3.2118))}px;
  background-color:black;
  object-fit:cover;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    height:${props => props.height}px;
  }
`;


const CarouselWrap = styled.div`
  display: block;
  position: relative;
  width: 100%;
  
  @media only screen and (max-width: 768px) {
    aspect-ratio: 1/1;
    // height: 100%;
  }
`;

const ControlImage = styled.img<{left?:boolean}>`
  margin:${props => props.left? '0 50px 0 0' : '0 0 0 50px'};
  width: 37.94px;
  height: 36.89px;
  @media only screen and (max-width: 768px) {
    margin:${props => props.left? '0 20px 0 0' : '0 0 0 20px'};
    width: 15.53px;
    height: 15.16px;
  }
`;
const LeftArrow = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  cursor: pointer;
  position:absolute;
  top:45%;
  left:50px;
  z-index:99999;
  @media only screen and (max-width: 768px) {
    left:20px;
  }
`
const RightArrow = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  cursor: pointer;
  position:absolute;
  top:45%;
  right:50px;
  z-index:99999;
  @media only screen and (max-width: 768px) {
    right:20px;
  }
`

const SlideImage = styled.img`
  vertical-align: middle;
  @media only screen and (max-width: 768px) {
    aspect-ratio: 1/1;
  }
`;

export default Home;
