import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import logoImage from '../../asset/image/logo.png';
import { APICompanyInfo } from '../../api/SettingAPI';
import { TCompanyInfo } from '../../components/Layout/Footer';
import CheckBox from '../../components/Shop/CheckBox';
import { CategoryList } from '../../components/List/List';

function AskInfo() {
  const [companyInfo, setCompanyInfo] = useState<TCompanyInfo>();
  const [checked, setChecked] = useState(0);
  const [sellingAsk,setSellingAsk] = useState<any>({
    artistname:'',
    brandname:'',
    email:'',
    sns:'',
    phone:'',
    categories:'',
    title:'',
    materials:'',
  })

  const getCompanyInfo = async () => {
    const data = await APICompanyInfo();
    console.log('companyInfo', data);
    setCompanyInfo(data);
  };

  const setInfoHandle = (e:any,type:string) =>{
    // console.log(e,type)
    setSellingAsk({...sellingAsk,[type]:e})
  }

  useEffect(() => {
    getCompanyInfo();
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
                <CheckboxItems onClick={()=>setChecked(index)}>
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
      </CheckMessagebox>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  width:100%;
`
const Title = styled.h3`
font-family:'Pretendard Variable';
  font-weight: 500;
  color: #121212;
  padding:30px;
  border-bottom: 1px solid #e2e2e2;
  @media only screen and (max-width: 1000px) {
    padding:20px;
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
  font-weight:500;
  font-size:14px;
  margin:20px 0 10px 5px;
  @media only screen and (max-width:768){
    font-size:12px;
  }
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
  font-weight: 400;
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
  font-weight: 400;
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

const RightInput = styled.input<{marginR?:number}>`
font-family:'Pretendard Variable';
  font-weight: 400;
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
