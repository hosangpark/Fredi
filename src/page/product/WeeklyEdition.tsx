import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
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
import { ArtworkListItem, TImage, WeeklyDetailsItem } from '../../types/Types';
import { APIWeeklyDetails } from '../../api/ListAPI';
import WeeklyListItem from '../../components/Product/WeeklyListItem';

function WeeklyEdition() {
  const navigate = useNavigate();
  const location = useLocation()
  const [WeeklyList, setWeeklyList] = useState<WeeklyDetailsItem[]>([]);
  const [showLogin, setShowLogin] = useState(false);
    const [page, setPage] = useState<number>(1);
  const [history, setHistory] = useState(false);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [appdownModal, setAppdownModal] = useState(false);



  const getWeeklyDetails = async (page : number) => {
    const data = {
      page: page,
    };
    try {
      if (history) {
        return setHistory(false);
      }
      const { list, total } = await APIWeeklyDetails(data);
      if (page === 1) {
        setWeeklyList((prev) => [...list]);
      } else {
        setWeeklyList((prev) => [...prev, ...list]);
      }
      // console.log('product', list, page);
    } catch (error) {
      console.log(error);
    }
  };

  const LinkHandler = (e:React.MouseEvent,title:string,idx?:number)=>{
    const y = globalThis.scrollY;
    sessionStorage.setItem('y', String(y ?? 0));

    navigate(`/productdetails/${idx}`,{state:idx})
  }

  const findHistory = () => {
    const page = Number(sessionStorage.getItem('WeeklyPage'));
    // setCategory(categ);

    setPage(page);
    setHistory(true);

    sessionStorage.removeItem('WeeklyPage');
  };

  useLayoutEffect(() => {
    const scrollY = Number(sessionStorage.getItem('y'));
    if (WeeklyList && scrollY) {
      console.log('불러옴', scrollY);
      setTimeout(() => {
        window.scrollTo({
          top: scrollY,
          behavior: 'auto',
        });
      }, 50);
      sessionStorage.removeItem('y');
    }
  }, [WeeklyList]);

  useLayoutEffect(() => {
    const page = Number(sessionStorage.getItem('ArtistPage'));
    if (page){
      findHistory();
    } else {
      console.log('getlist')
      setPage(1);
      getWeeklyDetails(1);
    }
  }, []);

  useEffect(() => {
    if (page > 1) getWeeklyDetails(page);
  }, [page]);




  return (
    <Container id="productContainer">
      <ProductListWrap>
        <WeeklyTitle>Weekly Edition</WeeklyTitle>
        {WeeklyList&&
        WeeklyList.slice(0,5).map((item,index) => {
          return(
            <WeeklyListItem
              key={index}
              LinkHandler={LinkHandler}
              title={WeeklyList[index].week}
              titlesize={18}
              ProductViews={innerWidth <= 768? 2.3 : 5}
              // naviArrow = {innerWidth <= 768? false : true}
              // scrollbar = {innerWidth <= 768? false : true}
              naviArrow={false}
              scrollbar={false}
              aspect={348/432}
              ProducList={WeeklyList[index].artwork_data}
              paddingnum={innerWidth <= 768? 0:50}
              marginT={innerWidth <= 768? 60:130}
              marginB={innerWidth <= 768? 20:65}
              />
          )
        })}
        
        
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
        text="Available after Sign up."
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
