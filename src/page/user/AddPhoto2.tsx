import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal } from '@mantine/core';
import { APICheckPassword, APIUserDetails } from '../../api/UserAPI';
import { UserContext } from '../../context/user';
import ImageCard from '../../components/Shop/ImageCard';
import { TImage } from '../admin/ProducerList';
import RightArrowImage from '../../asset/image/ico_next_mobile.png'
import CategoryItem from '../../components/Shop/CategoryItem';
import linkImage from '../../asset/image/links.png';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Virtual,Pagination,Navigation, Scrollbar } from 'swiper';
import { CategoryListCheck } from '../../components/List/List';

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
  const propsData = types.state;
  const { user } = useContext(UserContext);
  const [imageList, setimageList] = useState<TImage[]>([]);
  const [description, setdescription] = useState<string>('');
  
  const [categoryitemList,setcategoriitemList] = useState(CategoryListCheck)

  const saveHistory = (e: React.MouseEvent, idx: number) => {
    const div = document.getElementById('root');
    if (div) {
      console.log(div.scrollHeight, globalThis.scrollY);
      const y = globalThis.scrollY;
      // sessionStorage.setItem('shop', JSON.stringify(shopList));
      // sessionStorage.setItem('page', String(page));
      sessionStorage.setItem('type', String(1));
      sessionStorage.setItem('y', String(y ?? 0));
      navigate(`/shopdetails/${idx}`);
    }
  };
  const pagination = {
    // el:<PaginationBox/>,
    clickable: true,
    renderBullet: function (index:number, className:string) {
      let array : string[] = []
      imageList.map((item)=>{
        array.push(item.file_name);
      })
      return '<span class="' + className + '">' + array[index] + "</span>";
    },
  };
  
  
  useEffect(() => {
    setimageList([
      {
        idx: 1,
        file_name: '이미지1',
      },
      {
        idx: 2,
        file_name: '이미지2',
      },
      {
        idx: 3,
        file_name: '이미지3',
      },
      {
        idx: 4,
        file_name: '이미지4',
      },
    ]);
  }, []);

  return (
    <Container>
      <ProfileContainer>
        <ProductListWrap>
          
        </ProductListWrap>
        <BoxWrap>
          <BoxTitle>
            LINK
          </BoxTitle>
          <LayoutWrap onClick={()=>{navigate('/AddLink', { state: 'Add' });}}>
            <LinkImageWrap>
              <Image src={linkImage}/>
            </LinkImageWrap>
            <LinkItemBox>
              <LinkTitleBox>
                Add Links
              </LinkTitleBox>
            </LinkItemBox>
          </LayoutWrap>
          <LayoutWrap onClick={()=>{navigate('/EditLink', { state: 'Edit' });}}>
            <LinkImageWrap>
              <Image src={linkImage}/>
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
        {/* <InputWrap>
          <TextInput
            value={description}
            onChange={(e) => {
              setdescription(e.target.value);
            }}
            placeholder="Input here"
          />
        </InputWrap> */}
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
  @media only screen and (max-width: 768px) {
    flex-direction: column;
    border-top: 0;
  }
`;
const ProfileContainer = styled.div`
  margin:20px;
`;
const ProductListWrap = styled.div`
  width:100%;
  display:flex;
  flex-direction:column;
`;

const PlusImage = styled.div`
  /* border:1px solid #a1a1a1;; */
  display:flex;
  justify-content:center;
  align-items:center;
  aspect-ratio: 1.2;
  background-color:#d1d1d1;
  width: 16.5%;
  cursor: pointer;
  overflow: hidden;
  @media only screen and (max-width: 1440px) {
    width: 24.25%;
  }
  @media only screen and (max-width: 768px) {
    width: 49.5%;
    margin-bottom: 50px;
  }
`;
const PlusText = styled.p`
  font-size:25px;
  font-weight:400;
  margin:0;
  @media only screen and (max-width: 768px) {
  }
  `;

const InputWrap = styled.div`
  display: flex;
  width: 100%;
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

const AlertText = styled.span`
  font-weight: 400;
  font-size: 12px;
  color: #d82c19;
  margin-top: 8px;
  padding-left: 10px;
`;

const InputBox = styled.div`
  width:100%;
  justify-content:space-between;
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
  border-bottom:1px solid #c7c7c7;
`;
const BoxWrap = styled.div`
  width:100%;
  display: flex;
  flex-direction: column;
  margin-bottom:50px;
`;

const LayoutWrap = styled.div`
  display: flex;
  margin: 15px 0 ;
`;
const EditInputWrap = styled.div`
  display: flex;
  padding-bottom: 3px;
  align-items: center;
  border-bottom: 1px solid #121212;
`;
const EditPhotoButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration : underline;
  /* border-bottom:2px solid #c7c7c7; */
  margin:10px 0 0 0;
  font-size:14px;
  font-weight:400;
  white-space:nowrap;
  @media only screen and (max-width: 768px) {
  }
  `;
const SubTextBox = styled.p`
  font-size:14px;
  font-weight:400;
  text-align:start;
  color:#a1a1a1;
  margin:0;
  @media only screen and (max-width: 768px) {
  }
  `;
const DescriptionText = styled.p`
  font-size:14px;
  font-weight:400;
  text-align:start;
  color:#2b2b2b;
  margin:30px 0;
  @media only screen and (max-width: 768px) {
  }
  `;
const BoxTitle = styled.p`
font-family:'Pretendard Variable';
  font-size:16px;
  font-weight:500;
  text-align:start;
  color:#2b2b2b;
  margin:20px 0 10px 0;
  @media only screen and (max-width: 768px) {
  }
`
const CategoryCount = styled.span`
  font-size:13px;
  font-weight:500;
  text-align:start;
  color:#adadad;
  margin-left:20px;
`

const LinkName = styled.p`
font-family:'Pretendard Variable';
  font-weight:500;
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
  font-weight:500;
  text-align:start;
  color:#b8b8b8;
  margin:0;
  @media only screen and (max-width: 768px) {
    font-size:12px;
  }
`;

const ImageWrap = styled.div`
  width:210px;
  aspect-ratio: 1.1;
  /* width:15%; */
  @media only screen and (max-width: 768px) {
    width:160px;
  }
`;
const LinkImageWrap = styled.div`
display:flex;
align-items:center;
  width:70px;
  height:70px;
  margin-right:50px;
  /* width:40%; */
  @media only screen and (max-width: 768px) {
    margin-right:20px;
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
  /* gap:5px; */
`;

const Image = styled.img`
  width:100%;
  height:100%;
  object-fit:contain;
`;


const SwiperWrap = styled.div`
  background-color:#cecece;
  /* width:400px; */
  height:400px;
  /* max-height:1000px; */
  width:100%;
`;
const ImageBox2 = styled.div`
  width: 85%;
  height:100%;
  /* max-height:800px; */
  object-fit:contain;
  /* overflow: hidden; */
  background-color:aqua;
  /* aspect-ratio: 0.8; */
  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;

export default AddPhoto2;
