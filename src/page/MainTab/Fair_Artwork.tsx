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
import { FairDetailsArtworkItem, FairListItem, TImage, TProductListItem } from '../../types/Types';
import { UserContext } from '../../context/user';
import AlertModal from '../../components/Modal/AlertModal';
import { useLayoutEffect } from 'react';
import { createBrowserHistory } from 'history';
import ShowTypeButton from '../../components/Shop/ShowTypeButton';
import SearchBox from '../../components/Product/SearchBox';
import { APILikeShop, APIShopList } from '../../api/ShopAPI';
import TopButton from '../../components/Product/TopButton';
import { removeHistory } from '../../components/Layout/Header';
// swiper
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import ArtworkCard from '../../components/Shop/ArtworkCard';
import { CategoryList } from '../../components/List/List';
import { ArtworkListItem } from '../../types/Types';
import { APILikeProduct, APIProductList } from '../../api/ProductAPI';
import Fair_ArtworkCard from '../../components/Shop/Fair_ArtworkCard';


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


function FairArtwork({saveHistory,onLikeProduct,productList,showType}
  :
  {saveHistory:(e:React.MouseEvent, idx: number)=>void,
  onLikeProduct?:(e:number)=>void,
  productList?:FairDetailsArtworkItem[],
  showType?:number}) {
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  const keywordParams = searchParams.get('keyword') ?? '';
  const categoryParams = (searchParams.get('category') as '1' | '2' | '3' | '4' | '5' | '6') ?? '1';
  const [category, setCategory] = useState<'1' | '2' | '3' | '4' | '5' | '6'>(categoryParams);
  const [showLogin, setShowLogin] = useState(false);
  const [keyword, setKeyword] = useState<string>(keywordParams);
  const [showcategory,setShowCategory] = useState(false)


  const { user } = useContext(UserContext);





  const chageCategory = (value: '1' | '2' | '3' | '4' | '5' | '6') => {
    setCategory(value);
    setSearchParams({
      keyword,
      category: value,
    });
  };


  /** drageEvent */
  const scrollRef = useRef<any>(null);
  const [isDrag, setIsDrag] = useState(false);
  const [startX, setStartX] = useState<any>();

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
  const delay = 10;
  const onThrottleDragMove = throttle(onDragMove, delay);
  return (
    <Container>      
      <CategorySelectButtonWrap 
      onMouseDown={onDragStart}
      onMouseMove={onThrottleDragMove}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
      ref={scrollRef}
      showcategory={showcategory}>
        {CategoryList.map((item) => {
          return (
            <CategroySelectButtons key={`Category-${item.value}`} item={item} isSelect={category === item.value} onClickFilter={()=>{chageCategory(item.value as '1' | '2' | '3' | '4' | '5' | '6')}} />

          );
        })}
      </CategorySelectButtonWrap>
      
      <ProductListWrap>
        {productList &&
        productList.map((item:any,index:number)=>{
          return(
            <Fair_ArtworkCard
              item={item}
              key={index}
              onClick={(e) => saveHistory(e, item.idx)}
              onClickLike={(e) => {
                if (user.idx && onLikeProduct) {
                  e.stopPropagation();
                  onLikeProduct(item.idx);
                } else {
                  e.stopPropagation();
                  setShowLogin(true);
                }
              }}
              showType={showType? 2:1}
              index={index}
            />
          )
          })
        }
      </ProductListWrap>
      {/* <InterView ref={interSectRef} /> */}
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
  width:100%;
`;

const ProductListWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin:0 50px;
  /* 1440px */
  /* @media only screen and (max-width: 1440px) {
    margin:0 20px;
  } */
  @media only screen and (max-width: 768px) {
    margin:0;
  }
`;

const CarouselWrap = styled.div`
  display: block;
  position: relative;
  width: 100%;
  aspect-ratio: 4697/1737;
  max-height: 700px;
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

const CategorySelectButtonWrap = styled.div<{showcategory:boolean}>`
  /* display:flex; */
  display:${props => props.showcategory? 'flex' : 'none'};
  align-items: center;
  margin: 20px 50px 40px;

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

export default FairArtwork;
