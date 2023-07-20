import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { APILikeProduct, APILikeProductList } from '../../api/ProductAPI';
import { APILikeProducer, APILikeProducerList } from '../../api/ProducerAPI';
import logoImage from '../../asset/image/logo.png';
import { useCallback } from 'react';
import ShowTypeButton from '../../components/Shop/ShowTypeButton';
import ProducerCard from '../../components/Producer/ProducerCard';
import ProductCard from '../../components/Product/ProductCard';
import ShopCard from '../../components/Shop/ShopCard';
import { APILikeShop, APILikeShopList } from '../../api/ShopAPI';
import { TShopListItem } from '../shop/Shop';
import TopButton from '../../components/Product/TopButton';
import { UserContext } from '../../context/user';
import { LikeProductListItem, LikeProducerListItem, LikeShopListItem } from '../../types/Types';


function LikeList() {
  const navigate = useNavigate();
  const tabtype = Number(sessionStorage.getItem('tab'));
  const { user } = useContext(UserContext);

  const [tab, setTab] = useState(!!tabtype ? tabtype : 1);
  const [productList, setProductList] = useState<LikeProductListItem[]>([]);
  const [producerList, setProducerList] = useState<LikeProducerListItem[]>([]);
  const [shopItemList, setShopItemList] = useState<LikeShopListItem[]>([]);
  const [total, setTotal] = useState(1);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setLoading] = useState(false);
  const [history, setHistory] = useState(false);
  const [showType, setShowType] = useState<1 | 2>(1);
  const interSectRef = useRef(null);

  const getLikeProductList = async () => {
    setLoading(true);
    const data = {
      page,
    };
    try {
      const { list, total } = await APILikeProductList(data);
      console.log(list, page);
      if (page === 1) {
        setProductList(() => [...list]);
      } else {
        setProductList((prev) => [...prev, ...list]);
      }
      setTotal(total);
      console.log(list);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getLikeProducerList = async () => {
    setLoading(true);
    const data = {
      page,
    };
    try {
      const { list, total } = await APILikeProducerList(data);
      console.log(list, page);
      if (page === 1) {
        setProducerList(() => [...list]);
      } else {
        setProducerList((prev) => [...prev, ...list]);
      }
      setTotal(total);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getLikeShopList = async () => {
    setLoading(true);
    const data = {
      page,
    };
    try {
      const { list, total } = await APILikeShopList(data);
      console.log(list, page);
      if (page === 1) {
        setShopItemList(() => [...list]);
      } else {
        setShopItemList((prev) => [...prev, ...list]);
      }
      setTotal(total);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onCancelLikeProduct = async (idx: number) => {
    const data = {
      artwork_idx: idx,
    };
    try {
      const res = await APILikeProduct(data);
      console.log(res);
      const newList = productList.filter((item) => item.product.idx !== idx);
      setProductList(newList);
    } catch (error) {
      console.log(error);
    }
  };

  const onCancelLikeProducer = async (idx: number) => {
    const data = {
      producer_idx: idx,
    };
    try {
      const res = await APILikeProducer(data);
      console.log(res);
      const newList = producerList.filter((item) => item.producer.idx !== idx);
      setProducerList(newList);
    } catch (error) {
      console.log(error);
    }
  };

  const onCancelLikeShop = async (idx: number) => {
    const data = {
      idx: idx,
    };
    try {
      const res = await APILikeShop(data);
      console.log(res);
      const newList = shopItemList.filter((item) => item.sale_product.idx !== idx);
      setShopItemList(newList);
    } catch (error) {
      console.log(error);
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
    rootMargin: '20px', // 관찰하는 뷰포트의 마진 지정
    threshold: 1.0, // 관찰요소와 얼만큼 겹쳤을 때 콜백을 수행하도록 지정하는 요소
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, options);
    if (interSectRef.current) observer.observe(interSectRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    const page = sessionStorage.getItem('page');
    if (tab === 1) {
      if (page) {
        findProductHistory();
      } else {
        getLikeProductList();
      }
    } else if (tab === 2) {
      if (page) {
        findProducerHistory();
      } else {
        getLikeProducerList();
      }
    } else {
      if (page) {
        findShopHistory();
      } else {
        getLikeShopList();
      }
    }
  }, [tab, page]);

  const findProductHistory = () => {
    const list = JSON.parse(sessionStorage.getItem('products') ?? '');
    const page = Number(sessionStorage.getItem('page'));
    const type = (Number(sessionStorage.getItem('type')) as 1 | 2) ?? 1;

    setProductList(list);
    setHistory(true);
    setPage(page);
    setShowType(type);

    sessionStorage.removeItem('products');
    sessionStorage.removeItem('page');
    sessionStorage.removeItem('type');
  };
  const findProducerHistory = () => {
    const list = JSON.parse(sessionStorage.getItem('producers') ?? '');
    const page = Number(sessionStorage.getItem('page'));
    const type = (Number(sessionStorage.getItem('type')) as 1 | 2) ?? 1;

    setProducerList(list);
    setHistory(true);
    setPage(page);
    setShowType(type);

    sessionStorage.removeItem('producers');
    sessionStorage.removeItem('page');
    sessionStorage.removeItem('type');
  };

  const findShopHistory = () => {
    const list = JSON.parse(sessionStorage.getItem('shop') ?? '');
    const page = Number(sessionStorage.getItem('page'));
    const type = (Number(sessionStorage.getItem('type')) as 1 | 2) ?? 1;

    setShopItemList(list);
    setHistory(true);
    setPage(page);
    setShowType(type);

    sessionStorage.removeItem('shop');
    sessionStorage.removeItem('page');
    sessionStorage.removeItem('type');
  };

  const saveProductHistory = (e: React.MouseEvent, idx: number) => {
    const y = window.scrollY;

    sessionStorage.setItem('products', JSON.stringify(productList));
    sessionStorage.setItem('tab', String(1));
    sessionStorage.setItem('page', String(page));
    sessionStorage.setItem('type', String(showType));
    sessionStorage.setItem('y', String(y ?? 0));
    navigate(`/productdetails/${idx}`);
  };

  const saveProducerHistory = (e: React.MouseEvent, idx: number) => {
    const y = window.scrollY;

    sessionStorage.setItem('producers', JSON.stringify(producerList));
    sessionStorage.setItem('tab', String(2));
    sessionStorage.setItem('page', String(page));
    sessionStorage.setItem('type', String(showType));
    sessionStorage.setItem('y', String(y ?? 0));
    navigate(`/producerdetails/${idx}`);
  };

  const saveShopHistory = (e: React.MouseEvent, idx: number) => {
    const y = window.scrollY;

    sessionStorage.setItem('shop', JSON.stringify(shopItemList));
    sessionStorage.setItem('tab', String(3));
    sessionStorage.setItem('type', String(showType));
    sessionStorage.setItem('page', String(page));
    sessionStorage.setItem('y', String(y ?? 0));
    navigate(`/shopdetails/${idx}`);
  };

  useEffect(() => {
    const scrollY = Number(sessionStorage.getItem('y'));
    if ((productList.length > 0 || producerList.length > 0 || shopItemList.length > 0) && scrollY) {
      setTimeout(() => {
        window.scrollTo({
          top: scrollY,
          behavior: 'auto',
        });
      }, 50);
      sessionStorage.removeItem('y');
    }
  }, [productList, producerList, shopItemList]);

  return (
    <Container>
      <TabButtonWrap>
        <TabButton
          onClick={() => {
            sessionStorage.removeItem('tab');
            setTab(1);
            setPage(1);
          }}
        >
        <TabButtonText selected={tab === 1}>관심작품</TabButtonText>
        </TabButton>
        {user.level <= 1 && (
          <TabButton
            onClick={() => {
              sessionStorage.removeItem('tab');
              setTab(2);
              setPage(1);
            }}
          >
            <TabButtonText selected={tab === 2}>PRODUCING</TabButtonText>
          </TabButton>
        )}
        <TabButton
          onClick={() => {
            sessionStorage.removeItem('tab');
            setTab(3);
            setPage(1);
          }}
        >
          <TabButtonText selected={tab === 3}>SHOP</TabButtonText>
        </TabButton>
      </TabButtonWrap>
      {/* <ShowTypeButton onClickType1={() => setShowType(1)} onClickType2={() => setShowType(2)} /> */}

      {tab === 1 ? (
        <ProductListWrap>
          {total && total > 0 ? (
            productList.map((item, index) => (
              <ProductCard
                item={item.product}
                key={item.idx}
                index={index}
                isLikeList
                onClick={(e) => saveProductHistory(e, item.product.idx)}
                onClickLike={(e) => {
                  e.stopPropagation();
                  onCancelLikeProduct(item.product.idx);
                }}
                showType={showType}
              />
            ))
          ) : (
            <NoDataBox>
              {/* <Logo src={logoImage} /> */}
              <Text>NO PRODUCT</Text>
            </NoDataBox>
          )}
        </ProductListWrap>
      ) : tab === 2 ? (
        <ProducerListWrap>
          {total > 0 ? (
            producerList.map((item, index) => (
              <ProducerCard
                key={`producer-${item.idx}`}
                item={item.producer}
                showType={showType}
                index={index}
                isLikeList
                onClick={(e) => saveProducerHistory(e, item.producer.idx)}
                onClickLike={(e) => {
                  e.stopPropagation();
                  onCancelLikeProducer(item.producer.idx);
                }}
              />
            ))
          ) : (
            <NoDataBox>
              {/* <Logo src={logoImage} /> */}
              <Text>NO PRODUCING</Text>
            </NoDataBox>
          )}
        </ProducerListWrap>
      ) : (
        <ProducerListWrap>
          {total > 0 ? (
            shopItemList.map((item, index) => (
              <></>
              // <ShopCard
              //   item={item.sale_product}
              //   key={item.idx}
              //   onClick={(e) => saveShopHistory(e, item.sale_product.idx)}
              //   isLikeList
              //   onClickLike={(e) => {
              //     e.stopPropagation();
              //     onCancelLikeShop(item.sale_product.idx);
              //   }}
              //   index={index}
              //   showType={showType}
              // />
            ))
          ) : (
            <NoDataBox>
              {/* <Logo src={logoImage} /> */}
              <Text>NO SHOP PRODUCT</Text>
            </NoDataBox>
          )}
        </ProducerListWrap>
      )}
      <InterView ref={interSectRef} />

      <TopButton />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const TabButtonWrap = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 50px;
  @media only screen and (max-width: 768px) {
    padding: 10px 18px;
  }
`;

const TabButton = styled.div`
  padding: 10px 0;
  margin-right: 30px;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    padding: 5px 0;
    margin-right: 15px;
  }
`;

const TabButtonText = styled.span<{ selected: boolean }>`
  font-weight: 700;
  font-size: 18px;
  color: ${(props) => (props.selected ? '#398049' : '#121212')};
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const ProductListWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 30px;
`;

const ProducerListWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 50px;
`;

const NoDataBox = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-top: 120px;
`;

const Logo = styled.img`
  width: 150px;
  height: 38px;
  margin-bottom: 20px;
  @media only screen and (max-width: 768px) {
    width: 120px;
    height: 30px;
  }
`;

const Text = styled.h3`
  font-weight: 410;
  color: #121212;
  font-size: 16px;
  margin: 30px 0 50px;
  @media only screen and (max-width: 768px) {
    font-size: 13px;
    margin: 10px 0 30px;
  }
`;

const InterView = styled.div`
  height: 100px;
`;

export default LikeList;
