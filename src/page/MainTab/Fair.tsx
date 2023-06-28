import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
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
import { TImage } from '../admin/ProducerList';
import { UserContext } from '../../context/user';
import AlertModal from '../../components/Modal/AlertModal';
import { useLayoutEffect } from 'react';
import { createBrowserHistory } from 'history';
import { APILikeShop, APIShopList } from '../../api/ShopAPI';
import TopButton from '../../components/Product/TopButton';
import { removeHistory } from '../../components/Layout/Header';
import FairCard from '../../components/Shop/FairCard';

export type FairListItem = {
  idx: number;
  category: 1 | 2 | 3 | 4 | 5 | 6;
  name: string;
  price: number;
  size: string;
  weight: string;
  country: string;
  description: string;
  designer: string;
  sns: string;
  email: string;
  website: string;
  created_time: string;
  like_count: number;
  image: TImage[];
  isLike: boolean;
};

const useStyles = createStyles((theme, _params, getRef) => ({
  carousel: {},

  carouselControls: {
    ref: getRef('carouselControls'),
    padding: '0px 50px',
    boxShadow: 'unset',
    '@media (max-width: 768px)': { padding: '0 18px' },
  },
  carouselControl: {
    ref: getRef('carouselControl'),
    boxShadow: 'none',
    outline: 0,
  },

  carouselIndicator: {
    width: 8,
    height: 8,
    transition: 'width 250ms ease',
    borderRadius: '100%',
    backgroundColor: '#121212',
    opacity: 0.4,
    '&[data-active]': {
      width: 8,
      borderRadius: '100%',
    },
    '@media (max-width: 768px)': {
      '&[data-active]': {
        width: 4,
        borderRadius: '100%',
      },
      width: 4,
      height: 4,
    },
  },

  carouselImages: {
    width: '100%',
    maxHeight: 700,
  },
}));


