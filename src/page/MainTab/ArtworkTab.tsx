import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { APILikeProduct, APIProductList } from '../../api/ProductAPI';
import Artwork from './Artwork';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ArtworkListItem } from '../../types/Types';
import { UserContext } from '../../context/user';
import { useLayoutEffect } from 'react';
import { createBrowserHistory } from 'history';
import SearchBox from '../../components/Product/SearchBox';import AlertModal from '../../components/Modal/AlertModal';
;


function ArtworkTab() {
  const navigate = useNavigate();
  const browserHistory = createBrowserHistory();
  const location = useLocation();
  const [productList, setProductList] = useState<ArtworkListItem[]>([]);
  let [searchParams, setSearchParams] = useSearchParams();
  const keywordParams = searchParams.get('keyword') ?? '';
  const pathName = location.pathname.split('/')[1];
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [category, setCategory] = useState<string>('1');
  const [history, setHistory] = useState(false);
  const [keyword, setKeyword] = useState<string>(keywordParams);
  const [alertType, setAlertType] = useState<string>('')
  const [ShowAlertModal, setShowAlertModal] = useState(false);
  const [ViewPoint, setViewPoint] = useState(false);
  const interSectRef = useRef(null);

  const { user } = useContext(UserContext);



  const getproductList = async (page:number) => {
    const data = {
      page: page,
      category: category? category : 1,
      keyword:keyword? keyword : ""
    };
    try {
      if (history) {
        return setHistory(false);
      }
      const { list, total } = await APIProductList(data);
      setTotal(total);
      if(page > 1){
        setProductList((prev) => [...prev, ...list]);
      } else {
        setProductList(list);
      }
      // console.log('shop', list, page);
    } catch (error) {
      console.log(error);
    }
  };

 const onLikeProduct = async (idx: number) => {
    const data = {
      artwork_idx: idx,
    };
    try {
      const res = await APILikeProduct(data);
      if(res.message == '좋아요 완료'){
        setAlertType('Liked')
      } else {
        setAlertType('unLiked')
      }
      setShowAlertModal(true)
      const newList = productList.map((item) => (item.idx === idx ? { ...item, isLike: !item.isLike, like_count: res.likeCount } : { ...item }));
      setProductList(newList);
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

  const findHistory = () => {
    const list = JSON.parse(sessionStorage.getItem('ArtworkTabList') ?? '');
    const categ = sessionStorage.getItem('ArtworkTabCategory');
    const page = Number(sessionStorage.getItem('ArtworkPage'));
    console.log('cccccccccccc',categ)
    setHistory(true);
    if(categ){
      setCategory(categ)
    }
    setPage(page);
    setProductList(list);
    sessionStorage.removeItem('ArtworkPage');
    sessionStorage.removeItem('ArtworkTabCategory');
    sessionStorage.removeItem('ArtworkTabList');
  };

  
  const saveHistory = (e: React.MouseEvent, idx: number) => {
    const div = document.getElementById('root');
    if (div) {
      const y = globalThis.scrollY;
      sessionStorage.setItem('ArtworkTabList', JSON.stringify(productList));
      sessionStorage.setItem('ArtworkPage', String(page));
      sessionStorage.setItem('ArtworkTabCategory', category);
      sessionStorage.setItem('y', String(y ?? 0));
      navigate(`/productdetails/${idx}`);
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

  useEffect(() => {
    if(productList.length>0){
      setViewPoint(true)
    }
  }, [productList]);

  useLayoutEffect(() => {
    const page = Number(sessionStorage.getItem('ArtworkPage'));
    console.log('paa',page)
    if (page) {
      findHistory();
    } else {
      setPage(1);
      getproductList(1);
    }
  }, [searchParams,category]);


  useEffect(() => {
    const scrollY = Number(sessionStorage.getItem('y'));
    if (productList.length > 0 && scrollY) {
      window.scrollTo({
        top: scrollY,
        behavior: 'auto',
      });
      sessionStorage.removeItem('y');
    }
  }, [productList]);
  

  const onSearch = () => {
    createSearchParams({keyword:keyword})
    getproductList(1)
  };


  return (
  <Container>
    <TitleWrap>
      <TitleText>
        Artworks
      </TitleText>
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
          setCategory(value);
        }}
      />
    </TitleWrap>
      <TabBox>
        <TabContents onClick={()=>navigate('/MainTab/FairTab')}>
          Fair
        </TabContents>
        <TabContents On={true}>
          Artwork
        </TabContents>
        <TabContents onClick={()=>navigate('/MainTab/ArtistTab')}>
          Artist
        </TabContents>
      </TabBox>
    <Artwork saveHistory={saveHistory} productList={productList} onLikeProduct={onLikeProduct} CategoryClick={e=>setCategory(e)}
    selectCategory={category}/>
    <InterView ref={interSectRef} />
    <AlertModal
      visible={ShowAlertModal}
      setVisible={setShowAlertModal}
      onClick={() => {
        if(
          alertType == 'Available after Sign up.'
        ){
          // removeHistory();
          navigate('/signin');
        } else {
          setShowAlertModal(false);
          
        }
      }}
      text={alertType}
    />
</Container>   
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width:100%;
`;

const InterView = styled.div`
  height: 150px;
`;

const TitleWrap = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:40px 50px 90px;
  @media only screen and (max-width: 768px) {
    display:flex;
    margin: 0 20px;
    padding:0;
  }
`;

const TabBox = styled.div`
  display:none;
  width:100%;
  cursor:pointer;
  border-bottom:1.7px solid rgb(204,204,204);
  @media only screen and (max-width: 768px) {
    display:flex;
  }
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
const TitleText = styled.span`
font-family:'Pretendard Variable';
  font-weight: 410;
  color: #121212;
  font-size: 16px;
  text-transform: capitalize;
  @media only screen and (max-width: 768px) {
    display:none
  }
`;

export default ArtworkTab;
