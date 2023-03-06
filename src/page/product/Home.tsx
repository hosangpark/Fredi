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
import { TProductListItem } from '../admin/ProductList';
import { APIGetBanner } from '../../api/SettingAPI';
import { TImage } from '../admin/ProducerList';
import { UserContext } from '../../context/user';
import AlertModal from '../../components/Modal/AlertModal';
import { useLayoutEffect } from 'react';
import ShowTypeButton from '../../components/Shop/ShowTypeButton';
import ProductCard from '../../components/Product/ProductCard';
import SearchBox from '../../components/Product/SearchBox';
import TopButton from '../../components/Product/TopButton';
import { removeHistory } from '../../components/Layout/Header';


const useStyles = createStyles((theme, _params, getRef) => ({
  carousel: {
    width: '100%',
    // height: '100%',
    // aspectRatio: '1/1',
},

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

const CATEGORYLIST = [
  { value: '1', label: 'all' },
  { value: '2', label: 'furniture' },
  { value: '3', label: 'lighting' },
  { value: '4', label: 'fabric' },
  { value: '5', label: 'tableware' },
  { value: '6', label: 'art&objet' },
];

function Home() {
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  const keywordParams = searchParams.get('keyword') ?? '';
  const categoryParams = (searchParams.get('category') as '1' | '2' | '3' | '4' | '5' | '6') ?? '1';
  const [productList, setProductList] = useState<TProductListItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [category, setCategory] = useState<'1' | '2' | '3' | '4' | '5' | '6'>(categoryParams);
  const [showLogin, setShowLogin] = useState(false);
  const [bannerList, setBannerList] = useState<TImage[]>([]);
  const [bannerListMobile, setBannerListMobile] = useState<TImage[]>([]);
  const [history, setHistory] = useState(false);
  const [keyword, setKeyword] = useState<string>(keywordParams);
  const [showType, setShowType] = useState<1 | 2>(1);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);

  const { user } = useContext(UserContext);
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  const { classes } = useStyles();
  const interSectRef = useRef(null);

  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    if(innerWidth > 768){
      console.log('big');
    } else {
      console.log('s');
    }
    // console.log("innerWidth", innerWidth);
    window.addEventListener("resize", resizeListener);
  }, [innerWidth]);
  // console.log("innerWidth", innerWidth);

  const getBannerList = async () => {
    var array1 = new Array(); //pc
    var array2 = new Array(); //mobile
    try {
      const res = await APIGetBanner();
      console.log('banner@@@@@@@@', res);
      res.forEach((list:any) => {
        if(list.type === 'P'){
          array1.push(list);
        } else {
          array2.push(list);
        }
      });
      console.log(array1, array2);
      setBannerList(array1);
      setBannerListMobile(array2);
    } catch (error) {
      console.log('Banner', error);
    }
  };

  const getProductList = async (page: number) => {
    const data = {
      page: page,
      category: category,
      keyword: keywordParams,
    };
    try {
      if (history) {
        return setHistory(false);
      }
      const { list, total } = await APIProductList(data);
      setTotal(total);
      if (page === 1) {
        setProductList((prev) => [...list]);
      } else {
        setProductList((prev) => [...prev, ...list]);
      }
      console.log('product', list, page);
    } catch (error) {
      console.log(error);
    }
  };

  const onLikeProduct = async (idx: number) => {
    const data = {
      product_idx: idx,
    };
    try {
      const res = await APILikeProduct(data);
      console.log(res);
      const newList = productList.map((item) => (item.idx === idx ? { ...item, isLike: !item.isLike, like_count: res.likeCount } : { ...item }));
      setProductList(newList);
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
    const list = JSON.parse(sessionStorage.getItem('products') ?? '');
    const page = Number(sessionStorage.getItem('page'));
    const type = (Number(sessionStorage.getItem('type')) as 1 | 2) ?? 1;
    setProductList(list);
    setHistory(true);
    setPage(page);
    setShowType(type);

    sessionStorage.removeItem('products');
    sessionStorage.removeItem('page');
    sessionStorage.removeItem('type');
  };

  const saveHistory = (e: React.MouseEvent, idx: number) => {
    const y = globalThis.scrollY;
    sessionStorage.setItem('products', JSON.stringify(productList));
    sessionStorage.setItem('page', String(page));
    sessionStorage.setItem('type', String(showType));
    sessionStorage.setItem('y', String(y ?? 0));
    navigate(`/productdetails/${idx}`);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, options);
    if (interSectRef.current) observer.observe(interSectRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    getBannerList();
  }, []);

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
    const page = Number(sessionStorage.getItem('page'));
    console.log('카테고리', category);
    if (page) {
      findHistory();
    } else {
      setPage(1);
      getProductList(1);
    }
  }, [searchParams, category]);

  useEffect(() => {
    if (page > 1) getProductList(page);
  }, [page]);

  const onSearch = () => {
    navigate(
      {
        pathname: '/',
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

  const slides = bannerList.map((item:any) => {
    console.log('item', item);
    return(
      <Carousel.Slide key={item.idx}>
      <a href={item?.link}>
        <SlideImage src={item.file_name} className={classes.carouselImages} />
      </a>
    </Carousel.Slide>
    );
  });

  const slidesMobile = bannerListMobile.map((item:any) => {
    console.log('item', item);
    return(
      <Carousel.Slide key={item.idx}>
      <a href={item?.link}>
        <SlideImage src={item.file_name} className={classes.carouselImages} />
      </a>
    </Carousel.Slide>
    );
  });

  return (
    <Container id="productContainer">
      <CarouselWrap>
        {innerWidth > 768 && bannerList.length > 0 && (
          <Carousel
            plugins={[autoplay.current]}
            withIndicators
            loop
            withKeyboardEvents={false}
            nextControlIcon={<ControlImage src={rightButtonImage} />}
            previousControlIcon={<ControlImage src={leftButtonImage} />}
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
        {innerWidth <= 768 && bannerListMobile.length > 0 && (
          <Carousel
            plugins={[autoplay.current]}
            withIndicators
            loop
            withKeyboardEvents={false}
            nextControlIcon={<ControlImage src={rightButtonImage} />}
            previousControlIcon={<ControlImage src={leftButtonImage} />}
            styles={{
              root: { maxHeight: 700, aspectRatio: '1/1' },
              control: { background: 'transparent', width: 45, border: 0, aspectRatio: '1/1'},
            }}
            classNames={{
              root: classes.carousel,
              controls: classes.carouselControls,
              indicator: classes.carouselIndicator,
              control: classes.carouselControl,
            }}
            className="casual"
          >
            {slidesMobile}
          </Carousel>
        )}
      </CarouselWrap>
      <SearchBox
        onClickSearch={onSearch}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSearch();
          }
        }}
        onClickFilter={(item) => {
          chageCategory(item.value as '1' | '2' | '3' | '4' | '5' | '6');
        }}
        categoryList={CATEGORYLIST}
        category={category}
        keyword={keyword}
        onChangeInput={(e) => setKeyword(e.target.value)}
        onChangeCategory={(value: '1' | '2' | '3' | '4' | '5' | '6') => {
          chageCategory(value as '1' | '2' | '3' | '4' | '5' | '6');
        }}
      />
      {/* <ShowTypeButton onClickType1={() => setShowType(1)} onClickType2={() => setShowType(2)} /> */}
      <ProductListWrap>
        {productList.map((item, index) => (
          <ProductCard
            item={item}
            key={item.idx}
            index={index}
            onClick={(e) => saveHistory(e, item.idx)}
            onClickLike={(e) => {
              if (user.idx) {
                e.stopPropagation();
                onLikeProduct(item.idx);
              } else {
                e.stopPropagation();
                setShowLogin(true);
              }
            }}
            showType={showType}
          />
        ))}
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
  @media only screen and (max-width: 769px) {
    aspect-ratio: 4697/1737;
  }
  @media only screen and (max-width: 768px) {
    aspect-ratio: 1/1;
    // height: 100%;
  }
`;
const MobileCarouselWrap = styled.div`
  display: none;
  max-height: 700px;
  position: relative;
  @media only screen and (max-width: 991px) {
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

const SlideImage = styled.img`
  vertical-align: middle;
  @media only screen and (max-width: 768px) {
    aspect-ratio: 1/1;
  }
`;

export default Home;
