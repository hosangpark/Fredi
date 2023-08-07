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
import { CategoryType, FairList, TImage, TProductListItem } from '../../types/Types';
import { UserContext } from '../../context/user';
import AlertModal from '../../components/Modal/AlertModal';
import { useLayoutEffect } from 'react';
import { createBrowserHistory } from 'history';
import { APILikeShop, APIShopList } from '../../api/ShopAPI';
import TopButton from '../../components/Product/TopButton';
import { removeHistory } from '../../components/Layout/Header';
import FairCard from '../../components/Shop/FairCard';
import { APICategoryList, APIFairList, APIProductList } from '../../api/ProductAPI';
import SearchBox from '../../components/Product/SearchBox';
import { CategoryList } from '../../components/List/List';
import Nodata from '../../components/Product/NoData';


function FairTab() {
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  const keywordParams = searchParams.get('keyword') ?? '';
  const categoryParams = (searchParams.get('category') as '1' | '2' | '3' | '4' | '5' | '6') ?? '1';
const { type, idx } = useParams();
  const [FairList, setFairList] = useState<FairList[]>([]);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [category, setCategory] = useState<'1' | '2' | '3' | '4' | '5' | '6'>(categoryParams);
  const [showLogin, setShowLogin] = useState(false);
  const [history, setHistory] = useState(false);
  const [keyword, setKeyword] = useState<string>(keywordParams);
  const [categoriList, setcategoriList] = useState<CategoryType[]>([]);
  const { user } = useContext(UserContext);
  const interSectRef = useRef(null);



  const getFairsList = async (page:number) => {
    const data = {
      page: page,
      category: '1',
      keyword: keyword? keyword : "",
    };
    try {
      if (history) {
        return setHistory(false);
      }
      const { list, total } = await APIFairList(data);
      setFairList(list);
      setTotal(total);
      if (page === 1) {
        setFairList((prev) => [...list]);
      } else {
        setFairList((prev) => [...prev, ...list]);
      }
      console.log('productproductproduct', list);
    } catch (error) {
      console.log(error);
    }
  };

  const findHistory = () => {
    const list = JSON.parse(sessionStorage.getItem('FairList') ?? '');
    const page = Number(sessionStorage.getItem('FairPage'));
    setFairList(list);
    setHistory(true);
    setPage(page);

    sessionStorage.removeItem('FairList');
    sessionStorage.removeItem('FairPage');
  };

  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    // console.log("innerWidth", innerWidth);
    window.addEventListener("resize", resizeListener);
  }, [innerWidth]);


  const saveHistory = (e: React.MouseEvent, idx: number) => {
    const div = document.getElementById('root');
    if (div) {
      const y = globalThis.scrollY;
      sessionStorage.setItem('FairList', JSON.stringify(FairList));
      sessionStorage.setItem('FairPage', String(page));
      sessionStorage.setItem('FairTab_y', String(y ?? 0));
      navigate(`/FairContent/${idx}`);
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

  useLayoutEffect(() => {
    const page = Number(sessionStorage.getItem('FairPage'));
    if (page) {
      findHistory();
    } else {
      setPage(1);
      getFairsList(1);
    }
  }, [searchParams]);

  useEffect(() => {
    if (page > 1) getFairsList(page);
  }, [page]);


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



  const onSearch = () => {
    createSearchParams({keyword:keyword})
    getFairsList(page)
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
          category={category}
          keyword={keyword}
          onChangeInput={(e) => setKeyword(e.target.value)}
          onChangeCategory={(value: string) => {
            // chageCategory(value);
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
        {FairList && FairList.length > 0 ?
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
        :
        <Nodata/>
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
        text="Available after Sign up."
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
  cursor:pointer;
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
