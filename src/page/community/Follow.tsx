import React, { useCallback, useContext, useEffect, useRef, useState ,memo } from 'react';
import styled from 'styled-components';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Autoplay from 'embla-carousel-autoplay';
import leftButtonImage from '../../asset/image/ico_prev.png';
import rightButtonImage from '../../asset/image/ico_next.png';
import leftButtonMobileImage from '../../asset/image/ico_prev_mobile.png';
import NoProfileImage from '../../asset/image/Profile.svg';
import { createStyles, Image } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { APIGetBanner } from '../../api/SettingAPI';
import { FollowArtistListType, FollowCardType, LikeSnsListType, SnsdetailsType, TImage, TProductListItem, snsType } from '../../types/Types';
import { UserContext } from '../../context/user';
import AlertModal from '../../components/Modal/AlertModal';
import { useLayoutEffect } from 'react';
import { createBrowserHistory } from 'history';
import ShowTypeButton from '../../components/Shop/ShowTypeButton';
import SearchBox from '../../components/Product/SearchBox';
import { APILikeShop, APIShopList } from '../../api/ShopAPI';
import TopButton from '../../components/Product/TopButton';
import { removeHistory } from '../../components/Layout/Header';
import FairCard from '../../components/Shop/FairCard';
// swiper
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import FollowCard from '../../components/Shop/FollowCard';



function Follow({saveHistory,LikeSnsList,FollowArtistList}
  :
  {saveHistory:(e:React.MouseEvent, idx: number)=>void,
  LikeSnsList?:FollowCardType[]
  FollowArtistList?:FollowArtistListType[]
}) {
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  const keywordParams = searchParams.get('keyword') ?? '';
  const categoryParams = (searchParams.get('category') as '1' | '2' | '3' | '4' | '5' | '6') ?? '1';

  const [category, setCategory] = useState<'1' | '2' | '3' | '4' | '5' | '6'>(categoryParams);
  const [showLogin, setShowLogin] = useState(false);
  const [history, setHistory] = useState(false);
  const [keyword, setKeyword] = useState<string>(keywordParams);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);

  const { user } = useContext(UserContext);
  const interSectRef = useRef(null);




  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", resizeListener);
  }, [innerWidth]);
 
  const onSearch = () => {
    navigate(
      {
        pathname: '/shop',
        search: createSearchParams({
          keyword: keyword,
          category,
        }).toString(),
      },
      { replace: true }
    );
  };

  return (
    <Container>
      <FollowTitle>Following Artist</FollowTitle>
        <SwiperWrap>
          <Swiper
            modules={[Navigation, Pagination, Scrollbar]}
            slidesPerView={innerWidth<=768? innerWidth/110:(innerWidth-100)/110}
          >
            {FollowArtistList?
            FollowArtistList.map((item,index) => {
              return (
              <SwiperSlide key={index}>
                <FollowingListWrap onClick={()=>{navigate(`/MobileProfile/${item.designer.idx}`,{state:item.designer.idx});}}>
                  <ImageWrap>
                    <ProfileImage src={item.designer.image? item.designer.image.file_name : NoProfileImage}/>
                  </ImageWrap>
                  <FollowingName>
                    {item?.designer.name}
                  </FollowingName>
                </FollowingListWrap>
              </SwiperSlide>
              );
            })
            :
            <>
            팔로우 아티스트가 없습니다.
            </>
            }
          </Swiper>
        </SwiperWrap>
      <ProductListWrap>
        {LikeSnsList ?
        LikeSnsList.map((item,index)=>{
          return(
            // <div onClick={()=>console.log(item)}>asdsadasd</div>
            <FollowCard
              item={item}
              key={item.idx}
              onClick={(e) => saveHistory(e, item.idx)}
              index={index}
            />
          )
          })
          :
          <>
          팔로우 아티스트가 없습니다.
          </>
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
        text="회원가입 후 이용 가능합니다."
      />
      <TopButton />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin:0 50px;
  @media only screen and (max-width: 768px){
    margin:0;
  }
`;

const ProductListWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-top:34.76px;
`;

const FollowTitle = styled.div`
font-family:'Pretendard Variable';
  font-size:14px;
  font-weight: 410;
  text-align:start;
  margin:25px 20px;
  @media only screen and (max-width: 768px) {
    font-size:12px;
  }
`

const SwiperWrap = styled.div`
  /* display:flex; */
  align-items: center;
  margin: 0px 5px;
  /* @media only screen and (max-width: 1024px) {
    display: none;
  } */
`;

const CategorySelectButton = styled.div<{ selected: boolean }>`
  background-color: ${(props) => (props.selected ? '#121212' : '#fff')};
  border : 1px solid ${(props) => (props.selected ? '#121212' : '#7a7a7a')};
  padding: 0 18px;
  margin-right: 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  cursor: pointer;
  @media only screen and (max-width: 1440px) {
    height: 27px;
  }
`;

const CategorySelectButtonText = styled.span<{ selected: boolean }>`
  color: ${(props) => (props.selected ? '#fff' : '#121212')};
  font-size: 12px;
  font-weight: 410;
  text-transform: capitalize;
`;
const FollowingListWrap = styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
`;
const TitleWrap = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin:20px 0%;
  @media only screen and (max-width: 768px) {
    display:none
  }
`;
const FollowingName = styled.span`
font-family:'Pretendard Variable';
  width:90%;
  font-size: 12px;
  font-weight: 410;
  margin-top:5px;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  @media only screen and (max-width: 768px) {
    font-size: 9px;
  }
`;
const ImageWrap = styled.div`
  width:80px;
  height:80px;
  aspect-ratio:1;
  border-radius:50%;
  cursor: pointer;

  @media only screen and (max-width: 768px) {
    width:70px;
    height:70px;
  }
`
const ProfileImage = styled.img`
  width:80px;
  height:100%;
  box-sizing:border-box;
  border:1px solid #e0e0e0;
  border-radius:50%;
  @media only screen and (max-width: 768px) {
    width:70px;
  }
`

export default Follow;
