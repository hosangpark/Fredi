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
import { ArtworkLikeListItem, LikeProductListItem, TImage, TProductListItem } from '../../types/Types';
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
import { CategoryList } from '../../components/List/List';
import { ArtworkListItem } from '../../types/Types';
import { APILikeProduct, APILikeProductList, APIProductList } from '../../api/ProductAPI';
import dayjs from 'dayjs';
import snsImage from '../../asset/image/snsicon.png';
import LikeCard from '../../components/Shop/LikeCard';
import Nodata from '../../components/Product/NoData';



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


function LikeArtwork() {
  const navigate = useNavigate();
  const location = useLocation();
  const [category, setCategory] = useState<string>('1');
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [history, setHistory] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [likeList,setLikeList] = useState<ArtworkLikeListItem[]>([])
  const [showcategory,setShowCategory] = useState(false)
  const interSectRef = useRef(null);


  const { user } = useContext(UserContext);

  const getLikeProductList = async (page:number) => {
    const data = {
      page:page,
      category:1
    };
    try {
      if (history) {
        return setHistory(false);
      }
      const { list } = await APILikeProductList(data);
      setLikeList(list);
      // if(list){
      // }
      // console.log('listlistlistlist',list)
      // setTotal(total);
    } catch (error) {
      console.log(error);
    }
  };

  const findHistory = () => {
    const list = JSON.parse(sessionStorage.getItem('LikeArtworkList') ?? '');
    const categ = sessionStorage.getItem('LikeArtworkCategory');
    const page = Number(sessionStorage.getItem('LikeArtworkPage'));
    setHistory(true);
    if(categ){
      setCategory(categ)
    }
    setPage(page);
    setLikeList(list);
    sessionStorage.removeItem('LikeArtworkPage');
    sessionStorage.removeItem('LikeArtworkCategory');
    sessionStorage.removeItem('LikeArtworkList');
  };

  
  const saveHistory = (e: React.MouseEvent, idx: number) => {
    const div = document.getElementById('root');
    if (div) {
      console.log(div.scrollHeight, globalThis.scrollY);
      const y = globalThis.scrollY;
      sessionStorage.setItem('LikeArtworkList', JSON.stringify(likeList));
      sessionStorage.setItem('LikeArtworkCategory', category);
      sessionStorage.setItem('LikeArtworkPage', String(page));
      sessionStorage.setItem('y', String(y ?? 0));
      navigate(`/productdetails/${idx}`);
    }
  };

  const onCancelLikeProduct = async (idx: number) => {
    const data = {
      artwork_idx: idx,
    };
    try {
      const res = await APILikeProduct(data);
      console.log(res);
      const newList = likeList.filter((item) => item.artwork.idx !== idx);
      setLikeList(newList);
    } catch (error) {
      console.log(error);
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
  
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, options);
    if (interSectRef.current) observer.observe(interSectRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);


  useEffect(() => {
    if (page > 1) getLikeProductList(page);
  }, [page]);


  useLayoutEffect(() => {
    const scrollY = Number(sessionStorage.getItem('y'));
    if (likeList.length > 0 && scrollY) {
      console.log('불러옴', scrollY);
      setTimeout(() => {
        window.scrollTo({
          top: scrollY,
          behavior: 'auto',
        });
      }, 50);
      sessionStorage.removeItem('y');
    }
  }, [likeList]);

  useLayoutEffect(() => {
    const page = Number(sessionStorage.getItem('LikeArtworkPage'));
    if (page) {
      findHistory();
    } else {
      setPage(1);
      getLikeProductList(1);
    }
  }, []);



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
      <TabBox>
        <TabContents On={true}>
          Artwork
        </TabContents>
        <TabContents onClick={()=>navigate('/LikeSns')}>
          <TabImage src={snsImage}/>
        </TabContents>
      </TabBox>
      <CategorySelectButtonWrap 
      onMouseDown={onDragStart}
      onMouseMove={onThrottleDragMove}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
      ref={scrollRef}
      showcategory={showcategory}>
        {CategoryList.map((item) => {
          return (
            <CategroySelectButtons key={`Category-${item.value}`} item={item} isSelect={category === item.value} onClickFilter={()=>{if(!isDragging)setCategory(item.value)}} />
          );
        })}
      </CategorySelectButtonWrap>
      
      <ProductListWrap>
        {likeList &&
        likeList.length > 0 ?
        likeList.map((item:ArtworkLikeListItem,index:number)=>{
          return(
            <LikeCard
              item={item.artwork}
              key={item.idx}
              onClick={(e) => saveHistory(e, item.artwork.idx)}
              isLikeList
              onClickLike={(e) => {
                if (user.idx) {
                  e.stopPropagation();
                  onCancelLikeProduct(item.artwork.idx);
                } else {
                  e.stopPropagation();
                  setShowLogin(true);
                }
              }}
              showType={2}
              index={index}
            />
          )
          })
          :
          <Nodata/>
        }
      </ProductListWrap>
      <InterView ref={interSectRef} />
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
  margin:0 50px 100px;
  /* 1440px */
  /* @media only screen and (max-width: 1440px) {
    margin:0 20px;
  } */
  @media only screen and (max-width: 768px) {
    margin:0;
  }
`;

const Marginbox = styled.div`
  height:200px;
`

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

const TabBox = styled.div`
width:400px;
display:flex;
margin:50px;
border-bottom:1.7px solid rgb(204,204,204);
  @media only screen and (max-width: 768px) {
  margin:50px 0 0;
  width:100%;
  }
`
const TabContents = styled.div<{On?:boolean}>`
  font-family:'Pretendard Variable';
  border-bottom:${props => props.On? 1.7:0}px solid black;
  font-weight:${props => props.On? 410 : 360};
  cursor: pointer;
  color:rgb(0,0,0);
  padding:10px 0;
  margin-top:5px;
  font-size:18px;
  flex: 1 1 0%;
  @media only screen and (max-width: 768px) {
    font-size:14px;
  }
`
const TabImage = styled.img`
  width:25px;
  height:25px;
  @media only screen and (max-width:768px){
    width:20px;
    height:20px;
  }
`

export default LikeArtwork;
