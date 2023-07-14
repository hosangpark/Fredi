import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Autoplay from 'embla-carousel-autoplay';
import leftButtonImage from '../../asset/image/home02.png';
import rightButtonImage from '../../asset/image/ico_next.png';
import snsImage from '../../asset/image/snsicon.png';
import bookMarkImage from '../../asset/image/Bookoff.svg';
import { createStyles, Image } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { APIGetBanner } from '../../api/SettingAPI';
import { TImage, TProductListItem } from '../../types/Types';
import { UserContext } from '../../context/user';
import AlertModal from '../../components/Modal/AlertModal';
import { useLayoutEffect } from 'react';
import { createBrowserHistory } from 'history';
import ShowTypeButton from '../../components/Shop/ShowTypeButton';
import SearchBox from '../../components/Product/SearchBox';
import { APILikeShop, } from '../../api/ShopAPI';
import TopButton from '../../components/Product/TopButton';
import { removeHistory } from '../../components/Layout/Header';
import FairCard from '../../components/Shop/FairCard';
import Follow from './Follow';
import Feed from './Feed';
import BookMark from './BookMark';
import { FairListItem } from '../../types/Types';
import { CategoryList } from '../../components/List/List';
import { APIProductList } from '../../api/ProductAPI';

const TabImage = styled.img`
  width:25px;
  height:25px;
  object-fit:contain;
  @media only screen and (max-width:768px){
    width:20px;
    height:20px;
  }
`



function FeedTab() {
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
      const { list, total } = await APIProductList(data);
      setTotal(total);
      if (page === 1) {
        setShopList((prev) => [...list]);
      } 
      console.log('shop', list, page);
    } catch (error) {
      console.log(error);
    }
  };
  const findHistory = () => {
    // const list = JSON.parse(sessionStorage.getItem('shop') ?? '');
    const page = Number(sessionStorage.getItem('page'));
    const type = (Number(sessionStorage.getItem('type')) as 1 | 2) ?? 1;

    // setShopList(list);
    setHistory(true);
    setPage(page);
    setShowType(type);

    sessionStorage.removeItem('shop');
    sessionStorage.removeItem('page');
    sessionStorage.removeItem('type');
  };

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

  useEffect(()=>{
    getShopList(1)
  },[])

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
          categoryList={CategoryList}
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
          <UnderLineTab color={'black'}>
            <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
            <TabImage src={snsImage}/></div>
          </UnderLineTab>
          <UnderLineTab onClick={() => {navigate('/Community/FollowTab')}}>
            Follow
          </UnderLineTab>
          <UnderLineTab onClick={() => {navigate('/Community/BookMarkTab')}}>
            <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
            <TabImage src={bookMarkImage}/></div>
          </UnderLineTab>
        </TabButtonWrap>
        <Feed productList={shopList}/>
      </div>

    </Container>
  );
}

const Container = styled.div`
  flex:1;
`;

const TabButtonWrap = styled.div`
  width:400px;
  display:flex;
  border-bottom:1px solid #cccccc;
  margin:50px;
  @media only screen and (max-width: 990.99px) {
    margin:0;
    width:100%;
  }
`;
const TabButton = styled.div`
  flex:1;
  font-size:17px;
  font-weight: 410;
  padding:15px 0;
`;

const UnderLineTab = styled(TabButton)<{underLine?: boolean}>`
  border-bottom: solid 1.7px ${(props) => props.color || "none"};
  font-weight: ${props => props.color == 'black' ? 460 : 360};
  color:#000000;
  font-family:'Pretendard Variable';
  padding:10px 0;
  margin-top:5px;
  cursor: pointer;
  font-size:18px;
  @media only screen and (max-width: 768px) {
    font-size:14px;
  }
`

const TitleWrap = styled.div`
  display:none;
  justify-content:space-between;
  align-items:center;
  margin: 0 30px;
  @media only screen and (max-width: 768px) {
    display:flex;
    margin: 0 20px;
  }
`;


export default FeedTab;
