import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import likeOnImage from '../../asset/image/heart_on.svg';
import likeOffImage from '../../asset/image/heart.svg';
import bookmarkOnImage from '../../asset/image/bookon.svg';
import bookmarkOffImage from '../../asset/image/Bookoff.svg';
import arrDownImage from '../../asset/image/arr_down.png';
import rotateLeft from '../../asset/image/right.svg'
import { Modal, Select } from '@mantine/core';
import { SnsList, SnsdetailsType, TImage } from '../../types/Types';
import AlertModal from '../../components/Modal/AlertModal';
import reporticon from '../../asset/image/threecircle.svg';
import { UserContext } from '../../context/user';
import { useRef } from 'react';
import { createBrowserHistory } from 'history';
import profileImage from '../../asset/image/Profile.svg';
import { removeHistory } from '../../components/Layout/Header';
import { Pagination,Navigation, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { APIArtistFollowAdd, APIBookMarkLike, APIBookMarkLikeList, APIFollowersProductList, APISnsCount, APISnsDetails, APISnsLike, APISnsLikeList, APISnsList } from '../../api/ProductAPI';
import { APISnsDelete, APISnsReport, APIUserReport } from '../../api/UserAPI';
import { NoDoubleEmptySpace } from '../../util/Reg';
import 'swiper/css';
import 'swiper/css/pagination';
import './PersonalPage.css';

export const ReportReasonList = [
    { name: "ALL", label:'신고사유', value: "" },
    { name: "0", label:'욕설, 비방, 인신공격 게재', value: "0" },
    { name: "1", label:'영리목적 / 홍보성의 광고 내용', value: "1" },
    { name: "2", label:'개인정보 유출위험', value: "2" },
    { name: "3", label:'게시글 도배', value: "3" },
    { name: "4", label:'음란/선정성 불법 정보 노출', value: "4" },
    { name: "5", label:'기타', value: "5" },
];


function PersonalPage() {
  const navigate = useNavigate();
  const history = createBrowserHistory();
  const location = useLocation();
  const { user } = useContext(UserContext);
  const [ShowAlertModal, setShowAlertModal] = useState(false);
  const [alertType, setAlertType] = useState<string>('')
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [reason, setReason] = useState<string | null>('');
  const [reasonText, setReasonText] = useState<string>('');
  const [readmore, setReadMore] = useState(0)
  const [ReportModal, setReportModal] = useState(0)
  const [ShowReportModal, setShowReportModal] = useState(false)
  const [ReportType, setReportType] = useState<{reportType:number,reportIdx:number}>({reportType:0,reportIdx:0})
  const [ReportNumber, setReportNumber] = useState<number>(0)
  const [ ip , setIp ] = useState();
  const navigationPrevRef = React.useRef(null)
  const navigationNextRef = React.useRef(null)

  const [SnsList, setSnsList] = useState<SnsList[]>([]);
  const interSectRef = useRef(null);
  const [page, setPage] = useState<number>(1);


  const getproductList = async (page:number) => {
    const categ = sessionStorage.getItem('FeedTabCategory');
    const data = {
      page: page,
      category: categ?categ : '1',
      keyword: ''
    };
    try {
      const { list, total } = await APISnsList(data);
      // setTotal(total);
      // console.log('page',page)
      if(page > 1){
        setSnsList((prev) => [...prev, ...list]);
      } else {
        setSnsList(list);
      }
      // console.log('shop', list, page);
    } catch (error) {
      console.log(error);
    }
  };
  const getBookMarkList = async (page:number) => {
    // console.log('ccccccccccc',category)
    const data = {
      page: page,
      keyword: ''
    };
    try {
      const { list, total } = await APIBookMarkLikeList(data);
      if(page > 1){
        setSnsList((prev) => [...prev, ...list]);
      } else {
        setSnsList(list);
      }
      // console.log('shop', list, page);
    } catch (error) {
      console.log(error);
    }
  };

  const getFollowSnsData = async (page:number) => {
    const data = {
      page: page,
      keyword:""
    };
    try {
      const { list,total } = await APIFollowersProductList(data);
      if(page > 1){
        setSnsList((prev) => [...prev, ...list]);
      } else {
        setSnsList(list);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getLikeSnsData = async (page:number) => {
    const data = {
      page: page,
    };
    try {
      const { list } = await APISnsLikeList(data);
      if(page > 1){
        setSnsList((prev) => [...prev, ...list]);
      } else {
        setSnsList(list);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const getMyFeedData = async (page:number) => {
    const data = {
      page: page,
      user_idx: user.idx
    };
    try {
      const { list } = await APISnsList(data);
      console.log(page)
      if(page > 1){
        setSnsList((prev) => [...prev, ...list]);
      } else {
        setSnsList(list);
      }
      // console.log('shop', list, page);
    } catch (error) {
      console.log(error);
    }
  };

  // const getSnsDetails = async () => {
  //   console.log(location.state)
  //   const data = {
  //     idx: location.state,
  //   };
  //   try {
  //     const res = await APISnsDetails(data);
  //     console.log(res)
      
  //     setSnsdetails(res);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  const UserFollow = async(idx:number) =>{
    if(user.idx == idx)return(setShowAlertModal(true),setAlertType(`You can't follow yourself`))
    if (user.idx) {
      const data = {
        designer_idx: idx,
      };
      try {
        const res = await APIArtistFollowAdd(data);
        if(res.message == '좋아요 완료'){
          setAlertType('Followed')
        } else {
          setAlertType('unFollowed')
        }
        setShowAlertModal(true)
        
        const newList = SnsList.map((item) => (item.user_idx === idx ? { ...item, user:{ ...item.user, isLike: !item.user.isLike }} : { ...item }));
        setSnsList(newList);
      } catch (error) {
        console.log(error);
      }
    } else {
      setShowAlertModal(true);setAlertType('Available after Sign up.')
    }
  }
      
  const LikeSns = async (idx:number) => {
  if(user.idx == idx)return(setShowAlertModal(true),setAlertType('This is my Post.'))
    if (user.idx) {
      const data = {
        sns_idx: idx
      };
      try {
        const res = await APISnsLike(data);
        if(res.message == '좋아요 완료'){
          setAlertType('Liked')
        } else {
          setAlertType('unLiked')
        }
        setShowAlertModal(true)
        const newList = SnsList.map((item) => (item.idx === idx ? { ...item, isLike: !item.isLike } : { ...item }));
        setSnsList(newList);
      } catch (error) {
        console.log(error);
      }
    } else {
      setShowAlertModal(true);setAlertType('Available after Sign up.')
    }
  };

  const LikeBookMark = async (idx:number) => {
  if(user.idx == idx)return(setShowAlertModal(true),setAlertType('This is my Post.'))
    if (user.idx) {
      const data = {
        sns_idx: idx,
      };
      try {
        const res = await APIBookMarkLike(data);
        if(res.message == '좋아요 완료'){
          setAlertType('BookMarked')
        } else {
          setAlertType('unBookMarked')
        }
        setShowAlertModal(true)
        const newList = SnsList.map((item) => (item.idx === idx ? { ...item, isBookmark: !item.isBookmark } : { ...item }));
        setSnsList(newList);
      } catch (error) {
        console.log(error);
      }
    } else {
      setShowAlertModal(true);setAlertType('Available after Sign up.')
    }
  };

  const ReportSns = async (idx:number) => {
  if(reason==='')return(setShowAlertModal(true),setAlertType('select the reason for reporting.'))
  if (reason === '기타' && !reasonText) return(setAlertType('enter the report details.'),setShowAlertModal(true))
  if(reason){
    for(let i = 0 ;  i < ReportReasonList.length ; i++ ){
      if(ReportReasonList[i].value.includes(reason)){
        break
      }
      setReportNumber(i)
    }
  }
    const data = {
      reason:reason,
      reason_etc:reasonText,
      target_idx:idx
    };
      try {
        const res = await APISnsReport(data);
        setShowReportModal(false)
        setReasonText('')
        setShowAlertModal(true);
        setAlertType('Reported.');
        // console.log(res);
      } catch (error) {
        setShowReportModal(false)
        setShowAlertModal(true)
        setAlertType('Already Reported.')
        console.log(error);
      }
  };

  const ReportUser = async (idx:number) => {
  if(reason==='')return(setShowAlertModal(true),setAlertType('select the reason for reporting.'))
  if (reason === '기타' && !reasonText) return(setAlertType('enter the report details.'),setShowAlertModal(true))
    if(reason){
      for(let i = 0 ;  i < ReportReasonList.length ; i++ ){
        if(ReportReasonList[i].value.includes(reason)){
          break
        }
        setReportNumber(i)
      }
    }
      const data = {
        reason:ReportNumber,
        reason_etc:reasonText,
        target_idx:idx
      };
      try {
        const res = await APIUserReport(data);
        setShowReportModal(false)
        setShowAlertModal(true);
        setAlertType('Reported.');
        setReasonText('')
        console.log('userReport',res);
      } catch (error) {
        setShowReportModal(false)
        setShowAlertModal(true);
        setAlertType('Already Reported.');
        // console.log(error);
      }
  } 

  const DeleteSns = async(idx:number) => {
    if(!user.idx)return(setShowAlertModal(true),setAlertType('Available after Sign up.'))
    // if (!reason) return(setShowAlertModal(true),setAlertType('select the reason for reporting.'))
      const data = {
        idx: idx
      };
      try {
        const res = await APISnsDelete(data);
        setShowReportModal(false)
        setShowAlertModal(true);
        setAlertType('Deleted');
        
      } catch (error) {
        setShowReportModal(false)
        setShowAlertModal(true);
        setAlertType('failed');
        // console.log(error);
      }
    } 
  

  const SNSCount = async() => {
    const uuid = sessionStorage.getItem('_u');
    console.log('ip',ip)
    console.log('uuid',uuid)
    const data = {
      uuid:uuid,
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
  
  const ReportCheck = (e:string,number:number)=>{
    if(!user.idx)return(setShowAlertModal(true),setAlertType('Available after Sign up.'))
    setShowReportModal(true)
    setReportModal(0)
    if(e == 'user'){
      setReportType({reportType:1,reportIdx:number})
    }else{
      setReportType({reportType:2,reportIdx:number})
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

  const handleObserver = useCallback((entries: any) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  }, []);

  const options = {
    root: null, //기본 null, 관찰대상의 부모요소를 지정
    rootMargin: '100px', // 관찰하는 뷰포트의 마진 지정
    threshold: 1.0, // 관찰요소와 얼만큼 겹쳤을 때 콜백을 수행하도록 지정하는 요소
  };

  useEffect(() => {
    if (page > 1) getproductList(page);
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, options);
    if (interSectRef.current) observer.observe(interSectRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);


  useLayoutEffect(() => {
    const SNSy = sessionStorage.getItem('SNSy')
    const listType = sessionStorage.getItem('removeSNSHistory')
    // console.log(location.state.index)
    // console.log((Math.floor(location.state.index/10)*10))
    let Heightt = innerWidth > 768 ? 768+431 : innerWidth+300
    const scrollY =  (location.state.index-((Math.floor(location.state.index/10))*10))*(Heightt)
    if (SnsList.length > 0 && SNSy) {
      console.log(scrollY)
      setTimeout(() => {
        window.scrollTo({
          top: scrollY,
          behavior: 'auto',
        });
        sessionStorage.removeItem('SNSy')
      }, 10);
    }
  }, [SnsList]);

  useEffect(() => {
    const listType = sessionStorage.getItem('removeSNSHistory')
    console.log('ddd',location.state)
    // getproductList(1);
    // console.log('location.state',Math.floor(location.state.index/10)+1)
    if(listType == 'SnsBookMark'){
      getBookMarkList(Math.floor(location.state.index/10)+1)
    } else if(listType == 'SnsFollow'){
      getFollowSnsData(Math.floor(location.state.index/10)+1)
    } else if(listType == 'SnsFeed'){
      getproductList(Math.floor(location.state.index/10)+1)
    } else if(listType == 'SnsLike'){
      getLikeSnsData(Math.floor(location.state.index/10)+1)
    } else if(listType == 'MyFeed'){
      getMyFeedData(Math.floor(location.state.index/10)+1)
    }
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
    <ContainerWrap id="productContainer" onClick={() => setReportModal(0)}>
      {SnsList&&
      SnsList.length>0 &&
      SnsList.map((item,index)=>{
        return(
        <Container key={index}>
          <ProfileHeaderWrap LinkUrl={item?.link_url? true : false}>
          <HeaderLeft>
            <ImageWrap onClick={()=>{navigate(`/MobileProfile/${item.user_idx}`,{state:item.user_idx})}} Image={item.user.image?.file_name? true : false}>
              {item?.user.image?.file_name ?
              <ProfileImage src={item?.user.image?.file_name}/>
              :
              <BasicImage src={profileImage}/>
              }
            </ImageWrap>
            <NameBox>
            <FlexBox onClick={()=>{navigate(`/MobileProfile/${item.user_idx}`,{state:item.user_idx})}}>
              <NameText>{item?.user.nickname}</NameText>
            </FlexBox>
            <ButtonBox>
              <FollowButtonBox follow={item?.user.isLike? item?.user.isLike : false} onClick={()=>UserFollow(item.user.idx)}>
                Follow
              </FollowButtonBox>
              <ReportImageWrap onClick={
                (e)=>{
                e.stopPropagation();
                if(item.idx == ReportModal){
                  setReportModal(0)
                } else{
                  setReportModal(item.idx)
                }
                }}
                >
                <ImageRotate src={reporticon}/>
              </ReportImageWrap>
            </ButtonBox>

            {item.idx == ReportModal&&
            <ReportModalBox height={true}> 
            {/* user.idx !== item?.user_idx */}
              {user.idx !== item?.user_idx ?
              <>
              <ReportSelctBox onClick={()=>ReportCheck('user',item.user_idx)}>
                Reporting User
              </ReportSelctBox>
              <ReportSelctBox onClick={()=>ReportCheck('sns',item.idx)}>
                Report a post
              </ReportSelctBox>
              </>
              :
              <>
              <ReportSelctBox onClick={()=>{navigate(`/AddPhoto`);sessionStorage.setItem('ModifySns', String(item.idx));}}>
                Modify a Post
              </ReportSelctBox>
              <ReportSelctBox onClick={()=>DeleteSns(item.idx)}>
                Delete a Post
              </ReportSelctBox>
              </>
              }
            </ReportModalBox>
            }
            </NameBox>
          </HeaderLeft>
        </ProfileHeaderWrap>
          <Swiper
            // install Swiper modules
            modules={[Navigation, Pagination, Scrollbar]}
            // slidesPerView={ProductViews}
            navigation= {
              {
                prevEl: navigationPrevRef.current,
                nextEl: navigationNextRef.current,
              }
            // :
            // false
            }
            // spaceBetween={30}
            scrollbar={{hide:true}}
            pagination={{clickable: true}}
            style={{paddingBottom:2.5,}}
          >
            {item?.image?
            item?.image.map((item:TImage) => {
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
            {item?.image&& 
            item.image.length>2&&
            <>
            <LeftArrow ref={navigationPrevRef}>
              <RotateImage src={rotateLeft}/>
            </LeftArrow>
            <RightArrow ref={navigationNextRef}>
              <img src={rotateLeft}/>
            </RightArrow>
            </>
            }
          </Swiper>
          {item?.link_url &&
          <LinkUrlBox >
            <LinkTitle>
              {item?.link_title}
            </LinkTitle>
            <LinkUrl onClick={() =>{window.open(`https://${item?.link_url}`, '_blank')}}>
              {item?.link_url}
            </LinkUrl>
          </LinkUrlBox>
          }
          <LikeButtonWrap>
            <LikeBox>
              <LikeButton onClick={()=>LikeSns(item.idx)} src={item?.isLike ? likeOnImage : likeOffImage} />
              <BookMarkButton onClick={()=>LikeBookMark(item.idx)}src={item?.isBookmark ? bookmarkOnImage : bookmarkOffImage} />
            </LikeBox>
          </LikeButtonWrap>
          <DescriptionWrap LinkUrl={item?.link_url? true : false} readmore={readmore == item.idx}>
            <BoldSpan>{item?.user.nickname}</BoldSpan><br/>
            {item?.about} 
            {readmore !== item.idx && item?.about.length > 30 ?
            <ReadMore onClick={()=>{setReadMore(item.idx)}}>Read More</ReadMore>
            :
            ''
            }
          </DescriptionWrap>

      </Container>
          )
        })
      }
      <Modal opened={ShowReportModal} onClose={() => setShowReportModal(false)} overlayOpacity={0.5} size="auto" centered withCloseButton={false}>
        <ModalTitle>Do you want to report the{ReportType.reportType == 1 ? 'user' : 'post'}?</ModalTitle>
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
          data={ReportReasonList}
          onChange={setReason}   
        />
        {reason !== '5' ?
        <ModalContentBox1 disabled value={reasonText} onChange={e=>setReasonText(NoDoubleEmptySpace(e.target.value))}></ModalContentBox1>
        :
        <ModalContentBox value={reasonText} onChange={e=>setReasonText(NoDoubleEmptySpace(e.target.value))}></ModalContentBox>
        }
        
        <ButtonWrap visible={true} marginT={37} marginB={37}>
          <WhiteButton onClick={()=>setShowReportModal(false)}>
            <WhiteButtonText>Cancel</WhiteButtonText>
          </WhiteButton>
          <BlackButton onClick={()=> ReportType.reportType == 1 ? ReportUser(ReportType.reportIdx) : ReportSns(ReportType.reportIdx)}>
            <BlackButtonText>OK</BlackButtonText>
          </BlackButton>
        </ButtonWrap>
      </Modal>
      <InterView ref={interSectRef}/>
      <AlertModal
        visible={ShowAlertModal}
        setVisible={setShowAlertModal}
        onClick={() => {
          if(
            alertType == 'Available after Sign up.'
          ){
            removeHistory();
            navigate('/signin');
          } else if ( alertType == 'Deleted'){
            navigate(-1)
          }
          else {
            setShowAlertModal(false);
          }
        }}
        text={alertType}
      />
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
  object-fit:cover;
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
const DescriptionWrap = styled.div<{LinkUrl:boolean,readmore:boolean}>`
font-family:'Pretendard Variable';
font-weight: 310;
font-size:16px;
min-height:50px;
white-space:pre-line;
display: ${props => props.readmore? 'block':'-webkit-box'};
-webkit-line-clamp: ${props => props.readmore? 20:2}; // 원하는 라인수
-webkit-box-orient: vertical;
overflow:hidden; 
/* white-space:nowrap; */
text-overflow:ellipsis;
margin:25px 38px 0px 22px;
margin-bottom:${props => props.LinkUrl? 120 : 150}px;
text-align:start;
@media only screen and (max-width: 768px) {
  margin:25px 38px 0px 22px;
  min-height:44px;
    margin-bottom:${props => props.LinkUrl? 21 : 51}px;
    font-size:12px;
  }
`;
const ReadMore = styled.span`
  font-family:'Pretendard Variable';
  font-weight : 360;
  font-size:14px;
  cursor: pointer;
  text-align:start;
  text-decoration:underline;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`
const BoldSpan = styled.span`
  font-family:'Pretendard Variable';
  font-weight: 460;
  font-size:16px;
`
const ModalTitle = styled.span`
display:flex;
justify-content:center;
align-items:center;
  font-family:'Pretendard Variable';
  font-size: 17px;
  color: #000000;
  font-weight: 510;
  text-align:center;
  margin-bottom:20px;
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
const ModalContentBox1 = styled.textarea`
  width: 400px;
  resize: none;
  background:none;
  border:none;
  @media only screen and (max-width: 768px) {
    width: 260px;
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
  /* background:#c7c7c7; */
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
  object-fit: cover;
  height: 100%;
  max-height: 1096px;
  max-width: 100%;
  @media only screen and (max-width: 768px) {
    width: 100%;
    height:100%;
  }
`;

const ProfileHeaderWrap = styled.div<{LinkUrl:boolean}>`
  display:flex;
  justify-content:space-between;
  margin:0px 20px 0px;
  margin-top:60px;
  margin-bottom:${props => props.LinkUrl ? 20 : 40 }px;
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
  cursor: pointer;
`
const ImageWrap = styled.div<{Image:boolean}>`
  width:65px;
  height:65px;
  cursor: pointer;
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
const ReportModalBox = styled.div<{height:boolean}>`
  width:180px;
  height:${props => props.height? 110 : 55}px;
  z-index:98;
  cursor: pointer;
  background:#ffff;
  box-shadow: 2px 2px 5px #4e4e4e;
  position:absolute;
  right:0;
  bottom:${props => props.height? -110 : -55}px;
`
const ReportSelctBox = styled.div`
  font-family:'Pretendard Variable';
  font-size:15px;
  font-weight:360;
  height:55px;
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


const RotateImage = styled.img`
  transform:rotate(180deg);
`
const LeftArrow = styled.div`
display:flex;
align-items:center;
cursor: pointer;
justify-content:center;
  position:absolute;
  top:47%;
  left:20px;
  width:47px;
  height:47px;
  border-radius:50%;
  background:rgba(255, 255, 255, 0.5);
  z-index:99999;
  @media only screen and (max-width: 768px) {
    width:30px;
    height:30px;
  }
`
const RightArrow = styled.div`
display:flex;
align-items:center;
justify-content:center;
cursor: pointer;
  position:absolute;
  top:47%;
  right:20px;
  width:47px;
  height:47px;
  border-radius:50%;
  background:rgba(255, 255, 255, 0.5);
  z-index:99999;
  @media only screen and (max-width: 768px) {
    width:30px;
    height:30px;
  }
`
const InterView = styled.div`
  height: 150px;
`;

export default PersonalPage;
