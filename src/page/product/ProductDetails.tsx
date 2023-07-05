import React, { useContext, useEffect, useState,MouseEvent } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import likeOnImage from '../../asset/image/heart.svg';
import likeOffImage from '../../asset/image/heart.svg';
import { Carousel, Embla, useAnimationOffsetEffect } from '@mantine/carousel';
import { createStyles, Modal } from '@mantine/core';
import { TImage } from '../admin/ProducerList';
import AlertModal from '../../components/Modal/AlertModal';
import { UserContext } from '../../context/user';
import { useRef } from 'react';
import { createBrowserHistory } from 'history';
import { APIAddCartItem, APILikeShop, APIShopDetails } from '../../api/ShopAPI';
import { replaceString } from '../../util/Price';
import { removeHistory } from '../../components/Layout/Header';
import { Select } from '@mantine/core';
import arrDownImage from '../../asset/image/arr_down.png';
import { Virtual,Pagination,Navigation, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Sheet,{SheetRef} from 'react-modal-sheet';
import './ProductDetails.css'
import { APIGetBanner } from '../../api/SettingAPI';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';

export type TShopDetails = {
  idx: number;
  category: 1 | 2 | 3 | 4 | 5 | 6;
  name: string;
  price: number;
  size: string;
  weight: string;
  country: string;
  description: string;
  designer: string;
  sns: string;
  email: string;
  website: string;
  delivery_info: string;
  like_count: number;
  imageList: TImage[];
  optionList: OptionDetailList[];
  isLike: boolean;
};

export type OptionDetailList = {
  idx: number;
  name: string;
};


function ProductDetails() {
  const { idx } = useParams();
  const navigate = useNavigate();
  const history = createBrowserHistory();
  const { user } = useContext(UserContext);
  const [defaultoverlay, setDefaultoverlay] = useState(false)
  const [shopDetails, setShopDetails] = useState<TShopDetails>();
  const [isLike, setIsLike] = useState<boolean>(false);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [initcar, setInitCar] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState(false);
  const [height, setHeight] = useState(0);
  const [imageIdx, setImageIdx] = useState(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [option, setOption] = useState<any>(); // 기존 옵션 리스트
  const [value, setValue] = useState(); // 현재 선택값
  const [addOption, setAddOption] = useState<any>([]); // 선택 누적 리스트
  const [total, setTotal] = useState<number>(0);
  const [showOption, setShowOption] = useState<boolean>(false);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [bottomSheetModal, setBottomSheetModal] = useState(false);
  const ref = useRef<SheetRef>();


  const leftBoxRef = useRef<HTMLDivElement>(null);
  const Leftheight = leftBoxRef.current ? leftBoxRef.current?.offsetHeight : 0;
  const [embla, setEmbla] = useState<Embla | null>(null);
  const TRANSITION_DURATION = 200;
  useAnimationOffsetEffect(embla, TRANSITION_DURATION);
  // 업데이트 되는 값을 set 해줌
  


  const getShopDetails = async () => {
    var array1 = new Array(); //pc
    var array2 = new Array(); //mobile

    const res = await APIGetBanner();
    res.forEach((list:any) => {
        if(list.type === 'P'){
          array1.push(list);
        } else {
          array2.push(list);
        }
      });

    setShopDetails({
      idx: 1,
      category: 1,
      name: 'Folding chair',
      price: 8000,
      size: 'W71 x D65 x H60',
      weight: '스테인레스스틸, 아크릴',
      country: '지역',
      description: '종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 ',
      designer: 'Lee Ji Hong',
      sns: 'SNS',
      email: '이메일',
      website: '웹사이트',
      delivery_info: '배송정보',
      like_count: 11,
      imageList:array2,
      optionList: [
        {
          idx: 1,
          name: '옵션1번',
        },
        {
          idx: 2,
          name: '옵션2번',
        },
      ],
      isLike: true,
      }
      )
      
    // const data = {
    //   idx: idx,
    // };
    // try {
    //   const resData = await APIShopDetails(data);
    //   console.log('resData', resData);
    //   setShopDetails({ ...resData, imageList: resData.imageList.slice(1) });
    //   const array = new Array();
    //   resData.optionList.map((data: any) => {
    //     console.log('data ===>', data);
    //     array.push({
    //       value: data.idx,
    //       label: data.name,
    //     });
    //   });
    //   setOption(array);
    //   console.log('array', array);
    //   setIsLike(resData.isLike);
    // } catch (error) {
    //   console.log(error);
    //   // alert('존재하지 않는 상품입니다.');
    //   // navigate(-1);
    // }
  };

  const onLikeShop = async () => {
    if (user.idx) {
      const data = {
        idx: shopDetails?.idx,
      };
      try {
        const res = await APILikeShop(data);
        console.log(res);
        setIsLike((prev) => !prev);
      } catch (error) {
        console.log(error);
      }
    } else {
      setShowLogin(true);
    }
  };

  const onAddCartItem = async () => {
    if (user.idx) {
      const data = {
        idx: shopDetails?.idx,
        options: addOption.length > 0 ? addOption : [],
        // amount: 1,
      };
      try {
        const res = await APIAddCartItem(data);
        console.log(res);
        setShowModal(true);
      } catch (error) {
        console.log(error);
      }
    } else {
      setShowLogin(true);
    }
  };

  useEffect(() => {
    getShopDetails();
    console.log('shopDetails', window.innerHeight);
  }, []);

  useEffect(() => {
    setInitCar(showImageModal);
  }, [showImageModal]);

  useEffect(() => {
    setHeight(Leftheight);
  }, [Leftheight]);

  useEffect(() => {
    console.log(history.action);
    const backCheck = history.listen(({ location, action }) => {
      console.log(action);
      if (action === 'POP') {
        console.log('뒤로');
      }
    });
    return backCheck;
  }, []);

  const onChangeOption = (data: any) => {
    const result = option.filter((word: any) => word.value === data); //idx 값으로 기존값에서 컬럼 데이터 가져옴
    setValue(data);

    const array = addOption;
    //누적값에 동일 값이 들어왔는지 체크
    const result2 = array.filter((word: any) => word.value === data);
    if (result2.length > 0) {
      //동일값이 있으면 인덱스값을 구해서 인덱스 배열 카운트 추가
      const index = array.findIndex((word: any) => word.value === data);
      array[index].count = array[index].count + 1;
    } else {
      //동일값이 없으면 새로 추가
      result[0].count = 1;
      array.push(result[0]);
    }
    console.log('array===>', array);
    // setAddOption(array);
    // getTotal();
    // getShopDetails();
    return result;
  };

  const getTotal = () => {
    const count = addOption.reduce((a: any, v: any) => (a = a + v.count), 0);
    return count;
  };

  const getPrice = () => {
    const count = getTotal();
    console.log(getTotal(), shopDetails?.price);
    const price = Number(count) * Number(shopDetails?.price);
    console.log(price);
    return price;
  };

  var bullet = ['1번', '2번', '3번'];

  const pagination = {
    // el:<PaginationBox/>,
    clickable: true,
    renderBullet: function (index:number, className:string) {
      let array : string[] = []
      shopDetails?.imageList.map((item)=>{
        array.push(item.file_name);
      })
      // return '<span class="' + className + '">' + array[index] + "</span>";
      // return '<span class="' + className + '"><img src="' + array[index] + '}/>"</span>";
      return '<span class="' + className + '"><img src="' + array[index] +'"/></span>';
    },
  };
  

  useEffect(() => {
    console.log('addOption', addOption);
  }, [addOption]);

  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    if(innerWidth > 768){
      setBottomSheetModal(false)
    } else{
      setBottomSheetModal(true)
    }
    // console.log("innerWidth", innerWidth);
    window.addEventListener("resize", resizeListener);
  }, [innerWidth]);

  return (
    <ContainerWrap>
      <Container>
        {bottomSheetModal && 
        <Draggable 
        bounds={{left: 0, top: 1, right: 0, bottom: defaultoverlay? window.innerHeight-230 : window.innerHeight-170 }}
        axis="y"
        // handle={scrollable}
        defaultPosition={{x: 0, y: defaultoverlay? window.innerHeight-230 : window.innerHeight-170}}
        >
          <ModalInfromBox>
            <EmptyHeightBox height={defaultoverlay? 110 : 50}>
              {defaultoverlay == true ?
              <OverlayBox>
                <NameBox>
                  <NameDesigner>
                    <ProductName>{shopDetails?.name}</ProductName>
                    <Designer>{shopDetails?.designer}</Designer>
                  </NameDesigner>
                  <LikeButton onClick={onLikeShop} src={isLike ? likeOnImage : likeOffImage} />
                </NameBox>
              </OverlayBox>
                :
              <HeaderButtom/>
              }
            </EmptyHeightBox>
            <LeftTopBox>
              <TitleBox>
                {defaultoverlay == false &&
                <NameBox>
                  <NameDesigner>
                    <ProductName>{shopDetails?.name}</ProductName>
                    <Designer>{shopDetails?.designer}</Designer>
                  </NameDesigner>
                  <LikeButton onClick={onLikeShop} src={isLike ? likeOnImage : likeOffImage} />
                </NameBox>
                }
                <BottomBoxContent disabled value={shopDetails?.description}></BottomBoxContent>
                <CategoryBox>
                  <CategoryItem>Furniture</CategoryItem>
                  <CategoryItem>Side Table</CategoryItem>
                  <CategoryItem>Furniture</CategoryItem>
                </CategoryBox>
              </TitleBox>
              <ContentBox>
                {/* <ContentRowWrap>
                  <Title>price</Title>
                  <Content>{shopDetails && replaceString(shopDetails?.price)} ₩</Content>
                </ContentRowWrap> */}
              <ContentRowWrap>
                <Title>Size(cm)</Title>
                <Content>{shopDetails?.size}</Content>
              </ContentRowWrap>
              <ContentRowWrap>
                <Title>Materials</Title>
                <Content>{shopDetails?.weight}</Content>
              </ContentRowWrap>
              
              </ContentBox>
              <RowWrap>
                {/* <BottomBoxTitle>디자이너 & 작품설명</BottomBoxTitle> */}
                <AskButton
                  onClick={() => {
                    if (user.idx) {
                      navigate('/contact/registerask-shop', {
                        state: { idx: shopDetails?.idx, name: shopDetails?.name, designer: shopDetails?.designer },
                      });
                    } else {
                      setShowLogin(true);
                    }
                  }}
                >
                  Contact
                </AskButton>
              </RowWrap>
            </LeftTopBox>
          </ModalInfromBox>
        </Draggable>
        }
        
        <LeftBox ref={leftBoxRef}>
          <LeftTopBox>
            <TitleBox>
              <NameBox>
                <NameDesigner>
                  <ProductName>{shopDetails?.name}</ProductName>
                  <Designer>{shopDetails?.designer}</Designer>
                </NameDesigner>
                <LikeButton onClick={onLikeShop} src={isLike ? likeOnImage : likeOffImage} />
              </NameBox>
              <BottomBoxContent disabled value={shopDetails?.description}></BottomBoxContent>
              <CategoryBox>
                <CategoryItem>Furniture</CategoryItem>
                <CategoryItem>Side Table</CategoryItem>
                <CategoryItem>Object</CategoryItem>
              </CategoryBox>
            </TitleBox>
            <ContentBox>
              <ContentRowWrap>
                <Title>Size(cm)</Title>
                <Content>{shopDetails?.size}</Content>
              </ContentRowWrap>
              <ContentRowWrap>
                <Title>Materials</Title>
                <Content>{shopDetails?.weight}</Content>
              </ContentRowWrap>
              {option && option.length > 0 && (
                <ContentRowWrap>
                  <Title>옵션</Title>
                  <Select
                    placeholder="옵션을 선택해주세요"
                    rightSection={<DownIcon src={arrDownImage} />}
                    styles={(theme) => ({
                      rightSection: { pointerEvents: 'none' },
                      root: { width: '70%', display: 'inline-block' },
                    })}
                    variant="unstyled"
                    value={value}
                    data={option}
                    onChange={(data) => {
                      onChangeOption(data);
                    }}
                  />
                </ContentRowWrap>
              )}
            </ContentBox>
            <RowWrap>
                {/* <BottomBoxTitle>디자이너 & 작품설명</BottomBoxTitle> */}
                <AskButton
                  onClick={() => {
                    if (user.idx) {
                      navigate('/contact/registerask-shop', {
                        state: { idx: shopDetails?.idx, name: shopDetails?.name, designer: shopDetails?.designer },
                      });
                    } else {
                      setShowLogin(true);
                    }
                  }}
                >
                  Contact
                  {/* <OrderButtonText>문의하기</OrderButtonText> */}
                </AskButton>
            </RowWrap>
          </LeftTopBox>
          
        </LeftBox>
        <RightBox>
          <SwiperWrap>
            <Swiper 
              // modules={[Navigation,Pagination]}
              // mousewheel={true}
              modules={[Pagination,Scrollbar]}
              scrollbar={innerWidth <= 768? false : true}
              // onSlideChange={() => {/*...*/}}
              // allowTouchMove={false}
              // noSwiping={false}
              // oneWayMovement={true}
              // pagination={{
              //   clickable: true,
              // }}
              // simulateTouch={false}
              // shortSwipes={false}
              // setWrapperSize={true}
              pagination={innerWidth <= 768? false :pagination}
              style={{
                maxHeight:window.innerHeight*1.5,backgroundColor:'white'
              }}
              // slidesPerView={innerWidth <= 768? 990/innerWidth : innerWidth <= 1440? 1700/innerWidth :1800/innerWidth}
              slidesPerView={'auto'}
              // navigation={true}
              // pagination={{ clickable: true }}
              // scrollbar={ true }
              direction={'vertical'}
              // slidesPerView={3}
              spaceBetween={0}
            >
              {shopDetails?.imageList.map((item, index) => (
                <SwiperSlide key={item.idx} virtualIndex={index}>
                  {/* {slideContent} */}
                  <ImageBox2>
                    <ProductImage src={item.file_name}/>
                    {/* {item.file_name} */}
                  </ImageBox2>
                </SwiperSlide>
              ))}
                <SwiperSlide>
                  <EmptyHeightBox2 height={300}/>
                </SwiperSlide>
            </Swiper>
          </SwiperWrap>
        </RightBox>
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
        <AlertModal
          visible={showOption}
          setVisible={setShowOption}
          onClick={() => {
            setShowOption(false);
          }}
          text="옵션을 선택해주세요"
        />
      </Container>
      <AlertModal
        visible={showModal}
        setVisible={setShowModal}
        onClick={() => {
          setShowModal(false);
        }}
        text="장바구니에 상품이 추가되었습니다."
      />
    </ContainerWrap>
  );
}

