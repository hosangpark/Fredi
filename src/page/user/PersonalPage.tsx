import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import likeOnImage from '../../asset/image/heart_on.svg';
import likeOffImage from '../../asset/image/heart.svg';
import bookmarkOnImage from '../../asset/image/bookon.svg';
import bookmarkOffImage from '../../asset/image/Bookoff.svg';
import arrDownImage from '../../asset/image/arr_down.png';
import { Embla, useAnimationOffsetEffect } from '@mantine/carousel';
import { Modal, Select } from '@mantine/core';
import { SnsdetailsType, TImage } from '../../types/Types';
import AlertModal from '../../components/Modal/AlertModal';
import reporticon from '../../asset/image/threecircle.png';
import { UserContext } from '../../context/user';
import { useRef } from 'react';
import { createBrowserHistory } from 'history';
import profileImage from '../../asset/image/Profile.svg';
import { removeHistory } from '../../components/Layout/Header';
import { Pagination,Navigation, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { APIArtistFollowAdd, APIBookMarkLike, APISnsCount, APISnsDetails, APISnsLike } from '../../api/ProductAPI';
import { APISnsReport, APIUserReport } from '../../api/UserAPI';
import { NoDoubleEmptySpace } from '../../util/Reg';

const REASONLIST = [
  { value: '', label: '사유를 선택해주세요' },
  { value: '욕설, 비방, 인신공격 게재', label: '욕설, 비방, 인신공격 게재' },
  { value: '영리목적 / 홍보성의 광고 내용', label: '영리목적 / 홍보성의 광고 내용' },
  { value: '게시글 도배', label: '게시글 도배' },
  { value: '음란 / 선정성 불법 정보 노출', label: '음란 / 선정성 불법 정보 노출' },
  { value: '기타', label: '기타' },
];

function PersonalPage() {
  const { idx } = useParams();
  const navigate = useNavigate();
  const history = createBrowserHistory();
  const location = useLocation();
  const { user } = useContext(UserContext);
  const [Snsdetails, setSnsdetails] = useState<SnsdetailsType>();
  const [ShowAlertModal, setShowAlertModal] = useState(false);
  const [alertType, setAlertType] = useState<string>('')
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [reason, setReason] = useState<string | null>('');
  const [reasonText, setReasonText] = useState<string>('');
  const [ReportModal, setReportModal] = useState(false)
  const [ShowReportModal, setShowReportModal] = useState(false)
  const [ReportType, setReportType] = useState(1)
  const [ReportNumber, setReportNumber] = useState<number>(0)
  const [ ip , setIp ] = useState();


  const leftBoxRef = useRef<HTMLDivElement>(null);
  const [embla, setEmbla] = useState<Embla | null>(null);
  const TRANSITION_DURATION = 200;
  useAnimationOffsetEffect(embla, TRANSITION_DURATION);

 

  const getSnsDetails = async () => {
    console.log(location.state)
    const data = {
      idx: location.state,
    };
    try {
      const res = await APISnsDetails(data);
      console.log(res)
      
      setSnsdetails(res);
      // SNSCount()
    } catch (error) {
      console.log(error);
    }
    
  }

  const UserFollow = async() =>{
    if (user.idx) {
      const data = {
        designer_idx: Snsdetails?.user.idx,
      };
      try {
        const res = await APIArtistFollowAdd(data);
        if(res.message == '좋아요 완료'){
          setAlertType('팔로우 완료')
        } else {
          setAlertType('팔로우 해제')
        }
        setShowAlertModal(true)
        getSnsDetails()
      } catch (error) {
        console.log(error);
      }
    } else {
      setShowAlertModal(true);setAlertType('회원가입 후 이용 가능합니다.')
    }
  }
      
  const LikeSns = async () => {
    if (user.idx) {
      const data = {
        sns_idx: location.state,
      };
      try {
        const res = await APISnsLike(data);
        setAlertType(res.message)
        setShowAlertModal(true)
        getSnsDetails()
      } catch (error) {
        console.log(error);
      }
    } else {
      setShowAlertModal(true);setAlertType('회원가입 후 이용 가능합니다.')
    }
  };

  const LikeBookMark = async () => {
    if (user.idx) {
      const data = {
        sns_idx: location.state,
      };
      try {
        const res = await APIBookMarkLike(data);
        if(res.message == '좋아요 완료'){
          setAlertType('북마크 완료')
        } else {
          setAlertType('북마크 해제')
        }
        setShowAlertModal(true)
        getSnsDetails()
      } catch (error) {
        console.log(error);
      }
    } else {
      setShowAlertModal(true);setAlertType('회원가입 후 이용 가능합니다.')
    }
  };
  const ReportSns = async () => {
  if (!reason) return(setShowAlertModal(true),setAlertType('신고사유를 선택해주세요.'))
  if (reason === '기타' && !reasonText) return(setAlertType('신고내용을 입력해주세요.'),setShowAlertModal(true))
  if(reason){
    for(let i = 0 ;  i < REASONLIST.length ; i++ ){
      if(REASONLIST[i].value.includes(reason)){
        break
      }
      setReportNumber(i+1)
    }
  }
    if (user.idx) {
      const data = {
        reason:ReportNumber,
        reason_etc:reasonText,
        target_idx:Snsdetails?.idx
      };
      try {
        const res = await APISnsReport(data);
        setShowReportModal(false)
        setReasonText('')
        setShowAlertModal(true);
        setAlertType('신고되었습니다.');
        // console.log(res);
      } catch (error) {
        setShowReportModal(false)
        setShowAlertModal(true)
        setAlertType('이미 신고되었습니다.')
        console.log(error);
      }
    } else {
      setShowAlertModal(true);setAlertType('회원가입 후 이용 가능합니다.')
    }
  };
  const ReportUser = async () => {
  if (!reason) return(setShowAlertModal(true),setAlertType('신고사유를 선택해주세요.'))
  if (reason === '기타' && !reasonText) return(setAlertType('신고내용을 입력해주세요.'),setShowAlertModal(true))
    if(reason){
      for(let i = 0 ;  i < REASONLIST.length ; i++ ){
        if(REASONLIST[i].value.includes(reason)){
          break
        }
        setReportNumber(i+1)
      }
    }

    if (user.idx) {
      const data = {
        reason:ReportNumber,
        reason_etc:reasonText,
        target_idx:Snsdetails?.user_idx
      };
      try {
        const res = await APIUserReport(data);
        setShowReportModal(false)
        setShowAlertModal(true);
        setAlertType('신고되었습니다.');
        setReasonText('')
        console.log('userReport',res);
      } catch (error) {
        setShowReportModal(false)
        setShowAlertModal(true);
        setAlertType('이미 신고되었습니다.');
        // console.log(error);
      }
    } else {
      setShowAlertModal(true);setAlertType('회원가입 후 이용 가능합니다.')
    }
  };

  const SNSCount = async() => {
    let stringip = JSON.stringify(ip)
    
    const data = {
      res: ip,
      sns_idx: location.state
    };
    try {
      const res = await APISnsCount(data);
      console.log('resresresresresresresres',res);
    } catch (error) {
      console.log(error);
    }
  }
  
  const ReportCheck = (e:string)=>{
    setShowReportModal(true)
    setReportModal(false)
    if(e == 'user'){
      setReportType(1)
    }else{
      setReportType(2)
    }
  }


  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => setIp(data.ip))
      .catch(error => console.log(error))
  }, []);

  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", resizeListener);
  }, [innerWidth]);

  useEffect(() => {
    getSnsDetails();
    // SNSCount()
    // console.log('Snsdetails', Snsdetails);
  }, []);


  useEffect(() => {
    // console.log(history.action);
    const backCheck = history.listen(({ location, action }) => {
      // console.log(action);
      if (action === 'POP') {
        console.log('뒤로');
      }
    });
    return backCheck;
  }, []);


  return (
    <ContainerWrap id="productContainer" onClick={() => setReportModal(false)}>
      <Container>
        <ProfileHeaderWrap>
          <HeaderLeft>
            <ImageWrap Image={Snsdetails?.user.image?.file_name? true : false}>
              {Snsdetails?.user.image?.file_name ?
              <ProfileImage src={Snsdetails?.user.image?.file_name}/>
              :
              <BasicImage src={profileImage}/>
              }
            </ImageWrap>
            <NameBox>
            <FlexBox>
              <NameText>{Snsdetails?.user.name}</NameText>
              
            </FlexBox>
            <ButtonBox>
              <FollowButtonBox follow={Snsdetails?.user.isLike? Snsdetails?.user.isLike : false} onClick={UserFollow}>
                Follow
              </FollowButtonBox>
              <ReportImageWrap onClick={
                (e)=>{
                e.stopPropagation();
                setReportModal(!ReportModal)}}>
                <ImageRotate src={reporticon}/>
              </ReportImageWrap>
            </ButtonBox>

            {ReportModal &&
            <ReportModalBox>
              <ReportSelctBox onClick={()=>ReportCheck('user')}>
                사용자 신고하기
              </ReportSelctBox>
              <ReportSelctBox onClick={()=>ReportCheck('sns')}>
                게시글 신고하기
              </ReportSelctBox>
            </ReportModalBox>
            }
            
            </NameBox>
          </HeaderLeft>
          
        </ProfileHeaderWrap>
      <Swiper
        // install Swiper modules
        modules={[Navigation, Pagination, Scrollbar]}
        // slidesPerView={ProductViews}
        navigation= {false
        //   {
        //   prevEl: prevRef.current,
        //   nextEl: nextRef.current,
        // }
        // :
        // false
        }
        // spaceBetween={30}
        scrollbar={{hide:true}}
        // pagination={{ type: "progressbar" }}
        style={{paddingBottom:2.5,}}
      >
        {Snsdetails?.imageList  ?
        Snsdetails?.imageList.map((item:TImage) => {
          // console.log('item', item);
          return(
            <SwiperSlide key={item.idx}>
              <ImageBox2 innerWidth={innerWidth}>
                <SliderImage src={item.file_name} />
              </ImageBox2>
            </SwiperSlide>
          );
        })
        :
        <ImageBox2 innerWidth={innerWidth}>
        </ImageBox2>
        }
      </Swiper>
      <LinkUrlBox >
        <LinkTitle>
          {Snsdetails?.link_title}
        </LinkTitle>
        <LinkUrl onClick={() =>{window.open(`https://${Snsdetails?.link_url}`, '_blank')}}>
          {Snsdetails?.link_url}
        </LinkUrl>
      </LinkUrlBox>
      <LikeButtonWrap>
        <LikeBox>
          <LikeButton onClick={LikeSns} src={Snsdetails?.isLike ? likeOnImage : likeOffImage} />
          <BookMarkButton onClick={LikeBookMark}src={Snsdetails?.isBookmark ? bookmarkOnImage : bookmarkOffImage} />
        </LikeBox>
      </LikeButtonWrap>
      <DescriptionWrap>
        {Snsdetails?.about} 
      </DescriptionWrap>
      <Modal opened={ShowReportModal} onClose={() => setShowReportModal(false)} overlayOpacity={0.5} size="auto" centered withCloseButton={false}>
        <ModalTitle>해당 {ReportType == 1 ? '사용자를' : '게시글을'} 신고하시겠습니까?</ModalTitle>
        <Select
          rightSection={<DownIcon src={arrDownImage} />}
          styles={(theme) => ({
            rightSection: { pointerEvents: 'none' },
            root: { width: '100%' },
            item: {
              '&[data-selected]': {
                '&, &:hover': {
                  backgroundColor: '#121212',
                  color: '#fff',
                },
              },
            },
          })}
          variant="unstyled"
          value={reason}
          data={REASONLIST}
          onChange={setReason}   
        />
        <ModalContentBox value={reasonText} onChange={e=>setReasonText(NoDoubleEmptySpace(e.target.value))}></ModalContentBox>
        <ButtonWrap visible={true} marginT={37} marginB={37}>
          <WhiteButton onClick={()=>setShowReportModal(false)}>
            <WhiteButtonText>Cancel</WhiteButtonText>
          </WhiteButton>
          <BlackButton onClick={ReportType == 1 ? ReportUser : ReportSns}>
            <BlackButtonText>확인</BlackButtonText>
          </BlackButton>
        </ButtonWrap>
      </Modal>
        <AlertModal
          visible={ShowAlertModal}
          setVisible={setShowAlertModal}
          onClick={() => {
            if(
              alertType == '회원가입 후 이용 가능합니다.'
            ){
              removeHistory();
              navigate('/signin');
            } else {
              setShowAlertModal(false);
              
            }
          }}
          text={alertType}
        />
      </Container>
    </ContainerWrap>
  );
}

