import React, { useCallback, useContext, useEffect, useRef, useState ,memo } from 'react';
import styled from 'styled-components';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import snsImage from '../../asset/image/snsicon.png';
import { APIGetBanner } from '../../api/SettingAPI';
import { SnsList } from '../../types/Types';
import { UserContext } from '../../context/user';
import AlertModal from '../../components/Modal/AlertModal';
import { useLayoutEffect } from 'react';
import { createBrowserHistory } from 'history';
import { APILikeShop, APIShopList } from '../../api/ShopAPI';
import TopButton from '../../components/Product/TopButton';
import { removeHistory } from '../../components/Layout/Header';
// swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { ArtworkListItem } from '../../types/Types';
import { APISnsLikeList } from '../../api/ProductAPI';
import SNSCard from '../../components/Shop/SnsCard';
import Nodata from '../../components/Product/NoData';


interface ICategorySelectButton {
  item: { value: string; label: string };
  isSelect: boolean;
  onClickFilter: (e: { value: string; label: string }) => void;
}

const CategroySelectButtons = memo(({ item, isSelect, onClickFilter }: ICategorySelectButton) => {
  return (
    <CategorySelectButton selected={isSelect} onClick={() => onClickFilter(item)} key={item.label}>
      <CategorySelectButtonText selected={isSelect}>{item.label}</CategorySelectButtonText>
    </CategorySelectButton>
  );
});


function LikeSns({productList}:{productList?:ArtworkListItem[]}) {
  const navigate = useNavigate();
  const [LikeSnsList, setLikeSnsList] = useState<SnsList[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [history, setHistory] = useState(false);
  const [page, setPage] = useState<number>(1);
  const interSectRef = useRef(null);

  const { user } = useContext(UserContext);



  const getLikeSnsData = async (page:number) => {
    const data = {
      page: page,
    };
    try {
      if (history) {
        return setHistory(false);
      }
      const { list } = await APISnsLikeList(data);
      if(page > 1){
        setLikeSnsList((prev) => [...prev, ...list]);
      } else {
        setLikeSnsList(list);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const findHistory = () => {
    // const list = JSON.parse(sessionStorage.getItem('LikeSnsList') ?? '');
    const page = Number(sessionStorage.getItem('LikeSnsPage'));
    setHistory(true);
    setPage(page);
    getLikeSnsData(page)
    // setLikeSnsList(list)

    sessionStorage.removeItem('LikeSnsPage');
    // sessionStorage.removeItem('LikeSnsList');
    sessionStorage.removeItem('LikeSnsSave');
  };

  const saveHistory = (e: React.MouseEvent, idx: number, index:number) => {
    const div = document.getElementById('root');
    if (div) {
      const y = globalThis.scrollY;
      // sessionStorage.setItem('LikeSnsList', JSON.stringify(LikeSnsList));
      sessionStorage.setItem('LikeSnsPage', String(page));
      sessionStorage.setItem('LikeSnsSave','Save')
      sessionStorage.setItem('y', String(y ?? 0));
      sessionStorage.setItem('SNSy', 'ScrollOnce');
      sessionStorage.setItem('removeSNSHistory', 'SnsLike');
      navigate(`/personalpage/${idx}`,{state:{idx:idx,page:page,index:index}});
    }
  };
  
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
    const observer = new IntersectionObserver(handleObserver, options);
    if (interSectRef.current) observer.observe(interSectRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);


  useEffect(() => {
    if (page > 1) getLikeSnsData(page);
  }, [page]);


  useLayoutEffect(() => {
    const scrollY = Number(sessionStorage.getItem('y'));
    if (LikeSnsList.length > 0 && scrollY) {
      console.log('불러옴', scrollY);
      setTimeout(() => {
        window.scrollTo({
          top: scrollY,
          behavior: 'auto',
        });
      }, 50);
      sessionStorage.removeItem('y');
    }
  }, [LikeSnsList]);

  useLayoutEffect(() => {
    const Save = sessionStorage.getItem('LikeSnsSave')

    if (Save) {
      findHistory();
    } else {
      getLikeSnsData(1);
    }
  }, []);
  


  return (
    <Container>
      <TabBox>
        <TabContents onClick={()=>navigate('/LikeArtwork')}>
          Artwork
        </TabContents>
        <TabContents On={true}>
          <TabImage src={snsImage}/>
        </TabContents>
      </TabBox>
      <ProductListWrap>
        {LikeSnsList.length > 0 ?
        LikeSnsList.map((item,index)=>{
        return(
          // <div onClick={()=>console.log(item)}>asdsadasd</div>
          <SNSCard
            item={item}
            key={item.idx}
            onClick={(e) => saveHistory(e, item.idx,index)}
            index={index}
          />
        )
        })
        :
        <Nodata/>
        }
      </ProductListWrap>
      <InterView ref={interSectRef} />
      <AlertModal
        visible={showLogin}
        setVisible={setShowLogin}
        onClick={() => {
          removeHistory();
          setShowLogin(false);
          navigate('/signin');
        }}
        text="Available after Sign up."
      />
      <TopButton />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width:100%;
`;

const ProductListWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin:0 50px;
  @media only screen and (max-width: 768px) {
    margin:0;
  }
`;


const CategorySelectButton = styled.div<{ selected: boolean }>`
  background-color: ${(props) => (props.selected ? '#121212' : '#fff')};
  border : 1px solid ${(props) => (props.selected ? '#121212' : '#c0c0c0')};
  padding: 0 18px;
  margin-right: 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  /* box-shadow:2px 3px 3px 0px #aaaaaa; */
  cursor: pointer;
  @media only screen and (max-width: 1440px) {
    height: 27px;
  }
`;
const InterView = styled.div`
  height: 150px;
`;
const CategorySelectButtonText = styled.span<{ selected: boolean }>`
  color: ${(props) => (props.selected ? '#fff' : '#121212')};
  font-weight: 410;
  text-transform: capitalize;
  @media only screen and (max-width: 1024px) {
    font-size: 14px;
  }
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const TabBox = styled.div`
width:400px;
display:flex;
margin:50px;
  @media only screen and (max-width: 768px) {
  margin:50px 0 0;
  width:100%;
  border-bottom:1.7px solid rgb(204,204,204);
  }
`
const TabContents = styled.div<{On?:boolean}>`
  font-family:'Pretendard Variable';
  border-bottom:${props => props.On? 1.7:0}px solid black;
  font-weight:${props => props.On? 460 : 360};
  color:rgb(0,0,0);
  padding:10px 0;
  margin-top:5px;
  font-size:18px;
  flex: 1 1 0%;
  @media only screen and (max-width: 768px) {
    font-size:14px;
  }
`
const TabImage = styled.img`
  width:25px;
  height:25px;
  @media only screen and (max-width:768px){
    width:20px;
    height:20px;
  }
`
export default LikeSns;
