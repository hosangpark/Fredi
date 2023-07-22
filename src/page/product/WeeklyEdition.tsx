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
import { APIWeeklyDetails } from '../../api/ListAPI';

function WeeklyEdition() {
  const navigate = useNavigate();
  const [productList, setProductList] = useState<TProductListItem[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [bannerList, setBannerList] = useState<TImage[]>([]);
  const [bannerListMobile, setBannerListMobile] = useState<TImage[]>([]);
  const [history, setHistory] = useState(false);
  const [showType, setShowType] = useState<1 | 2>(1);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [appdownModal, setAppdownModal] = useState(false);

  const getBannerList = async () => {
    var array1 = new Array(); //pc
    var array2 = new Array(); //mobile
    try {
      const res = await APIGetBanner();
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

  const getWeeklyDetails = async () => {

    try {
      const res = await APIWeeklyDetails();
      console.log('WWWWWWWWWWWWWWW', res);

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
      navigate(`/personalpage/${idx}`,{state:idx})
    } else if (title.includes('Trending')) {
      navigate(`/MobileProfile/${idx}`,{state:idx})
    } else if (title.includes('Featured')) {
      navigate(`/MobileProfile/${idx}`,{state:idx})
    } else {
      console.log(title,idx)
    }
  }



  const saveHistory = (e: React.MouseEvent, idx: number) => {
    const y = globalThis.scrollY;
    // sessionStorage.setItem('products', JSON.stringify(productList));
    // sessionStorage.setItem('page', String(page));
    // sessionStorage.setItem('type', String(showType));
    sessionStorage.setItem('y', String(y ?? 0));
    navigate(`/productdetails/${idx}`);
  };




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

  useLayoutEffect(() => {

    getWeeklyDetails()
    getBannerList();

  }, [productList]);



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