const ContainerWrap = styled.div`
  display: flex;
  flex-direction: column;
  width:100%;
  /* margin-bottom:100px; */
  /* background-color: palegoldenrod; */
  @media only screen and (max-width: 768px) {
    
  }
`;

const Container = styled.div`
  display: flex;
  height:100%;
  flex-direction: row;
  /* border-top: 1px solid #e0e0e0; */
  background-color: #ffffff;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
    border-top: 0;
  }
`;

const BottomContainer = styled(Container)`
  min-height: 400px;
`;

const LeftBox = styled.div`
  padding: 0 4.21875% 0 2.708333%;
  display: flex;
  min-width:28.12%;
  max-width:540px;
  /* min-width: 540px; */
  max-height:850px;
  flex-direction: column;
  justify-content:space-between;
  text-align: left;
  /* border-right: 1px solid #121212; */
  @media only screen and (max-width: 768px) {
    width: 100%;
    /* border-right: 0;
    position:absolute;
    bottom:500px;
    z-index:9999; */
    display:none
  }
`;

const RightBox = styled.div`
  display: flex;
  width:100%;
  flex-direction: column;
  overflow: hidden;
  @media only screen and (max-width: 768px) {
    width:100%;

  }
`;
const PaginationBox = styled.div`
   @media only screen and (max-width: 768px) {
    /* display:none; */
  }
`;