const ContainerWrap = styled.div`
  display: flex;
  flex-direction: column;
  width:100%;
  flex:1;
  /* margin-bottom:100px; */
`;

const Container = styled.div`
  max-width: 768px;
  width:100%;
  margin: 0 auto;
  flex: 1;
  @media only screen and (max-width: 768px) {
    
  }
`;

const ProfileImage = styled.img`
  width:100%;
  height:100%;
  border-radius:50%;
  border:1px solid #e0e0e0;
  object-fit:contain;
`;
const LikeButtonWrap = styled.div`
  width:100%;
  display:flex;
  justify-content:flex-end;
`;
const DownIcon = styled.img`
  width: 14px;
  height: 14px;
  cursor: pointer;
`;
const LikeBox = styled.div`
  display: flex;
  align-items: center;
  margin:20px 20px 0;
  @media only screen and (max-width: 768px) {
    margin:20px 20px 0;
  }
`;
const DescriptionWrap = styled.div`
font-family:'Pretendard Variable';
font-weight: 300;
font-size:16px;
  margin:25.14px 38px 150px 22px;
  text-align:start;
  @media only screen and (max-width: 768px) {
    margin:25.14px 38px 51.36px 22px;
    font-size:12px;
  }
`;
const ModalTitle = styled.span`
display:flex;
justify-content:center;
align-items:center;
  font-family:'Pretendard Variable';
  font-size: 17px;
  color: #000000;
  font-weight: 510;
  text-align:center;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;
const ModalContentBox = styled.textarea`
  width: 400px;
  height: 200px;
  border: 1px solid #121212;
  padding: 15px;
  overflow-y: scroll;
  margin: 5px 0;
  resize: none;
  font-size: 14px;
  font-weight: 410;
  color: #121212;
  outline: 0;
  line-height: 25px;
  margin-top: 10px;
  background-color: #fff;
  -webkit-text-fill-color: #121212;
  opacity: 1;

  @media only screen and (max-width: 768px) {
    width: 260px;
    height: 150px;
    font-size: 12px;
    line-height: 20px;
    margin-top: 10px;
  }
