import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import arrDownImage from '../../asset/image/arr_down.png';
import { Select } from '@mantine/core';
import { APILikeProducer, APIProducerList } from '../../api/ProducerAPI';
import AlertModal from '../../components/Modal/AlertModal';
import { useLayoutEffect } from 'react';
import axios from 'axios';
import ShowTypeButton from '../../components/Shop/ShowTypeButton';
import ProducerCard from '../../components/Producer/ProducerCard';
import TopButton from '../../components/Product/TopButton';
import { TProducerListItem } from '../../types/Types';

const CATEGORYLIST = [
  { value: '0', label: '전체' },
  { value: '1', label: '아크릴' },
  { value: '2', label: '목재' },
  { value: '3', label: '스틸' },
  { value: '4', label: '금속' },
  { value: '5', label: '유리' },
  { value: '6', label: '도자기' },
];

function Producer() {
  const navigate = useNavigate();

  const [producerList, setProducerList] = useState<TProducerListItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [category, setCategory] = useState<'0' | '1' | '2' | '3' | '4' | '5' | '6'>('0');
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [history, setHistory] = useState<boolean>(false);
  const [showType, setShowType] = useState<1 | 2>(1);
  const interSectRef = useRef(null);

  const getProducerList = async () => {
    if (history) {
      return setHistory(false);
    }
    const data = {
      page: page,
      category: category === '0' ? undefined : Number(category),
    };
    console.log('data', data);
    try {
      const { list, total } = await APIProducerList(data);
      console.log(list, total);
      if (page === 1) {
        setProducerList((prev) => [...list, ...prev]);
      } else {
        setProducerList((prev) => [...prev, ...list]);
      }
      setTotal(total);
      console.log(list);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403 || error.response?.status === 401) {
          setShowAlert(true);
        }
      }
    }
  };

  const onLikeProducer = async (idx: number) => {
    const data = {
      producer_idx: idx,
    };
    try {
      const res = await APILikeProducer(data);
      console.log(res);
      const newList = producerList.map((item) => (item.idx === idx ? { ...item, isLike: !item.isLike, like_count: res.likeCount } : { ...item }));
      setProducerList(newList);
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

  const saveHistory = (e: React.MouseEvent, idx: number) => {
    const y = window.scrollY;

    sessionStorage.setItem('producers', JSON.stringify(producerList));
    sessionStorage.setItem('page', String(page));
    sessionStorage.setItem('type', String(showType));
    sessionStorage.setItem('y', String(y ?? 0));
    navigate(`/producerdetails/${idx}`);
  };

  const findHistory = () => {
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

  useEffect(() => {
    const scrollY = Number(sessionStorage.getItem('y'));
    if (producerList.length > 0 && scrollY) {
      console.log('불러옴', scrollY);
      window.scrollTo({
        top: scrollY,
        behavior: 'auto',
      });
      sessionStorage.removeItem('y');
    }
  }, [producerList]);

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

  useLayoutEffect(() => {
    const page = Number(sessionStorage.getItem('page'));
    if (page) {
      findHistory();
    } else {
      getProducerList();
    }
  }, [category, page]);

  return (
    <Container>
      <CategoryFilterWrap>
        {/* <ShowTypeButton onClickType1={() => setShowType(1)} onClickType2={() => setShowType(2)} style={{ marginBottom: 0 }} /> */}
        <UnderLineBox>
          <Select
            rightSection={<DownIcon src={arrDownImage} />}
            styles={(theme) => ({
              rightSection: { pointerEvents: 'none' },
              item: {
                '&[data-selected]': {
                  '&, &:hover': {
                    backgroundColor: '#121212',
                    color: '#fff',
                  },
                  '@media (max-width: 768px)': { fontSize: 12 },
                },
                '@media (max-width: 768px)': { fontSize: 12 },
              },
              input: { fontSize: 14, '@media (max-width: 768px)': { fontSize: 12 } },
            })}
            variant="unstyled"
            value={category}
            data={CATEGORYLIST}
            onChange={(value: '0' | '1' | '2' | '3' | '4' | '5' | '6') => {
              setCategory(value);
              setProducerList([]);
              setPage(1);
            }}
          />
        </UnderLineBox>
      </CategoryFilterWrap>
      <ProducerListWrap>
        {producerList.map((item, index) => (
          <ProducerCard
            key={item.idx}
            item={item}
            showType={showType}
            index={index}
            onClick={(e) => saveHistory(e, item.idx)}
            onClickLike={(e) => {
              e.stopPropagation();
              onLikeProducer(item.idx);
            }}
          />
        ))}
      </ProducerListWrap>
      <InterView ref={interSectRef} />
      <AlertModal
        visible={showAlert}
        setVisible={setShowAlert}
        onClick={() => {
          setShowAlert(false);
          navigate('/');
        }}
        text="접근 권한이 없습니다."
      />
      <TopButton />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const ProducerListWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 50px;
`;

const UnderLineBox = styled.div`
  width: 200px;
  padding: 0px 10px;
  border-bottom: 1px solid #121212;
  @media only screen and (max-width: 768px) {
    width: 120px;
    padding: 0px 5px;
  }
`;

const DownIcon = styled.img`
  width: 14px;
  height: 14px;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    width: 12px;
    height: 12px;
  }
`;

const CategoryFilterWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 30px 50px;
  @media only screen and (max-width: 768px) {
    padding: 20px 18px;
    justify-content: space-between;
  }
`;

const InterView = styled.div``;

export default Producer;
