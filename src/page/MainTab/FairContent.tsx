import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { createSearchParams, useNavigate, useSearchParams,useParams } from 'react-router-dom';
import { FairDetailsType } from '../../types/Types';
import { useLayoutEffect } from 'react';
import SearchBox from '../../components/Product/SearchBox';
import TopButton from '../../components/Product/TopButton';
import { CategoryList } from '../../components/List/List';
import { APIFairDetails, APILikeProduct } from '../../api/ProductAPI';
import FairArtwork from './Fair_Artwork';
import FairArtist from './Fair_Artist';


function FairContent() {
  const navigate = useNavigate();
  const { idx } = useParams();
  let [searchParams, setSearchParams] = useSearchParams();
  const keywordParams = searchParams.get('keyword') ?? '';
  const [FairDetail,setFairDetail] = useState<FairDetailsType>()
  const categoryParams = (searchParams.get('category') as string) ?? '1';
  const [category, setCategory] = useState<string>(categoryParams);
  const [keyword, setKeyword] = useState<string>(keywordParams);
  const [history, setHistory] = useState(false);


  const saveHistory1 = (e: React.MouseEvent, item:number) => {
    const div = document.getElementById('root');
    if (div) {
      const y = globalThis.scrollY;
      sessionStorage.setItem('FairContents', JSON.stringify(FairDetail));
      sessionStorage.setItem('FairContentsCatg', category);
      sessionStorage.setItem('FairContab', String(contentItem.tab));
      sessionStorage.setItem('FairCon_y', String(y ?? 0));
      navigate(`/productdetails/${item}`);
    }
  };
  const saveHistory2 = (e: React.MouseEvent, item:string, item2:number) => {
    const div = document.getElementById('root');
    if (div) {
      const y = globalThis.scrollY;
      sessionStorage.setItem('FairContab', String(contentItem.tab));
      sessionStorage.setItem('FairCon_y', String(y ?? 0));
      navigate(`/ArtistProducts/${item}`,{ state:{name:item,idx:item2} });
    }
  };

  const onLikeProduct = async (idx: number) => {
    const data = {
      artwork_idx: idx,
    };
    try {
      const res = await APILikeProduct(data);
      console.log(res);
      getFairDetail()
    } catch (error) {
      console.log(error);
    }
  };



  const content = [
    {
      tab: "Artworks",
      content:<FairArtwork saveHistory={saveHistory1}  CategoryClick={e=>setCategory(e)} productList={FairDetail?.artwork_data} onLikeProduct={onLikeProduct} selectCategory={category}/>
    },
    {
      tab: "Exhibitors",
      content:<FairArtist saveHistory={saveHistory2} productList={FairDetail?.designer_data}/>
    }
  ];
  const useTabs = (initialTabs:any, allTabs:any) => {
    const [contentIndex, setContentIndex] = useState(initialTabs);
    sessionStorage.removeItem('FairContab');
    return {
      contentItem: allTabs[contentIndex],
      contentChange: setContentIndex
    };
  };
  const tab = sessionStorage.getItem('FairContab');
  const { contentItem, contentChange } = useTabs(tab == 'Exhibitors'? 1 : 0, content);


  

  
  const getFairDetail = async () => {
    const data = {
      idx:idx,
      category:category == '1'? "1" : "2",
      // keyword:keyword? keyword : ''
    }
    try {
      if (history) {
        return setHistory(false);
      }
      const res = await APIFairDetails(data);

      setFairDetail(res)
      
    } catch (error) {
    }
  };
  const findHistory = () => {
    const list = JSON.parse(sessionStorage.getItem('FairContents') ?? '');
    const categ = sessionStorage.getItem('FairContentsCatg');
    // setCategory(categ);
    setFairDetail(list);
    setHistory(true);
    if(categ){
      setCategory(categ)
    }

    sessionStorage.removeItem('FairContentsCatg');
    sessionStorage.removeItem('FairContents');
  };



  useLayoutEffect(() => {
    const scrollY = Number(sessionStorage.getItem('FairCon_y'));
    if (scrollY) {
      setTimeout(() => {
        window.scrollTo({
          top: scrollY,
          behavior: 'auto',
        });
      }, 100);
      sessionStorage.removeItem('FairCon_y');
    }
  }, []);

  useLayoutEffect(() => {
    // const page = Number(sessionStorage.getItem('page'));
    const categ = sessionStorage.getItem('FairContentsCatg');
    // console.log(categ)
// console.log(categ&& setCategory(JSON.parse(categ)))

    if (categ) {
      findHistory();
    } else {
      console.log('getlist')
      getFairDetail();
    }
  }, [searchParams,category]);
  
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", resizeListener);
  }, [innerWidth]);

  const onSearch = () => {
    createSearchParams({keyword:keyword})
    getFairDetail()
  };

  return (
    <Container>
      <MainImage height={innerWidth}>
        <BannerImage src={innerWidth > 768 ?  FairDetail?.image[0].file_name : FairDetail?.image_m[0].file_name}/>
      </MainImage>
      <TitleWrap>
        <div>
          <TitleText>
            {FairDetail?.name}
          </TitleText>
          <SubText>
            {FairDetail?.range} &nbsp;
            {FairDetail?.location}
          </SubText>
        </div>
        <SearchBox
          none={true}
          onClickSearch={() => onSearch()}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSearch();
            }
          }}
          categoryList={CategoryList}
          category={category}
          keyword={keyword}
          onChangeInput={(e) => setKeyword(e.target.value)}
          onChangeCategory={(value: string) => {
            // chageCategory(value);
          }}
        />
      </TitleWrap>
      <div className="App">
        <TabButtonWrap>
        {content.map((section, index:number) => (
          <UnderLineTab key={index} onClick={() => {contentChange(index)}} color={section.tab == contentItem.tab? 'black':'none'}>{section.tab}</UnderLineTab>
        ))}
        </TabButtonWrap>
        {contentItem.content}
        <EmptySpace/>
      </div>
      {/* <ShowTypeButton onClickType1={() => setShowType(1)} onClickType2={() => setShowType(2)} /> */}
      <TopButton />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin:0px;