`;
const LikeButton = styled.img`
  width: 23px;
    height: 19px;
  object-fit:contain;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    width: 23.28px;
    height: 19.49px;
  }
`;
const BookMarkButton = styled.img`
  width: 15px;
    height: 19px;
  margin-left:24px;
  object-fit:contain;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    width: 15.54px;
    height: 19.49px;
  }
`;

const LinkUrlBox = styled.div`
  width:100%;
  display:flex;
  flex-direction:column;
  padding:5px 0;
  background:#000000;
`;
const LinkTitle = styled.a`
font-family:'Pretendard Variable';
font-weight: 410;
  color:#ffffff;
   font-size:14px;
`
const LinkUrl = styled.a`
font-family:'Pretendard Variable';
font-size:12px;
  color:#ffffff;
  font-weight: 210;
  text-decoration:none;
  cursor: pointer;
`;

const ImageBox2 = styled.div<{innerWidth:number}>`
  width: 768px;
  height: 768px;
  background:#c7c7c7;
  /* max-height:800px; */
  object-fit:contain;
  /* overflow: hidden; */
  /* background-color:aqua; */
  /* aspect-ratio: 0.8; */
  @media only screen and (max-width: 768px) {
    width: ${props=>props.innerWidth}px;
    height: ${props=>props.innerWidth}px;
  }
