import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, FileButton, Image } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal } from '@mantine/core';
import { APICheckPassword, APIUserDetails } from '../../api/UserAPI';
import { UserContext } from '../../context/user';
import ImageCard from '../../components/Shop/ImageCard';
import { TImage } from '../admin/ProducerList';
import RightArrowImage from '../../asset/image/ico_next_mobile.png'
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { DndList, dndData } from '../../components/DnD/DnD';

export type TUserDetails = {
  idx: number;
  type: 1 | 2 | 3; // 1: fredi / 2: kakao / 3: naver
  user_id: string;
  password: string;
  name: string;
  nickname: string;
  phone: string;
  gender: 1 | 2;
  birth: string;
  visit_count: number;
  login_time: Date | null;
  created_time: Date;
  suspended_time: Date | null;
  deleted_time: Date | null;
  reason: string;
  level: 0 | 1 | 2 | 3; // 0: 관리자 / 1: 입점업체회원 / 2: 일반회원2 / 3: 일반회원1
  status: 'active' | 'suspended' | 'deleted';
};
export type ImageItem = {
  idx:number;
  file_name:string;
  url:string;
};


function AddPhoto() {
  const navigate = useNavigate();
  const types = useLocation();
  const propsData = types.state;
  const { user } = useContext(UserContext);
  const [imageList, setimageList] = useState<dndData[]>([]);
  const [description, setdescription] = useState<string>('');
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  const getBase64 = (file: File, cb: (value: string | ArrayBuffer | null) => void) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  };
  
  const handleImage = (value: File) => {
    getBase64(value, (url) => {
      const file = { url: url as string, name: value.name, symbol: String(Date.now()), file: value };
      // console.log(file)
      // console.log(file.url)
    });
    console.log(value)
    // setimageList([...imageList, file]);
  };

  const PhotoHandle = (type:string, idx?:number) =>{
    let temp_img = [...imageList];
    if(type == 'aa'){
      setimageList(
        imageList.filter((el, index) => index !== idx)
      );
    } else if (type =='bb'){
      setimageList([
        {
          symbol: 'sdad',
          name: '1사',
          url:'ddd'
        },
        {
          symbol: 'sdad',
          name: '2사',
          url:'ddd'
        },
        {
          symbol: 'sdad',
          name: '3사',
          url:'ddd'
        },
        {
          symbol: 'sdad',
          name: '4사',
          url:'ddd'
        },
      ]);
    }
  }
  
  useEffect(() => {
    
  }, []);


  return (
    <Container>
      <ProfileContainer>
        {imageList.length > 0 &&
          <SwiperWrap>
            <Swiper 
              style={{height:300,marginBottom:20,backgroundColor:'white'}}
              spaceBetween={10}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[FreeMode, Navigation, Thumbs]}
              className="mySwiper2"
            >
              {imageList.map((item, index) => (
                <SwiperSlide key={index} virtualIndex={index}>
                  {/* {slideContent} */}
                  <ImageBox2 width={80}>
                    {/* <img src={item.url}/> */}
                    {item.url}
                  </ImageBox2>
                </SwiperSlide>
              ))}
              <PlusImageBtnWrap onClick={()=>PhotoHandle('bb')}>
                <PlusImageBtn src={'dd'}/>
              </PlusImageBtnWrap>
            </Swiper>
            <Swiper
              style={{height:100}}
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={4}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="mySwiper"
            >
            {imageList.map((item, index) => (
              <SwiperSlide key={index} virtualIndex={index}>
                {/* {slideContent} */}
                <ImageBox2>
                  {item.name}
                  {item.url}
                  <Xtext onClick={()=>{
                    PhotoHandle('aa',index)
                    }}>
                    X
                  </Xtext>
                </ImageBox2>
              </SwiperSlide>
            ))}
            {imageList.length < 4 &&
            <SwiperSlide>
              
                <ImagePlus>
                  +
                </ImagePlus>
              
            </SwiperSlide>
            }
          </Swiper>
          </SwiperWrap>
        }
        {imageList.length == 0 &&
        <LabelBox>
          <label>
          <UploadButton type={'file'} multiple name='addButton'/>
          <PlusText>+</PlusText>
            select your image
            </label>
        </LabelBox>
        }
        <AboutWrap>
          About
        </AboutWrap>
        <InputWrap>
          <TextInput
            value={description}
            onChange={(e) => {
              setdescription(e.target.value);
            }}
            placeholder="Input here"
          />
        </InputWrap>
      </ProfileContainer>
    </Container>
  );
}

