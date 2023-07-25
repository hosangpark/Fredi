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
import { SnsList, TImage, TProductListItem } from '../../types/Types';
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
import { APIBookMarkLikeList } from '../../api/ProductAPI';



const TabImage = styled.img`
  width:25px;
  height:25px;
  object-fit:contain;
  @media only screen and (max-width:768px){
    width:20px;
    height:20px;
  }
`



function BookMarkTab() {
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  const keywordParams = searchParams.get('keyword') ?? '';
  const [BookMarkList, setBookMarkList] = useState<SnsList[]>([]);
  const [history, setHistory] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>(keywordParams);
  const interSectRef = useRef(null);
  
  const getproductList = async (page:number) => {
    // console.log('ccccccccccc',category)
    const data = {
      page: page,
      keyword: keyword? keyword : ''
    };
    try {
      if (history) {
        return setHistory(false);
      }
      const { list, total } = await APIBookMarkLikeList(data);
      setBookMarkList(list);
      setTotal(total)
      // console.log('shop', list, page);
    } catch (error) {
      console.log(error);
    }
  };
  

  const findHistory = () => {
    const list = JSON.parse(sessionStorage.getItem('BookMarkTabList') ?? '');
    const page = Number(sessionStorage.getItem('BookMarkPage'));

    // setBookMarkList(list)
    setHistory(true);
    setPage(page);
    
    sessionStorage.removeItem('BookMarkPage');
    sessionStorage.removeItem('BookMarkTabList');
    sessionStorage.removeItem('BookMarkTabSave');    
  };


  const saveHistory = (e: React.MouseEvent, idx: number) => {
    const div = document.getElementById('root');
    if (div) {
      const y = globalThis.scrollY;
      sessionStorage.setItem('BookMarkTabList', JSON.stringify(BookMarkList));
      sessionStorage.setItem('BookMarkPage', String(page));
      sessionStorage.setItem('BookMarkTabSave', 'Save');
      sessionStorage.setItem('y', String(y ?? 0));
      navigate(`/personalpage/${idx}`,{state:idx});
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
    if (page > 1) getproductList(page);
  }, [page]);

  useLayoutEffect(() => {
  const Save = sessionStorage.getItem('BookMarkTabSave');
    if (Save) {
      findHistory();
    } else {
      getproductList(1)
    }
  }, [searchParams]);


  useLayoutEffect(() => {
    const scrollY = Number(sessionStorage.getItem('y'));
    if (BookMarkList.length > 0 && scrollY) {
      console.log('불러옴', scrollY);
      setTimeout(() => {
        window.scrollTo({
          top: scrollY,
          behavior: 'auto',
        });
      }, 50);
      sessionStorage.removeItem('y');
    }
  }, [BookMarkList]);
 
  const onSearch = () => {
    createSearchParams({keyword:keyword})
    getproductList(1)
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
          category={'1'}
          keyword={keyword}
          onChangeInput={(e) => setKeyword(e.target.value)}
          onChangeCategory={(value: string) => {
            // chageCategory(value);
          }}
        />
      </TitleWrap>
      <div className="App">
        <TabButtonWrap>
          <UnderLineTab onClick={() => {navigate('/Community/FeedTab')}}>
            <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
            <TabImage src={snsImage}/></div>
          </UnderLineTab>
          <UnderLineTab onClick={() => {navigate('/Community/FollowTab')}}>
            Follow
          </UnderLineTab>
          <UnderLineTab color={'black'}>
            <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
            <TabImage src={bookMarkImage}/></div>
          </UnderLineTab>
        </TabButtonWrap>
        <BookMark saveHistory={saveHistory} productList={BookMarkList}/>
      </div>
    </Container>
  );
}

const Container = styled.div`
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


export default BookMarkTab;
