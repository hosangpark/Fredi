import React,{useState,useRef} from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { TProductListItem } from '../../page/admin/ProductList';
import likeOnImage from '../../asset/image/heart_on.png';
import likeOffImage from '../../asset/image/heart_off.png';
import newIconImage from '../../asset/image/ico_new.png';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Button, FileButton, Image } from '@mantine/core';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import leftarrowIcon from '../../asset/image/ico_prev_mobile.png'
import rightarrowIcon from '../../asset/image/ico_next_mobile.png'
import { TImage } from '../../types/Types';
import { useNavigate } from 'react-router-dom';

function WeeklyEditionList({
  // item,
  // showType,
  // index,
  // onClick,
  // onClickLike,
  // isLikeList,
  title,
  ProductViews,
  naviArrow,
  scrollbar,
  ProductTitle,
  ProducList,
  arrowView,
  productLink,
  link
}:{
  title:string
  ProductViews:number
  naviArrow:boolean
  scrollbar:boolean
  ProductTitle?:number
  ProducList:TImage[]
  arrowView?:boolean
  productLink?:boolean
  link:string
}) { 
  const navigate = useNavigate();
  return (
    <ContainerWrap>
      <TitleBox onClick={()=>{navigate(`/${link}`);}}>
        <TitleText>{title}</TitleText>
        {arrowView&&
        <ArrowRightIcon src={rightarrowIcon}/>
        }
      </TitleBox>
      {/* <StyledButton ref={prevRef}>
        <Image src={leftarrowIcon} alt="prev" />
      </StyledButton>
      <StyledButton ref={nextRef}>
        <Image src={rightarrowIcon} alt="next" />
      </StyledButton> */}
      <Swiper
        // install Swiper modules
        modules={[Navigation, Pagination, Scrollbar]}
        slidesPerView={ProductViews}
        navigation= {naviArrow
        //   {
        //   prevEl: prevRef.current,
        //   nextEl: nextRef.current,
        // }
        // :
        // false
        }
        // spaceBetween={30}
        scrollbar={ scrollbar }
        // pagination={{ clickable: true }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log('slide change')}
        style={{paddingBottom:50}}
      >
        {ProducList.map(item=>{
          return(
          <SwiperSlide>
          <ProductWrap onClick={()=>{productLink == true ? navigate(`/shopdetails/${item.idx}`): navigate(`/${link}`)}}>
            <ProductTopbox>
              <ProductTopboxLeft>
                <ProductImage src={item.file_name}/>
              </ProductTopboxLeft>
              <ProductTopboxRight>
                <ProductImage src={item.file_name} style={{marginBottom:10}}/>
                <ProductImage src={item.file_name}/>
              </ProductTopboxRight>
            </ProductTopbox>
            <ProductBottombox>
                <ProductBottomImage src={item.file_name}/>
                <ProductBottomImage src={item.file_name}/>
            </ProductBottombox>
            <ProductTitleText>
              {item.idx}
            </ProductTitleText>
            <ProductSubText>
              {item.idx}
            </ProductSubText>
          </ProductWrap>
          </SwiperSlide>
          )
        })}
        
      </Swiper>
    </ContainerWrap>
  );
}

const ProductTopbox = styled.div`
  display:flex;
  margin-bottom:10px;
`;
const ProductTopboxLeft = styled.div`
  width:66.6666%;
  margin-right:10px;
`;
const ProductTopboxRight = styled.div`
  height:100%;
  width:33.3333%;
  gap:10px;
`;
const ProductBottombox = styled.div`
  display:flex;
  width:100%;
  flex:1;
  gap:10px;
`;
const ProductBottomInner = styled.div`
  width:100%;
`;
const ProductBox = styled.div<{ isLast: boolean; showType: 1 | 2 }>`
  position: relative;
  display: column;
  width: 24.25%;
  margin-bottom: 110px;
  margin-right: ${(props) => (props.isLast ? 0 : 1)}%;
  cursor: pointer;
  overflow: hidden;

  @media only screen and (max-width: 768px) {
    width: ${(props) => (props.showType === 1 ? 100 : 50)}%;
    margin-right: 0;
    margin-bottom: 50px;
  }
`;

const ProductImage = styled.img`
  width:100%;
  height: 100%;
  object-fit:contain;
`;
const ProductBottomImage = styled.img`
  width:50%;
  height: 100%;
  object-fit:contain;
`;
const ProductContainer = styled.div`
  display: flex;
  /* overflow-x: scroll; */
  -ms-overflow-style: none;
  scrollbar-width: none; 
`;
const ProductWrap = styled.div`
  margin-right:20px;
  text-align:start;
`;


const ContainerWrap = styled.div`
  width:100%;
`;
const TitleBox = styled.div`
  display: flex;
  align-items:center;
  margin: 15px 0px;
  padding: 5px 0;
  @media only screen and (max-width: 768px) {
    justify-content:space-between;
    padding: 5px 15px;
  }
`;

const TitleText = styled.span`
font-family:'Pretendard Variable';
  font-size:14px;
  font-weight:500;
`;
const ArrowRightIcon = styled.img`
margin:0 40px;
width:20px;
height:20px;
  @media only screen and (max-width: 768px) {
    margin:0 20px;
  }
`;

const ProductTitleText = styled.div`
  font-size:17px;
  font-weight:500;
  margin-top:5px;
  @media only screen and (max-width: 768px) {
    font-size:15px;
  }
`;
const ProductSubText = styled.div`
  font-size:15px;
  font-weight:400;
  color:#525252;
  @media only screen and (max-width: 768px) {
    font-size:14px;
  }
`;

const ProductNameWrap = styled.div`
  display: flex;
  flex-direction: column;
`;
const StyledButton = styled.div`
  padding: 0;
  background: none;
  border: none;
  width:20px;
  height:20px;
`;

export default WeeklyEditionList;