const ModalInfromBox = styled.div`
  width:100%;
  position:absolute;
  height:100vh;
  /* overflow:hidden; */
  /* border-radius:10px; */
  z-index:99;
  background:rgba(255,255,255,0.95);
`;
const EmptyHeightBox = styled.div<{height:number}>`
  width:100%;
  height:${props => props.height}px;
  border-bottom:1px solid #D9D9D9;
`;
const EmptyHeightBox2 = styled.div<{height:number}>`
  width:100%;
  height:${props => props.height}px;
`;
const HeaderButtom = styled.div`
// tranform: translateY(-1px);
  position:absolute;
  top:20px;
  left:50%;
  transform:translate(-50%,0);
  width:55px;
  border:1px solid #a5a5a5;
  border-radius:20px;
  @media only screen and (max-width: 768px) {
    width:45px;
  }
`;
const LeftTopBox = styled.div`
  position: relative;
  width: 100%;
  height: calc(100vh - 200px);
  padding: 0;
  @media only screen and (max-width: 768px) {
    padding: 0 20px;
    /* position: static;
    bottom:0; */
  }
`;

const LeftMiddleBox = styled.div`
  width: 100%;
  position: relative;
  padding: 10px 50px 60px 50px;
  @media only screen and (max-width: 768px) {
    padding: 10px 18px 70px;
  }
`;

