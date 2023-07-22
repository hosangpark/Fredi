import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FileButton } from '@mantine/core';
import { APISelling } from '../../api/SettingAPI';
import deleteButtonImage from '../../asset/image/ico_del.png';
import ButtonContainer from '../../components/Layout/ButtonBox';
import { useNavigate } from 'react-router-dom';
import AlertModal from '../../components/Modal/AlertModal';
import { dndData } from '../../components/DnD/DnD';
import { APICategoryList } from '../../api/ProductAPI';
import { CategoryType } from '../../types/Types';
import CheckCategoryItem from '../../components/Shop/CheckCategoryItem';

function AskInfo() {
  const navigate = useNavigate();
  const [ShowImage, setShowImage] = useState<any[]>([]);
  const [alertType, setAlertType] = useState('');
  const [showContentModal, setShowContentModal] = useState(false);
  const [checked, setChecked] = useState(0);
  const [UploadImage, setUploadImages] = useState<dndData[]>([]);
  const [categoryList,setcategoriList] = useState<CategoryType[]>([])
  const [categoryArray,setcategoryArray] = useState<number[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [sellingAsk,setSellingAsk] = useState<any>({
    artistname:'',
    brandname:'',
    email:'',
    sns:'',
    phone:'',
    categories:'',
    title:'',
    materials:'',
    height:'',
    width:'',
    depth:'',
  })

  const SendSelling = async () => {
    const formData = new FormData();

    if (!sellingAsk.artistname) return setAlertType('artistname을 입력해주세요.'),setShowContentModal(true);
    if (!sellingAsk.brandname) return setAlertType('brandname을 입력해주세요.'),setShowContentModal(true);
    if (!sellingAsk.email) return setAlertType('email을 입력해주세요.'),setShowContentModal(true);
    if (!sellingAsk.sns) return setAlertType('sns을 입력해주세요.'),setShowContentModal(true);
    if (!sellingAsk.phone) return setAlertType('phone을 입력해주세요.'),setShowContentModal(true);
    if (categoryArray.length == 0) return setAlertType('categories을 입력해주세요.'),setShowContentModal(true);
    if (!sellingAsk.title) return setAlertType('title을 입력해주세요.'),setShowContentModal(true);
    if (!sellingAsk.materials) return setAlertType('materials을 입력해주세요.'),setShowContentModal(true);
    if (!sellingAsk.height) return setAlertType('height을 입력해주세요.'),setShowContentModal(true);
    if (!sellingAsk.width) return setAlertType('width을 입력해주세요.'),setShowContentModal(true);
    if (!sellingAsk.depth) return setAlertType('depth을 입력해주세요.'),setShowContentModal(true);
    if (!UploadImage) return setAlertType('Image를 업로드 해주세요.'),setShowContentModal(true);

    formData.append('artist_name', sellingAsk.artistname);
    formData.append('brand_name', sellingAsk.brandname);
    formData.append('sns', sellingAsk.sns);
    formData.append('email', sellingAsk.email);
    formData.append('phone', sellingAsk.phone);
    formData.append('title', sellingAsk.title);
    formData.append('width', sellingAsk.width);
    formData.append('depth', sellingAsk.depth);
    formData.append('height', sellingAsk.height);
    formData.append('materials', sellingAsk.materials);

    for (var i = 0; i < categoryArray.length; i++){
      formData.append('category[]', JSON.stringify(categoryArray[i]))
    }

    for (var i = 0; i < UploadImage.length; i++){
      formData.append('images', UploadImage[i].file);
    }
    try {
      const res = await APISelling(formData);
      console.log(res)
      setAlertType('success')
      setShowContentModal(true)
      // setIsSnsUser(res.type !== 1 ? true : false);
    } catch (error) {
      console.log(error);
      // navigate('/signin', { replace: true });
    }
  };

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


  const onUploadImage = (value: File[]) => {
    if(UploadImage.length > 12)return(setShowContentModal(true),setAlertType('12장 이상 등록할 수 없습니다.'))
    if(value.length > 12)return(setShowContentModal(true),setAlertType('12장 이상 등록할 수 없습니다.'))
    // console.log(value)
    const ShowImages = value;
    let fileURLs:dndData[] = [...UploadImage];
    let imageUrlLists = [...ShowImage];
    for (let i = 0; i < value.length; i++) {
      let reader = new FileReader();
      const currentImageUrl = URL.createObjectURL(ShowImages[i]);
      imageUrlLists.push(currentImageUrl);
      let file = value[i];
      reader.onload = () => {
        const file = { url: reader.result as string, name: value[i].name, symbol: String(Date.now()), file: value[i] };
        fileURLs.push(file)
        // console.log('fsfsfs',file)
        
      };
      reader.readAsDataURL(file);
    }
    setShowImage(imageUrlLists.slice(0, 12))
    // console.log(fileURLs)
    setUploadImages(fileURLs)
  };

  const handleDelete = (ItemIndex: number) => {
    console.log(ItemIndex)
    setShowImage((prev) => prev.filter((item,index) => index !== ItemIndex))
    setUploadImages((prev) => prev.filter((item,index) => index !== ItemIndex))
  };


  const setInfoHandle = (e:any,type:string) =>{
    // console.log(e,type)
    setSellingAsk({...sellingAsk,[type]:e})
  }

  useEffect(() => {
    getCategoryList()
    // getCompanyInfo();
  }, []);
  useEffect(() => {
    console.log('dasdsa')
    setChecked(ShowImage.length)
  }, [ShowImage]);

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

  return (
    <Container>
    <Title>Selling</Title>
      <CheckMessagebox>
        <MessageInform>
          Let us know how to reach you
        </MessageInform>
        <RowWap>
          <LeftText>Artist name</LeftText>
          <RightInput
            value={sellingAsk.artistname} 
            onChange={(e) => setInfoHandle(e.target.value,'artistname')} 
            placeholder='[Artist name]'
          />
        </RowWap>
        <RowWap>
          <LeftText>Brand name</LeftText>
          <RightInput
            value={sellingAsk.brandname} 
            onChange={(e) => setInfoHandle(e.target.value,'brandname')} 
            placeholder='[Brand name]'/>
        </RowWap>
        <RowWap>
          <LeftText>E-mail</LeftText>
          <RightInput
            value={sellingAsk.email} 
            onChange={(e) => setInfoHandle(e.target.value,'email')} 
            placeholder='[E-mail address]'
            />
          {/* <TextInput maxLength={10} value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="닉네임 입력" /> */}
          {/* <UnderlineTextButton onClick={onCheckNickname}>중복확인</UnderlineTextButton> */}
        </RowWap>
        <RowWap>
          <LeftText>SNS Account</LeftText>
          <RightInput
            value={sellingAsk.sns} 
            onChange={(e) => setInfoHandle(e.target.value,'sns')} 
            placeholder='[URL]'
          />
        </RowWap>
        <RowWap>
          <LeftText>Phone</LeftText>
          <RightInput
            value={sellingAsk.phone} 
            onChange={(e) => setInfoHandle(e.target.value,'phone')} 
            placeholder='[Phone]'
          />
        </RowWap>
        <CheckBoxContainer>
          <MessageInform>
            About Artwork
          </MessageInform>
          <LeftText>Categories</LeftText>
          <CheckBoxWrap>
            {categoryList && 
            categoryList.map((item,index)=>{
              return(
                <CheckCategoryItem key={index} item={item.name} idx={item.idx} checked={categoryArray.includes(item.idx)} 
                setChecked={(e,type)=>{
                  console.log(e,type)
                  if(categoryArray.includes(e)){
                    setcategoryArray((prev) => prev?.filter((item) => item !== e))
                  } else if(categoryArray.length < 3){
                    setcategoryArray((prev) => [...prev, e])
                  }
                }} />
              )
            })}
          </CheckBoxWrap>
        </CheckBoxContainer>
        <RowWap>
          <LeftText>Title</LeftText>
          <RightInput
            value={sellingAsk.title} 
            onChange={(e) => setInfoHandle(e.target.value,'title')} 
            placeholder='[Title]'
          />
        </RowWap>
        <RowWap>
          <LeftText>Materials</LeftText>
          <RightInput
            value={sellingAsk.materials} 
            onChange={(e) => setInfoHandle(e.target.value,'materials')} 
            placeholder='[Materials]'
          />
        </RowWap>
        <RowWap>
          <RowWap>
            <LeftText>Height</LeftText>
            <RightInput
              value={sellingAsk.Height} 
              onChange={(e) => setInfoHandle(e.target.value,'height')} 
              placeholder='mm'
            />
          </RowWap>
          <RowWap>
            <LeftText>Width</LeftText>
            <RightInput
              value={sellingAsk.Width} 
              onChange={(e) => setInfoHandle(e.target.value,'width')} 
              placeholder='mm'
            />
          </RowWap>
          <RowWap>
            <LeftText>Depth</LeftText>
            <RightInput
              value={sellingAsk.Width} 
              onChange={(e) => setInfoHandle(e.target.value,'depth')} 
              placeholder='mm'
            />
          </RowWap>
        </RowWap>
        
        <MessageInform>
          About Artwork
        </MessageInform>
        <FileButton onChange={onUploadImage} multiple accept="image/png,image/jpeg">
          {(props) => (
          <FileUpload {...props}>
            {/* <UplodaImage src={UploadImage}/> */}
            File upload {checked}
          </FileUpload>
          )}
        </FileButton>

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
              <UploadImageItem onClick={()=>{}} src={item}/>
              <DeleteButton onClick={() => handleDelete(index)} src={deleteButtonImage} />
            </UploadImageItemWrap>
            )
          })
          }
          {ShowImage.length < 1 &&
          <FileButton onChange={onUploadImage} multiple accept="image/png,image/jpeg">
            {(props) => (
            <PlusImage key={0} index={0} {...props}>
              <PlusH></PlusH>
              <PlusV></PlusV>
            </PlusImage>
            )}
          </FileButton>
          }
        </ImageFlexBox>
        

        <ButtonContainer
          text1={'Send'}
          text2={'Cancel'}
          onClick1={()=>{}}
          onClick2={SendSelling}
          cancle={()=>navigate(-1)}
          marginT={50}
          marginB={100}
        />
      </CheckMessagebox>
      <AlertModal
      visible={showContentModal}
      setVisible={setShowContentModal}
      onClick={() => {
        if(alertType == 'success'){
          setShowContentModal(false);
          navigate(-1)
        } else {
          setShowContentModal(false);
        }
      }}
      text={alertType}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  min-width: 290px;
  width: 100%;
  flex-direction: column;
  text-align: left;
  padding:30px;
  @media only screen and (max-width: 1000px) {
    width: 100%;
    padding:20px;
    border-right: 0;
  }
