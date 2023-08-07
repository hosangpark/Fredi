import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Autoplay from 'embla-carousel-autoplay';
import leftButtonImage from '../../asset/image/home02.png';
import rightButtonImage from '../../asset/image/ico_next.png';
import snsImage from '../../asset/image/discover.svg';
import bookMarkImage from '../../asset/image/Bookoff.svg';
import { CategoryType, SnsList } from '../../types/Types';
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
import { APICategoryList, APIProductList, APISnsList } from '../../api/ProductAPI';

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
  const token = sessionStorage.getItem('token');
  let [searchParams, setSearchParams] = useSearchParams();
  const keywordParams = searchParams.get('keyword') ?? '';
  const [showLogin, setShowLogin] = useState(false);
  const [SnsList, setSnsList] = useState<SnsList[]>([]);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [category, setCategory] = useState<string>('1');
  const [history, setHistory] = useState(false);
  const [keyword, setKeyword] = useState<string>(keywordParams);
  const [categoriList, setcategoriList] = useState<CategoryType[]>([]);
  const interSectRef = useRef(null);

  const getproductList = async (page:number) => {
    const data = {
      page: page,
      category: category?category : '1',
      keyword: keyword? keyword : ''
    };
    console.log('category',category)
    try {
      if (history) {
        console.log('히스토리컷')
        return setHistory(false);
      }
      console.log('ddddddddddd불러옴')
      const { list, total } = await APISnsList(data);
      setTotal(total);
      // console.log('page',page)
      if(page > 1){
        setSnsList((prev) => [...prev, ...list]);
      } else {
        setSnsList(list);
      }
      // console.log('shop', list, page);
    } catch (error) {
      console.log(error);
    }
  };
  

  const findHistory = () => {
    const list = JSON.parse(sessionStorage.getItem('FeedTabList') ?? '');
    const categ = sessionStorage.getItem('FeedTabCategory');
    const page = Number(sessionStorage.getItem('FeedTabPage'));
    setHistory(true);
    if(categ){
      setCategory(categ)
    }
    setPage(page);
    setSnsList(list);
    sessionStorage.removeItem('FeedTabList');
    sessionStorage.removeItem('FeedTabCategory');
    sessionStorage.removeItem('FeedTabPage');
    sessionStorage.removeItem('FeedTabSave');
  };


  const saveHistory = (e: React.MouseEvent, idx: number, index:number) => {
    const div = document.getElementById('root');
    if (div) {
      const y = globalThis.scrollY;
      sessionStorage.setItem('FeedTabList', JSON.stringify(SnsList));
      sessionStorage.setItem('FeedTabCategory', category);
      sessionStorage.setItem('FeedTabPage', String(page));
      sessionStorage.setItem('FeedTabSave', 'Save');
      sessionStorage.setItem('y', String(y ?? 0));
      sessionStorage.setItem('SNSy', 'ScrollOnce');
      sessionStorage.setItem('removeSNSHistory', 'SnsFeed');
      navigate(`/personalpage/${idx}`,{state:{idx:idx,page:page,index:index}});
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
    const page = Number(sessionStorage.getItem('FeedTabPage'));
    if (page) {
      findHistory();
    } else {
      setPage(1);
      getproductList(1);
    }
  }, [searchParams,category]);
  

  useLayoutEffect(() => {
    const scrollY = Number(sessionStorage.getItem('y'));
    if (SnsList.length > 0 && scrollY) {
      setTimeout(() => {
        window.scrollTo({
          top: scrollY,
          behavior: 'auto',
        });
      }, 50);
      sessionStorage.removeItem('y');
    }
  }, [SnsList]);
 

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
          categoryList={categoriList}
          category={category}
          keyword={keyword}
          onChangeInput={(e) => setKeyword(e.target.value)}
          onChangeCategory={(value: string) => {
            setCategory(value);
          }}
        />
      </TitleWrap>
      <div className="App">
        <TabButtonWrap>
          <UnderLineTab color={'black'}>
            <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
            <TabImage src={snsImage}/></div>
          </UnderLineTab>
          <UnderLineTab onClick={() =>{
            if (!token) {
            setShowLogin(true);
          } else {navigate('/Community/FollowTab')
          }}}>
            Follow
          </UnderLineTab>
          <UnderLineTab onClick={() => {
            if (!token) {
            setShowLogin(true);
          } else {navigate('/Community/BookMarkTab')
          }}}>
            <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
            <TabImage src={bookMarkImage}/></div>
          </UnderLineTab>
        </TabButtonWrap>
        <Feed saveHistory={saveHistory} productList={SnsList} CategoryClick={e=>setCategory(e)} setShowLogin={()=>setShowLogin(true)} selectCategory={category}/>
      </div>
      <InterView ref={interSectRef}/>
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
    </Container>
  );
}

const Container = styled.div`
  flex:1;
`;
const InterView = styled.div`
  height: 150px;
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
  font-family:'Pretendard Variable';
  border-bottom: solid 1.7px ${(props) => props.color || "none"};
  font-weight: 310;
  color: #121212;
  font-size: 16px;
  padding:10px 0;
  margin-top:5px;
  cursor: pointer;
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