const LeftConBox = styled.div`
  width: 100%;
  height: 100%;
  padding-bottom: 5rem;
  // border-bottom: 1px solid #121212;
  // padding: 0 50px 50px 50px;
  // @media only screen and (max-width: 768px) {
  //   padding: 0 18px 30px;
  // }
`;

const LeftBottomBox = styled.div`
  width: 100%;
  position: relative;
  padding: 0 50px 50px 50px;
  @media only screen and (max-width: 768px) {
    padding: 0 18px 30px;
  }
`;

const DeliveryInfoWrap = styled(LeftBottomBox)`
  padding-top: 50px;
  border: 0;
  @media only screen and (max-width: 768px) {
    padding: 30px 20px;
    border-top: 1px solid #121212;
  }
`;
const OverlayBox = styled.div`
  padding:30px 20px 10px;
`
const NameBox = styled.div`
  width:100%;
  display:flex;
  justify-content:space-between;
  margin-top:100px;
  margin-bottom:70px;
  @media only screen and (max-width: 1440px) {
    margin-top:70px;
    margin-bottom:50px;
  }
  @media only screen and (max-width: 768px) {
    margin-top:10px;
    margin-bottom:10px;
    font-size:14px;
  }
`;
const CategoryBox = styled.div`
  display:flex;
  flex-wrap:wrap;
  margin-top:49px;
  @media only screen and (max-width: 1440px) {
    margin-top:20px;
  }

`
const CategoryItem = styled.span`
  font-size:17px;
  font-weight:460;
  padding:10px 17px;
  border-radius:5px;
  margin:0 11px 11px 0;
  border:1px solid #B4B4B4;
  @media only screen and (max-width: 1440px) {
    font-size:15px;
  }
  @media only screen and (max-width: 768px) {
    padding:5px 10px;
    font-size:14px;
  }
`
const Xbox = styled.div`
  width:20px;
  height:20px;
  position:absolute;
  top:10px;
  right:20px;
  background-color:blue;
  z-index:9999;
`

