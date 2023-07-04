import React,{useState,useRef} from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { TProductListItem } from '../../page/admin/ProductList';
import likeOnImage from '../../asset/image/heart_on.png';
import likeOffImage from '../../asset/image/heart_off.png';
import newIconImage from '../../asset/image/ico_new.png';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Button, Image } from '@mantine/core';
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
  paddingnum
}:{
  title:string
  ProductViews:number
  naviArrow:boolean
  scrollbar:boolean
  ProductTitle?:number
  ProducList:TImage[]
  arrowView?:boolean
  productLink?:boolean
  paddingnum?:number
}) { 
  const navigate = useNavigate();
  return (
    <ContainerWrap>
      <TitleBox onClick={()=>{navigate(`/`);}}>
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
        style={{paddingBottom:paddingnum? paddingnum : 0}}
      >
        {ProducList.map(item=>{
          return(
          <SwiperSlide>
          <ProductWrap onClick={()=>{navigate(`/WeeklyEdition`)}}>
            <ProductTopbox>
              <ProductTopboxLeft>
                <ProductImage src={item.file_name}/>
              </ProductTopboxLeft>
              <ProductTopboxRight>
                <ProductTopboxRightWrap style={{marginBottom:5}}>
                  <ProductImage src={item.file_name} style={{marginBottom:10}}/>
                </ProductTopboxRightWrap>
                <ProductTopboxRightWrap>
                  <ProductImage src={item.file_name}/>
                </ProductTopboxRightWrap>
              </ProductTopboxRight>
            </ProductTopbox>
            <ProductBottombox>
                <ProductBottomImageWrap style={{marginRight:6}}>
                  <ProductImage src={item.file_name}/>
                </ProductBottomImageWrap>
                <ProductBottomImageWrap>
                  <ProductImage src={item.file_name}/>
                </ProductBottomImageWrap>
            </ProductBottombox>
            <TextWrap>
              <ProductTitleText>
                MoreTitleMoreTitleMoreTitleMoreTitle{item.idx}
              </ProductTitleText>
              <ProductSubText>
                MoreTextMoreTextMoreTextMoreTextMoreText{item.idx}
              </ProductSubText>
            </TextWrap>
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
  margin-bottom:5px;
  width:100%;
  aspect-ratio:340/280;
`;
const ProductTopboxLeft = styled.div`
  width:67%;
  aspect-ratio:225/280;
  margin-right:5px;
`;
const ProductTopboxRight = styled.div`
  width:33%;
  height:100%;
  display:flex;
  flex-direction:column;
  /* aspect-ratio:110/280; */
`;

const ProductTopboxRightWrap = styled.div`
  width:100%;  
  height:50%;
  aspect-ratio:0.7857;
`

const ProductBottombox = styled.div`
  display:flex;
  width:100%;
  aspect-ratio:340/200;
`;
const ProductBottomImageWrap = styled.div`
  width:calc(50% - 3px);
  aspect-ratio:340/200;
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
`;
const ProductBottomImage = styled.img`
  width:100%;
  height: 100%;
`;
const ProductContainer = styled.div`
  display: flex;
  /* overflow-x: scroll; */
  -ms-overflow-style: none;
  scrollbar-width: none; 
`;
const ProductWrap = styled.div`
  text-align:start;
  margin-right:40px;
  @media only screen and (max-width: 768px) {
    margin-right:20px;
    /* margin-right:10px; */
  }
`;


const ContainerWrap = styled.div`
  width:100%;
`;
const TitleBox = styled.div`
  display: flex;
  align-items:center;
  margin:170px 0 55px 0;
  @media only screen and (max-width: 1440px) {
    margin:135px 0 45px 0;
  }
  @media only screen and (max-width: 768px) {
    margin:100px 0 35px 0;
    justify-content:space-between;
    padding: 5px 15px;
  }
`;

const TitleText = styled.span`
font-family:'Pretendard Variable';
  font-size:20px;
  font-weight: 360;
  @media only screen and (max-width: 1440px) {
    font-size:18px;
  }
  @media only screen and (max-width: 768px) {
    font-size:15px;
  }
`
const ArrowRightIcon = styled.img`
margin:0 40px;
width:20px;
height:20px;
  @media only screen and (max-width: 768px) {
    margin:0 20px;
  }
`;
const TextWrap = styled.div`
  padding:0 10px;
`

const ProductTitleText = styled.div`
font-family:'Pretendard Variable';
color:#000000;
  font-size:17px;
  font-weight: 360;
  margin-top:5px;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  @media only screen and (max-width: 768px) {
    font-weight:500;
    font-size:12px;
  }
`;
const ProductSubText = styled.div`
font-family:'Pretendard Variable';
  font-size:16px;
  font-weight: 310;
  color:#000000;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  @media only screen and (max-width: 768px) {
    font-size:12px;
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
