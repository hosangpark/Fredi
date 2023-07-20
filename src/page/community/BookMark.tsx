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


function BookMark({saveHistory,onLikeProduct,CategoryClick,productList,selectCategory}
  :
  {saveHistory:(e:React.MouseEvent, idx: number)=>void,
  onLikeProduct?:(e:number)=>void,
  CategoryClick?:(e:any)=>void,
  productList?:SnsList[],
  selectCategory?:string}) {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const { user } = useContext(UserContext);



  return (
    <Container>
      <ProductListWrap>
        {
        productList? productList.map((item:any,index:number)=>{
          return(
            <SnsCard
              item={item.sns}
              key={item.idx}
              onClick={(e) => saveHistory(e, item.sns.idx)}
              index={index}
            />
          )
          })
        : 
        <>NO ITEMS</>
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
        text="회원가입 후 이용 가능합니다."
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
