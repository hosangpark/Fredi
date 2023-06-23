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
import ShowTypeButton from '../../components/Shop/ShowTypeButton';
import SearchBox from '../../components/Product/SearchBox';
import ShopCard from '../../components/Shop/ShopCard';
import { APILikeShop, APIShopList } from '../../api/ShopAPI';
import TopButton from '../../components/Product/TopButton';
import { removeHistory } from '../../components/Layout/Header';
import FairCard from '../../components/Shop/FairCard';
import Fair from './Fair';
import Artwork from './Artwork';
import Artist from './Artist';

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

const CATEGORYLIST = [
  { value: '1', label: 'all' },
  { value: '2', label: 'furniture' },
  { value: '3', label: 'lighting' },
  { value: '4', label: 'fabric' },
  { value: '5', label: 'tableware' },
  { value: '6', label: 'art&objet' },
];

const content = [
    { 
      tab: "Fair",
      content:<Fair/>
    },
    {
      tab: "Artwork",
      content:<Artwork/>
    },
    {
      tab: "Artist",
      content:<Artist/>
    }
  ];
  const useTabs = (initialTabs:any, allTabs:any) => {
    const [contentIndex, setContentIndex] = useState(initialTabs);
    return {
      contentItem: allTabs[contentIndex],
      contentChange: setContentIndex
    };
  };


function MainTab() {
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
  const { contentItem, contentChange } = useTabs(0, content);

  const { user } = useContext(UserContext);
  const { classes } = useStyles();
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  const interSectRef = useRef(null);


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
      // const { list, total } = await APIShopList(data);
      // setTotal(total);
      if (page === 1) {
        // setShopList((prev) => [...list]);
      } else {
        // setShopList((prev) => [...prev, ...list]);
        setShopList([
          {
            idx: 1,
            category: 1,
            name: '일므',
            price: 1000,
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
              {
                idx: 11,
                file_name: ''
              }
            ],
            isLike: true,
          }
        ]);
      }
      // console.log('shop', list, page);
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

  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    if(innerWidth > 768){
      // console.log('cccccccc',contentItem)
      if(contentItem.tab ==='Fair'){
        navigate('/Fair')
      }else if(contentItem.tab ==='Artwork'){
        navigate('/Artwork') 
      }else if(contentItem.tab ==='Artist'){
        navigate('/Artist')
      }
    }
    // console.log("innerWidth", innerWidth);
    window.addEventListener("resize", resizeListener);
  }, [innerWidth]);


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
      console.log(div.scrollHeight, globalThis.scrollY);
      const y = globalThis.scrollY;
      sessionStorage.setItem('shop', JSON.stringify(shopList));
      sessionStorage.setItem('page', String(page));
      sessionStorage.setItem('type', String(showType));
      sessionStorage.setItem('y', String(y ?? 0));
      navigate(`/shopdetails/${idx}`);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, options);
    if (interSectRef.current) observer.observe(interSectRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);


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
    setShopList([
      {
        idx: 1,
        category: 1,
        name: '일므',
        price: 1000,
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
          {
            idx: 11,
            file_name: ''
          }
        ],
        isLike: true,
      }
    ]);
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
      <TitleWrap>
        <SearchBox
          onClickSearch={() => onSearch()}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSearch();
            }
          }}
          categoryList={CATEGORYLIST}
          category={category}
          keyword={keyword}
          onChangeInput={(e) => setKeyword(e.target.value)}
          onChangeCategory={(value: '1' | '2' | '3' | '4' | '5' | '6') => {
            chageCategory(value);
          }}
        />
      </TitleWrap>

      <div className="App">
        <TabButtonWrap>
        {content.map((section, index:number) => (
          <UnderLineTab onClick={() => {contentChange(index)}} color={section.tab == contentItem.tab? 'black':'#CCCCCC'}>
            {section.tab}
          </UnderLineTab>
          ))}
        </TabButtonWrap>
        {contentItem.content}
      </div>

    </Container>
  );
}

const Container = styled.div`
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

const TabButtonWrap = styled.div`
  width:100%;
  display:flex;
  margin-top:10px;
  border-bottom:1px solid #cccccc;
`;
const TabButton = styled.div`
  flex:1;
  font-size:17px;
  padding:15px 0;
`;

const UnderLineTab = styled(TabButton)<{underLine?: boolean}>`
  border-bottom: solid 1px ${(props) => props.color || "none"};
  font-weight: ${props => props.color == 'black' ? 600 : 300};
  font-family:'Pretendard Variable';
  padding:10px 0;
  @media only screen and (max-width: 768px) {
    font-size:14px;
  }
`

const TitleWrap = styled.div`
  display:none;
  justify-content:space-between;
  align-items:center;
  @media only screen and (max-width: 768px) {
    display:flex;
    margin: 0 30px;
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

export default MainTab;