const ProductImage = styled.img`
  width: 100%;
  height:100%;
  object-fit:cover;
  @media only screen and (max-width: 768px) {
    object-fit:cover;
  }
  @media only screen and (max-width: 450px) {
    object-fit:contain;
  }
`;
const TitleBox = styled.div`
  margin-bottom: 35px;
  @media only screen and (max-width: 768px) {
    margin-bottom: 18px;
  }
`;
const NameDesigner = styled.div`
  text-align:start;
`
const ProductName = styled.h3`
font-family:'Pretendard Variable';
font-weight: 360;
  color: #121212;
  font-size: 22px;
  margin: 0px;
  flex-wrap: wrap;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const Designer = styled.span`
font-family:'Pretendard Variable';
  font-weight: 360;
  color: #121212;
  font-size: 22px;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const LikeButton = styled.img`
  width:35px;
  height: 30px;
  cursor: pointer;
  margin-top: 5px;
  @media only screen and (max-width: 768px) {
    height: 25px;
  }
`;

const CartButton = styled.img`
  height: 33px;
  cursor: pointer;
  margin-top: 5px;
  margin-right: 10px;
  @media only screen and (max-width: 768px) {
    height: 25px;
  }
  `;

const ContentBox = styled.div`
  margin:65px 3.48px 90.85px 6.63px;
  @media only screen and (max-width: 768px) {

  }
`;

