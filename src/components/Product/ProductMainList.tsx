import React,{useState,useEffect,useRef} from 'react';
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
import rotateLeft from '../../asset/image/right.svg'
import rightarrowIcon from '../../asset/image/ico_next_mobile.png'
import { TImage } from '../../types/Types';
import './ProductMainList.css'

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
  aspect,
  paddingnum,
  marginRight
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
  aspect?:number
  paddingnum?:number
  marginRight?:number
}) {
  const navigationPrevRef = React.useRef(null)
  const navigationNextRef = React.useRef(null)

  const navigate = useNavigate();

  const LinkHandler = (productLink:string,idx?:number)=>{
    if(productLink === 'FairsM'){
      navigate(`/FairContent/${idx}`)
    } else if (productLink === 'FairsW'){
      navigate(`/MainTab`)
    } else if (productLink.includes('Home')) {
      navigate(`/personalpage/${idx}`)
    } else if (productLink.includes('Latest')) {
      navigate(`/productdetails/${idx}`)
    } else if (productLink.includes('Trending')) {
      navigate(`/MobileProfile/${idx}`)
    } else if (productLink.includes('Featured')) {
      navigate(`/MobileProfile/${idx}`)
    } else {
      console.log(productLink,idx)
    }
  }

  const [like, setLike] = useState(false)

  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", resizeListener);
  }, [innerWidth]);

  return (
    <ContainerWrap>
      
      <TitleBox 
      // onClick={()=>{navigate(`/${link}`);}}
      >
        {/* <a href={item?.link}> */}
        <TitleText titlesize={titlesize}>{title}</TitleText>
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
        {ProducList.map(item=>{
          return(
            <SwiperSlide>
              <ProductWrap marginRight={marginRight? marginRight:20}>
                {title?.includes('Featured') &&
                <ToptextWrap>
                  <FeaturedTitleText>
                    MoreTitleMoreTitleMoreTitleMoreTitleMoreTitleMoreTitle{item.idx}
                  </FeaturedTitleText>
                  <LikeButton onClick={()=>{setLike(!like)}} src={like ? likeOnImage : likeOffImage} />
                </ToptextWrap>
                }
                <ProductImageWrap aspect={aspect? aspect:1} height={innerWidth} 
                onClick={()=>LinkHandler(productLink?productLink:title,item.idx)}
                >
                  <ProductImage src={item.file_name}/>
                </ProductImageWrap>
                {!title?.includes('Featured') &&
                <TextWrap title={title}>
                  <ProductTitleText>
                    MoreTitleMoreTitleMoreTitleMoreTitleMoreTitleMoreTitle{item.idx}
                  </ProductTitleText>
                  <ProductSubText>
                    MoreTextMoreTextMoreTextMoreTextMoreTextMoreTextMoreTextMoreTextMoreTextMoreText{item.idx}
                  </ProductSubText>
                </TextWrap>
                }
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
  position:absolute;
  top:35%;
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
  position:absolute;
  top:35%;
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
  padding:30px 10px;
  @media only screen and (max-width: 768px) {
    padding:0 10px;
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
  width: 20px;
  height: 20px;
  @media only screen and (max-width: 768px) {
    width: 20px;
    height: 20px;
  }
`;
const ProductImageWrap = styled.div<{aspect:number,height?:number}>`
  /* max-width:350px; */
  width:100%;
  text-align:start;
  aspect-ratio:${props => props.aspect? props.aspect : 1};
  @media only screen and (max-width: 768px) {

  }
`;


const ContainerWrap = styled.div`
  width:100%;
`;
export const TitleBox = styled.div`
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

const TitleText = styled.span<{titlesize?:number}>`
font-family:'Pretendard Variable';
  font-size:${props=>props.titlesize? props.titlesize : 22}px;
  font-weight: 360;
  @media only screen and (max-width: 1440px) {
    font-size:18px;
  }
  @media only screen and (max-width: 768px) {
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
  font-weight: 360;
  margin-top:5px;
  /* white-space:nowrap; */
  overflow:hidden;
  text-overflow:ellipsis;
  @media only screen and (max-width: 768px) {
    font-weight:500;
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
    font-weight: 410;
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

export default ProductMainList;
