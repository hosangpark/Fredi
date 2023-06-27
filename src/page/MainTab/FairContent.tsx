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
import Artwork from './Artwork';
import Artist from './Artist';

const content = [
    {
      tab: "Artworks",
      content:<Artwork/>
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


function FairContent() {
  const navigate = useNavigate();
  const { type, idx } = useParams();
  const { contentItem, contentChange } = useTabs(0, content);

  return (
    <Container>
      <MainImage>
        <Image src={'dd'}/>
      </MainImage>
      <TitleWrap>
        <TitleText>
          Salon del Mobile 2023
        </TitleText>
        <SubText>
          Salon del Mobile 2023
        </SubText>
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

const ProductListWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 30px;
`;

const MainImage2 = styled.img`
  display: block;
  position: relative;
  width: 100%;
  aspect-ratio: 4697/1737;
`;
const MainImage = styled.div`
  width: 100%;
  /* aspect-ratio: 4697/1737; */
  aspect-ratio: 3.1;
  background-color:black;
  margin-bottom:0px;
  @media only screen and (max-width: 768px) {
    aspect-ratio: 1.5;
  }
`;
const MobileCarouselWrap = styled.div`
  display: none;
  max-height: 700px;
  position: relative;
  @media only screen and (max-width: 768px) {
    display: block;
  }
`;

const TabButtonWrap = styled.div`
  width:400px;
  display:flex;
  border-bottom:1px solid #cccccc;
  margin-bottom:50px;
  @media only screen and (max-width: 768px) {
    margin-bottom:0px;
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
  border-bottom: solid 1px ${(props) => props.color || "none"};
  font-weight: ${props => props.color == 'black' ? 600 : 300};
  font-family:'Pretendard Variable';
  padding:10px 0;
  @media only screen and (max-width: 768px) {
    font-size:14px;
  }
`

const TitleWrap = styled.div`
  margin:20px 20px 40px 20px;
  text-align:start;
`;
const TitleText = styled.span`
font-family:'Pretendard Variable';
  display:block;
  font-weight: 500;
  text-transform: capitalize;
  margin: 2px 0;
  @media only screen and (max-width: 768px) {
    font-size:14px;
  }
`;
const SubText = styled.span`
font-family:'Pretendard Variable';
  display:block;
  font-weight: 400;
  text-transform: capitalize;
  margin: 2px 0;
  @media only screen and (max-width: 768px) {
    font-size:12px;
  }
`;

export default FairContent;
