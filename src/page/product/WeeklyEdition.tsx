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
import { APIGetBanner } from '../../api/SettingAPI';
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
import { TImage, TProductListItem } from '../../types/Types';

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
  //     artwork_idx: idx,
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
  const LinkHandler = (e:React.MouseEvent,title:string,idx?:number)=>{
    const y = globalThis.scrollY;
    sessionStorage.setItem('y', String(y ?? 0));
    if(title === 'Fairs'){
      navigate(`/FairContent/${idx}`)
    } else if (title.includes('Home')) {
      navigate(`/personalpage/${idx}`)
    } else if (title.includes('Trending')) {
      navigate(`/MobileProfile/${idx}`,{state:idx})
    } else if (title.includes('Featured')) {
      navigate(`/MobileProfile/${idx}`,{state:idx})
    } else {
      console.log(title,idx)
    }
  }

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


  return (
    <Container id="productContainer">
      <ProductListWrap>
        <WeeklyTitle>Weekly Edition</WeeklyTitle>
        <ProductMainList
        LinkHandler={LinkHandler}
        title={'May 1st'}
        titlesize={18}
        ProductViews={innerWidth <= 768? 2.3 : 5}
        // naviArrow = {innerWidth <= 768? false : true}
        // scrollbar = {innerWidth <= 768? false : true}
        naviArrow={false}
        scrollbar={false}
        aspect={348/432}
        ProducList={bannerListMobile}
        paddingnum={innerWidth <= 768? 0:50}
        marginT={innerWidth <= 768? 60:130}
        marginB={innerWidth <= 768? 20:65}
        />
        <ProductMainList
        LinkHandler={LinkHandler}
        title={'April 4th'}
        titlesize={18}
        ProductViews={innerWidth <= 768? 2.3 : 5}
        // naviArrow = {innerWidth <= 768? false : true}
        // scrollbar = {innerWidth <= 768? false : true}
        naviArrow={false}
        scrollbar={false}
        aspect={348/432}
        ProducList={bannerListMobile}
        paddingnum={innerWidth <= 768? 0:50}
        marginT={innerWidth <= 768? 60:130}
        marginB={innerWidth <= 768? 20:65}
        />
        <ProductMainList
        LinkHandler={LinkHandler}
        title={'April 3th'}
        titlesize={18}
        ProductViews={innerWidth <= 768? 2.3 : 5}
        // naviArrow = {innerWidth <= 768? false : true}
        // scrollbar = {innerWidth <= 768? false : true}
        naviArrow={false}
        scrollbar={false}
        aspect={348/432}
        paddingnum={innerWidth <= 768? 0:50}
        marginT={innerWidth <= 768? 60:130}
        marginB={innerWidth <= 768? 21:65}
        ProducList={bannerListMobile}
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
  margin: 40px 50px;
  @media only screen and (max-width: 768px) {
    margin: 20px 0px;
  }
`;
const WeeklyTitle = styled.div`
  text-align:start;
  font-size:18px;
  font-weight: 410;
  margin: 0;
  @media only screen and (max-width: 768px) {
    margin: 0 20px;
  }
`

const SlideImage = styled.img`
  vertical-align: middle;
  @media only screen and (max-width: 768px) {
    aspect-ratio: 1/1;
  }
`;

export default WeeklyEdition;
