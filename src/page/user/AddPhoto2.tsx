import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal } from '@mantine/core';
import { UserContext } from '../../context/user';
import { CategoryType, TImage } from '../../types/Types';
import RightArrowImage from '../../asset/image/ico_next_mobile.png'
import CategoryItem from '../../components/Shop/CategoryItem';
import linkImage from '../../asset/image/links.png';
import { CategoryListCheck } from '../../components/List/List';
import TopButton from '../../components/Product/TopButton';
import TopTextButton from '../../components/Layout/TopTextButton';

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


function AddPhoto2() {
  const navigate = useNavigate();
  const types = useLocation();
  const [categoryList,setcategoriList] = useState<CategoryType[]>([])
  const [categoryArray,setcategoryArray] = useState<number[]>([])
  const propsData = types.state;
  const { user } = useContext(UserContext);
  const [imageList, setimageList] = useState<TImage[]>([]);
  const [description, setdescription] = useState<string>('');
  
  const [categoryitemList,setcategoriitemList] = useState(CategoryListCheck)

  
  return (
    <Container>
      <TopTextButton text='Save' onClick={()=>{}}/>
      <ProfileContainer>
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
      </ProfileContainer>
    </Container>
  );
}


const Container = styled.div`
  /* display: flex; */
  /* flex: 1; */
  min-height: calc(100vh - 80px);
  /* flex-direction: row; */
  border-top: 1px solid #121212;
  background-color: #ffffff;
  max-width: 768px;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
    border-top: 0;
  }
`;
const ProfileContainer = styled.div`
  margin:20px 15px;
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

const LinkImage = styled.img`
  width:100%;
  height:100%;
  object-fit:contain;
`;


export default AddPhoto2;
