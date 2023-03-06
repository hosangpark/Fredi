import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import likeOnImage from '../../asset/image/heart_on.png';
import likeOffImage from '../../asset/image/heart_off.png';
import leftButtonImage from '../../asset/image/ico_prev.png';
import rightButtonImage from '../../asset/image/ico_next.png';
import { Carousel, Embla, useAnimationOffsetEffect } from '@mantine/carousel';
import { createStyles, Modal } from '@mantine/core';
import { TImage } from '../admin/ProducerList';
import AlertModal from '../../components/Modal/AlertModal';
import { UserContext } from '../../context/user';
import { useRef } from 'react';
import { createBrowserHistory } from 'history';
import cart from '../../asset/image/cart.png';
import ask from '../../asset/image/home05.png';
import { APIAddCartItem, APILikeShop, APIShopDetails } from '../../api/ShopAPI';
import { replaceString } from '../../util/Price';
import { removeHistory } from '../../components/Layout/Header';
import { TextInput, Select } from '@mantine/core';
import arrDownImage from '../../asset/image/arr_down.png';
import CartCard from '../../components/Shop/CartCard';
import { read } from 'fs';
import { getConstantValue } from 'typescript';
import { count } from 'console';

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

function ShopDetails() {
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

  const leftBoxRef = useRef<HTMLDivElement>(null);
  const Leftheight = leftBoxRef.current ? leftBoxRef.current?.offsetHeight : 0;
  const [embla, setEmbla] = useState<Embla | null>(null);
  const TRANSITION_DURATION = 200;
  useAnimationOffsetEffect(embla, TRANSITION_DURATION);

  const getShopDetails = async () => {
    const data = {
      idx: idx,
    };
    try {
      const resData = await APIShopDetails(data);
      console.log('resData', resData);
      setShopDetails({ ...resData, imageList: resData.imageList.slice(1) });
      const array = new Array();
      resData.optionList.map((data: any) => {
        console.log('data ===>', data);
        array.push({
          value: data.idx,
          label: data.name,
        });
      });
      setOption(array);
      console.log('array', array);
      setIsLike(resData.isLike);
    } catch (error) {
      console.log(error);
      alert('존재하지 않는 상품입니다.');
      navigate(-1);
    }
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

  useEffect(() => {
    console.log('addOption', addOption);
  }, [addOption]);

  const slides2 = shopDetails?.imageList.map((item, index) => (
    <Carousel.Slide key={`mobile-${item.idx}`} style={{ width: '100%' }}>
      <ImageBox2>
        <SliderImage src={item.file_name} />
      </ImageBox2>
    </Carousel.Slide>
  ));

  return (
    <ContainerWrap>
      <Container>
        <Carousel
          sx={{ width: '100%' }}
          nextControlIcon={<RightButton src={rightButtonImage} />}
          previousControlIcon={<LeftButton src={leftButtonImage} />}
          styles={{
            root: { display: 'none', '@media (max-width: 768px)': { display: 'block' } },
            control: { background: 'transparent', width: 45, border: 0, '@media (max-width: 768px)': { width: 30 } },
          }}
          classNames={{
            controls: classes.carouselControls,
            indicator: classes.carouselIndicator,
            control: classes.carouselControl,
          }}
        >
          {slides2}
        </Carousel>
        <LeftBox ref={leftBoxRef}>
          <LeftTopBox>
            <TitleBox>
              <Div>
                <ProductName>{shopDetails?.name}</ProductName>
                <Designer>{shopDetails?.designer}</Designer>
              </Div>
              <ContentRowWrap>
                <CartButton
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
                />
                <LikeButton onClick={onLikeShop} src={isLike ? likeOnImage : likeOffImage} />
              </ContentRowWrap>
            </TitleBox>
            <ContentBox>
              <ContentRowWrap>
                <Title>판매가</Title>
                <Content>{shopDetails && replaceString(shopDetails?.price)} ₩</Content>
              </ContentRowWrap>
              <ContentRowWrap>
                <Title>사이즈</Title>
                <Content>{shopDetails?.size}</Content>
              </ContentRowWrap>
              <ContentRowWrap>
                <Title>무게</Title>
                <Content>{shopDetails?.weight}</Content>
              </ContentRowWrap>
              <ContentRowWrap>
                <Title>제조</Title>
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
            <OrderButton
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
              {/* <OrderButtonText>구매하기</OrderButtonText> */}
            </OrderButton>
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
          <LeftBottomBox>
            <RowWrap>
              <BottomBoxTitle>디자이너 & 작품설명</BottomBoxTitle>
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
                문의하기
                {/* <OrderButtonText>문의하기</OrderButtonText> */}
              </AskButton>
            </RowWrap>
            <BottomBoxContent disabled value={shopDetails?.description}></BottomBoxContent>
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
          </LeftBottomBox>
        </LeftBox>
        <RightBox>
          <Carousel
            draggable={false}
            height={'100%'}
            sx={{ flex: 1 }}
            onSlideChange={(value) => setImageIdx(value)}
            nextControlIcon={<RightButton src={rightButtonImage} />}
            previousControlIcon={<LeftButton src={leftButtonImage} />}
            styles={{
              root: { display: 'block', '@media (max-width: 768px)': { display: 'none' } },
              control: { background: 'transparent', width: 45, border: 0 },
            }}
            classNames={{
              controls: classes.carouselControls,
              indicator: classes.carouselIndicator,
              control: classes.carouselControl,
            }}
          >
            {shopDetails?.imageList.map((item, index) => (
              <Carousel.Slide key={item.idx}>
                <ImageBox onClick={() => setShowImageModal(true)} style={{ height: '100%' }}>
                  <SliderImage src={item.file_name} />
                </ImageBox>
              </Carousel.Slide>
            ))}
          </Carousel>
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
        <Modal
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
        </Modal>
      </Container>
      <BottomContainer>
        <LeftBox>
          <DeliveryInfoWrap>
            <BottomBoxContent disabled value={shopDetails?.delivery_info ?? '배송정보 없음'}></BottomBoxContent>
          </DeliveryInfoWrap>
        </LeftBox>
        <RightBox></RightBox>
      </BottomContainer>
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
  flex: 1;
  flex-direction: column;
  background-color: palegoldenrod;
`;

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  border-top: 1px solid #121212;
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
  display: flex;
  width: 450px;
  min-width: 290px;
  flex-direction: column;
  text-align: left;
  border-right: 1px solid #121212;
  @media only screen and (max-width: 768px) {
    width: 100%;
    border-right: 0;
  }
`;

const RightBox = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
`;

const LeftTopBox = styled.div`
  position: relative;
  width: 100%;
  padding: 50px;
  @media only screen and (max-width: 768px) {
    padding: 25px 18px;
  }
`;

const LeftMiddleBox = styled.div`
  width: 100%;
  position: relative;
  border-top: 1px solid #121212;
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
  border-top: 1px solid #121212;
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

const Div = styled.div``;

const TitleBox = styled.div`
  margin-bottom: 35px;
  display: flex;
  justify-content: space-between;
  @media only screen and (max-width: 768px) {
    margin-bottom: 18px;
  }
`;

const ProductName = styled.h3`
  font-weight: 700;
  color: #121212;
  font-size: 30px;
  margin: 0px;
  flex-wrap: wrap;
  @media only screen and (max-width: 768px) {
    font-size: 23px;
  }
`;

const Designer = styled.span`
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
  font-weight: 400;
  color: #121212;
  font-size: 15px;
  display: inline-block;
  width: 80px;
  @media only screen and (max-width: 768px) {
    width: 60px;
    font-size: 12px;
  }
`;

const Content = styled.span`
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
  font-family: 'NotoSans' !important;
  width: 100%;
  height: 320px;
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
    height: 220px;
    font-size: 12px;
    line-height: 20px;
  }
  &::-webkit-scrollbar {
    width: 0;
  }
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
  width: 100%;
  overflow: hidden;
  aspect-ratio: 0.8;
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
  width: 130px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  background-color: white;
  border: solid 1px #398049;
  color: #398049;
  @media only screen and (max-width: 768px) {
    width: 100px;
    height: 35px;
    font-size: 13px;
  }
  &:hover {
    background-color: #398049;
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

export default ShopDetails;