function Fair() {
  const navigate = useNavigate();
  const browserHistory = createBrowserHistory();
  const location = useLocation();
  let [searchParams, setSearchParams] = useSearchParams();
  const keywordParams = searchParams.get('keyword') ?? '';
  const categoryParams = (searchParams.get('category') as '1' | '2' | '3' | '4' | '5' | '6') ?? '1';

  const [shopList, setShopList] = useState<FairListItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [category, setCategory] = useState<'1' | '2' | '3' | '4' | '5' | '6'>(categoryParams);
  const [showLogin, setShowLogin] = useState(false);
  const [bannerList, setBannerList] = useState<TImage[]>([]);
  const [history, setHistory] = useState(false);
  const [keyword, setKeyword] = useState<string>(keywordParams);
  const [showType, setShowType] = useState<1 | 2>(1);

  const { user } = useContext(UserContext);
  const { classes } = useStyles();
  const autoplay = useRef(Autoplay({ delay: 5000 }));
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

  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    if(innerWidth < 768){
      navigate('/MainTab')
    }
    // console.log("innerWidth", innerWidth);
    window.addEventListener("resize", resizeListener);
  }, [innerWidth]);

  const getShopList = async (page: number) => {
    const data = {
      page: page,
      category: category,
      keyword: keywordParams,
    };
    try {
      if (history) {
        return setHistory(false);
      }
      const { list, total } = await APIShopList(data);
      setTotal(total);
      if (page === 1) {
        // setShopList((prev) => [...list]);
      } else {
        // setShopList((prev) => [...prev, ...list]);
        // setShopList([
        //   {
        //     idx: 1,
        //     category: 1,
        //     name: '일름이름이름',
        //     price: 1000,
        //     size: '사이즈',
        //     weight: '무게',
        //     country: '지역,위치',
        //     description: '설명',
        //     designer: '디자이너',
        //     sns: 'SNS',
        //     email: "email",
        //     website: "website",
        //     created_time: Date(),
        //     like_count: 11,
        //     image: [
        //       {
        //         idx: 11,
        //         file_name: ''
        //       }
        //     ],
        //     isLike: true,
        //   },
        //   {
        //     idx: 2,
        //     category: 2,
        //     name: '이이이이이이잉',
        //     price: 2000,
        //     size: '사이즈',
        //     weight: '무게',
        //     country: '지역,위치',
        //     description: '설명',
        //     designer: '디자이너',
        //     sns: 'SNS',
        //     email: "email",
        //     website: "website",
        //     created_time: Date(),
        //     like_count: 11,
        //     image: [
        //       {
        //         idx: 11,
        //         file_name: ''
        //       }
        //     ],
        //     isLike: true,
        //   }
        // ]);
      }
      console.log('shop', list, page);
    } catch (error) {
      console.log(error);
    }
  };

  const onLikeShop = async (idx: number) => {
    const data = {
      idx: idx,
    };
    try {
      const res = await APILikeShop(data);
      console.log(res);
      const newList = shopList.map((item) => (item.idx === idx ? { ...item, isLike: !item.isLike, like_count: res.likeCount } : { ...item }));
      setShopList(newList);
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

  const findHistory = () => {
    const list = JSON.parse(sessionStorage.getItem('shop') ?? '');
    const page = Number(sessionStorage.getItem('page'));
    const type = (Number(sessionStorage.getItem('type')) as 1 | 2) ?? 1;

    setShopList(list);
    setHistory(true);
    setPage(page);
    setShowType(type);

    sessionStorage.removeItem('shop');
    sessionStorage.removeItem('page');
    sessionStorage.removeItem('type');
  };
  

  const saveHistory = (e: React.MouseEvent, idx: number) => {
    const div = document.getElementById('root');
    if (div) {
      // console.log(div.scrollHeight, globalThis.scrollY);
      // const y = globalThis.scrollY;
      // sessionStorage.setItem('shop', JSON.stringify(shopList));
      // sessionStorage.setItem('page', String(page));
      // sessionStorage.setItem('type', String(showType));
      // sessionStorage.setItem('y', String(y ?? 0));
      // navigate(`/shopdetails/${idx}`);
      navigate(`/FairContent/${idx}`);
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
    if (shopList.length > 0 && scrollY) {
      console.log('불러옴', scrollY);
      setTimeout(() => {
        window.scrollTo({
          top: scrollY,
          behavior: 'auto',
        });
      }, 50);
      sessionStorage.removeItem('y');
    }
  }, [shopList]);

  useLayoutEffect(() => {
    const page = Number(sessionStorage.getItem('page'));

    if (page) {
      findHistory();
    } else {
      setPage(1);
      getShopList(1);
    }
  }, [searchParams, category]);
  

  useEffect(() => {
    if (page > 1) getShopList(page);
  }, [page]);
  useEffect(() => {
    if(bannerList){
      setShopList([
        {
          idx: 1,
          category: 1,
          name: 'Salone del Mobile 2023',
          designer: 'April 17-23',
          price: 1000,
          size: '사이즈',
          weight: '무게',
          country: '지역,위치',
          description: '설명',
          sns: 'SNS',
          email: "email",
          website: "website",
          created_time: Date(),
          like_count: 11,
          image: [
            bannerList[0]
          ],
          isLike: true,
        },
        {
          idx: 2,
          category: 2,
          name: 'Salone del Mobile 2023',
          designer: 'April 17-23',
          price: 2000,
          size: '사이즈',
          weight: '무게',
          country: '지역,위치',
          description: '설명',
          sns: 'SNS',
          email: "email",
          website: "website",
          created_time: Date(),
          like_count: 11,
          image: [
            bannerList[1]
          ],
          isLike: true,
        },
        {
          idx: 3,
          category: 2,
          name: 'Salone del Mobile 2023',
          designer: 'April 17-23',
          price: 2000,
          size: '사이즈',
          weight: '무게',
          country: '지역,위치',
          description: '설명',
          sns: 'SNS',
          email: "email",
          website: "website",
          created_time: Date(),
          like_count: 11,
          image: [
            bannerList[2]
          ],
          isLike: true,
        },
        {
          idx: 4,
          category: 2,
          name: '이이이이이이잉',
          price: 2000,
          size: '사이즈',
          weight: '무게',
          country: '지역,위치',
          description: '설명',
          designer: '디자이너',
          sns: 'SNS',
          email: "email",
          website: "website",
          created_time: Date(),
          like_count: 11,
          image: [
            bannerList[3]
          ],
          isLike: true,
        },
      ]);
    }
  }, [bannerList]);

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

  const chageCategory = (value: '1' | '2' | '3' | '4' | '5' | '6') => {
    setCategory(value);
    setSearchParams({
      keyword,
      category: value,
    });
  };

  const slides = bannerList.map((item) => (
    <Carousel.Slide key={item.idx}>
      <Image src={item.file_name} className={classes.carouselImages} />
    </Carousel.Slide>
  ));

  return (
    <Container>
      {/* <CarouselWrap>
        {bannerList.length > 0 && (
          <Carousel
            plugins={[autoplay.current]}
            withIndicators
            nextControlIcon={<ControlImage src={rightButtonImage} />}
            previousControlIcon={<ControlImage src={leftButtonImage} />}
            loop
            styles={{
              root: { maxHeight: 700 },
              control: { background: 'transparent', width: 45, border: 0, '@media (max-width: 768px)': { width: 25 } },
            }}
            classNames={{
              root: classes.carousel,
              controls: classes.carouselControls,
              indicator: classes.carouselIndicator,
              control: classes.carouselControl,
            }}
          >
            {slides}
          </Carousel>
        )}
      </CarouselWrap> */}
      
      {/* <ShowTypeButton onClickType1={() => setShowType(1)} onClickType2={() => setShowType(2)} /> */}
      <ProductListWrap>
        {/* <div onClick={()=>console.log(shopList)}> ddddddddddddddd</div> */}
        {shopList.length > 0 &&
        shopList.map((item,index)=>{
          return(
            <FairCard
              item={item}
              key={item.idx}
              onClick={(e) => saveHistory(e, item.idx)}
              onClickLike={(e) => {
                if (user.idx) {
                  e.stopPropagation();
                  onLikeShop(item.idx);
                } else {
                  e.stopPropagation();
                  setShowLogin(true);
                }
              }}
              index={0}
              showType={showType}
            />
          )
        })
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
  margin-top:5px;
`;

const ProductListWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 30px;
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

`;

const TitleWrap = styled.div`
  display:none;
  justify-content:space-between;
  align-items:center;
  @media only screen and (max-width: 768px) {
    display:flex;
  }
`;
const TitleText = styled.span`
  font-size: 20px;
  font-weight: 500;
  text-transform: capitalize;
  @media only screen and (max-width: 768px) {
    display:none
  }
`;

export default Fair;
