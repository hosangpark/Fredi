import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { CategoryList } from '../../components/List/List';
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
  const [total, setTotal] = useState<number>(0);
  const [category, setCategory] = useState<string>('1');
  const [history, setHistory] = useState(false);
  const [keyword, setKeyword] = useState<string>(keywordParams);
  const [alertType, setAlertType] = useState<string>('')
  const [ShowAlertModal, setShowAlertModal] = useState(false);


  const { user } = useContext(UserContext);



  const getproductList = async () => {
    console.log('ccccccccccc',category)
    const data = {
      page: 1,
      category: category,
      keyword:keyword? keyword : ""
    };
    try {
      if (history) {
        return setHistory(false);
      }
      const { list, total } = await APIProductList(data);
      setTotal(total);
      setProductList(list);
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
      setAlertType(res.message)
      setShowAlertModal(true)
      getproductList()
      // const newList = productList.map((item) => (item.idx === idx ? { ...item, isLike: !item.isLike, like_count: res.likeCount } : { ...item }));
      // setProductList(newList);
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


  const saveHistory = (e: React.MouseEvent, idx: number) => {
    const div = document.getElementById('root');
    if (div) {
      console.log(div.scrollHeight, globalThis.scrollY);
      const y = globalThis.scrollY;
      sessionStorage.setItem('ArtworkTabList', JSON.stringify(productList));
      sessionStorage.setItem('ArtworkTabCategory', category);
      sessionStorage.setItem('y', String(y ?? 0));
      navigate(`/productdetails/${idx}`);
    }
  };

  const findHistory = () => {
    const list = JSON.parse(sessionStorage.getItem('ArtworkTabList') ?? '');
    const categ = sessionStorage.getItem('ArtworkTabCategory');
    // setCategory(categ);
    setProductList(list);
    setHistory(true);
    if(categ){
      setCategory(categ)
    }

    sessionStorage.removeItem('ArtworkTabCategory');
    sessionStorage.removeItem('ArtworkTabList');
  };




  useLayoutEffect(() => {
    // const page = Number(sessionStorage.getItem('page'));
    const categ = sessionStorage.getItem('ArtworkTabCategory');
    // console.log(categ)
// console.log(categ&& setCategory(JSON.parse(categ)))

    if (categ) {
      console.log('find')
      findHistory();
    } else {
      console.log('getlist')
      getproductList();
    }
  }, [searchParams,category]);


  useEffect(() => {
    const scrollY = Number(sessionStorage.getItem('y'));
    if (productList.length > 0 && scrollY) {
      console.log('불러옴', scrollY);
      window.scrollTo({
        top: scrollY,
        behavior: 'auto',
      });
      sessionStorage.removeItem('y');
    }
  }, [productList]);
  

  const onSearch = () => {
    createSearchParams({keyword:keyword})
    getproductList()
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
        categoryList={CategoryList}
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
    <AlertModal
      visible={ShowAlertModal}
      setVisible={setShowAlertModal}
      onClick={() => {
        if(
          alertType == '회원가입 후 이용 가능합니다.'
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
  font-size: 22px;
  font-weight: 310;
  text-transform: capitalize;
  @media only screen and (max-width: 768px) {
    display:none
  }
`;

export default ArtworkTab;
