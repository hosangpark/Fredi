import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import likeOnImage from '../../asset/image/heart_on.png';
import likeOffImage from '../../asset/image/heart_off.png';
import leftButtonImage from '../../asset/image/ico_prev.png';
import rightButtonImage from '../../asset/image/ico_next.png';
import { Carousel, Embla, useAnimationOffsetEffect } from '@mantine/carousel';
import { createStyles, Modal } from '@mantine/core';
import { APILikeProduct, APIProductDetails } from '../../api/ProductAPI';
import { TImage, TProductListItem } from '../../types/Types';
import AlertModal from '../../components/Modal/AlertModal';
import { UserContext } from '../../context/user';
import { useRef } from 'react';
import { createBrowserHistory } from 'history';
import { removeHistory } from '../../components/Layout/Header';

type TProductDetails = {
  idx: number;
  category: 1 | 2 | 3 | 4 | 5 | 6;
  name: string;
  size: string;
  weight: string;
  country: string;
  description: string;
  designer: string;
  sns: string;
  email: string;
  website: string;
  created_time: Date;
  imageList: TImage[];
  isLike: boolean;
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

function PrevProductDetails() {
  const { idx } = useParams();
  const navigate = useNavigate();
  const { classes } = useStyles();
  const history = createBrowserHistory();
  const { user } = useContext(UserContext);
  const [productDetails, setProductDetails] = useState<TProductDetails>();
  const [isLike, setIsLike] = useState<boolean>(false);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [initcar, setInitCar] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState(false);
  const [height, setHeight] = useState(0);
  const [imageIdx, setImageIdx] = useState(0);
  const leftBoxRef = useRef<HTMLDivElement>(null);
  const Leftheight = leftBoxRef.current ? leftBoxRef.current?.offsetHeight : 0;
  const [embla, setEmbla] = useState<Embla | null>(null);
  const TRANSITION_DURATION = 200;
  useAnimationOffsetEffect(embla, TRANSITION_DURATION);

  const getProductDetails = async () => {
    const data = {
      idx: idx,
    };
    try {
      const resData = await APIProductDetails(data);
      console.log(resData);
      setProductDetails({ ...resData, imageList: resData.imageList.slice(1) });
      setIsLike(resData.isLike);
    } catch (error) {
      console.log(error);
      alert('존재하지 않는 상품입니다.');
      navigate(-1);
    }
  };

  const onLikeProduct = async () => {
    if (user.idx) {
      const data = {
        product_idx: productDetails?.idx,
      };
      try {
        const res = await APILikeProduct(data);
        console.log(res);
        setIsLike((prev) => !prev);
      } catch (error) {
        console.log(error);
      }
    } else {
      setShowLogin(true);
    }
  };

  useEffect(() => {
    getProductDetails();
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

  const slides2 = productDetails?.imageList.map((item, index) => (
    <Carousel.Slide key={`mobile-${item.idx}`} style={{ width: '100%' }}>
      <ImageBox2>
        <SliderImage src={item.file_name} />
      </ImageBox2>
    </Carousel.Slide>
  ));

  return (
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
              <ProductName>{productDetails?.name}</ProductName>
              <Designer>{productDetails?.designer}</Designer>
            </Div>
            <LikeButton onClick={onLikeProduct} src={isLike ? likeOnImage : likeOffImage} />
          </TitleBox>
          <ContentBox>
            <ContentRowWrap>
              <Title>사이즈</Title>
              <Content>{productDetails?.size}</Content>
            </ContentRowWrap>
            <ContentRowWrap>
              <Title>무게</Title>
              <Content>{productDetails?.weight}</Content>
            </ContentRowWrap>
            <ContentRowWrap>
              <Title>제조</Title>
              <Content>{productDetails?.country}</Content>
            </ContentRowWrap>
          </ContentBox>
        </LeftTopBox>
        <LeftBottomBox>
          <BottomBoxTitle>디자이너 & 작품설명</BottomBoxTitle>
          <BottomBoxContent disabled value={productDetails?.description}></BottomBoxContent>
          <BottomBoxTitle>CONTACT</BottomBoxTitle>
          <ContentRowWrap>
            <ContactTitle>SNS</ContactTitle>
            {productDetails?.sns ? (
              <ContactContent href={`https://www.instagram.com/${productDetails?.sns.split('@')[1]}`} target="_blank">
                {productDetails?.sns}
              </ContactContent>
            ) : (
              <ContactContent>-</ContactContent>
            )}
          </ContentRowWrap>
          <ContentRowWrap>
            <ContactTitle>E-mail</ContactTitle>
            {productDetails?.email ? <ContactContent>{productDetails?.email}</ContactContent> : <ContactContent>-</ContactContent>}
          </ContentRowWrap>
          <ContentRowWrap>
            <ContactTitle>Website</ContactTitle>
            {productDetails?.website ? (
              <ContactContent href={`https://${productDetails?.website}`} target="_blank">
                {productDetails?.website}
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
          {productDetails?.imageList.map((item, index) => (
            <Carousel.Slide key={item.idx}>
              <ImageBox onClick={() => setShowImageModal(true)} style={{ height }}>
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
            {productDetails?.imageList.map((item, index) => (
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
  );
}

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
  width: 100%;
  padding: 50px;
  @media only screen and (max-width: 768px) {
    padding: 25px 18px;
  }
`;
const LeftBottomBox = styled.div`
  width: 100%;
  border-top: 1px solid #121212;
  padding: 0 50px 50px 50px;
  @media only screen and (max-width: 768px) {
    padding: 0 18px 30px;
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

const ContentBox = styled.div``;

const Title = styled.span`
  font-weight: 410;
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
  font-weight: 410;
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
  font-family:'Pretendard Variable'; !important;
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

const SliderImage = styled.img`
  cursor: pointer;
  object-fit: cover;
  height: 100% !important;
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

export default PrevProductDetails;