`;

const MainImage = styled.div<{height:number}>`
  width: 100%;
  /* height:${props => (props.height/(1.4642))}px; */
  height:${props => (props.height/(2.7118))}px;
  background-color:black;
  margin-bottom:0px;
  @media only screen and (max-width: 768px) {
    height:${props => (props.height/(1.4642))}px;
    /* height:${props => (props.height/(2.7118))}px; */
  }
`;
const BannerImage = styled.img`
  width:100%;
  height:100%;
`
const TabButtonWrap = styled.div`
  width:400px;
  display:flex;
  border-bottom:1px solid #cccccc;
  cursor: pointer;
  margin:0 50px 40px;
  @media only screen and (max-width: 768px) {
    margin:0px;
    width:100%;
  }
`;
const TabButton = styled.div`
  flex:1;
  font-size:17px;
  font-weight: 410;
  padding:5px 0;
`;

const UnderLineTab = styled(TabButton)<{underLine?: boolean}>`
  border-bottom: solid 1.7px ${(props) => props.color || "none"};
  font-weight: ${props => props.color == 'black' ? 460 : 360};
  color:#000000;
  font-family:'Pretendard Variable';
  padding:10px 0;
  /* margin-top:5px; */
  font-size:18px;
  @media only screen and (max-width: 768px) {
    font-size:14px;
  }
`
const SearchBoxWrap =styled.div`
  display:block;
  @media only screen and (max-width: 768px) {
    display:none;
  }
`

const TitleWrap = styled.div`
  margin:42px 50px 80px 54.29px;
  text-align:start;
  display:flex;
  justify-content:space-between;
  @media only screen and (max-width: 768px) {
    margin:20px 0px 25px 20px;
  }
`;
const TitleText = styled.span`
font-family:'Pretendard Variable';
  display:block;
  font-weight: 410;
  text-transform: capitalize;
  font-size:26px;
  @media only screen and (max-width: 1440px) {
    font-size:20px;
  }
  @media only screen and (max-width: 768px) {
    font-size:12px;
  }
`;
const SubText = styled.span`
  font-family:'Pretendard Variable';
  display:block;
  font-weight: 410;
  text-transform: capitalize;
  margin-top:12px;
  font-size:22px;
  @media only screen and (max-width: 1440px) {
    font-size:17px;
  }
  @media only screen and (max-width: 768px) {
    font-size:12px;
  }
`;
const EmptySpace = styled.div`
  height:130px;
`
export default FairContent;
