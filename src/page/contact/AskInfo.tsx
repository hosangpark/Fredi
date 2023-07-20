import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import logoImage from '../../asset/image/logo.png';
import { APICompanyInfo, APISelling } from '../../api/SettingAPI';
import { TCompanyInfo } from '../../components/Layout/Footer';
import CheckBox from '../../components/Shop/CheckBox';
import { CategoryList } from '../../components/List/List';
import ButtonContainer from '../../components/Layout/ButtonBox';
import { useNavigate } from 'react-router-dom';
import AlertModal from '../../components/Modal/AlertModal';
import UploadImage from '../../asset/image/save_img.svg'

function AskInfo() {
  const navigate = useNavigate();
  const [companyInfo, setCompanyInfo] = useState<TCompanyInfo>();
  const [alertType, setAlertType] = useState('');
  const [showContentModal, setShowContentModal] = useState(false);
  const [checked, setChecked] = useState(0);
  const [Images, setImages] = useState<any>();
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
    if (!sellingAsk.categories) return setAlertType('categories을 입력해주세요.'),setShowContentModal(true);
    if (!sellingAsk.title) return setAlertType('title을 입력해주세요.'),setShowContentModal(true);
    if (!sellingAsk.materials) return setAlertType('materials을 입력해주세요.'),setShowContentModal(true);
    if (!sellingAsk.height) return setAlertType('height을 입력해주세요.'),setShowContentModal(true);
    if (!sellingAsk.width) return setAlertType('width을 입력해주세요.'),setShowContentModal(true);
    if (!sellingAsk.depth) return setAlertType('depth을 입력해주세요.'),setShowContentModal(true);
    if (!Images) return setAlertType('Image를 업로드 해주세요.'),setShowContentModal(true);

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

    for (var i = 0; i < Images.length; i++){
      formData.append('images', Images[i]);
    }
    
    try {
      const res = await APISelling(formData);
      console.log(res)
      navigate(-1)
      // setIsSnsUser(res.type !== 1 ? true : false);
    } catch (error) {
      // console.log(error);
      // navigate('/signin', { replace: true });
    }
  };
  const onUploadImageButtonClick = useCallback(() => {
    if (!inputRef.current) {
      return;
    }
    inputRef.current.click();
  }, []);

  const onUploadImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    console.log(e.target.files)
    setImages(e.target.files)    
  }, []);


  const setInfoHandle = (e:any,type:string) =>{
    // console.log(e,type)
    setSellingAsk({...sellingAsk,[type]:e})
  }

  useEffect(() => {
    // getCompanyInfo();
  }, []);

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
            {CategoryList.slice(1).map((item,index)=>{
              return(
                <CheckboxItems key={index} onClick={()=>setChecked(index)}>
                  <CheckBox checked={checked==index} size={20}/>
                  <CheckBoxText>{item.label}</CheckBoxText>
                </CheckboxItems>
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
              onChange={(e) => setInfoHandle(e.target.value,'materials')} 
              placeholder='mm'
            />
          </RowWap>
          <RowWap>
            <LeftText>Width</LeftText>
            <RightInput
              value={sellingAsk.Width} 
              onChange={(e) => setInfoHandle(e.target.value,'materials')} 
              placeholder='mm'
            />
          </RowWap>
        </RowWap>
        
        <MessageInform>
          About Artwork
        </MessageInform>

        <FileUpload htmlFor='Upload' onClick={onUploadImageButtonClick}>
          {/* <UplodaImage src={UploadImage}/> */}
          <HideInput type='file' multiple accept='image/*' ref={inputRef} onChange={onUploadImage} name='Upload'/>
          File upload {Images? Images.length : 0}
        </FileUpload>

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
        setShowContentModal(false);
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
const FileUpload = styled.label`
display:flex;
justify-content:center;
align-items:center;
  width: 150px;
  border-radius:12.5px;
  border:1px solid #b1b1b1;
  font-weight:410;
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


export default AskInfo;
