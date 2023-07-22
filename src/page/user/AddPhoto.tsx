import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Modal } from '@mantine/core';
import { FileButton } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/user';
import RightArrowImage from '../../asset/image/ico_next_mobile.png'
import linkImage from '../../asset/image/links.png';
import deleteButtonImage from '../../asset/image/ico_del.png';
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import {  dndData } from '../../components/DnD/DnD';
import TopTextButton from '../../components/Layout/TopTextButton';
import ButtonContainer from '../../components/Layout/ButtonBox';
import AlertModal from '../../components/Modal/AlertModal';
import { APICategoryList, APISnsAdd } from '../../api/ProductAPI';
import { CategoryListCheck } from '../../components/List/List';
import CategoryItem from '../../components/Shop/CategoryItem';
import { AddLinkListType, CategoryType, LinkListType } from '../../types/Types';
import { APILink, APIUserDetails } from '../../api/UserAPI';
import LoadingIndicator from '../../components/Product/LoadingIndicator';
import AddLink from './AddLink';
import EditLink from './EditLink';

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
  // const [Name, setName] = useState<string>('');
  const [Title, setTitle] = useState<string>('');
  const [About, setAbout] = useState<string>('');
  const [alertType, setAlertType] = useState<string>();
  const [UploadImage, setUploadImages] = useState<dndData[]>([]);
  const [LinkList, setLinkList] = useState<AddLinkListType[]>([]);
  const [SelectMain, setSelectMain] = useState(0)
  const [categoryList,setcategoriList] = useState<CategoryType[]>([])
  const [categoryArray,setcategoryArray] = useState<number[]>([])
  const [IsLoading,setIsLoading] = useState<boolean>(false)
  const [LinkModal, setLinkModal] = useState<boolean>(false);
  
  const UploadSns = async() =>{
    if(UploadImage.length == 0)return(setShowModal(true),setAlertType('사진을 등록해주세요.'))
    if(About.length == 0)return(setShowModal(true),setAlertType('내용을 등록해주세요.'))
    if(LinkList.length == 0)return(setShowModal(true),setAlertType('링크를 등록해주세요.'))
    if(categoryArray.length == 0)return(setShowModal(true),setAlertType('카테고리를 등록해주세요.'))

    const formData = new FormData();
    for (var i = 0; i < categoryArray.length; i++){
      formData.append('category[]', JSON.stringify(categoryArray[i]))
    }
    formData.append('name', Title)
    formData.append('about', About)


    formData.append('link_title', LinkList[0].title)
    formData.append('link_url', LinkList[0].url)
    

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
  
  const getCategoryList = async () => {
    const data = {
      page: 1
    };
    try {
      const {list,total} = await APICategoryList(data);
      setcategoriList(list);
    } catch (error) {
    }
  };
  
  const getLinks = async () => {
    const data = {
      page: 1
    };
    try {
      const {list,total} = await APILink(data);
      setLinkList(list);
    } catch (error) {
    }
  };
  
  const handleImage = (value: File[]) => {
    if(UploadImage.length > 12)return(setShowModal(true),setAlertType('12장 이상 등록할 수 없습니다.'))
    if(value.length > 12)return(setShowModal(true),setAlertType('12장 이상 등록할 수 없습니다.'))
    let fileURLs:dndData[] = [...UploadImage];
    const ShowImages = value;
    let imageUrlLists = [...ShowImage];
    setIsLoading(true)
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
    setIsLoading(false)
  };
  
  const handleDelete = (ItemIndex: number) => {
    console.log(ItemIndex)
    setShowImage((prev) => prev.filter((item,index) => index !== ItemIndex))
    setUploadImages((prev) => prev.filter((item,index) => index !== ItemIndex))
  };



  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", resizeListener);
  }, [innerWidth]);
  /** drageEvent */
  const scrollRef = useRef<any>(null);
  const [isDrag, setIsDrag] = useState(false);
  const [startX, setStartX] = useState<any>();
  const [isDragging, setIsDragging] = useState(false);
  const [movingX, setmovingX] = useState<any>();
  const onDragStart = (e:any) => {
    e.preventDefault();
    setIsDrag(true);
    setStartX(e.pageX + scrollRef.current.scrollLeft);
  };
  const onDragEnd = () => {
    setIsDrag(false);
  };
  const onDragMove = (e:any) => {
    if (isDrag) {
      scrollRef.current.scrollLeft = startX - e.pageX;
      setmovingX(scrollRef.current.scrollLeft)
    }
  };
  const throttle = (func:any, ms:any) => {
    let throttled = false;
    return (...args:any) => {
      if (!throttled) {
        throttled = true;
        setTimeout(() => {
          func(...args);
          throttled = false;
        }, ms);
      }
    };
  };
  
  useEffect(()=>{
    setIsDragging(true)
    setTimeout(() => {
      setIsDragging(false);
    }, 500);
  },[movingX])
  
  const delay = 10;
  const onThrottleDragMove = throttle(onDragMove, delay);

  useEffect(()=>{
    // getLinks()
    getCategoryList()
  },[])
  
  return (
    <Container>
      <TopTextButton text='Save' onClick={UploadSns}/>
      <ProfileContainer>
        {
        ShowImage.length > 0 &&
        <ShowMainImage>
          <MainUploadImageItem height={innerWidth} src={ShowImage[SelectMain]? ShowImage[SelectMain]:ShowImage[0]}/>
          <FileButton onChange={handleImage} multiple accept="image/png,image/jpeg">
            {(props) => (
            <MiniPlusImage height={innerWidth} key={0} index={0} {...props}>
              <PlusH></PlusH>
              <PlusV></PlusV>
            </MiniPlusImage>
            )}
          </FileButton>
        </ShowMainImage>
        }
        
        <ImageFlexBox
          onMouseDown={onDragStart}
          onMouseMove={onThrottleDragMove}
          onMouseUp={onDragEnd}
          onMouseLeave={onDragEnd}
          ref={scrollRef} 
          >
          {
          ShowImage.map((item,index)=>{
            return(
            <UploadImageItemWrap key={index}>
              <UploadImageItem onClick={()=>setSelectMain(index)} src={item}/>
              <DeleteButton onClick={() => handleDelete(index)} src={deleteButtonImage} />
            </UploadImageItemWrap>
            )
          })
          }
          {ShowImage.length < 1 &&
          <FileButton onChange={handleImage} multiple accept="image/png,image/jpeg">
            {(props) => (
            <PlusImage height={innerWidth} key={0} index={0} {...props}>
              <PlusH></PlusH>
              <PlusV></PlusV>
            </PlusImage>
            )}
          </FileButton>
          }
        </ImageFlexBox>
        <>
        <AboutWrap>
          Title
        </AboutWrap>
        <TextInput
          maxLength={20}
          value={Title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          placeholder="Input here"
          />
        <AboutWrap>
          About
        </AboutWrap>
        <InputWrap>
          <TextAreaInput
            maxLength={300}
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
          <LayoutWrap onClick={()=>{
            if(LinkList.length < 1){
              setLinkModal(true)
            } else {
              setShowModal(true);
              setAlertType('링크는 1개 이상 추가 할 수 없습니다.')
            }
          }}>
            <LinkImageWrap>
              <LinkImage src={linkImage}/>
            </LinkImageWrap>
            <LinkItemBox>
              <LinkTitleBox>
                Add Links
              </LinkTitleBox>
            </LinkItemBox>
          </LayoutWrap>
          {LinkList.map((item,index)=>{
          return(
          <LayoutWrap key={index} onClick={()=>{setLinkModal(true)}}>
            <LinkImageWrap>
              <LinkImage src={linkImage}/>
            </LinkImageWrap>
            <LinkItemBox>
              <LinkTitleBox>
                <LinkName>
                  {item.title}
                </LinkName>
                <LinkUrl>
                  {item.url}
                </LinkUrl>
              </LinkTitleBox>
              <ArrowImageWrap>
                <ArrowImage src={RightArrowImage}/>
              </ArrowImageWrap>
            </LinkItemBox>
          </LayoutWrap>
          )
        })}
        </BoxWrap>
        <BoxWrap>
          <BoxTitle>
            Category<CategoryCount>{categoryArray.length}</CategoryCount>
          </BoxTitle>
          <CategoryItemContainer>
            {categoryList && 
            categoryList.map((item,index)=>{
              return(
                <CategoryItem key={index} item={item.name} idx={item.idx} checked={categoryArray.includes(item.idx)} 
                setChecked={(e,type)=>{
                  console.log(e,type)
                  if(categoryArray.includes(e)){
                    setcategoryArray((prev) => prev?.filter((item) => item !== e))
                  } else if(categoryArray.length < 3){
                    setcategoryArray((prev) => [...prev, e])
                  }
                }}/>
              )
            })}
          </CategoryItemContainer>
        </BoxWrap>
      </WebContainer>
        </>
        <Modal opened={LinkModal} onClose={() => setLinkModal(false)} overlayOpacity={0.5} size="auto" centered withCloseButton={false}>
          <AddLink Check={(name,url)=>{setLinkList([{title:name, url:url}]);setLinkModal(false)}} Cancel={()=>setLinkModal(false)}/>
        </Modal>
        {/* <Modal opened={LinkModal} onClose={() => setLinkModal(false)} overlayOpacity={0.5} size="auto" centered withCloseButton={false}>
          <EditLink Check={(name,url)=>{setLinkList([{title:name, url:url}]);setLinkModal(false)}} Cancel={()=>setLinkModal(false)}/>
        </Modal> */}
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
        if(alertType == '12장 이상 등록할 수 없습니다.' ||
        alertType == '링크는 1개 이상 추가 할 수 없습니다.' ||
        alertType == '사진을 등록해주세요.' ||
        alertType == '내용을 등록해주세요.' ||
        alertType == '링크를 등록해주세요.' ||
        alertType == '카테고리를 등록해주세요.'
        
        ){
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
  max-width:768px;
  flex: 1;
  min-height: calc(100vh - 80px);
  margin:0 auto;
  /* flex-direction: row; */
  /* border-top: 1px solid #121212; */
  background-color: #ffffff;
  @media only screen and (max-width: 768px) {
    width:100%;
    margin:0;
    flex-direction: column;
    border-top: 0;
  }
`;

const ShowMainImage = styled.div`
  width:100%;
  height:width;
  position:relative;
`
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
  flex:1;
  width:100%;
`;
const ProductListWrap = styled.div`
  width:100%;
  height:100%;
`;
const WebContainer = styled.div`
  display:block;
  @media only screen and (max-width: 768px) {
    /* display:none */
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
  margin-right:10px;
  width: 150px;
  height: 150px;
  cursor: pointer;
  overflow: hidden;
  margin-bottom: 30px;
`;

const MiniPlusImage = styled.div<{height:number,index:number}>`
  /* border:1px solid #a1a1a1;; */
  position:absolute;
  right:30px;
  bottom:30px;
  display:flex;
  justify-content:center;
  align-items:center;
  background-color:#ffffff;
  border-radius:50%;
  border:1px solid #646464;
  width: 40px;
  height: 40px;
  cursor: pointer;
  overflow: hidden;
  margin-bottom: 30px;
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
const MainUploadImageItem = styled.img<{height:number}>`
  width: ${props => props.height > 768 ? 768 : props.height}px;
  height: ${props => props.height > 768 ? 768 : props.height}px;
  margin-right:10px;
  object-fit:contain;
`
const UploadImageItemWrap = styled.div`
position:relative;
  width: 150px;
  height: 150px;
`
const UploadImageItem = styled.img`
  width: 150px;
  height: 150px;
  margin-right:10px;
  object-fit:contain;
`
const DeleteButton = styled.img`
  width: 18px;
  height: 18px;
  position: absolute;
  top: 7px;
  right: 7px;
  cursor: pointer;
`;
const UploadButton = styled.input`
  display:none;
`
const ImageFlexBox = styled.div`
  display:flex;
  flex:1;
  width:100%;
  align-items: center;
  margin-bottom: 30px;

  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;

  ::-webkit-scrollbar{
    display:none;
  }
  /* 1440px */
  /* @media only screen and (max-width: 1440px) {
    margin: 20px 0px 20px 20px;;
  } */
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

const TextInput = styled.input`
  width:100%;
  font-size: 16px;
  color: #121212;
  height:40px;
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
const TextAreaInput = styled.textarea`
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
  @media only screen and (max-width: 768px) {
    margin:0 0px 50px;
    padding:0 10px;
  }
`;

const LayoutWrap = styled.div`
  display: flex;
  margin: 15px 0 ;
  cursor: pointer;
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