`;

const SliderImage = styled.img`
  cursor: pointer;
  object-fit: cover;
  height: 100%;
  max-height: 1096px;
  max-width: 100%;
  @media only screen and (max-width: 768px) {
    width: 100%;
    height:100%;
  }
`;

const ProfileHeaderWrap = styled.div`
  display:flex;
  justify-content:space-between;
  margin:10px 20px 40px;
  @media only screen and (max-width: 768px) {
  }
`;
const HeaderLeft = styled.div`
width:100%;
  display:flex;

  @media only screen and (max-width: 768px) {
  }
`;
const NameBox = styled.div`
  width:100%;
  position:relative;
  display:flex;
  align-items:center;
  justify-content:space-between;

`;
const NameText = styled.p`
font-family:'Pretendard Variable';
  font-size:16px;
  font-weight: 410;
  text-align:start;
  line-height:31px;
  margin:0 10px 0 0;
  @media only screen and (max-width: 768px) {
    font-size:14px;
  }
`;
const FollowButtonBox = styled.div<{follow:boolean}>`
font-family:'Pretendard Variable';
  display: flex;
  justify-content: center;
  align-items: center;
  width:100%;
  cursor: pointer;
  background-color:${props=>props.follow? '#505050':'#ffffff'};
  color:${props=>props.follow? '#ffffff': '#505050'};
  border:1px solid #c7c7c7;;
  border-radius:4.93px;
  font-size:12px;
    width:90px;
    height:38px;
  font-weight: 300;
  white-space:nowrap;
  @media only screen and (max-width: 768px) {
    width:60px;
    height:25px;
    font-size:10px;
  }
