import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Autoplay from 'embla-carousel-autoplay';
import snsImage from '../../asset/image/snsicon.png';
import rightButtonImage from '../../asset/image/ico_next.png';
import leftButtonMobileImage from '../../asset/image/ico_prev_mobile.png';
import rightButtonMobileImage from '../../asset/image/ico_next_mobile.png';
import { createStyles, Image } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { APIGetBanner } from '../../api/SettingAPI';
import { TImage, TProductListItem } from '../../types/Types';
import { UserContext } from '../../context/user';
import AlertModal from '../../components/Modal/AlertModal';
import { useLayoutEffect } from 'react';
import { createBrowserHistory } from 'history';
import { APILikeShop, APIShopList } from '../../api/ShopAPI';
import LikeArtwork from './LikeArtwork';
import Fair from '../MainTab/Fair';
import LikeSns from './LikeSns';
import Artwork from '../MainTab/Artwork';
import { ArtworkListItem } from '../../types/Types';
import { APILikeProductList, APIProductList } from '../../api/ProductAPI';


const TabImage = styled.img`
  width:25px;
  height:25px;
  @media only screen and (max-width:768px){
    width:20px;
    height:20px;
  }
`


function LikeTab() {
  const navigate = useNavigate();
  const browserHistory = createBrowserHistory();
  const location = useLocation();
  let [searchParams, setSearchParams] = useSearchParams();
  const keywordParams = searchParams.get('keyword') ?? '';
  const categoryParams = (searchParams.get('category') as '1' | '2' | '3' | '4' | '5' | '6') ?? '1';
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [category, setCategory] = useState<'1' | '2' | '3' | '4' | '5' | '6'>(categoryParams);
  const [showLogin, setShowLogin] = useState(false);
  const [bannerList, setBannerList] = useState<TImage[]>([]);
  const [history, setHistory] = useState(false);
  const [keyword, setKeyword] = useState<string>(keywordParams);
  const [showType, setShowType] = useState<1 | 2>(1);
  const [productList,setproductList] = useState<ArtworkListItem[]>([])

  const saveHistory = (e: React.MouseEvent, idx: number) => {
    const div = document.getElementById('root');
    if (div) {
      console.log(div.scrollHeight, globalThis.scrollY);
      const y = globalThis.scrollY;
      // sessionStorage.setItem('shop', JSON.stringify(shopList));
      sessionStorage.setItem('page', String(page));
      sessionStorage.setItem('type', String(showType));
      sessionStorage.setItem('y', String(y ?? 0));
      navigate(`/productdetails/${idx}`);
    }
  };
  const content = [
    {
      tab: "Artwork",
      content:<Artwork saveHistory={saveHistory} productList={productList} showType={2}/>
    },
    { 
      tab: <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
        <TabImage src={snsImage}/></div>,
      content:<LikeSns productList={productList}/>
    },
  ];

  const useTabs = (initialTabs:any, allTabs:any) => {
    const [contentIndex, setContentIndex] = useState(initialTabs);
    return {
      contentItem: allTabs[contentIndex],
      contentChange: setContentIndex
    };
  };
  const { contentItem, contentChange } = useTabs(0, content);


  const getLikeProductList = async () => {
    const data = {
      page,
    };
    try {
      const { list, total } = await APILikeProductList(data);


      setproductList(() => [...list]);
      
      setTotal(total);
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
    // const list = JSON.parse(sessionStorage.getItem('shop') ?? '');
    const page = Number(sessionStorage.getItem('page'));
    // const type = (Number(sessionStorage.getItem('type')) as 1 | 2) ?? 1;

    // setShopList(list);
    setHistory(true);
    setPage(page);
    // setShowType(type);

    sessionStorage.removeItem('shop');
    sessionStorage.removeItem('page');
    sessionStorage.removeItem('type');
  };

  
  // useLayoutEffect(() => {
  //   const scrollY = Number(sessionStorage.getItem('y'));
  //   if (shopList.length > 0 && scrollY) {
  //     console.log('불러옴', scrollY);
  //     setTimeout(() => {
  //       window.scrollTo({
  //         top: scrollY,
  //         behavior: 'auto',
  //       });
  //     }, 50);
  //     sessionStorage.removeItem('y');
  //   }
  // }, [shopList]);

  useLayoutEffect(() => {
    // const page = Number(sessionStorage.getItem('page'));
    const Tab = sessionStorage.getItem('tab')
    if(Tab == 'Artwork'){
      contentChange(0)
    } else {
      contentChange(1);
    } 
    getLikeProductList()
    findHistory();

    // if (page) {
    //   findHistory();
    // } else {
    //   setPage(1);
    //   getShopList(1);
    // }
  }, [searchParams, category]);

  // useEffect(() => {
  //   if (page > 1) getShopList(page);
  // }, [page]);
  
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
      <div className="App">
        <TabButtonWrap>
        {content.map((section, index:number) => (
          <UnderLineTab onClick={() => {contentChange(index)}} color={section.tab == contentItem.tab? 'black':'none'}>
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


const TabButtonWrap = styled.div`
  width:400px;
  display:flex;
  border-bottom:1px solid #cccccc;
  margin:50px;
  @media only screen and (max-width: 768px) {
    margin:0px;
    width:100%;
  }
`;
const TabButton = styled.div`
  flex:1;
  font-size:17px;
  font-weight:500;
  padding:15px 0;
`;

const UnderLineTab = styled(TabButton)<{underLine?: boolean}>`
  border-bottom: solid 1.7px ${(props) => props.color || "none"};
  font-weight: ${props => props.color == 'black' ? 460 : 360};
  color:#000000;
  font-family:'Pretendard Variable';
  padding:10px 0;
  margin-top:5px;
  font-size:18px;
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

export default LikeTab;