const Container = styled.div`
  /* display: flex; */
  width:100%;
  flex: 1;
  min-height: calc(100vh - 80px);
  /* flex-direction: row; */
  border-top: 1px solid #121212;
  background-color: #ffffff;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
    border-top: 0;
  }
`;
const SwiperWrap = styled.div`
  background-color:#ffffff;
  /* width:400px; */
  /* max-height:1000px; */
  width:100%;
  margin-bottom:50px;
`;
const ProfileContainer = styled.div`
  margin:20px 30px;
`;
const ProductListWrap = styled.div`
  width:100%;
  height:100%;

`;

const PlusImage = styled.div`
  /* border:1px solid #a1a1a1;; */
  display:flex;
  justify-content:center;
  align-items:center;
  flex-direction:column;
  margin:0 auto;
  aspect-ratio: 1.2;
  width: 24.25%;
  cursor: pointer;
  overflow: hidden;
  @media only screen and (max-width: 1440px) {
    width: 32.66%;
  }
  @media only screen and (max-width: 768px) {
    width: 49.5%;
    margin-bottom: 10px;
  }
`;
const PlusText = styled.p`
  font-size:25px;
  font-weight:bold;
  margin:30px 0;
  @media only screen and (max-width: 768px) {
  }
`;

const ImageBox2 = styled.img<{width?:number}>`
  height:100%;
  /* max-height:800px; */
  object-fit:contain;
  /* overflow: hidden; */
  background-color:aqua;
  margin:0 auto;
  /* aspect-ratio: 0.8; */
  width:${(props)=>props.width? props.width: 100}%;
  @media only screen and (max-width: 768px) {
  }
`;
const UploadButton = styled.input`
  display:none;
`
const ImagePlus = styled.div`
  height:100%;
  /* max-height:800px; */
  object-fit:contain;
  /* overflow: hidden; */
  background-color:#8d8d8d;
  cursor: pointer;
  /* aspect-ratio: 0.8; */
  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;
const PlusImageBtnWrap = styled.div`
  position:absolute;
  right:15%;
  bottom:20px;
  z-index:1000;
  width: 50px;
  height:50px;
  border-radius:50%;
  cursor: pointer;
  /* aspect-ratio: 0.8; */
`;
const PlusImageBtn = styled.img`
  width: 100%;
  height:100%;
  object-fit:contain;
  /* border-radius:50%; */
  background-color:#696969;
  /* aspect-ratio: 0.8; */
`;
const InputWrap = styled.div`
  display: flex;
  width: 100%;
  min-height:150px;
  margin: 20px 0 10px;
  @media only screen and (max-width: 768px) {
    margin: 0;
  }
`;
const InputTitle = styled.div`
  white-space:nowrap;
  width:25%;
  max-width:250px;
  text-align:start;
  @media only screen and (max-width: 768px) {
  }
`;

const TextInput = styled.textarea`
  width:100%;
  font-size: 16px;
  color: #121212;
  font-weight: 400;
  text-align:start;
  border-radius: 0;
  min-height:35px;
  margin:0;
  border:1px dotted black;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const Xtext = styled.p`
  position:absolute;
  top:5%;
  right:5%;
  color: #ffffff;
  background:#000000;
  padding:0 4px;
  margin:0;
  font-size: 14px;
  border:1px solid black;
  border-radius:50%;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    font-size: 8px;
  }
`;
const LabelBox = styled.div`
  margin:100px 0;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;
const BlackButtonText = styled.span`
  color: #ffffff;
  font-size: 16px;
  font-weight: 400;
  @media only screen and (max-width: 768px) {
    font-size: 11px;
  }
`;


const ModalBlackButton = styled.div`
  width: 160px;
  height: 60px;
  background-color: #121212;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid #121212;
  @media only screen and (max-width: 768px) {
    height: 40px;
  }
`;

const ModalWhiteButton = styled(ModalBlackButton)`
  background-color: #ffffff;
  margin-left: 10px;
  @media only screen and (max-width: 768px) {
    margin-left: 0;
    margin-top: 5px;
  }
`;

const AboutWrap = styled.div`
  text-align:start;
  padding:10px;
  font-weight: bold;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

export default AddPhoto;
