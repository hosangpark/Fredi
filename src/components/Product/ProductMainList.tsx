import React,{useState,useRef} from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { TProductListItem } from '../../page/admin/ProductList';
import likeOnImage from '../../asset/image/heart_on.png';
import likeOffImage from '../../asset/image/heart_off.png';
import newIconImage from '../../asset/image/ico_new.png';
import { useLocation, useNavigate } from 'react-router-dom';
// Import Swiper styles
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import leftarrowIcon from '../../asset/image/ico_prev_mobile.png'
import rightarrowIcon from '../../asset/image/ico_next_mobile.png'
import { TImage } from '../../types/Types';

function ProductMainList({
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
  productLink,
  arrowView,
  titlesize,
  link
}:{
  title:string
  ProductViews:number
  naviArrow:boolean
  scrollbar:boolean
  ProductTitle?:number
  ProducList:TImage[]
  productLink?:string
  arrowView?:boolean
  titlesize?:number
  link?:string
}) {

  const navigate = useNavigate();

  const LinkHandler = (productLink:string,idx?:number)=>{
    if(productLink === 'FairsM'){
      navigate(`/FairContent/${idx}`)
    } else if (productLink === 'FairsW'){
      navigate(`/MainTab`)
    } else {
      navigate(`/productLink`)
    }
  }
 
  return (
    <ContainerWrap>
      <TitleBox 
      // onClick={()=>{navigate(`/${link}`);}}
      >
        {/* <a href={item?.link}> */}
        <TitleText titlesize={titlesize? titlesize:16}>{title}</TitleText>
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
        style={{paddingBottom:30}}
      >
        {ProducList.map(item=>{
          return(
            <SwiperSlide>
              <ProductWrap onClick={()=>LinkHandler(productLink?productLink:title,item.idx)}>
                <ProductImage src={item.file_name}/>
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
  width: 100%;
  object-fit:contain;
`;
const ProductContainer = styled.div`
  display: flex;
  /* overflow-x: scroll; */
  -ms-overflow-style: none;
  scrollbar-width: none; 
`;
const ProductWrap = styled.div`
  /* max-width:350px; */
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

const TitleText = styled.span<{titlesize:number}>`
font-family:'Pretendard Variable';
  font-size:${props=>props.titlesize? props.titlesize : 14}px;
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
font-family:'Pretendard Variable';
  font-size:14px;
  font-weight:500;
  margin-top:5px;
  @media only screen and (max-width: 768px) {
    font-size:12px;
  }
`;
const ProductSubText = styled.div`
font-family:'Pretendard Variable';
  font-size:14px;
  font-weight:400;
  color:#525252;
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

export default ProductMainList;
