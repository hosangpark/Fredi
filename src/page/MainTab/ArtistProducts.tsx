import React, { useCallback, useContext, useEffect, useRef, useState ,memo } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { SnsList } from '../../types/Types';
import { UserContext } from '../../context/user';
import AlertModal from '../../components/Modal/AlertModal';
import { useLayoutEffect } from 'react';
import { createBrowserHistory } from 'history';
import { APILikeShop } from '../../api/ShopAPI';
import TopButton from '../../components/Product/TopButton';
import { removeHistory } from '../../components/Layout/Header';
// swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import FeedCard from '../../components/Shop/FeedCard';
import { APIProductList } from '../../api/ProductAPI';
import Nodata from '../../components/Product/NoData';




function ArtistProducts() {
  const navigate = useNavigate();
  const browserHistory = createBrowserHistory();
  const location = useLocation();
  const { name } = location.state;
  console.log(name)


  const [SnsList, setSnsList] = useState<SnsList[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [showLogin, setShowLogin] = useState(false);
  const [history, setHistory] = useState(false);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const interSectRef = useRef(null);

  const { user } = useContext(UserContext);

  const getSnsList = async (page: number) => {
    const data = {
      page: page,
      category: '1',
      keyword:"",
      designer_name:name
    };
    try {
      if (history) {
        return setHistory(false);
      }
      const { list, total } = await APIProductList(data);
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

  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", resizeListener);
  }, [innerWidth]);

  const onLikeShop = async (idx: number) => {
    const data = {
      idx: idx,
    };
    try {
      const res = await APILikeShop(data);
      console.log(res);
      const newList = SnsList.map((item) => (item.idx === idx ? { ...item, isLike: !item.isLike, like_count: res.likeCount } : { ...item }));
      setSnsList(newList);
    } catch (error) {
      console.log(error);
    }
  };

  const findHistory = () => {
    const list = JSON.parse(sessionStorage.getItem('ArtistProductList') ?? '');
    const page = Number(sessionStorage.getItem('ArtistProductPage'));

    setHistory(true);
    setPage(page);
    setSnsList(list);

    sessionStorage.removeItem('ArtistProductList');
    sessionStorage.removeItem('ArtistProductPage');
    sessionStorage.removeItem('Save');
  };

  const saveHistory = (e: React.MouseEvent, idx: number) => {
    const div = document.getElementById('root');
    if (div) {
      const y = globalThis.scrollY;
      sessionStorage.setItem('Save', 'Save');
      sessionStorage.setItem('ArtistProductList', JSON.stringify(SnsList));
      sessionStorage.setItem('ArtistProductPage', String(page));
      sessionStorage.setItem('y', String(y ?? 0));
      navigate(`/productdetails/${idx}`,{state:idx});
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
    if (page > 1) getSnsList(page);
  }, [page]);

  useLayoutEffect(() => {
    const scrollY = Number(sessionStorage.getItem('y'));
    if (SnsList.length > 0 && scrollY) {
      console.log('불러옴', scrollY);
      setTimeout(() => {
        window.scrollTo({
          top: scrollY,
          behavior: 'auto',
        });
      }, 50);
      sessionStorage.removeItem('y');
    }
  }, [SnsList]);

  useLayoutEffect(() => {
    const Save = sessionStorage.getItem('Save')
    if (Save) {
      findHistory();
    } else {
      setPage(1);
      getSnsList(1);
    }
  }, []);



  return (
    <Container>
      <NameBox>{name}</NameBox>
      <ProductListWrap>
        {SnsList.length > 0 ?
        SnsList.map((item,index)=>{
          return(
            <FeedCard
              item={item}
              key={item.idx}
              onClick={(e) =>{

                saveHistory(e, item.idx)

              }}
              onClickLike={(e) => {
                if (user.idx) {
                  e.stopPropagation();
                  onLikeShop(item.idx);
                } else {
                  e.stopPropagation();
                  setShowLogin(true);
                }
              }}
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
  display: flex;
  flex: 1;
  flex-direction: column;
`;
const NameBox = styled.div`
font-family:'Pretendard Variable';
font-weight: 410;
  display: flex;
  align-items:center;
  justify-content:start;
  margin:40px 20px;
`;

const ProductListWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  /* 1440px */
  /* @media only screen and (max-width: 1440px) {
    margin:0 20px;
  } */

`;


export default ArtistProducts;
