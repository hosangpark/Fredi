import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { createSearchParams, useLocation, useNavigate, useSearchParams,useParams } from 'react-router-dom';
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
import Artwork, { FairListItem } from './Artwork';
import Artist from './Artist';
import { CategoryList } from '../../components/List/List';
import { APIProductList } from '../../api/ProductAPI';









function FairContent() {
  const navigate = useNavigate();
  const { type, idx } = useParams();
  const [productList,setproductList] = useState<FairListItem[]>([])
  const [mainbanner,setMainbanner] = useState()
  const content = [
    {
      tab: "Artworks",
      content:<Artwork productList={productList}/>
    },
    {
      tab: "Exhibitors",
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
  const { contentItem, contentChange } = useTabs(0, content);

  let [searchParams, setSearchParams] = useSearchParams();
  const keywordParams = searchParams.get('keyword') ?? '';
  const [keyword, setKeyword] = useState<string>(keywordParams);
  const categoryParams = (searchParams.get('category') as '1' | '2' | '3' | '4' | '5' | '6') ?? '1';
  const [category, setCategory] = useState<'1' | '2' | '3' | '4' | '5' | '6'>(categoryParams);

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

  const getShopList = async (page: number) => {
    const data = {
      page: page,
      category: category,
      keyword: keywordParams,
    };
    try {
      const { list, total } = await APIProductList(data);
      if (page === 1) {
        setproductList((prev) => [...list]);
      } else {
        // setShopList((prev) => [...prev, ...list]);
      }
      console.log('shop', list, page);
    } catch (error) {
      console.log(error);
    }
  };
  
  const getBannerList = async () => {
    var array1 = new Array(); //pc
    var array2 = new Array(); //mobile
    try {
      const res = await APIGetBanner();
      console.log('banner@@@@@@@@', res);
      res.forEach((list:any) => {
        if(list.type === 'P'){
          array1.push(list);
        } else {
          array2.push(list);
        }
      });
      // console.log(array1, array2);
      setMainbanner(array1[0].file_name);
      console.log('array2',array2)
    } catch (error) {
      console.log('Banner', error);
    }
  };

  useEffect(()=>{
    getBannerList()
    getShopList(1)
  },[])
  

  return (
    <Container>
      <MainImage>
        <BannerImage src={mainbanner}/>
      </MainImage>
      <TitleWrap>
        <div>
          <TitleText>
            Salon del Mobile 2023
          </TitleText>
          <SubText>
            April 17-23
          </SubText>
        </div>
        <SearchBox
          none={true}
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
        {content.map((section, index:number) => (
          <UnderLineTab onClick={() => {contentChange(index)}} color={section.tab == contentItem.tab? 'black':'none'}>{section.tab}</UnderLineTab>
        ))}
        </TabButtonWrap>
        {contentItem.content}
      </div>
      {/* <ShowTypeButton onClickType1={() => setShowType(1)} onClickType2={() => setShowType(2)} /> */}
      <TopButton />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin:0px;
`;

const MainImage = styled.div`
  width: 100%;
  /* aspect-ratio: 4697/1737; */
  aspect-ratio: 2.7042;
  background-color:black;
  margin-bottom:0px;
  @media only screen and (max-width: 768px) {
    aspect-ratio: 412/280;
  }
`;
const BannerImage = styled.img`
  width:100%;
  height:100%;
`
const TabButtonWrap = styled.div`
  width:400px;
  display:flex;
  border-bottom:1px solid #cccccc;
  margin:0 50px 40px;
  @media only screen and (max-width: 768px) {
    margin:0px;
    width:100%;
  }
`;
const TabButton = styled.div`
  flex:1;
  font-size:17px;
  font-weight:500;
  padding:5px 0;
`;

const UnderLineTab = styled(TabButton)<{underLine?: boolean}>`
  border-bottom: solid 1.7px ${(props) => props.color || "none"};
  font-weight: ${props => props.color == 'black' ? 460 : 360};
  color:#000000;
  font-family:'Pretendard Variable';
  padding:10px 0;
  /* margin-top:5px; */
  font-size:18px;
  @media only screen and (max-width: 768px) {
    font-size:14px;
  }
`
const SearchBoxWrap =styled.div`
  display:block;
  @media only screen and (max-width: 768px) {
    display:none;
  }
`

const TitleWrap = styled.div`
  margin:42px 50px 80px 54.29px;
  text-align:start;
  display:flex;
  justify-content:space-between;
  @media only screen and (max-width: 768px) {
    margin:20px 0px 25px 20px;
  }
`;
const TitleText = styled.span`
font-family:'Pretendard Variable';
  display:block;
  font-weight: 360;
  text-transform: capitalize;
  font-size:26px;
  @media only screen and (max-width: 1440px) {
    font-size:20px;
  }
  @media only screen and (max-width: 768px) {
    font-size:12px;
  }
`;
const SubText = styled.span`
  font-family:'Pretendard Variable';
  display:block;
  font-weight: 360;
  text-transform: capitalize;
  margin-top:12px;
  font-size:22px;
  @media only screen and (max-width: 1440px) {
    font-size:17px;
  }
  @media only screen and (max-width: 768px) {
    font-size:12px;
  }
`;

export default FairContent;
