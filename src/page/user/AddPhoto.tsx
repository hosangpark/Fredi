import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FileButton } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/user';
import RightArrowImage from '../../asset/image/ico_next_mobile.png'
import linkImage from '../../asset/image/links.png';
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import {  dndData } from '../../components/DnD/DnD';
import TopTextButton from '../../components/Layout/TopTextButton';
import ButtonContainer from '../../components/Layout/ButtonBox';
import AlertModal from '../../components/Modal/AlertModal';
import { APISnsAdd } from '../../api/ProductAPI';
import { CategoryListCheck } from '../../components/List/List';
import CategoryItem from '../../components/Shop/CategoryItem';

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
  const [ShowModal,setShowModal] = useState<boolean>(false)
  const [ShowImage, setShowImage] = useState<any[]>([]);
  const [About, setAbout] = useState<string>('');
  const [alertType, setAlertType] = useState<string>();
  const [UploadImage, setUploadImages] = useState<dndData[]>([]);
  const [categoryitemList,setcategoriitemList] = useState(CategoryListCheck)
  
  const UploadSns = async() =>{
    if(UploadImage.length > 12){
      setUploadImages(UploadImage.slice(0,12))
    }
    const formData = new FormData();
    formData.append('category[]', '1')
    formData.append('name', '안녕하세요')
    formData.append('about', About)
    formData.append('link_title', '꾸글')
    formData.append('link_url', 'www.google.com')
    for (var i = 0; i < UploadImage.length; i++){
      formData.append('images', UploadImage[i].file);
      // console.log(UploadImage[i].file)
    }
    console.log(formData)
    try {
      const res = APISnsAdd(formData);
      // console.log('55')
      console.log('APISnsAdd',res);
      // setShowModal(true)
      // setUserDetails(res);
      // setIsSnsUser(res.type !== 1 ? true : false);
      } catch (error) {
        console.log(error);
        // navigate('/signin', { replace: true });
    }
  }

  
  const handleImage = (value: File[]) => {
    if(value.length > 12)return(setShowModal(true),setAlertType('12장 이상 등록할 수 없습니다.'))
    if(UploadImage.length > 12)return(setShowModal(true),setAlertType('12장 이상 등록할 수 없습니다.'))
    let fileURLs:dndData[] = [...UploadImage];
    const ShowImages = value;
    let imageUrlLists = [...ShowImage];
    for (let i = 0; i < value.length; i++) {
      let reader = new FileReader();
      const currentImageUrl = URL.createObjectURL(ShowImages[i]);
      imageUrlLists.push(currentImageUrl);
      let file = value[i];
      reader.onload = () => {
        const file = { url: reader.result as string, name: value[i].name, symbol: String(Date.now()), file: value[i] };
        fileURLs.push(file)
      };
      reader.readAsDataURL(file);
    }
    setShowImage(imageUrlLists.slice(0, 12))
    setUploadImages(fileURLs)
  };
  

  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", resizeListener);
  }, [innerWidth]);

  return (
    <Container>
      <TopTextButton text='Next' onClick={()=>navigate('/AddPhoto2')}/>
      <ProfileContainer>
        {/* <DndList data={images} setData={setImages} initList={[]} /> */}
        <SwiperWrap>
          {
          ShowImage.map((item,index)=>{
            return(
            <PlusImage height={innerWidth} index={1} key={index}>
              <UploadImageItem src={item}/>
            </PlusImage>
            )
          })
          }
          <FileButton onChange={handleImage} multiple accept="image/png,image/jpeg">
            {(props) => (
            <PlusImage height={innerWidth} key={0} index={0} {...props}>
              <label>
              <UploadButton type={'file'} multiple name='addButton'/>
              <PlusH></PlusH>
              <PlusV></PlusV>
              </label>
            </PlusImage>
            )}
          </FileButton>
        </SwiperWrap>
        <>
        <AboutWrap>
          About
        </AboutWrap>
        <InputWrap>
          <TextInput
            value={About}
            onChange={(e) => {
              setAbout(e.target.value);
            }}
            placeholder="Input here"
            />
        </InputWrap>
        <WebContainer>
        <BoxWrap>
          <BoxTitle>
            LINK
          </BoxTitle>
          <LayoutWrap onClick={()=>{navigate('/AddLink', { state: 'Add' });}}>
            <LinkImageWrap>
              <LinkImage src={linkImage}/>
            </LinkImageWrap>
            <LinkItemBox>
              <LinkTitleBox>
                Add Links
              </LinkTitleBox>
            </LinkItemBox>
          </LayoutWrap>
          <LayoutWrap onClick={()=>{navigate('/EditLink', { state: 'Edit' });}}>
            <LinkImageWrap>
              <LinkImage src={linkImage}/>
            </LinkImageWrap>
            <LinkItemBox>
              <LinkTitleBox>
                <LinkName>
                  Website (FREDI)
                </LinkName>
                <LinkUrl>
                  www.fredi.co.kr
                </LinkUrl>
              </LinkTitleBox>
              <ArrowImageWrap>
                <ArrowImage src={RightArrowImage}/>
              </ArrowImageWrap>
            </LinkItemBox>
          </LayoutWrap>
        </BoxWrap>
        <BoxWrap>
          <BoxTitle>
            Category<CategoryCount>{categoryitemList.filter(element => element.checked === true).length}</CategoryCount>
          </BoxTitle>
          <CategoryItemContainer>
            {categoryitemList.map((item,index)=>{
              return(
                <CategoryItem item={item.item} checked={item.checked} 
                setChecked={(e,type)=>{
                  if(categoryitemList.filter(element => element.checked === true).length < 3){
                    categoryitemList[index].checked = e
                  }else{
                    categoryitemList[index].checked = false
                  }
                  setcategoriitemList([
                    ...categoryitemList,
                  ])
                }}/>
              )
            })}
          </CategoryItemContainer>
        </BoxWrap>
      </WebContainer>
        </>
      </ProfileContainer>
      <ButtonContainer
        text1={'Save'}
        text2={'Cancel'}
        onClick1={()=>{}}
        onClick2={UploadSns}
        cancle={()=>navigate(-1)}
        marginT={50}
        marginB={100}
        visible={true}
      />
      <AlertModal
      visible={ShowModal}
      setVisible={setShowModal}
      onClick={() => {
        if(alertType == '12장 이상 등록할 수 없습니다.'){
          setShowModal(false);
        } else{
          setShowModal(false);
          navigate(-1)
        }
      }}
      text={alertType? alertType : '저장되었습니다.'}
      />
    </Container>
  );
}

