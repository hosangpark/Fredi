import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import Autoplay from 'embla-carousel-autoplay';
import leftButtonImage from '../../asset/image/ico_prev.png';
import rightButtonImage from '../../asset/image/ico_next.png';
import { createStyles, Image } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { APIArtistList, APIFairList, APILikeProduct, APIProductList, APISnsList } from '../../api/ProductAPI';
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
import { ArtistItem, ArtistList, ArtworkListItem, FairList, FeaturedListType, MainFairList, SnsList, TImage, TProductListItem, WeeklyListItem } from '../../types/Types';
import LastestList from '../../components/Product/LastestList';
import FairMainList from '../../components/Product/FairMainList';
import { APIFeaturedWorksList, APITrendingArtist, APIWeeklyList } from '../../api/ListAPI';
import FeaturedList from '../../components/Product/FeaturedList';
import HomeStyleList from '../../components/Product/HomeStyleList';



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


function Home() {
  const navigate = useNavigate();
  // let [searchParams, setSearchParams] = useSearchParams();
  // const keywordParams = searchParams.get('keyword') ?? '';
  // const categoryParams = (searchParams.get('category') as '1' | '2' | '3' | '4' | '5' | '6') ?? '1';
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

  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [appdownModal, setAppdownModal] = useState(false);

  const { user } = useContext(UserContext);
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  const { classes } = useStyles();
  const interSectRef = useRef(null);

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    if(innerWidth > 768){
      setAppdownModal(false)
    } else {
      // console.log('userAgent',userAgent);
      // const code = searchParams.get("code");
      if (userAgent === "APP-android" || userAgent === "APP-ios") {
        setAppdownModal(false)
      } else{
        setAppdownModal(true)
      }
    }
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
      setWeeklyList(list.slice(0,10));
      // console.log('product', list,);
    } catch (error) {
      console.log(error);
    }
  };
  const getHomeStyleList = async () => {
    try {
      if (history) {
        return setHistory(false);
      }
      const { list } = await APISnsList({page:1});
      setHomeList(list.slice(0,10));
      // console.log('product', list,);
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
      setArtistList(list.slice(0,10));
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


  const LinkHandler = (e:React.MouseEvent,title:string,idx?:number)=>{
    const y = globalThis.scrollY;
    sessionStorage.setItem('Home_y', String(y ?? 0));
    if(title === 'Fairs'){
      navigate(`/FairContent/${idx}`)
    } else if (title.includes('Latest')) {
      // sessionStorage.setItem('LatestList', JSON.stringify(LatestList));
      navigate(`/productdetails/${idx}`);
    } else if (title.includes('Home')) {
      navigate(`/personalpage/${idx}`,{state:idx});
    } else if (title.includes('Weekly')) {
      navigate(`/WeeklyEdition`)
    } else if (title.includes('Trending')) {
      navigate(`/MobileProfile/${idx}`,{state:idx})
    } else if (title.includes('Featured')) {
      navigate(`/MobileProfile/${idx}`,{state:idx})
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


  const slides = bannerList.map((item:any) => {
    return(
    <Carousel.Slide key={item.idx}>
      <a>
        <SlideImage src={item.file_name} className={classes.carouselImages} />
      </a>
    </Carousel.Slide>
    );
  });

  const slidesMobile = bannerListMobile.map((item:any) => {
    // console.log('item', item);
    return(
      <Carousel.Slide key={item.idx}>
      <a>
        <SlideImage src={item.file_name} className={classes.carouselImages} />
      </a>
    </Carousel.Slide>
    );
  });

  return (
    <Container id="productContainer">
      <CarouselWrap>
        {innerWidth > 768 && bannerList.length > 0 && (
          <Carousel
            plugins={[autoplay.current]}
            withIndicators
            loop
            withKeyboardEvents={false}
            nextControlIcon={<ControlImage left={true} src={rightButtonImage} />}
            previousControlIcon={<ControlImage src={leftButtonImage} />}
            styles={{
              root: { maxHeight: 700 },
              control: { background: 'transparent', width: 45, border: 0, '@media (max-width: 768px)': { width: 25 } },
            }}
            classNames={{
              root: classes.carousel,
              // controls: classes.carouselControls,
              indicator: classes.carouselIndicator,
              control: classes.carouselControl,
            }}
          >
            {slides}
          </Carousel>
        )}
        {innerWidth <= 768 && bannerListMobile.length > 0 && (
          <Carousel
            plugins={[autoplay.current]}
            withIndicators
            nextControlIcon={<ControlImage left={true} src={rightButtonImage} />}
            previousControlIcon={<ControlImage src={leftButtonImage} />}
            loop
            withKeyboardEvents={false}
            styles={{
              root: { maxHeight: 700, aspectRatio: '1/1' },
              control: { background: 'transparent', width: 45, border: 0, aspectRatio: '1/1'},
            }}
            classNames={{
              root: classes.carousel,
              // controls: classes.carouselControls,
              indicator: classes.carouselIndicator,
              control: classes.carouselControl,
            }}
            className="casual"
          >
            {slidesMobile}
          </Carousel>
        )}
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
        paddingnum={innerWidth <= 768? 0:60}
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
        paddingnum={innerWidth <= 768? 0:60}
        marginRight={18}
        marginT={innerWidth <= 768? 143:172.22}
        marginB={innerWidth <= 768? 21:56.36}
        />
        <WeeklyEditionList
        LinkHandler={LinkHandler}
        title={'Weekly Edition'}
        ProductViews={innerWidth <= 768? 1.1 : innerWidth <= 1440? 2.7 :3.4}
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
        onClose={()=>setAppdownModal(false)} 
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
        text="회원가입 후 이용 가능합니다."
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

const CarouselWrap = styled.div`
  display: block;
  position: relative;
  width: 100%;
  @media only screen and (max-width: 769px) {
    aspect-ratio: 4697/1737;
  }
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

const SlideImage = styled.img`
  vertical-align: middle;
  @media only screen and (max-width: 768px) {
    aspect-ratio: 1/1;
  }
`;

export default Home;
