import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { createSearchParams, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Autoplay from 'embla-carousel-autoplay';
import leftButtonImage from '../../asset/image/ico_prev.png';
import rightButtonImage from '../../asset/image/ico_next.png';
import leftButtonMobileImage from '../../asset/image/ico_prev_mobile.png';
import rightButtonMobileImage from '../../asset/image/ico_next_mobile.png';
import { createStyles, Image } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { APIGetBanner } from '../../api/SettingAPI';
import { FairList, TImage, TProductListItem } from '../../types/Types';
import { UserContext } from '../../context/user';
import AlertModal from '../../components/Modal/AlertModal';
import { useLayoutEffect } from 'react';
import { createBrowserHistory } from 'history';
import { APILikeShop, APIShopList } from '../../api/ShopAPI';
import TopButton from '../../components/Product/TopButton';
import { removeHistory } from '../../components/Layout/Header';
import FairCard from '../../components/Shop/FairCard';
import { APIFairList, APIProductList } from '../../api/ProductAPI';
import SearchBox from '../../components/Product/SearchBox';
import { CategoryList } from '../../components/List/List';


function FairTab() {
  const navigate = useNavigate();
  const browserHistory = createBrowserHistory();
  const location = useLocation();
  let [searchParams, setSearchParams] = useSearchParams();
  const keywordParams = searchParams.get('keyword') ?? '';
  const categoryParams = (searchParams.get('category') as '1' | '2' | '3' | '4' | '5' | '6') ?? '1';
const { type, idx } = useParams();
  const [FairList, setFairList] = useState<FairList[]>([]);
  const [page, setPage] = useState<number>(1);
  const [category, setCategory] = useState<'1' | '2' | '3' | '4' | '5' | '6'>(categoryParams);
  const [showLogin, setShowLogin] = useState(false);
  const [bannerList, setBannerList] = useState<TImage[]>([]);
  const [bannerListMobile, setBannerListMobile] = useState<TImage[]>([]);
  const [history, setHistory] = useState(false);
  const [keyword, setKeyword] = useState<string>(keywordParams);

  const { user } = useContext(UserContext);
  const interSectRef = useRef(null);



    const getFairsList = async () => {
    const data = {
      page: 1,
      category: '',
      keyword: '',
    };
    try {
      const { list, total } = await APIFairList(data);
      setFairList(list);
      console.log('productproductproduct', list);
    } catch (error) {
      console.log(error);
    }
  };



  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    // console.log("innerWidth", innerWidth);
    window.addEventListener("resize", resizeListener);
  }, [innerWidth]);

  

  // const findHistory = () => {
  //   const list = JSON.parse(sessionStorage.getItem('shop') ?? '');
  //   const page = Number(sessionStorage.getItem('page'));
  //   const type = (Number(sessionStorage.getItem('type')) as 1 | 2) ?? 1;

  //   setFairList(list);
  //   setHistory(true);
  //   setPage(page);
  //   setShowType(type);

  //   sessionStorage.removeItem('shop');
  //   sessionStorage.removeItem('page');
  //   sessionStorage.removeItem('type');
  // };
  

  const saveHistory = (e: React.MouseEvent, idx: number) => {
    const div = document.getElementById('root');
    if (div) {
      // console.log(div.scrollHeight, globalThis.scrollY);
      const y = globalThis.scrollY;
      sessionStorage.setItem('FairTab_y', String(y ?? 0));
      sessionStorage.setItem('FairList', JSON.stringify(FairList));
      // sessionStorage.setItem('page', String(page));
      // sessionStorage.setItem('type', String(showType));
      // navigate(`/shopdetails/${idx}`);
      navigate(`/FairContent/${idx}`);
    }
  };


  useLayoutEffect(() => {
    const scrollY = Number(sessionStorage.getItem('FairTab_y'));
    if (FairList.length > 0 && scrollY) {
      console.log('불러옴', scrollY);
      setTimeout(() => {
        window.scrollTo({
          top: scrollY,
          behavior: 'auto',
        });
      }, 50);
      sessionStorage.removeItem('FairTab_y');
    }
  }, [FairList]);

  
  useEffect(() => {
    getFairsList()
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
      <TabBox>
        <TabContents On={true}>
          Fair
        </TabContents>
        <TabContents onClick={()=>navigate('/MainTab/ArtworkTab')}>
          Artwork
        </TabContents>
        <TabContents onClick={()=>navigate('/MainTab/ArtistTab')}>
          Artist
        </TabContents>
      </TabBox>
      <ProductListWrap>
        {FairList.length > 0 &&
        FairList.map((item,index)=>{
          return(
            <FairCard
              item={item}
              key={item.idx}
              onClick={(e) => saveHistory(e, item.idx)}
              index={index}
            />
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
  width:100%;
`;

const ProductListWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 30px;
`;

const InterView = styled.div`

`;

const TitleWrap = styled.div`
  display:none;
  justify-content:space-between;
  align-items:center;
  @media only screen and (max-width: 768px) {
    display:flex;
    margin: 0 20px;
  }
`;

const TabBox = styled.div`
  width:100%;
  display:flex;
  border-bottom:1.7px solid rgb(204,204,204);
`
const TabContents = styled.div<{On?:boolean}>`
  display:none;
  font-family:'Pretendard Variable';
  border-bottom:${props => props.On? 1.7:0}px solid black;
  font-weight:${props => props.On? 460 : 360};
  color:rgb(0,0,0);
  padding:10px 0;
  margin-top:5px;
  font-size:18px;
  flex: 1 1 0%;
  @media only screen and (max-width: 768px) {
    font-size:14px;
    display:block;
  }
`


export default FairTab;
