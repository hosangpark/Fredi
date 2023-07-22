import React,{useState,useRef} from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
// Import Swiper styles
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import profileImage from '../../asset/image/Profile.svg';
import rightarrowIcon from '../../asset/image/ico_next_mobile.png'
import { ArtistList } from '../../types/Types';

function MainArtistList({
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
  productLink,
  arrowView,
  titlesize,
  aspect,
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
  ProducList:ArtistList[]
  productLink?:string
  arrowView?:boolean
  titlesize?:number
  aspect?:number
  paddingnum?:number
  marginT?:number
  marginB?:number
}) {

  const navigate = useNavigate();
  const [follow,followed] = useState(false)
 
  return (
    <ContainerWrap>
      <TitleBox marginT={marginT} marginB={marginB}
      >
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
        {ProducList.map((item,index)=>{
          return(
            <SwiperSlide key={index}>
              <ProductWrap>
                <ProductImageWrap aspect={aspect? aspect:1} onClick={(e)=>LinkHandler(e,title,item.idx)}>
                  <ProductImage src={item.image?.file_name ? item.image?.file_name : profileImage}/>
                </ProductImageWrap>
                <TextWrap>
                  <ProductTitleText>
                    {/* {item.idx} */}
                    More Artis Name More Artis Name More Artis Name
                  </ProductTitleText>
                  <FollowButtonBox follow={follow} style={{marginRight:0}} onClick={()=>followed(!follow)}>
                    Follow
                  </FollowButtonBox>
                  {/* <ProductSubText>
                    {item.idx}
                  </ProductSubText> */}
                </TextWrap>
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
const FollowButtonBox = styled.span<{follow:boolean}>`
font-family:'Pretendard Variable';
  padding:5px 25px;
  border:0.5px solid #000000;
  background-color:${props=>props.follow? '#505050':'#ffffff'};
  color:${props=>props.follow? '#ffffff': '#505050'};
  box-sizing:border-box;
  border-radius:40px;
  font-weight: 310;
  cursor: pointer;
  font-size:15px;
  white-space:nowrap;
  
  @media only screen and (max-width: 768px) {
    border-radius:40px;
    font-size:12px;

  }
`;

const ProductImage = styled.img`
  width: 100%;
  height:100%;
  border-radius:50%;
`;
const ProductContainer = styled.div`
  display: flex;
  /* overflow-x: scroll; */
  -ms-overflow-style: none;
  scrollbar-width: none; 
`;
const TextWrap = styled.div`
text-align:center;
  @media only screen and (max-width: 768px) {
    padding:0 10px;
  }
`
const ProductWrap = styled.div`
  /* max-width:350px; */
  align-items:center;
  margin-right:20px;
  @media only screen and (max-width: 768px) {
    margin-right:10px;
  }
`;
const ProductImageWrap = styled.div<{aspect:number}>`
  /* max-width:350px; */
  width:100%;
  cursor: pointer;
  border-radius:50%;
  text-align:start;
  aspect-ratio:${props => props.aspect? props.aspect : 1};
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
  font-size:22px;
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
width:70%;
font-family:'Pretendard Variable';
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  font-size:17px;
  font-weight: 310;
  color:#000000;
  margin:20px auto 16px auto;
  @media only screen and (max-width: 768px) {
    margin:10px auto 12px auto;
    font-size:12px;
  }
`;
const ProductSubText = styled.div`
font-family:'Pretendard Variable';
  font-size:16px;
  font-weight: 310;
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

export default MainArtistList;
