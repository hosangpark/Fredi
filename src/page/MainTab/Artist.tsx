import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import {  useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ArtistCardType } from '../../types/Types';
import { UserContext } from '../../context/user';
import AlertModal from '../../components/Modal/AlertModal';
import { createBrowserHistory } from 'history';
import TopButton from '../../components/Product/TopButton';
import { removeHistory } from '../../components/Layout/Header';
// swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import ArtistCard from '../../components/Shop/ArtistCard';
import Nodata from '../../components/Product/NoData';


function Artist({saveHistory,productList}
  :
  {saveHistory:(e:React.MouseEvent, name: string)=>void,
  productList?:ArtistCardType[],}) {
  const navigate = useNavigate();
  const browserHistory = createBrowserHistory();
  const location = useLocation();
  let [searchParams, setSearchParams] = useSearchParams();
  const keywordParams = searchParams.get('keyword') ?? '';
  const [showLogin, setShowLogin] = useState(false);
  const { user } = useContext(UserContext);




  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };

    // console.log("innerWidth", innerWidth);
    window.addEventListener("resize", resizeListener);
  }, [innerWidth]);


  return (
    <Container>      
      <ProductListWrap>
        {productList && productList.length > 0 ?
        productList.map((item,index)=>{
          return(
            <ArtistCard
              item={item}
              key={index}
              onClick={(e) => saveHistory(e, item.designer_name)}
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
  width:100%;
`;

const ProductListWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin:0 50px;
  /* 1440px */
  /* @media only screen and (max-width: 1440px) {
    margin:0 20px;
  } */
  @media only screen and (max-width: 768px) {
    margin:0;
  }
`;

export default Artist;
