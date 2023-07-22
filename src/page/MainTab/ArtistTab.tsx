import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Autoplay from 'embla-carousel-autoplay';
import leftButtonImage from '../../asset/image/ico_prev.png';
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
import SearchBox from '../../components/Product/SearchBox';
import { APIShopList } from '../../api/ShopAPI';
import TopButton from '../../components/Product/TopButton';
import { removeHistory } from '../../components/Layout/Header';
import Artist from './Artist';
import { ArtistItem } from '../../types/Types';
import { CategoryList } from '../../components/List/List';
import { APIArtistList, APIProductList } from '../../api/ProductAPI';



const useStyles = createStyles((theme, _params, getRef) => ({
  carousel: {},

  carouselControls: {
    ref: getRef('carouselControls'),
    padding: '0px 50px',
    boxShadow: 'unset',
    '@media (max-width: 768px)': { padding: '0 18px' },
  },
  carouselControl: {
    ref: getRef('carouselControl'),
    boxShadow: 'none',
    outline: 0,
  },

  carouselIndicator: {
    width: 8,
    height: 8,
    transition: 'width 250ms ease',
    borderRadius: '100%',
    backgroundColor: '#121212',
    opacity: 0.4,
    '&[data-active]': {
      width: 8,
      borderRadius: '100%',
    },
    '@media (max-width: 768px)': {
      '&[data-active]': {
        width: 4,
        borderRadius: '100%',
      },
      width: 4,
      height: 4,
    },
  },

  carouselImages: {
    width: '100%',
    maxHeight: 700,
  },
}));


function ArtistTab() {
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  const keywordParams = searchParams.get('keyword') ?? '';
  const [artistList, setArtistList] = useState<[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [history, setHistory] = useState(false);
  const [keyword, setKeyword] = useState<string>(keywordParams);


  const getDesignerList = async()=> {
    const data = {
      page: 1,
      keyword:keyword? keyword : ''
    };
    try {
      if (history) {
        return setHistory(false);
      }
      const { list } = await APIArtistList(data);
      setArtistList(list);
      console.log('arrrrrrr',list)
      

    } catch (error) {
      console.log(error);
    }
  };

  const saveHistory = (e: React.MouseEvent, name: string , idx:number) => {
    const div = document.getElementById('root');
    if (div) {
      // console.log(div.scrollHeight, globalThis.scrollY);
      const y = globalThis.scrollY;
      sessionStorage.setItem('y', String(y ?? 0));
      // sessionStorage.setItem('shop', JSON.stringify(shopList));
      // sessionStorage.setItem('page', String(page));
      // sessionStorage.setItem('type', String(showType));
    }
    navigate(`/ArtistProducts/${name}`,{ state:{name:name,idx:idx} });
  };

  useLayoutEffect(() => {
    const scrollY = Number(sessionStorage.getItem('y'));
    if (artistList.length > 0 && scrollY) {
      console.log('불러옴', scrollY);
      setTimeout(() => {
        window.scrollTo({
          top: scrollY,
          behavior: 'auto',
        });
      }, 50);
      sessionStorage.removeItem('y');
    }
  }, [artistList]);

  useEffect(() => {
    getDesignerList();
  }, []);
  

  const onSearch = () => {
    createSearchParams({keyword:keyword})
    getDesignerList()
  };

  return (
    <Container>
      <TitleWrap>
        <TitleText>
          Artist
        </TitleText>
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
          onChangeCategory={(value: '1' | '2' | '3' | '4' | '5' | '6') => {
            // chageCategory(value);
          }}
        />
      </TitleWrap>
      <TabBox>
        <TabContents onClick={()=>navigate('/MainTab/FairTab')}>
          Fair
        </TabContents>
        <TabContents  onClick={()=>navigate('/MainTab/ArtworkTab')} >
          Artwork
        </TabContents>
        <TabContents On={true}>
          Artist
        </TabContents>
      </TabBox>
      {/* <ShowTypeButton onClickType1={() => setShowType(1)} onClickType2={() => setShowType(2)} /> */}
      <Artist saveHistory={saveHistory} productList={artistList}/>
      {/* <InterView ref={interSectRef} /> */}
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
  display: flex;
  flex: 1;
  flex-direction: column;
  width:100%;
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

const ProductListWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin:13px 0;
  @media only screen and (max-width: 768px) {
    /* display: block; */
  }
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
const TitleText = styled.span`
font-family:'Pretendard Variable';
  font-size: 22px;
  font-weight: 360;
  text-transform: capitalize;
  @media only screen and (max-width: 768px) {
    display:none
  }
`;

export default ArtistTab;
