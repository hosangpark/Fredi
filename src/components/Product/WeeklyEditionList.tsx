import React,{useState,useRef, useEffect} from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import likeOnImage from '../../asset/image/heart_on.svg';
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
import { TImage, WeeklyListItem } from '../../types/Types';
import { useNavigate } from 'react-router-dom';

function WeeklyEditionList({
  // item,
  // showType,
  // index,
  // onClick,
  // onClickLike,
  // isLikeList,
  LinkHandler,
  title,
  ProductViews,
  naviArrow,
  scrollbar,
  ProductTitle,
  ProducList,
  arrowView,
  productLink,
  paddingnum,
  marginT,
  marginB
}:{
  LinkHandler:(e:React.MouseEvent, title:string, idx?:number)=>void
  title:string
  ProductViews:number
  naviArrow:boolean
  scrollbar:boolean
  ProductTitle?:number
  ProducList:WeeklyListItem[]
  arrowView?:boolean
  productLink?:boolean
  paddingnum?:number
  marginT?:number
  marginB?:number
}) { 
  const navigate = useNavigate();

  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", resizeListener);
  }, [innerWidth]);

  return (
    <ContainerWrap>
      <TitleBox marginT={marginT} marginB={marginB} onClick={()=>{navigate(`/`);}}>
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
        {ProducList &&
        ProducList.length > 0 &&
        ProducList.slice(0,20).map((item,index)=>{
          return(
          <SwiperSlide key={index}>
          <ProductWrap onClick={(e)=>LinkHandler(e,title,item.idx)}>
            <ProductTopbox>
              <ProductTopboxLeft innerWidth={innerWidth}>
                <ProductImage src={item?.image[0]?.file_name}/>
              </ProductTopboxLeft>
              <ProductTopboxRight>
                <ProductTopboxRightWrap innerWidth={innerWidth} style={{marginBottom:5}}>
                  <ProductImage src={item?.image[1]?.file_name} style={{}}/>
                </ProductTopboxRightWrap>
                <ProductTopboxRightWrap innerWidth={innerWidth}>
                  <ProductImage src={item?.image[2]?.file_name}/>
                </ProductTopboxRightWrap>
              </ProductTopboxRight>
            </ProductTopbox>
            <ProductBottombox>
                <ProductBottomImageWrap innerWidth={innerWidth} style={{marginRight:6}}>
                  <ProductImage src={item?.image[3]?.file_name}/>
                </ProductBottomImageWrap>
                <ProductBottomImageWrap innerWidth={innerWidth}>
                  <ProductImage src={item?.image[4]?.file_name}/>
                </ProductBottomImageWrap>
            </ProductBottombox>
            <TextWrap>
              <ProductTitleText>
                {item?.name}
              </ProductTitleText>
              <ProductSubText>
                {item?.week}
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
`;
const ProductTopboxLeft = styled.div<{innerWidth:number}>`
  width:${props => props.innerWidth*0.213}px;
  height:${props => props.innerWidth*0.213*1.270618}px;
  margin-right:5px;
  @media only screen and (max-width: 1440px) {
  }
  @media only screen and (max-width: 768px) {
    width:${props => props.innerWidth*0.584}px;
    height:${props => props.innerWidth*0.584*1.2553}px;
  }
`;
const ProductTopboxRight = styled.div`
  width:33%;
  height:100%;
  display:flex;
  flex-direction:column;
  /* aspect-ratio:110/280; */
`;

const ProductTopboxRightWrap = styled.div<{innerWidth:number}>`
  width:${props => props.innerWidth*0.105}px;
  height:${props => (props.innerWidth)*0.105*1.271}px;
  aspect-ratio:0.7857;
  @media only screen and (max-width: 768px) {
    width:${props => props.innerWidth*0.287}px;
    height:${props => (props.innerWidth)*0.287*1.25825}px;
  }
`

const ProductBottombox = styled.div`
  display:flex;
  width:100%;
  aspect-ratio:340/200;
`;
const ProductBottomImageWrap = styled.div<{innerWidth:number}>`
  width:${props => props.innerWidth*0.159}px;
  height:${props => props.innerWidth*0.158*1.196}px;
  aspect-ratio:158/189;
  @media only screen and (max-width: 768px) {
    width:${props => props.innerWidth*0.433333}px;
    height:${props => props.innerWidth*0.435*1.186}px;
  }
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
  cursor: pointer;
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
  overflow:hidden;
  @media only screen and (max-width: 768px) {
    margin-right:20px;
    /* margin-right:10px; */
  }
`;


const ContainerWrap = styled.div`
  width:100%;
`;

const TitleBox = styled.div<{marginT?:number;marginB?:number;}>`
  margin-top:${props=> props.marginT}px;
  margin-bottom:${props=> props.marginB}px;
  display: flex;
  align-items:center;
  padding: 0px 3px;
  @media only screen and (max-width: 768px) {
    justify-content:space-between;
    padding: 0px 15px;
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
    font-weight: 410;
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
  padding:30px 5px;
`

const ProductTitleText = styled.div`
font-family:'Pretendard Variable';
color:#000000;
  font-size:17px;
  font-weight: 310;
  margin-top:5px;
  /* white-space:nowrap; */
  overflow:hidden;
  text-overflow:ellipsis;
  @media only screen and (max-width: 768px) {
    font-size:12px;
  }
`;
const ProductSubText = styled.div`
font-family:'Pretendard Variable';
color:#000000;
  font-size:16px;
  font-weight: 310;
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