const Container = styled.div`
  /* display: flex; */
  width:100%;
  flex: 1;
  min-height: calc(100vh - 80px);
  /* flex-direction: row; */
  /* border-top: 1px solid #121212; */
  background-color: #ffffff;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
    border-top: 0;
  }
`;
const SwiperWrap = styled.div`
display:flex;
flex-wrap:wrap;
  background-color:#ffffff;
  /* width:400px; */
  /* max-height:1000px; */
  width:100%;
  margin-bottom:20px;
`;
const ProfileContainer = styled.div`
  margin:20px;
`;
const ProductListWrap = styled.div`
  width:100%;
  height:100%;
`;
const WebContainer = styled.div`
  display:block;
  @media only screen and (max-width: 768px) {
    display:none
  }
`
const PlusImage = styled.div<{height:number,index:number}>`
  /* border:1px solid #a1a1a1;; */
  position:relative;
  display:flex;
  justify-content:center;
  align-items:center;
  aspect-ratio: 1;
  background-color:#d1d1d1;
  margin-right: ${(props) => ((props.index) % 3 === 0 ? 12:0)}px;
  width: calc(25% - 9px);
  cursor: pointer;
  overflow: hidden;
  margin-bottom: 30px;
  @media only screen and (max-width: 1440px) {
    margin-bottom: 12px;
    margin-right: ${(props) => ((props.index) % 3 === 0 ? 12:0)}px;
    /* width: 24.25%; */
    width: calc(33.3333% - 8px)
  }
  @media only screen and (max-width: 768px) {
    margin-right: ${(props) => ((props.index) % 2 === 0 ? 12:0)}px;
    width: calc(50% - 6px);
    margin-bottom: 12px;
    height:${props => (props.height/2-6)}px;
  }
`;
const PlusH = styled.div`
  position:absolute;
  left:50%;
  top:50%;
  width:30px;
  transform:translate(-50%,-50%);
  border-bottom:1px solid #585858;
  @media only screen and (max-width: 768px) {
    width:20px;
  }
`
const PlusV = styled.div`
  position:absolute;
  left:50%;
  top:50%;
  height:30px;
  transform:translate(-50%,-50%);
  border-right:1px solid #585858;
  @media only screen and (max-width: 768px) {
    height:20px;
  }
`
const UploadImageItem = styled.img`
  width:100%;
  height:100%;
`
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
const InputWrap = styled.div`
  display: flex;
  width: 100%;
  min-height:150px;
  margin: 20px 0 10px;
  @media only screen and (max-width: 768px) {
    margin: 0;
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

const AboutWrap = styled.div`
  text-align:start;
  padding:10px;
  font-weight: bold;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const BoxWrap = styled.div`
  width:100%;
  display: flex;
  flex-direction: column;
  margin:0 5px 50px;
`;

