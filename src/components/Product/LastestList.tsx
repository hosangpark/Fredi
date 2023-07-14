import React,{useState,useEffect,useRef,useLayoutEffect} from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import likeOnImage from '../../asset/image/heart.svg';
import likeOffImage from '../../asset/image/heart.svg';
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
import rotateLeft from '../../asset/image/right.svg'
import rightarrowIcon from '../../asset/image/ico_next_mobile.png'
import { TImage, TProductListItem } from '../../types/Types';
import './ProductMainList.css'

function LastestList({
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
  ProducList,
  productLink,
  arrowView,
  titlesize,
  aspect,
  paddingnum,
  marginRight,
  marginT,
  marginB
}:{
  LinkHandler:(e:React.MouseEvent, title:string, idx?:number)=>void
  title:string
  ProductViews:number
  naviArrow:boolean
  scrollbar:boolean
  ProducList:TProductListItem[]
  productLink?:string
  arrowView?:boolean
  titlesize?:number
  aspect?:number
  paddingnum?:number
  marginRight?:number
  marginT?:number
  marginB?:number
}) {
  const navigationPrevRef = React.useRef(null)
  const navigationNextRef = React.useRef(null)

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
      <TitleBox marginT={marginT} marginB={marginB}
      // onClick={()=>{navigate(`/${link}`);}}
      >
        {/* <a href={item?.link}> */}
        <TitleText titlesize={titlesize}>
          {title}
        </TitleText>
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
        navigation= {naviArrow ?
            {
              prevEl: navigationPrevRef.current,
              nextEl: navigationNextRef.current,
            }
            :
            false
            }
        // spaceBetween={30}
        scrollbar={ scrollbar }
        // pagination={{ clickable: true }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log('slide change')}
        style={{paddingBottom:paddingnum? paddingnum : 0}}
      >
        {ProducList.map((item,index)=>{
          return(
            <SwiperSlide key={index}>
              <ProductWrap marginRight={marginRight? marginRight:20}>
                <ProductImageWrap aspect={aspect? aspect:1} height={innerWidth} 
                onClick={(e)=>LinkHandler(e,title,item.idx)}
                >
                  <ProductImage src={item.image[0].file_name}/>
                </ProductImageWrap>
                <TextWrap title={title}>
                  <ProductTitleText>
                    {item.name}
                  </ProductTitleText>
                  <ProductSubText>
                    {item.designer}
                  </ProductSubText>
                </TextWrap>
              </ProductWrap>
            </SwiperSlide>
          )
        })}
        {naviArrow == true &&
        <>
        <LeftArrow ref={navigationPrevRef}>
          <RotateImage src={rotateLeft}/>
        </LeftArrow>
        <RightArrow ref={navigationNextRef}>
          <img src={rotateLeft}/>
        </RightArrow>
        </>
        }
      </Swiper>
    </ContainerWrap>
  );
}

const RotateImage = styled.img`
  transform:rotate(180deg);
`
const LeftArrow = styled.div`
display:flex;
align-items:center;
justify-content:center;
border:1px solid #dfdfdf;
  position:absolute;
  top:30%;
  left:20px;
  width:47px;
  height:47px;
  border-radius:50%;
  background:#FFFFFF;
  z-index:99999;
`
const RightArrow = styled.div`
display:flex;
align-items:center;
justify-content:center;
border:1px solid #dfdfdf;
  position:absolute;
  top:30%;
  right:20px;
  width:47px;
  height:47px;
  border-radius:50%;
  background:#FFFFFF;
  z-index:99999;
`

const ProductImage = styled.img`
  width: 100%;
  height:100%;
  object-fit:cover;
`;

const TextWrap = styled.div<{title?:string}>`
  display:${props => props.title?.includes('Home')? 'none':'block'};
  padding:40px 5px 0;
  @media only screen and (max-width: 768px) {
    padding:10px 10px 0;
  }
`
const ToptextWrap = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;;
  padding:0 10px 15px;
  @media only screen and (max-width: 768px) {
    padding:0 10px 10px;
  }
`
const ProductWrap = styled.div<{marginRight:number}>`
  /* max-width:350px; */
  margin-right:${props => props.marginRight}px;
  text-align:start;
  @media only screen and (max-width: 768px) {
    margin-right:10px;
  }
`;
const LikeButton = styled.img`
  width: 18px;
  height: 17px;
  object-fit:contain;
  /* @media only screen and (max-width: 768px) {
    width: 18px;
    height: 15px;
  } */
`;
const ProductImageWrap = styled.div<{aspect:number,height?:number}>`
  /* max-width:350px; */
  width:100%;
  text-align:start;
  cursor: pointer;
  aspect-ratio:${props => props.aspect? props.aspect : 1};
  @media only screen and (max-width: 768px) {

  }
`;


const ContainerWrap = styled.div`
  width:100%;
`;
export const TitleBox = styled.div<{marginT?:number;marginB?:number;}>`
  display: flex;
  align-items:center;
  margin-top:${props=> props.marginT}px;
  margin-bottom:${props=> props.marginB}px;
  padding: 0px 3px;
  @media only screen and (max-width: 768px) {
    justify-content:space-between;
    padding: 0px 15px;
  }
`;

const TitleText = styled.span<{titlesize?:number}>`
font-family:'Pretendard Variable';
  font-size:${props=>props.titlesize? props.titlesize : 22}px;
  font-weight: 360;
  @media only screen and (max-width: 1440px) {
    font-size:18px;
  }
  @media only screen and (max-width: 768px) {
    font-weight: 410;
    font-size:15px;
  }
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
color:#000000;
  font-size:17px;
  font-weight: 310;
  line-height:1;
  /* white-space:nowrap; */
  overflow:hidden;
  text-overflow:ellipsis;
  @media only screen and (max-width: 768px) {
    font-size:12px;
  }
`;

const FeaturedTitleText = styled.div`
font-family:'Pretendard Variable';
width:70%;
  font-size:17px;
  font-weight: 310;
  margin-top:5px;
  white-space:nowrap;
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
  line-height:1;
  font-weight: 310;
  white-space:nowrap;
  overflow:hidden;
  margin-top:10px;
  margin-bottom:7px;
  text-overflow:ellipsis;
  @media only screen and (max-width: 768px) {
    font-size:12px;
    margin-top:5px;
    margin-bottom:0px;
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

export default LastestList;