`;
const FlexBox = styled.div`
  display:flex;
  align-items:center;
`
const ImageWrap = styled.div<{Image:boolean}>`
  width:65px;
  height:65px;
  margin-right:10px;
  display:flex;
  justify-content:center;
  align-items:center;
  border-radius:50%;
  aspect-ratio: 1.0;
  background-color:${props => props.Image?  'none': '#DBDBDB'} ;
  @media only screen and (max-width: 768px) {
    width:36px;
    height:36px;
  }
`;
const BasicImage = styled.img`
  width:50%;
  height:50%;
  object-fit:contain;
`;
const ReportImageWrap = styled.div`
  padding:0 1px;
  margin-left:0px;
  display:flex;
  align-items:center;
  cursor: pointer;
`
const ReportModalBox = styled.div`
  width:180px;
  height:110px;
  z-index:98;
  cursor: pointer;
  background:#ffff;
  box-shadow: 2px 2px 5px #4e4e4e;
  position:absolute;
  right:0;
  bottom:-110px;
`
const ReportSelctBox = styled.div`
  font-family:'Pretendard Variable';
  font-size:15px;
  font-weight:360;
  height:50%;
  display:flex;
  justify-content:center;
  align-items:center;
`
const ImageRotate = styled.img`
  width:24px;
  height: 6px;
  aspect-ratio:1.0;
  margin:0 10px;
  cursor: pointer;
  transform:rotate(90deg);
  @media only screen and (max-width: 768px) {
    width:14px;
    height: 3px;
  }
`
const ButtonBox = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;

  /* background-color:black; */
`;

const ButtonWrap = styled.div<{marginT?:number,marginB?:number,visible?:boolean}>`
  display: flex;
  width:100%;
  margin: 37px auto;
  min-height:55px;
  
  @media only screen and (max-width: 768px) {
    min-height:45px;
  }
`;

const BlackButton = styled.div`
  background-color: rgb(73, 73, 73);
  border: 1px solid #131313;
  cursor: pointer;
  border-radius:5px;
  flex:1;
  display:flex;
  
  justify-content:center;
  align-items:center;
  @media only screen and (max-width: 768px) {
  }
`;
const BlackButtonText = styled.span`
font-family:'Pretendard Variable';
  color: #ffffff;
  font-size: 14px;
  font-weight: 360;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
  `;

const WhiteButton = styled(BlackButton)`
margin-right:10px;
  background-color: #ffffff;
  flex:1;
`;

const WhiteButtonText = styled(BlackButtonText)`
  color: #121212;
`;

export default PersonalPage;