const LayoutWrap = styled.div`
  display: flex;
  margin: 15px 0 ;
`;
const BoxTitle = styled.p`
font-family:'Pretendard Variable';
  font-size:16px;
  font-weight: 410;
  text-align:start;
  color:#2b2b2b;
  margin:20px 5px 10px;
  @media only screen and (max-width: 768px) {
  }
`
const CategoryCount = styled.span`
  font-size:13px;
  font-weight: 410;
  text-align:start;
  color:#adadad;
  margin-left:20px;
`

const LinkName = styled.p`
font-family:'Pretendard Variable';
  font-weight: 410;
  text-align:start;
  color:#2b2b2b;
  margin:0;
  @media only screen and (max-width: 768px) {
    font-size:14px;
  }
`
const LinkUrl = styled.p`
font-family:'Pretendard Variable';
  font-size:14px;
  font-weight: 410;
  text-align:start;
  color:#b8b8b8;
  margin:0;
  @media only screen and (max-width: 768px) {
    font-size:12px;
  }
`;

const LinkImageWrap = styled.div`
display:flex;
align-items:center;
  width:70px;
  height:70px;
  margin-right:30px;

  /* width:40%; */
  @media only screen and (max-width: 768px) {
    width:55px;
    height:50px;
  }
`;
const ArrowImageWrap = styled.div`
display:flex;
align-items:center;
  width:20px;
  height:20px;
  @media only screen and (max-width: 768px) {
    width:15px;
    height:15px;
  }
`;
const LinkImage = styled.img`
  width:100%;
  height:100%;
  object-fit:contain;
`;

const ArrowImage = styled.img`
  width:100%;
  height:100%;
`;
const LinkItemBox = styled.div`
  width:100%;
  display:flex;
  justify-content:space-between;
  align-items:center;
  @media only screen and (max-width: 768px) {
  }
`;
const LinkTitleBox = styled.div`
font-family:'Pretendard Variable';
  display:flex;
  flex-direction:column;
  justify-content:center;
  @media only screen and (max-width: 768px) {
    font-size:14px;
  }
`;
const CategoryItemContainer = styled.div`
  display:flex;
  flex-wrap:wrap;
`;


export default AddPhoto;
