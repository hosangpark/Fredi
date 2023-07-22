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
import { FairListItem, SnsList, TImage, TProductListItem } from '../../types/Types';
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
import FeedCard from '../../components/Shop/FeedCard';
import { CategoryList } from '../../components/List/List';
import { ArtworkListItem } from '../../types/Types';
import { APIProducerList } from '../../api/ProducerAPI';
import { APIProductList } from '../../api/ProductAPI';


interface ICategorySelectButton {
  item: { value: string; label: string };
  isSelect: boolean;
  onClickFilter: (e: { value: string; label: string }) => void;
}

const CategroySelectButtons = memo(({ item, isSelect, onClickFilter }: ICategorySelectButton) => {
  return (
      <CategorySelectButton selected={isSelect} onClick={() => onClickFilter(item)} key={item.label}>
        <CategorySelectButtonText selected={isSelect}>{item.label}</CategorySelectButtonText>
      </CategorySelectButton>
  );
});


function Feed({saveHistory,onLikeProduct,CategoryClick,setShowLogin,productList,selectCategory}
  :
  {saveHistory:(e:React.MouseEvent, idx: number)=>void,
  onLikeProduct?:(e:number)=>void,
  CategoryClick?:(e:any)=>void,
  setShowLogin:(e:boolean)=>void,
  productList?:SnsList[],
  selectCategory?:string}) {
  const navigate = useNavigate();
  
  const { user } = useContext(UserContext);

  /** drageEvent */
  const scrollRef = useRef<any>(null);
  const [isDrag, setIsDrag] = useState(false);
  const [startX, setStartX] = useState<any>();
  const [isDragging, setIsDragging] = useState(false);
  const [movingX, setmovingX] = useState<any>();
  
  const onDragStart = (e:any) => {
    e.preventDefault();
    setIsDrag(true);
    setStartX(e.pageX + scrollRef.current.scrollLeft);
  };

  const onDragEnd = () => {
    setIsDrag(false);
  };

  const onDragMove = (e:any) => {
    if (isDrag) {
      scrollRef.current.scrollLeft = startX - e.pageX;
      setmovingX(scrollRef.current.scrollLeft)
    }
  };
  const throttle = (func:any, ms:any) => {
    let throttled = false;
    return (...args:any) => {
      if (!throttled) {
        throttled = true;
        setTimeout(() => {
          func(...args);
          throttled = false;
        }, ms);
      }
    };
  };


  useEffect(()=>{
    setIsDragging(true)
    setTimeout(() => {
      setIsDragging(false);
    }, 500);
  },[movingX])

  const delay = 10;
  const onThrottleDragMove = throttle(onDragMove, delay);

  return (
    <Container>
      <CategorySelectButtonWrap
      onMouseDown={onDragStart}
      onMouseMove={onThrottleDragMove}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
      ref={scrollRef}>
        {CategoryList.map((item) => { 
          return (
            <CategroySelectButtons key={`Category-${item.value}`} item={item} isSelect={selectCategory === item.value} 
            onClickFilter={()=>{if(!isDragging){if(CategoryClick)CategoryClick(item.value)}}} />
          );
        })}
      </CategorySelectButtonWrap>
      <ProductListWrap>
        {
        productList? productList.map((item:any,index:number)=>{
          return(
            <FeedCard
              item={item}
              key={item.idx}
              onClick={(e) => {
                if(user.idx){
                saveHistory(e, item.idx)
              } else {
                setShowLogin(true)
              }
              }}
              onClickLike={(e) => {
                if (user.idx && onLikeProduct) {
                  e.stopPropagation();
                  onLikeProduct(item.idx);
                } else {
                  e.stopPropagation();
                  setShowLogin(true);
                }
              }}
              index={index}
            />
          )
          })
        : 
        <>NO ITEMS</>
        }
      </ProductListWrap>
      {/* <InterView ref={interSectRef} /> */}
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
  /* 1440px */
  /* @media only screen and (max-width: 1440px) {
    margin:0 20px;
  } */

`;

const MobileCarouselWrap = styled.div`
  display: none;
  max-height: 700px;
  position: relative;
  @media only screen and (max-width: 768px) {
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

const CategorySelectButtonWrap = styled.div`
  /* display:flex; */
  display:flex;
  align-items: center;
  margin: 20px 0px 40px;
  overflow-x: scroll;
  cursor: pointer;
  -webkit-overflow-scrolling: touch;

  ::-webkit-scrollbar{
    display:none;
  }
  /* 1440px */
  /* @media only screen and (max-width: 1440px) {
    margin: 20px 0px 20px 20px;;
  } */
  @media only screen and (max-width: 768px) {
    margin: 20px 0 20px 18px;
  }
`;

const CategorySelectButton = styled.div<{ selected: boolean }>`
  background-color: ${(props) => (props.selected ? '#121212' : '#fff')};
  border : 1px solid ${(props) => (props.selected ? '#121212' : '#c0c0c0')};
  padding: 13px 24px 14px 22px;
  margin-right: 10.88px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 47.25px;
  /* box-shadow:2px 3px 3px 0px #aaaaaa; */
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    margin-right: 5px;
    padding: 7px 20px;
    height: 27px;
  }
`;

const CategorySelectButtonText = styled.span<{ selected: boolean }>`
  font-family:'Pretendard Variable';
  font-size:17px;
  color: ${(props) => (props.selected ? '#fff' : '#121212')};
  font-weight: 410;
  text-transform: capitalize;
  @media only screen and (max-width: 1440px) {
    font-size: 14px;
  }
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

export default Feed;