const Title = styled.span`
font-family:'Pretendard Variable';
text-align:start;
  font-weight: 360;
  color: #121212;
  display: inline-block;
  width: 80px;
  font-size: 17px;
  @media only screen and (max-width: 1440px) {
    font-size: 14px;
  }
  @media only screen and (max-width: 768px) {
    width: 60px;
    font-size: 12px;
  }
`;

const Content = styled.span`
font-family:'Pretendard Variable';
  font-weight: 310;
  color: #121212;
  font-size: 16px;
  margin-left:20px;
  @media only screen and (max-width: 1440px) {
    font-size: 14px;
  }
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const ContactTitle = styled(Title)`
  font-size: 14px;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const ContactContent = styled.a`
  flex: 1;
  font-size: 14px;
  font-weight: 410;
  color: #121212;
  font-size: 15px;
  text-decoration: none;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const BottomBoxTitle = styled.h3`
  font-weight: 500;
  color: #121212;
  font-size: 16px;
  margin-bottom: 15px;
  margin-top: 50px;
  @media only screen and (max-width: 768px) {
    margin-top: 30px;
    font-size: 14px;
  }
`;

const BottomBoxContent = styled.textarea`
font-family:'Pretendard Variable';
  width: 100%;
  min-height: 230px;
  overflow: scroll;
  outline: 0;
  line-height: 30px;
  border: 0;
  font-size: 17px;
  font-weight:310;
  color: #121212;
  resize: none;
  background-color: #fff;
  -webkit-text-fill-color: #121212;
  /* overflow:hidden; */
  text-overflow:ellipsis;
  opacity: 1;
  @media only screen and (max-width: 768px) {
    background-color: transparent;
    margin-top: 20px;
    height: 30vh;
    font-size: 12px;
    line-height: 20px;
  }
  &::-webkit-scrollbar {
    width: 0;
  }
`;

const ModalminusButton = styled.div<{isopen:boolean,position:string}>`
  display:${(props)=> props.isopen? 'none':'block'};
  position:${(props)=> props.position == 'bottom' && 'fixed'};
  bottom:${(props)=> props.position == 'bottom' && '60px'};
  text-align:center;
  font-size:23px;
  font-weight:bold;
  width:100%;
`;
const ContentRowWrap = styled.div`
  display:flex;
  width:100%;
  justify-content:space-between;
  @media only screen and (max-width: 768px) {
    margin-top: 10px;
  }
`;

const ImageBox = styled.div`
  height: 100%;
  width: 100%;
  text-align: left;
  overflow: hidden;
`;

const ModalImageBox = styled.div`
  width: 100%;
  height: 90vh;
`;

const ImageBox2 = styled.div`
  width: 85%;
  aspect-ratio:1;
  /* height:100%; */
  /* max-height:800px; */
  /* overflow: hidden; */
  /* aspect-ratio: 0.8; */
  

  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;
const PagenationDiv = styled.div`
  /* width: 100%; */
  width: 100px;
  height:100px;
  /* max-height:800px; */
  /* object-fit:contain; */
  /* overflow: hidden; */
  /* background-color:aqua; */
  /* aspect-ratio: 0.8; */
`;

const LeftLabelBox = styled.div`
  display: flex;
  width: 60%;
  font-size: 16px;
  padding: 0.4rem 0rem;
  align-items: center;
  float: left;
  @media only screen and (max-width: 768px) {
    padding: 0.4rem 0rem;
    font-size: 14px;
  }
`;

