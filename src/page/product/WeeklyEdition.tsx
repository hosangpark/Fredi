import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import Autoplay from 'embla-carousel-autoplay';
import leftButtonImage from '../../asset/image/ico_prev.png';
import rightButtonImage from '../../asset/image/ico_next.png';
import leftButtonMobileImage from '../../asset/image/ico_prev_mobile.png';
import rightButtonMobileImage from '../../asset/image/ico_next_mobile.png';
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


function WeeklyEdition() {
  const navigate = useNavigate();
  const [productList, setProductList] = useState<TProductListItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [showLogin, setShowLogin] = useState(false);
  const [bannerList, setBannerList] = useState<TImage[]>([]);
  const [bannerListMobile, setBannerListMobile] = useState<TImage[]>([]);
  const [history, setHistory] = useState(false);
  const [showType, setShowType] = useState<1 | 2>(1);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [appdownModal, setAppdownModal] = useState(false);

  const { user } = useContext(UserContext);
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  const { classes } = useStyles();
  const interSectRef = useRef(null);

  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    if(innerWidth > 768){
      console.log('big');
      setAppdownModal(false)
    } else {
      console.log('s');
      setAppdownModal(true)
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

  // const getProductList = async (page: number) => {
  //   const data = {
  //     page: page,
  //     category: category,
  //     keyword: keywordParams,
  //   };
  //   try {
  //     if (history) {
  //       return setHistory(false);
  //     }
  //     const { list, total } = await APIProductList(data);
  //     setTotal(total);
  //     if (page === 1) {
  //       setProductList((prev) => [...list]);
  //     } else {
  //       setProductList((prev) => [...prev, ...list]);
  //     }
  //     // console.log('product', list, page);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const onLikeProduct = async (idx: number) => {
  //   const data = {
  //     product_idx: idx,
  //   };
  //   try {
  //     const res = await APILikeProduct(data);
  //     console.log(res);
  //     const newList = productList.map((item) => (item.idx === idx ? { ...item, isLike: !item.isLike, like_count: res.likeCount } : { ...item }));
  //     setProductList(newList);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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

  // useLayoutEffect(() => {
  //   const page = Number(sessionStorage.getItem('page'));
  //   console.log('카테고리', category);
  //   if (page) {
  //     findHistory();
  //   } else {
  //     setPage(1);
  //     getProductList(1);
  //   }
  // }, [searchParams, category]);

  // useEffect(() => {
  //   if (page > 1) getProductList(page);
  // }, [page]);



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
      <ProductListWrap>
        <ProductMainList
        title={'May 1st'}
        titlesize={14}
        ProductViews={innerWidth <= 768? 2.3 : 3.7}
        naviArrow = {innerWidth <= 768? false : true}
        scrollbar = {innerWidth <= 768? false : true}
        ProducList={bannerListMobile}
        link={'MainTab'}
        />
        <ProductMainList
        title={'April 4th'}
        titlesize={14}
        ProductViews={innerWidth <= 768? 2.3 : 5.8}
        naviArrow = {innerWidth <= 768? false : true}
        scrollbar = {innerWidth <= 768? false : true}
        ProducList={bannerListMobile}
        link={'Latest'}
        />
        <ProductMainList
        title={'April 3th'}
        titlesize={14}
        ProductViews={innerWidth <= 768? 2.3 : 5.9}
        naviArrow = {innerWidth <= 768? false : true}
        scrollbar = {innerWidth <= 768? false : true}
        ProducList={bannerListMobile}
        link={'producer'}
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
  margin: 45px 20px;
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
const MobileCarouselWrap = styled.div`
  display: none;
  max-height: 700px;
  position: relative;
  @media only screen and (max-width: 991px) {
    display: block;
  }
`;

const ControlImage = styled.img`
  width: 40px;
  @media only screen and (max-width: 768px) {
    width: 15px;
  }
`;

const InterView = styled.div`
  height: 200px;
`;

const SlideImage = styled.img`
  vertical-align: middle;
  @media only screen and (max-width: 768px) {
    aspect-ratio: 1/1;
  }
`;

export default WeeklyEdition;
