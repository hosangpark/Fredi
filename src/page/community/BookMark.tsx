import React, { useCallback, useContext, useEffect, useRef, useState ,memo } from 'react';
import styled from 'styled-components';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Autoplay from 'embla-carousel-autoplay';
import leftButtonImage from '../../asset/image/ico_prev.png';
import rightButtonImage from '../../asset/image/ico_next.png';
import leftButtonMobileImage from '../../asset/image/ico_prev_mobile.png';
import rightButtonMobileImage from '../../asset/image/ico_next_mobile.png';
import { createStyles, Image } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { APIGetBanner } from '../../api/SettingAPI';
import { SnsList, TImage, TProductListItem } from '../../types/Types';
import { UserContext } from '../../context/user';
import AlertModal from '../../components/Modal/AlertModal';
import { useLayoutEffect } from 'react';
import { createBrowserHistory } from 'history';
import ShowTypeButton from '../../components/Shop/ShowTypeButton';
import SearchBox from '../../components/Product/SearchBox';
import { APILikeShop, APIShopList } from '../../api/ShopAPI';
import TopButton from '../../components/Product/TopButton';
import { removeHistory } from '../../components/Layout/Header';
import FairCard from '../../components/Shop/FairCard';
// swiper
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { FairListItem } from '../../types/Types';
import SnsCard from '../../components/Shop/SnsCard';
import { APIProductList } from '../../api/ProductAPI';
import FeedCard from '../../components/Shop/FeedCard';
import Nodata from '../../components/Product/NoData';


function BookMark({saveHistory,onLikeProduct,productList,selectCategory}
  :
  {saveHistory:(e:React.MouseEvent, idx: number, index: number)=>void,
  onLikeProduct?:(e:number)=>void,
  productList?:SnsList[],
  selectCategory?:string}) {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const { user } = useContext(UserContext);



  return (
    <Container>
      <ProductListWrap>
        {
        productList&&
        productList.length > 0 ?
        productList.map((item:SnsList,index:number)=>{
          return(
            <SnsCard
              item={item}
              key={item.idx}
              onClick={(e) => saveHistory(e, item.idx, index)}
              index={index}
            />
          )
          })
        : 
        <Nodata/> 
        }
      </ProductListWrap>
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
  display: flex;
  flex: 1;
  flex-direction: column;
  margin:0 50px;
  @media only screen and (max-width: 768px){
    margin:0;
  }
`;

const ProductListWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;

`;


export default BookMark;