const SliderImage = styled.img`
  cursor: pointer;
  object-fit: cover;
  height: 100%;
  max-height: 1096px;
  max-width: 100%;
  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;

const LeftButton = styled.img`
  width: 45px;
  cursor: w-resize;
`;

const RightButton = styled.img`
  width: 45px;
  cursor: e-resize;
`;

const LeftButtonMobile = styled(LeftButton)`
  width: 45px;
`;

const RightButtonMobile = styled(RightButton)`
  width: 45px;
`;

const OrderButton = styled.div`
  // position: absolute;
  // right: 49px;
  // bottom: 60px;
  margin-top: 1rem;
  float: right;
  width: 130px;
  height: 40px;
  background-color: #398049;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  @media only screen and (max-width: 768px) {
    right: 19px;
    bottom: 33px;
    width: 100px;
    height: 35px;
    font-size: 13px;
  }
  &:hover {
    background-color: white;
    border: 1px solid #398049;
    color: #398049;
  }
`;

const DownIcon = styled.img`
  width: 10px;
  height: 10px;
  cursor: pointer;
  @media only screen and (max-width: 460px) {
    width: 8px;
    height: 8px;
    margin-left: 15px;
  }
`;

const AskButton = styled.div`
    font-family: "Pretendard Variable";
    width: 100%;
    height: 53px;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    border-radius: 7px;
    font-weight: 310;
    cursor: pointer;
    font-size: 17px;
    background-color: rgb(0, 0, 0);
    border: 0;
    color: rgb(236, 236, 236);
  @media only screen and (max-width: 768px) {
    font-size: 15px;
  }
  &:hover {
    background-color: #2e2e2e;
    color: white;
  }
`;

const RowWrap = styled.div`
  align-items: flex-end;
  justify-content:flex-end;
  margin-bottom:30px;
  @media only screen and (max-width: 768px) {
    position:fixed;
    width:calc(100% - 40px);
    bottom:150px;
    margin-bottom:0px;
  }
`;

const LeftOption = styled.div`
  min-height: 40px;
  line-height: 2;
`;
const CartCardWrap = styled.div``;

const SwiperWrap = styled.div`
  /* background-color:#cecece; */
  width:80%;
  max-width:1000px;
  height:100%;
  /* max-height:800px; */
  /* width:100%; */
  @media only screen and (max-width: 1440px) {
    min-width:49.27%;
    max-width:1000px;
  }
  @media only screen and (max-width: 768px) {
    width:100%;
  }

`;

const AmountControllerWrap = styled.div`
  display: flex;
  height: 100%;
  flex-direction: row;
  align-items: center;
  // padding: 0.5rem 0;
  justify-content: space-between;
  @media only screen and (max-width: 768px) {
    margin-top: 5px;
    // padding: 0.4rem 0.5rem;
  }
`;

const AmountControllerBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 23px;
  border: 1px solid #121212;
  border-left: 0;
  border-right: 0;
`;

const AmountControllerButton = styled.div`
  display: flex;
  width: 23px;
  height: 23px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid #121212;
`;

const AmountControllerButtonImage = styled.img`
  width: 7px;
  height: 7px;
`;
const AmountControllerButtonImageMinus = styled(AmountControllerButtonImage)`
  height: auto;
`;

const AmountText = styled.span`
  font-family:'Pretendard Variable';;
  font-size: 12px;
  width: 30px;
  text-align: center;
  line-height: 23px;
  @media only screen and (max-width: 768px) {
    font-size: 11px;
  }
`;

const DeleteButton = styled.div`
  margin-right: 5px;
  padding: 5px;
  cursor: pointer;
`;

const DeleteButtonImage = styled.img`
  width: 17px;
  height: 17px;
  margin-top: -2px;
  @media only screen and (max-width: 768px) {
    width: 14px;
    height: 14px;
  }
`;

const LeftMiddleTotal = styled.p`
  position: absolute;
  font-size: 16px;
  bottom: 0;
  right: 4rem;
  padding: 0;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
    right: 2rem;
  }
`;

export default ProductDetails;
