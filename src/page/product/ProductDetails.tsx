import React, { useContext, useEffect, useState,MouseEvent } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import likeOnImage from '../../asset/image/heart_on.png';
import likeOffImage from '../../asset/image/heart_off.png';
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

const useStyles = createStyles((theme, _params, getRef) => ({
  carouselControls: {
    ref: getRef('carouselControls'),
    width: 150,
    justifyContent: 'space-between',
    top: 'unset',
    left: 50,
    bottom: 50,
    padding: '0 20px',
    '@media (max-width: 768px)': { width: '100%', left: 0, bottom: 15 },
  },

  carouselControl: {
    ref: getRef('carouselControl'),
    boxShadow: 'none',
  },

  carouselIndicator: {
    width: 16,
    height: 16,
    transition: 'width 250ms ease',
    borderRadius: 50,
    backgroundColor: '#121212',

    opacity: 0.4,
    '&[data-active]': {
      width: 16,
      borderRadius: 50,
    },
  },
}));

function ProductDetails() {
  const { idx } = useParams();
  const navigate = useNavigate();
  const { classes } = useStyles();
  const history = createBrowserHistory();
  const { user } = useContext(UserContext);
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
      name: '이름',
      price: 8000,
      size: '사이즈',
      weight: '무게',
      country: '지역',
      description: '종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 종이접기와 풍선과 같이 본래 물성은 얇지만, 볼륨감을 ',
      designer: '제작자(디자이너)',
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
    // console.log('shopDetails', shopDetails);
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
    }
    // console.log("innerWidth", innerWidth);
    window.addEventListener("resize", resizeListener);
  }, [innerWidth]);

  return (
    <ContainerWrap>
      <Container>
        <Draggable 
        bounds={{left: 0, top: 10, right: 0, bottom: window.innerHeight-150}}
        axis="y"
        // handle={scrollable}
        defaultPosition={{x: 0, y: window.innerHeight-150}}
        >
          <ModalInfromBox>
            <EmptyHeightBox>
              <HeaderButtom/>
            </EmptyHeightBox>
            <LeftTopBox>
              <TitleBox>
                <NameBox>
                  <ProductName>{shopDetails?.name}</ProductName>
                  <ContentRowWrap>
                    <LikeButton onClick={onLikeShop} src={isLike ? likeOnImage : likeOffImage} />
                  </ContentRowWrap>
                </NameBox>
                  <Designer>{shopDetails?.designer}</Designer>
                  <BottomBoxContent disabled value={shopDetails?.description}></BottomBoxContent>
              </TitleBox>
              <ContentBox>
                <ContentRowWrap>
                  <Title>price</Title>
                  <Content>{shopDetails && replaceString(shopDetails?.price)} ₩</Content>
                </ContentRowWrap>
                <ContentRowWrap>
                  <Title>Size</Title>
                  <Content>{shopDetails?.size}</Content>
                </ContentRowWrap>
                <ContentRowWrap>
                  <Title>Weight</Title>
                  <Content>{shopDetails?.weight}</Content>
                </ContentRowWrap>
                <ContentRowWrap>
                  <Title>Country</Title>
                  <Content>{shopDetails?.country}</Content>
                </ContentRowWrap>
              </ContentBox>
            </LeftTopBox>
            <RowWrap>
                <AskButton
                  onClick={() => {
                    setBottomSheetModal(false)
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
            
          </ModalInfromBox>
        </Draggable>
        {/* <Sheet isOpen={bottomSheetModal} onClose={() => setBottomSheetModal(false)}
        >
          <Sheet.Container>
            <Sheet.Content style={{ paddingBottom: ref.current?.y }}>
              <ModalminusButton onClick={() => setBottomSheetModal(!bottomSheetModal)} isopen={!bottomSheetModal} position={'top'}> ㅡ </ModalminusButton>
              <ModalInfromBox>
                <LeftTopBox>
                  <TitleBox>
                    <NameBox>
                      <ProductName>{shopDetails?.name}</ProductName>
                      <ContentRowWrap>
                        <LikeButton onClick={onLikeShop} src={isLike ? likeOnImage : likeOffImage} />
                      </ContentRowWrap>
                    </NameBox>
                      <Designer>{shopDetails?.designer}</Designer>
                      <BottomBoxContent disabled value={shopDetails?.description}></BottomBoxContent>
                  </TitleBox>
                  <ContentBox>
                    <ContentRowWrap>
                      <Title>price</Title>
                      <Content>{shopDetails && replaceString(shopDetails?.price)} ₩</Content>
                    </ContentRowWrap>
                    <ContentRowWrap>
                      <Title>Size</Title>
                      <Content>{shopDetails?.size}</Content>
                    </ContentRowWrap>
                    <ContentRowWrap>
                      <Title>Weight</Title>
                      <Content>{shopDetails?.weight}</Content>
                    </ContentRowWrap>
                    <ContentRowWrap>
                      <Title>Country</Title>
                      <Content>{shopDetails?.country}</Content>
                    </ContentRowWrap>
                  </ContentBox>
                </LeftTopBox>
                <RowWrap>
                    <AskButton
                      onClick={() => {
                        setBottomSheetModal(false)
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
              </ModalInfromBox>
            </Sheet.Content>
          </Sheet.Container>

          <Sheet.Backdrop />
        </Sheet> */}
        <LeftBox ref={leftBoxRef}>
          <LeftTopBox>
            <TitleBox>
              <NameBox>
                <ProductName>{shopDetails?.name}</ProductName>
                <ContentRowWrap>
                  {/* <CartButton
                    onClick={async () => {
                      if (option.length > 0) {
                        if (addOption.length === 0) {
                          setShowOption(true);
                        } else {
                          onAddCartItem();
                        }
                      } else {
                        onAddCartItem();
                      }
                    }}
                    src={cart}
                  /> */}
                  <LikeButton onClick={onLikeShop} src={isLike ? likeOnImage : likeOffImage} />
                </ContentRowWrap>
              </NameBox>
                <Designer>{shopDetails?.designer}</Designer>
                <BottomBoxContent disabled value={shopDetails?.description}></BottomBoxContent>
            </TitleBox>
            <ContentBox>
              <ContentRowWrap>
                <Title>price</Title>
                <Content>{shopDetails && replaceString(shopDetails?.price)} ₩</Content>
              </ContentRowWrap>
              <ContentRowWrap>
                <Title>Size</Title>
                <Content>{shopDetails?.size}</Content>
              </ContentRowWrap>
              <ContentRowWrap>
                <Title>Weight</Title>
                <Content>{shopDetails?.weight}</Content>
              </ContentRowWrap>
              <ContentRowWrap>
                <Title>Country</Title>
                <Content>{shopDetails?.country}</Content>
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
            {/* <OrderButton
              onClick={async () => {
                if (user.idx) {
                  if (option.length > 0) {
                    if (addOption.length === 0) {
                      setShowOption(true);
                    } else {
                      await onAddCartItem();
                      navigate('/cart');
                    }
                  } else {
                    await onAddCartItem();
                    navigate('/cart');
                  }
                } else {
                  setShowLogin(true);
                }
              }}
            >
              구매하기
            </OrderButton> */}
          </LeftTopBox>
          {addOption.length >= 1 && (
            <LeftMiddleBox>
              {addOption.map((data: any, index: any) => {
                // console.log('fdsfdsfsd', data);
                return (
                  <LeftOption key={index}>
                    <LeftLabelBox>{data.label}</LeftLabelBox>
                    <AmountControllerWrap>
                      <AmountControllerBox>
                        <AmountControllerButton
                          onClick={() => {
                            const array = addOption;
                            console.log(array);
                            if (data.count - 1 === 0) {
                              console.log('dd');
                              array.splice(index, 1);
                              setAddOption(array);
                              getShopDetails();
                            } else {
                              console.log('ss');
                              array[index].count = array[index].count - 1;
                              console.log(array);
                              setAddOption(array);
                              getShopDetails();
                            }
                          }}
                        >
                          <AmountControllerButtonImageMinus src={require('../../asset/image/minus.png')} />
                        </AmountControllerButton>
                        <AmountText>{data.count}</AmountText>
                        <AmountControllerButton
                          onClick={() => {
                            const array = addOption;
                            console.log(array);
                            array[index].count = array[index].count + 1;
                            console.log(array);
                            setAddOption(array);
                            getTotal();
                            getShopDetails();
                          }}
                        >
                          <AmountControllerButtonImage src={require('../../asset/image/plus.png')} />
                        </AmountControllerButton>
                      </AmountControllerBox>
                      <DeleteButton
                        onClick={() => {
                          const array = addOption;
                          console.log(array);
                          array.splice(index, 1);
                          setAddOption(array);
                          getTotal();
                          getShopDetails();
                        }}
                      >
                        <DeleteButtonImage src={require('../../asset/image/close.png')} />
                      </DeleteButton>
                    </AmountControllerWrap>
                  </LeftOption>
                );
              })}
              <LeftMiddleTotal>
                <span style={{ fontSize: '12px' }}>총 구매금액</span>
                <span style={{ marginLeft: '10px', fontSize: '18px' }}>{replaceString(getPrice())} ₩</span>
              </LeftMiddleTotal>
            </LeftMiddleBox>
          )}
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
          {/* <LeftBottomBox>
            
            
            <BottomBoxTitle>CONTACT</BottomBoxTitle>
            <ContentRowWrap>
              <ContactTitle>SNS</ContactTitle>
              {shopDetails?.sns ? (
                <ContactContent href={`https://www.instagram.com/${shopDetails?.sns.split('@')[1]}`} target="_blank">
                  {shopDetails?.sns}
                </ContactContent>
              ) : (
                <ContactContent>-</ContactContent>
              )}
            </ContentRowWrap>
            <ContentRowWrap>
              <ContactTitle>E-mail</ContactTitle>
              {shopDetails?.email ? <ContactContent>{shopDetails?.email}</ContactContent> : <ContactContent>-</ContactContent>}
            </ContentRowWrap>
            <ContentRowWrap>
              <ContactTitle>Website</ContactTitle>
              {shopDetails?.website ? (
                <ContactContent href={`https://${shopDetails?.website}`} target="_blank">
                  {shopDetails?.website}
                </ContactContent>
              ) : (
                <ContactContent>-</ContactContent>
              )}
            </ContentRowWrap>
          </LeftBottomBox> */}
        </LeftBox>
        <RightBox>
          <SwiperWrap>
            <Swiper 
              // modules={[Navigation,Pagination]}
              // mousewheel={true}
              modules={[Pagination,Scrollbar]}
              // pagination={{
              //   clickable: true,
              // }}
              pagination={pagination}
              style={{
                maxHeight:window.innerHeight,backgroundColor:'white'
              }}
              slidesPerView={innerWidth <= 768? 1 : 1.2}
              // navigation={true}
              // pagination={{ clickable: true }}
              // scrollbar={ true }
              direction={'vertical'}
              // slidesPerView={3}
              // spaceBetween={0}
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
        {/* <Modal
          opened={showImageModal}
          onClose={() => setShowImageModal(false)}
          transitionDuration={TRANSITION_DURATION}
          overlayOpacity={0.5}
          size="90vw"
          padding={0}
          withCloseButton={false}
          styles={{
            root: { backgroundColor: 'rgba(255,255,255,0.6)', '& div': { backgroundColor: 'transparent', boxShadow: 'none' } },
          }}
        >
          {initcar && (
            <Carousel
              initialSlide={imageIdx}
              getEmblaApi={setEmbla}
              nextControlIcon={<RightButtonMobile src={rightButtonImage} />}
              previousControlIcon={<LeftButtonMobile src={leftButtonImage} />}
              styles={{
                control: { background: 'transparent', width: 45, border: 0 },
                controls: { width: 140, top: 'unset', left: '50%', bottom: 50, transform: 'translateX(-50%)' },
              }}
              classNames={{
                control: classes.carouselControl,
              }}
            >
              {shopDetails?.imageList.map((item, index) => (
                <Carousel.Slide key={`modal-${item.idx}`}>
                  <ModalImageBox onClick={() => setShowImageModal(false)}>
                    <SliderImage src={item.file_name} style={{ objectFit: 'contain', width: '100%' }} />
                  </ModalImageBox>
                </Carousel.Slide>
              ))}
            </Carousel>
          )}
        </Modal> */}
      </Container>
      {/* <BottomContainer>
        <LeftBox>
          <DeliveryInfoWrap>
            <BottomBoxContent disabled value={shopDetails?.delivery_info ?? '배송정보 없음'}></BottomBoxContent>
          </DeliveryInfoWrap>
        </LeftBox>
        <RightBox></RightBox>
      </BottomContainer> */}
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
  background-color: palegoldenrod;
  @media only screen and (max-width: 768px) {
    
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  border-top: 1px solid #e0e0e0;
  background-color: #d15555;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
    border-top: 0;
  }
`;

const BottomContainer = styled(Container)`
  min-height: 400px;
`;

const LeftBox = styled.div`
  padding:0 2%;
  display: flex;
  width:35%;
  min-width: 290px;
  flex-direction: column;
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
  height:80vh;
  /* overflow:hidden; */
  /* border-radius:10px; */
  z-index:99;
  background:rgba(255,255,255,0.95);
`;
const EmptyHeightBox = styled.div`
  width:100%;
  height:50px;
`;
const HeaderButtom = styled.div`
// tranform: translateY(-1px);
  position:absolute;
  top:20px;
  left:50%;
  transform:translate(-50%,0);
  width:55px;
  border:2px solid #a5a5a5;
  border-radius:20px;
  @media only screen and (max-width: 768px) {
    width:45px;
  }
`;
const LeftTopBox = styled.div`
  position: relative;
  width: 100%;
  padding: 20px;
  @media only screen and (max-width: 768px) {
    padding: 25px 18px;
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

const NameBox = styled.div`
  width:100%;
  display:flex;
  justify-content:space-between;
  @media only screen and (max-width: 768px) {
    font-size:14px;
  }
`;
const ProductImage = styled.img`
  width: 100%;
  height:100%;
  object-fit:fill;
  @media only screen and (max-width: 1440px) {
    object-fit:contain;
  }
`;
const TitleBox = styled.div`
  margin-bottom: 35px;
  @media only screen and (max-width: 768px) {
    margin-bottom: 18px;
  }
`;

const ProductName = styled.h3`
font-family:'Pretendard Variable';
  font-weight: 700;
  color: #121212;
  font-size: 22px;
  margin: 0px;
  flex-wrap: wrap;
  @media only screen and (max-width: 768px) {
    font-size: 18px;
  }
`;

const Designer = styled.span`
font-family:'Pretendard Variable';
  font-weight: 500;
  color: #121212;
  font-size: 18px;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const LikeButton = styled.img`
  height: 35px;
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

const ContentBox = styled.div``;

const Title = styled.span`
font-family:'Pretendard Variable';
  font-weight: 400;
  color: #121212;
  font-size: 16px;
  display: inline-block;
  width: 80px;
  @media only screen and (max-width: 768px) {
    width: 60px;
    font-size: 12px;
  }
`;

const Content = styled.span`
font-family:'Pretendard Variable';
  font-weight: 400;
  color: #121212;
  font-size: 15px;
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
  font-weight: 400;
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
  margin-top: 30px;
  width: 100%;
  height: 250px;
  overflow: scroll;
  outline: 0;
  line-height: 22px;
  border: 0;
  font-size: 14px;
  color: #121212;
  resize: none;
  background-color: #fff;
  -webkit-text-fill-color: #121212;
  opacity: 1;
  @media only screen and (max-width: 768px) {
    background-color: transparent;
    height: 220px;
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
  margin-bottom: 8px;
  @media only screen and (max-width: 768px) {
    margin-bottom: 3px;
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
  /* max-height:800px; */
  object-fit:contain;
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
font-family:'Pretendard Variable';
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  font-size: 20px;
  font-weight: 500;
  background-color: #000000;
  border: solid 1px #000000;
  color: #ececec;
  @media only screen and (max-width: 768px) {
    width: 100%;
    height: 45px;
    font-weight: 500;
    font-size: 18px;
  }
  &:hover {
    background-color: #2e2e2e;
    color: white;
  }
`;

const RowWrap = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const LeftOption = styled.div`
  min-height: 40px;
  line-height: 2;
`;
const CartCardWrap = styled.div``;

const SwiperWrap = styled.div`
  background-color:#cecece;
  height:100%;
  max-height:800px;
  /* width:100%; */
  @media only screen and (max-width: 768px) {
    max-height:800px;
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
  font-family: 'NotoSans';
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
