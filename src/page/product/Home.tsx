import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import Autoplay from 'embla-carousel-autoplay';
import leftButtonImage from '../../asset/image/ico_prev.png';
import rightButtonImage from '../../asset/image/ico_next.png';
import { createStyles, Image } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { APILikeProduct, APIProductList } from '../../api/ProductAPI';
import ProductList, { TProductListItem } from '../admin/ProductList';
import { APIGetBanner } from '../../api/SettingAPI';
import { TImage } from '../admin/ProducerList';
import { UserContext } from '../../context/user';
import AlertModal from '../../components/Modal/AlertModal';
import { useLayoutEffect } from 'react';
import ShowTypeButton from '../../components/Shop/ShowTypeButton';
import ProductCard from '../../components/Product/ProductCard';
import SearchBox from '../../components/Product/SearchBox';
import TopButton from '../../components/Product/TopButton';
import { removeHistory } from '../../components/Layout/Header';
import AppdownModal from '../../components/Modal/AppdownModal';
import ProductMainList from '../../components/Product/ProductMainList';
import WeeklyEditionList from '../../components/Product/WeeklyEditionList';
import Footer from '../../components/Layout/Footer';
import MainArtistList from '../../components/Product/MainArtistList';



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
  let [searchParams, setSearchParams] = useSearchParams();
  const keywordParams = searchParams.get('keyword') ?? '';
  const categoryParams = (searchParams.get('category') as '1' | '2' | '3' | '4' | '5' | '6') ?? '1';
  const [productList, setProductList] = useState<TProductListItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [category, setCategory] = useState<'1' | '2' | '3' | '4' | '5' | '6'>(categoryParams);
  const [showLogin, setShowLogin] = useState(false);
  const [bannerList, setBannerList] = useState<TImage[]>([]);
  const [bannerListMobile, setBannerListMobile] = useState<TImage[]>([]);
  const [history, setHistory] = useState(false);
  const [keyword, setKeyword] = useState<string>(keywordParams);
  const [showType, setShowType] = useState<1 | 2>(1);
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
      console.log('big');
      setAppdownModal(false)
    } else {
      console.log('userAgent',userAgent);
      // const code = searchParams.get("code");
      if (userAgent === "APP-android" || userAgent === "APP-ios") {
        setAppdownModal(false)
      } else{
        setAppdownModal(true)
      }
    }
    // console.log("innerWidth", innerWidth);
    window.addEventListener("resize", resizeListener);
  }, [innerWidth]);
  // console.log("innerWidth", innerWidth);

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

  const handleObserver = useCallback((entries: any) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  }, []);

  const options = {
    root: null, //기본 null, 관찰대상의 부모요소를 지정
    rootMargin: '100px', // 관찰하는 뷰포트의 마진 지정
    threshold: 1.0, // 관찰요소와 얼만큼 겹쳤을 때 콜백을 수행하도록 지정하는 요소
  };

  const findHistory = () => {
    const list = JSON.parse(sessionStorage.getItem('products') ?? '');
    const page = Number(sessionStorage.getItem('page'));
    const type = (Number(sessionStorage.getItem('type')) as 1 | 2) ?? 1;
    setProductList(list);
    setHistory(true);
    setPage(page);
    setShowType(type);

    sessionStorage.removeItem('products');
    sessionStorage.removeItem('page');
    sessionStorage.removeItem('type');
  };

  const saveHistory = (e: React.MouseEvent, idx: number) => {
    const y = globalThis.scrollY;
    sessionStorage.setItem('products', JSON.stringify(productList));
    sessionStorage.setItem('page', String(page));
    sessionStorage.setItem('type', String(showType));
    sessionStorage.setItem('y', String(y ?? 0));
    navigate(`/productdetails/${idx}`);
  };

  const onDeleteAsk = async () => {
    // setAppdownModal(false);
    // const data = {
    //   idx: itemIdx,
    // };
    // try {
    //   const res = await APIDeleteAsk(data);
    //   console.log(res);
    //   setShowModal(true);
    //   getAskList();
    // } catch (error) {
    //   console.log(error);
    //   alert(error);
    // }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, options);
    if (interSectRef.current) observer.observe(interSectRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    getBannerList();
  }, []);

  useLayoutEffect(() => {
    const scrollY = Number(sessionStorage.getItem('y'));
    if (productList.length > 0 && scrollY) {
      console.log('불러옴', scrollY);
      setTimeout(() => {
        window.scrollTo({
          top: scrollY,
          behavior: 'auto',
        });
      }, 50);
      sessionStorage.removeItem('y');
    }
  }, [productList]);

  

  const slides = bannerList.map((item:any) => {
    console.log('item', item);
    return(
    <Carousel.Slide key={item.idx}>
      <a href={item?.link}>
        <SlideImage src={item.file_name} className={classes.carouselImages} />
      </a>
    </Carousel.Slide>
    );
  });

  const slidesMobile = bannerListMobile.map((item:any) => {
    // console.log('item', item);
    return(
      <Carousel.Slide key={item.idx}>
      <a href={item?.link}>
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
            loop
            withKeyboardEvents={false}
            // nextControlIcon={<ControlImage src={rightButtonImage} />}
            // previousControlIcon={<ControlImage src={leftButtonImage} />}
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
        <ProductMainList
        title={'Fairs'}
        ProductViews={innerWidth <= 768? 1.35  : innerWidth <= 1440? 2.7: 3.7}
        naviArrow = {innerWidth <= 768? false : true}
        scrollbar = {innerWidth <= 768? false : true}
        ProducList={bannerListMobile}
        arrowView={false}
        productLink={innerWidth <= 768? "FairsM" : "FairsW"}
        aspect={495/332}
        paddingnum={innerWidth <= 768? 0:50}
        marginT={innerWidth <= 768? 100:170}
        marginB={innerWidth <= 768? 21:55}
        />
        <ProductMainList
        title={'Latest'}
        ProductViews={innerWidth <= 768? 2.1  : innerWidth <= 1440? 4.4: 5.9}
        naviArrow = {innerWidth <= 768? false : true}
        scrollbar = {innerWidth <= 768? false : true}
        ProducList={bannerListMobile}
        arrowView={false}
        productLink={'Latest'}
        aspect={300/370}
        titlesize={21}
        paddingnum={innerWidth <= 768? 0:50}
        marginRight={18}
        marginT={innerWidth <= 768? 143:172}
        marginB={innerWidth <= 768? 21:56}
        />
        <WeeklyEditionList
        title={'Weekly Edition'}
        ProductViews={innerWidth <= 768? 1.1 : innerWidth <= 1440? 2.7 :3.4}
        naviArrow = {false}
        scrollbar = {innerWidth <= 768? false : true}
        ProducList = {bannerListMobile}
        arrowView={false}
        paddingnum={innerWidth <= 768? 0:50}
        marginT={innerWidth <= 768? 120:175}
        marginB={innerWidth <= 768? 21:51}
        />
        <ProductMainList
        title={'Home & Styling'}
        ProductViews={innerWidth <= 768? 1.5  : innerWidth <= 1440? 4.4: 5.9}
        // naviArrow = {innerWidth <= 768? false : true}
        naviArrow = {false}
        scrollbar = {innerWidth <= 768? false : true}
        ProducList={bannerListMobile}
        productLink={'Home'}
        arrowView={false}
        paddingnum={innerWidth <= 768? 0:90}
        marginRight={18}
        marginT={innerWidth <= 768? 100:170}
        marginB={innerWidth <= 768? 21:55}
        // aspect={285/240}
        />
        <MainArtistList
        title={'Trending Artist'}
        ProductViews={innerWidth <= 768? 2.05 : innerWidth <= 1440? 4.4 : 5.7}
        // naviArrow = {innerWidth <= 768? false : true}
        naviArrow = {false}
        scrollbar = {innerWidth <= 768? false : true}
        ProducList={bannerListMobile}
        productLink={'Trending'}
        arrowView={false}
        paddingnum={innerWidth <= 768? 5:50}
        marginT={innerWidth <= 768? 100:170}
        marginB={innerWidth <= 768? 21:54}
        />
        <ProductMainList
        title={'Featured Works'}
        ProductViews={innerWidth <= 768? 2.05 : innerWidth <= 1440? 4.4 : 5.9}
        // naviArrow = {innerWidth <= 768? false : true}
        naviArrow = {false}
        scrollbar = {innerWidth <= 768? false : true}
        ProducList={bannerListMobile}
        arrowView={false}
        aspect={190/230}
        paddingnum={innerWidth <= 768? 0:90}
        marginT={innerWidth <= 768? 100:170}
        marginB={innerWidth <= 768? 21:64}
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
    width: 15px;
  }
`;

const SlideImage = styled.img`
  vertical-align: middle;
  @media only screen and (max-width: 768px) {
    aspect-ratio: 1/1;
  }
`;

export default Home;
