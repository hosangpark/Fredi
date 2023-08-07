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
import { APIArtistList} from '../../api/ProductAPI';



function ArtistTab() {
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  const keywordParams = searchParams.get('keyword') ?? '';
  const [artistList, setArtistList] = useState<any[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [history, setHistory] = useState(false);
  const [keyword, setKeyword] = useState<string>(keywordParams);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const interSectRef = useRef(null);

  const getDesignerList = async(page:number)=> {
    const data = {
      page: page,
      keyword:keyword? keyword : ''
    };
    try {
      if (history) {
        return setHistory(false);
      }
      const { list , total } = await APIArtistList(data);
      console.log('page',page)
      if(page > 1){
        // setArtistList([...artistList , ...list]);
        setArtistList((prev) => [...prev, ...list]);
      } else {
        setArtistList(list);
      }

    } catch (error) {
      console.log(error);
    }
  };

  const findHistory = () => {
    const list = JSON.parse(sessionStorage.getItem('ArtistList') ?? '');
    const page = Number(sessionStorage.getItem('ArtistPage'));
    // setCategory(categ);

    setArtistList(list);
    setPage(page);
    setHistory(true);

    sessionStorage.removeItem('ArtistPage');
    sessionStorage.removeItem('ArtistList');
  };

  const saveHistory = (e: React.MouseEvent, name: string) => {
    const div = document.getElementById('root');
    if (div) {
      // console.log(div.scrollHeight, globalThis.scrollY);
      const y = globalThis.scrollY;
      sessionStorage.setItem('y', String(y ?? 0));
      sessionStorage.setItem('ArtistList', JSON.stringify(artistList));
      sessionStorage.setItem('ArtistPage', String(page));
    }
    navigate(`/ArtistProducts/${name}`,{ state:{name:name} });
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
    const page = Number(sessionStorage.getItem('ArtistPage'));
    if (page){
      findHistory();
    } else {
      console.log('getlist')
      setPage(1);
      getDesignerList(1);
    }
  }, [searchParams]);

  useEffect(() => {
    if (page > 1) getDesignerList(page);
  }, [page]);

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

  const onSearch = () => {
    createSearchParams({keyword:keyword})
    getDesignerList(1)
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
          category={'1'}
          keyword={keyword}
          onChangeInput={(e) => setKeyword(e.target.value)}
          onChangeCategory={(value: string) => {
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
      <InterView ref={interSectRef} />
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
  display: flex;
  flex: 1;
  flex-direction: column;
  width:100%;
`;
const InterView = styled.div`
  height: 150px;
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
  font-weight: 410;
  color: #121212;
  font-size: 16px;
  text-transform: capitalize;
  @media only screen and (max-width: 768px) {
    display:none
  }
`;

export default ArtistTab;
