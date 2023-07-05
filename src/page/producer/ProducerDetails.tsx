import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import likeOnImage from '../../asset/image/heart_on.png';
import likeOffImage from '../../asset/image/heart_off.png';
import leftButtonImage from '../../asset/image/ico_prev.png';
import rightButtonImage from '../../asset/image/ico_next.png';
import { createStyles, Modal } from '@mantine/core';
import { Carousel, Embla, useAnimationOffsetEffect } from '@mantine/carousel';
import { TImage } from '../admin/ProducerList';
import { APILikeProducer, APIProducerDetails } from '../../api/ProducerAPI';
import { CATEGORY_PRODUCER } from '../admin/DashBoard';
export type TProducerDetails = {
  idx: number;
  name: string;
  category: 1 | 2 | 3 | 4 | 5 | 6;
  address_text: string;
  zipcode: string;
  address1: string;
  address2: string;
  phone: string;
  business_hour: string;
  description: string;
  sns: string;
  email: string;
  website: string;
  created_time: Date;
  imageList: TImage[];
  isLike: boolean;
};

const useStyles = createStyles((theme, _params, getRef) => ({
  carousel: {
    height: '100%',
    position: 'relative',
  },

  carouselControls: {
    ref: getRef('carouselControls'),
    width: 140,
    justifyContent: 'space-between',
    top: 'unset',
    left: 50,
    bottom: 50,
    boxShadow: 'unset',
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

function ProducerDetails() {
  const { idx } = useParams();
  const navigate = useNavigate();
  const { classes } = useStyles();
  const [producerDetails, setProducerDetails] = useState<TProducerDetails>();
  const [isLike, setIsLike] = useState<boolean>(false);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [imageSource, setImageSource] = useState<string>('');
  const [height, setHeight] = useState(0);
  const leftBoxRef = useRef<HTMLDivElement>(null);
  const Leftheight = leftBoxRef.current ? leftBoxRef.current?.offsetHeight : 0;
  const [initcar, setInitCar] = useState<boolean>(false);
  const [imageIdx, setImageIdx] = useState(0);
  const [embla, setEmbla] = useState<Embla | null>(null);
  const TRANSITION_DURATION = 200;
  useAnimationOffsetEffect(embla, TRANSITION_DURATION);

  const getProducerDetails = async () => {
    const data = {
      idx: idx,
    };
    try {
      const resData = await APIProducerDetails(data);
      console.log(resData);
      setProducerDetails({ ...resData, imageList: resData.imageList.slice(1) });
      setIsLike(resData.isLike);
    } catch (error) {
      console.log(error);
      alert('존재하지 않는 업체입니다.');
      navigate(-1);
    }
  };

  const onLikeProducer = async () => {
    const data = {
      producer_idx: producerDetails?.idx,
    };
    try {
      const res = await APILikeProducer(data);
      console.log(res);
      setIsLike((prev) => !prev);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducerDetails();
  }, []);

  useEffect(() => {
    if (imageSource) {
      setShowImageModal(true);
    }
  }, [imageSource]);

  useEffect(() => {
    setHeight(Leftheight);
  }, [Leftheight]);

  const slides2 = producerDetails?.imageList.map((item, index) => (
    <Carousel.Slide key={item.idx}>
      <ImageBox2>
        <SliderImage src={item.file_name} />
      </ImageBox2>
    </Carousel.Slide>
  ));

  useEffect(() => {
    setInitCar(showImageModal);
  }, [showImageModal]);

  useEffect(() => {
    setHeight(Leftheight);
  }, [Leftheight]);

  return (
    <Container>
      <Carousel
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
              <ProductName>{producerDetails?.name}</ProductName>
              <Designer>{producerDetails?.category && CATEGORY_PRODUCER[producerDetails?.category]}</Designer>
            </Div>
            <LikeButton onClick={onLikeProducer} src={isLike ? likeOnImage : likeOffImage} />
          </TitleBox>
          <ContentBox>
            <ContentRowWrap>
              <Title>주소</Title>
              <ContactContent
                href={`https://map.kakao.com/link/search/${producerDetails?.address1}`}
                target="_blank"
              >{`${producerDetails?.address1} ${producerDetails?.address2}`}</ContactContent>
            </ContentRowWrap>
            <ContentRowWrap>
              <Title>전화번호</Title>
              <Phone href={`tel:${producerDetails?.phone}`}>{producerDetails?.phone}</Phone>
            </ContentRowWrap>
            <ContentRowWrap>
              <Title>영업시간</Title>
              <Content>{producerDetails?.business_hour}</Content>
            </ContentRowWrap>
          </ContentBox>
        </LeftTopBox>
        <LeftBottomBox>
          <BottomBoxTitle>업체설명</BottomBoxTitle>
          <BottomBoxContent disabled value={producerDetails?.description}></BottomBoxContent>
          <BottomBoxTitle>CONTACT</BottomBoxTitle>
          <ContentRowWrap>
            <ContactTitle>SNS</ContactTitle>
            {producerDetails?.sns ? (
              <ContactContent href={`https://www.instagram.com/${producerDetails?.sns.split('@')[1]}`} target="_blank">
                {producerDetails?.sns}
              </ContactContent>
            ) : (
              <ContactContent>-</ContactContent>
            )}
          </ContentRowWrap>
          <ContentRowWrap>
            <ContactTitle>E-mail</ContactTitle>
            {producerDetails?.email ? <ContactContent>{producerDetails?.email}</ContactContent> : <ContactContent>-</ContactContent>}
          </ContentRowWrap>
          <ContentRowWrap>
            <ContactTitle>Website</ContactTitle>
            {producerDetails?.website ? (
              <ContactContent href={`https://${producerDetails?.website}`} target="_blank">
                {producerDetails?.website}
              </ContactContent>
            ) : (
              <ContactContent>-</ContactContent>
            )}
          </ContentRowWrap>
        </LeftBottomBox>
      </LeftBox>
      <RightBox>
        <Carousel
          loop={false}
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
          {producerDetails?.imageList.map((item, index) => (
            <Carousel.Slide key={item.idx}>
              <ImageBox onClick={() => setShowImageModal(true)} style={{ height }}>
                <SliderImage src={item.file_name} />
              </ImageBox>
            </Carousel.Slide>
          ))}
        </Carousel>
      </RightBox>
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
            {producerDetails?.imageList.map((item, index) => (
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
  width: 540px;
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
  position: relative;
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

const Phone = styled.a`
  font-weight: 410;
  color: #121212;
  font-size: 15px;
  text-decoration: none;
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
  line-height: 25px;
  border: 0;
  font-size: 14px;
  color: #121212;
  resize: none;
  background-color: #fff;
  line-height: 22px;
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
  display: flex;
`;

const ImageBox = styled.div`
  height: 100%;
  width: 100%;
  text-align: left;
  overflow: hidden;
`;

const ImageBox2 = styled.div`
  display: none;
  position: relative;
  overflow: hidden;
  aspect-ratio: 0.8;
  @media only screen and (max-width: 768px) {
    display: flex;
  }
`;

const ModalImageBox = styled.div`
  width: 100%;
  height: 90vh;
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

export default ProducerDetails;
