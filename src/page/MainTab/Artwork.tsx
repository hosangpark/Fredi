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
import { CategoryType, FairListItem, TImage, TProductListItem } from '../../types/Types';
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

import { ArtworkListItem } from '../../types/Types';
import { APICategoryList} from '../../api/ProductAPI';
import Nodata from '../../components/Product/NoData';


interface ICategorySelectButton {
  item: CategoryType;
  isSelect: boolean;
  onClickFilter: (e:CategoryType) => void;
}

const CategroySelectButtons = memo(({ item, isSelect, onClickFilter }: ICategorySelectButton) => {
  return (
    <CategorySelectButton selected={isSelect} onClick={() => onClickFilter(item)} key={item.name}>
      <CategorySelectButtonText selected={isSelect}>{item.name}</CategorySelectButtonText>
    </CategorySelectButton>
  );
});


function Artwork({saveHistory,onLikeProduct,CategoryClick,productList,showType,selectCategory}
  :
  {saveHistory:(e:React.MouseEvent, idx: number)=>void,
  onLikeProduct?:(e:number)=>void,
  CategoryClick?:(e:any)=>void,
  productList?:ArtworkListItem[],
  showType?:number,selectCategory?:string}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false)
  const [showcategory,setShowCategory] = useState(false)
  const [categoriList, setcategoriList] = useState<CategoryType[]>([]);

  const { user } = useContext(UserContext);

  const getCategoryList = async () => {
    const data = {
      page: 1
    };
    try {
      const {list,total} = await APICategoryList(data);
      setcategoriList(list);
    } catch (error) {
    }
  };

  useEffect(()=>{
    getCategoryList()
  },[])

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
    }, 50);
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
      ref={scrollRef}
      showcategory={showcategory}>
        <CategroySelectButtons key={`Category-All`} item={{
            idx:'1',
            order_num:1,
            name:'All',
            show:1,
            created_time: '',
            updated_time: '',
            deleted_time: ''
        }} isSelect={selectCategory === '1'} 
        onClickFilter={()=>{if(!isDragging){if(CategoryClick)CategoryClick('1')}}} />
        {categoriList.map((item,index) => {
          return (
            <CategroySelectButtons key={`Category-${item.idx}`} item={item} isSelect={selectCategory == item.idx} onClickFilter={()=>{
              if(!isDragging){if(CategoryClick)CategoryClick(item.idx)}}} />
          );
        })}
      </CategorySelectButtonWrap>
      <ProductListWrap>
        {productList && productList.length> 0 ?
        productList.map((item:any,index:number)=>{
          return(
            <ArtworkCard
              item={item}
              key={item.idx}
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
          :
          <Nodata/>
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
  display:flex;
  /* display:${props => props.showcategory? 'flex' : 'none'}; */
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
  border : 1px solid ${(props) => (props.selected ? '#121212' : '#dbdbdb')};
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
  color: ${(props) => (props.selected ? '#fff' : '#121212')};
  font-weight: 310;
  font-size: 14px;
  text-transform: capitalize;
  white-space:nowrap;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

export default Artwork;
