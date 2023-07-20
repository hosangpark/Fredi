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
import SearchBox from '../../components/Product/SearchBox';;


function ArtworkTab() {
  const navigate = useNavigate();
  const browserHistory = createBrowserHistory();
  const location = useLocation();
  const [productList, setProductList] = useState<ArtworkListItem[]>([]);
  let [searchParams, setSearchParams] = useSearchParams();
  const keywordParams = searchParams.get('keyword') ?? '';
  const categoryParams = (searchParams.get('category')) ?? '1';
  const pathName = location.pathname.split('/')[1];
  const [total, setTotal] = useState<number>(0);
  const [category, setCategory] = useState<string>(categoryParams);
  const [history, setHistory] = useState(false);
  const [keyword, setKeyword] = useState<string>(keywordParams);


  const { user } = useContext(UserContext);



  const getproductList = async () => {
    console.log('ccccccccccc',category)
    const data = {
      page: 1,
      category: category,
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
      console.log(res);
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


  const saveHistory = (e: React.MouseEvent, idx: number) => {
    const div = document.getElementById('root');
    if (div) {
      console.log(div.scrollHeight, globalThis.scrollY);
      const y = globalThis.scrollY;
      sessionStorage.setItem('List', JSON.stringify(productList));
      sessionStorage.setItem('category', category);
      sessionStorage.setItem('y', String(y ?? 0));
      navigate(`/productdetails/${idx}`);
    }
  };

  const findHistory = () => {
    const list = JSON.parse(sessionStorage.getItem('List') ?? '');
    const categ = sessionStorage.getItem('category');
console.log('list불러옴',list)
    // setCategory(categ);
    setProductList(list);
    setHistory(true);
    if(categ){
      setCategory(JSON.parse(categ))
    }

    sessionStorage.removeItem('category');
    sessionStorage.removeItem('List');
  };




  useLayoutEffect(() => {
    // const page = Number(sessionStorage.getItem('page'));
    const categ = sessionStorage.getItem('category');
    console.log(categ)
// console.log(categ&& setCategory(JSON.parse(categ)))

    if (categ) {
      console.log('find')
      findHistory();
    } else {
      console.log('getlist')
      getproductList();
    }
  }, [category]);


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