`
const Title = styled.h3`
font-family:'Pretendard Variable';
  font-weight: 410;
  color: #121212;
  font-size: 16px;
  border-bottom: 1px solid  #ECECEC;
  
  @media only screen and (max-width: 768px) {
  padding-bottom:40px;
    font-size: 14px;
  }
`;

const CheckMessagebox = styled.div`
max-width:768px;
margin:0 auto;
padding:0 20px 50px;
`

const MessageInform = styled.div`
  font-family:'Pretendard Variable';
  font-weight: 410;
  font-size:14px;
  margin:20px 0 10px 5px;
  @media only screen and (max-width:768){
    font-size:12px;
  }
`

const UplodaImage = styled.img`
  width:30px;
  height:30px;
  transform:rotate(180deg);
`
const FileUpload = styled.div`
display:flex;
justify-content:center;
cursor:pointer;
align-items:center;
  width: 150px;
  border-radius:12.5px;
  border:1px solid #b1b1b1;
  font-weight:410;
  margin-bottom:20px;
`
const CheckBoxContainer = styled.div`
  padding:10px 5px;
  display:flex;
  flex-direction:column;

`
const CheckBoxText = styled.span`
  font-family:'Pretendard Variable';
  font-size: 14px;
  margin-left: 7px;
  font-weight: 410;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;
const CheckboxItems = styled.div`
  display:flex;
  align-items:center;
  padding:5px;
  width:33.3333%;
`
const RowWap = styled.div<{ last?: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  justify-content:space-between;
  border-bottom:1px solid #d4d4d4;
  @media only screen and (max-width: 768px) {
  }
`;
const LeftText = styled.span`
font-family:'Pretendard Variable';
  color: #121212;
  font-weight: 410;
  flex:4;
  height: 100%;
  text-align: left;
  line-height: 80px;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
    line-height: 50px;
  }
`;
const CheckBoxWrap = styled.div`
  display:flex;
  flex-wrap:wrap;
`
const HideInput = styled.input`
  display:none;
`

const RightInput = styled.input<{marginR?:number}>`
font-family:'Pretendard Variable';
  font-weight: 410;
  width:100%;
  padding:10px 0;
  border: 0;
  flex:6;
  font-size: 14px;
  margin-right:15px;
  text-align: right;
  margin-right:${(props)=> props.marginR ? props.marginR : 0}px;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;
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
const PlusImage = styled.div<{index:number}>`
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

export default AskInfo;
