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
import { FollowArtistList, TImage, TProductListItem } from '../../types/Types';
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
import { CategoryList } from '../../components/List/List';
import FollowCard from '../../components/Shop/FollowCard';
import { APIArtistFollowingList, APIProductList } from '../../api/ProductAPI';



function Follow() {
  const navigate = useNavigate();
  const browserHistory = createBrowserHistory();
  const location = useLocation();
  let [searchParams, setSearchParams] = useSearchParams();
  const keywordParams = searchParams.get('keyword') ?? '';
  const categoryParams = (searchParams.get('category') as '1' | '2' | '3' | '4' | '5' | '6') ?? '1';

  const [FollowArtistList, setFollowArtistList] = useState<FollowArtistList[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [category, setCategory] = useState<'1' | '2' | '3' | '4' | '5' | '6'>(categoryParams);
  const [showLogin, setShowLogin] = useState(false);
  const [bannerList, setBannerList] = useState<TImage[]>([]);
  const [history, setHistory] = useState(false);
  const [keyword, setKeyword] = useState<string>(keywordParams);
  const [showType, setShowType] = useState<1 | 2>(1);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);

  const { user } = useContext(UserContext);
  const interSectRef = useRef(null);

  const getBannerList = async () => {
    try {
      const res = await APIGetBanner();
      console.log('banner', res);
      setBannerList(res);
    } catch (error) {
      console.log(error);
    }
  };

  const getArtistLikeList = async () => {
    const data = {
      page: 1,
    };
    try {
      if (history) {
        return setHistory(false);
      }
      const { list } = await APIArtistFollowingList(data);

      setFollowArtistList(list);


    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", resizeListener);
  }, [innerWidth]);


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
    const list = JSON.parse(sessionStorage.getItem('shop') ?? '');

    setFollowArtistList(list);
    setHistory(true);
    setPage(page);

    sessionStorage.removeItem('shop');
    sessionStorage.removeItem('page');
    sessionStorage.removeItem('type');
  };

  const saveHistory = (e: React.MouseEvent, name: string) => {
    const div = document.getElementById('root');
    if (div) {
      console.log(div.scrollHeight, globalThis.scrollY);
      const y = globalThis.scrollY;
      sessionStorage.setItem('shop', JSON.stringify(FollowArtistList));
      sessionStorage.setItem('y', String(y ?? 0));
      navigate(`/personalpage/${name}`);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, options);
    if (interSectRef.current) observer.observe(interSectRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    console.log(browserHistory.location);
    console.log(location);
    getBannerList();
  }, []);

  useLayoutEffect(() => {
    const scrollY = Number(sessionStorage.getItem('y'));
    if (FollowArtistList.length > 0 && scrollY) {
      console.log('불러옴', scrollY);
      setTimeout(() => {
        window.scrollTo({
          top: scrollY,
          behavior: 'auto',
        });
      }, 50);
      sessionStorage.removeItem('y');
    }
  }, [FollowArtistList]);

  useLayoutEffect(() => {
    const page = Number(sessionStorage.getItem('page'));

    if (page) {
      findHistory();
    } 
  }, [searchParams, category]);

  useEffect(() => {
    getArtistLikeList();
  }, []);
 
  const onSearch = () => {
    navigate(
      {
        pathname: '/shop',
        search: createSearchParams({
          keyword: keyword,
          category,
        }).toString(),
      },
      { replace: true }
    );
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
      <FollowTitle>Following Artist</FollowTitle>
        <CategorySelectButtonWrap
        onMouseDown={onDragStart}
        onMouseMove={onThrottleDragMove}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        ref={scrollRef}>
          <Swiper
            // install Swiper modules
            modules={[Navigation, Pagination, Scrollbar]}
            slidesPerView={innerWidth<=768? innerWidth/110:(innerWidth-100)/110}
            // spaceBetween={30}
            // pagination={{ clickable: true }}
            // onSwiper={(swiper) => console.log(swiper)}
            // onSlideChange={() => console.log('slide change')}
          >
            {FollowArtistList.map((item,index) => {
              return (
              <SwiperSlide key={index}>
                <FollowingListWrap onClick={()=>{navigate(`/MobileProfile/${item.idx}`);}}>
                  <ImageWrap>
                    <ProfileImage src={item.designer.image[0]?.file_name}/>
                  </ImageWrap>
                  <FollowingName>
                    {item?.designer.name}
                  </FollowingName>
                </FollowingListWrap>
              </SwiperSlide>
              );
            })}
          </Swiper>
        </CategorySelectButtonWrap>
      <ProductListWrap>
        {FollowArtistList.length > 0 &&
        FollowArtistList.map((item,index)=>{
          return(
            <></>
            // <FollowCard
            //   item={item.designer}
            //   key={item.idx}
            //   onClick={(e) => saveHistory(e, item.designer.name)}
            //   index={index}
            // />
          )
          })
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
  margin-top:34.76px;
`;

const FollowTitle = styled.div`
font-family:'Pretendard Variable';
  font-size:14px;
  font-weight: 410;
  text-align:start;
  margin:25px 20px;
  @media only screen and (max-width: 768px) {
    font-size:12px;
  }
`

const CategorySelectButtonWrap = styled.div`
  /* display:flex; */
  align-items: center;
  margin: 0px 5px;
  /* @media only screen and (max-width: 1024px) {
    display: none;
  } */
`;

const CategorySelectButton = styled.div<{ selected: boolean }>`
  background-color: ${(props) => (props.selected ? '#121212' : '#fff')};
  border : 1px solid ${(props) => (props.selected ? '#121212' : '#7a7a7a')};
  padding: 0 18px;
  margin-right: 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  cursor: pointer;
  @media only screen and (max-width: 1440px) {
    height: 27px;
  }
`;

const CategorySelectButtonText = styled.span<{ selected: boolean }>`
  color: ${(props) => (props.selected ? '#fff' : '#121212')};
  font-size: 12px;
  font-weight: 410;
  text-transform: capitalize;
`;
const FollowingListWrap = styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
`;
const TitleWrap = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin:20px 0%;
  @media only screen and (max-width: 768px) {
    display:none
  }
`;
const FollowingName = styled.span`
font-family:'Pretendard Variable';
  width:90%;
  font-size: 12px;
  font-weight: 410;
  margin-top:5px;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  @media only screen and (max-width: 768px) {
    font-size: 9px;
  }
`;
const ImageWrap = styled.div`
  width:80px;
  height:80px;
  aspect-ratio:1;
  border-radius:50%;
  cursor: pointer;

  @media only screen and (max-width: 768px) {
    width:70px;
    height:70px;
  }
`
const ProfileImage = styled.img`
  width:80px;
  height:100%;
  box-sizing:border-box;
  border:1px solid #e0e0e0;
  border-radius:50%;
  @media only screen and (max-width: 768px) {
    width:70px;
  }
`

export default Follow;
