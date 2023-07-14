import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import likeOffImage from '../../asset/image/heart_off.png';
import { APIDashboard, APIDashboardProducerList, APIDashboardProductList } from '../../api/SettingAPI';
import { Pagination } from '@mantine/core';
import AlertModal from '../../components/Modal/AlertModal';
import axios from 'axios';
import { TProductListItem,TProducerListItem } from '../../types/Types';

export const CATEGORY_PRODUCER = {
  1: '아크릴',
  2: '목재',
  3: '스틸',
  4: '금속',
  5: '유리',
  6: '도자기',
};

function DashBoard() {
  const navigate = useNavigate();
  const [days, setDays] = useState(7);
  const [days2, setDays2] = useState(7);
  const [total, setTotal] = useState(0);
  const [total2, setTotal2] = useState(0);
  const [page, setPage] = useState<number>(1);
  const [page2, setPage2] = useState<number>(1);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const [data, setData] = useState<{
    todayVisitor: number;
    todaySign: number;
    visitList: { name: string; uv: number }[];
  }>();
  const [productList, setProductList] = useState<TProductListItem[]>([]);
  const [producerList, setProducerList] = useState<TProducerListItem[]>([]);

  const getDashboardData = async () => {
    const data = {
      days: days,
    };
    try {
      const result = await APIDashboard(data);
      console.log('chart', result);
      setData(result);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403 || error.response?.status === 401) {
          setShowAlert(true);
        }
      }
    }
  };

  const getProductList = async () => {
    const data = {
      page: page,
      days: days2,
    };
    try {
      const { list, total } = await APIDashboardProductList(data);
      console.log('product', list, total);
      setProductList(list);
      setTotal(total);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403 || error.response?.status === 401) {
          setShowAlert(true);
        }
      }
    }
  };

  const getProducerList = async () => {
    const data = {
      page: page2,
      days: days2,
    };
    try {
      const { list, total } = await APIDashboardProducerList(data);
      console.log('producer', list, total);
      setProducerList(list);
      setTotal2(total);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403 || error.response?.status === 401) {
          setShowAlert(true);
        }
      }
    }
  };

  useEffect(() => {
    getDashboardData();
  }, [days]);

  useEffect(() => {
    getProductList();
    getProducerList();
    console.log(days2);
  }, [page, page2, days2]);

  return (
    <>
      <TitleBox>
        <TitleText>오늘 현황</TitleText>
      </TitleBox>
      <RowWrap>
        <TodayStatusBox>
          <TodayStatusBoxSubTitle>오늘 접속자 수</TodayStatusBoxSubTitle>
          <CountText>
            {data?.todayVisitor} <TodayStatusBoxSubTitle>명</TodayStatusBoxSubTitle>
          </CountText>
        </TodayStatusBox>
        <TodayStatusBox isLast>
          <TodayStatusBoxSubTitle>오늘 가입자 수</TodayStatusBoxSubTitle>
          <CountText>
            {data?.todaySign} <TodayStatusBoxSubTitle>명</TodayStatusBoxSubTitle>
          </CountText>
        </TodayStatusBox>
      </RowWrap>
      <TitleBox>
        <TitleText>최근 접속자 수</TitleText>
      </TitleBox>
      <ChartBox>
        <TabButtonWrap>
          <TabButton selected={days === 7} onClick={() => setDays(7)}>
            <TabButtonText selected={days === 7}>7일</TabButtonText>
          </TabButton>
          <TabButton selected={days === 30} onClick={() => setDays(30)}>
            <TabButtonText selected={days === 30}>30일</TabButtonText>
          </TabButton>
          <TabButton selected={days === 90} onClick={() => setDays(90)}>
            <TabButtonText selected={days === 90}>90일</TabButtonText>
          </TabButton>
        </TabButtonWrap>
        <ChartWrap>
          <ResponsiveContainer>
            <LineChart data={data?.visitList ?? []}>
              <Line type="linear" dataKey="count" stroke="#444444" isAnimationActive={false} />
              <XAxis dataKey="name" />
              <YAxis />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrap>
      </ChartBox>
      <TitleBox>
        <TitleText>최근 7일 관심제품 등록 현황</TitleText>
      </TitleBox>
      <LikeProductTabButtonWrap>
        <TabButton selected={days2 === 7} onClick={() => setDays2(7)}>
          <TabButtonText selected={days2 === 7}>7일</TabButtonText>
        </TabButton>
        <TabButton selected={days2 === 30} onClick={() => setDays2(30)}>
          <TabButtonText selected={days2 === 30}>30일</TabButtonText>
        </TabButton>
        <TabButton selected={days2 === 90} onClick={() => setDays2(90)}>
          <TabButtonText selected={days2 === 90}>90일</TabButtonText>
        </TabButton>
      </LikeProductTabButtonWrap>
      <ListWrap>
        <ListBox>
          <ListTitle>Designer Product</ListTitle>
          {productList.map((item) => (
            <ListItemBox key={`product-${item.idx}`}>
              <ItemImage src={item.image[0]?.file_name ?? ''} />
              <ItemContentBox>
                <ListItemTitleRowWrap>
                  <RowWrap>
                    <ItemTitle>{item.name}</ItemTitle>
                    <LikeCountWrap>
                      <LikeButton src={likeOffImage} />
                      <LikeCount>{item.like_count}</LikeCount>
                    </LikeCountWrap>
                  </RowWrap>
                </ListItemTitleRowWrap>
                <ItemSubTitle>{item.designer}</ItemSubTitle>
              </ItemContentBox>
            </ListItemBox>
          ))}
          {total > 10 && (
            <PaginationBox>
              <Pagination
                page={page}
                total={total / 10 + 1}
                position="center"
                onChange={setPage}
                styles={(theme) => ({
                  item: {
                    border: 'none',
                    color: '#ccc',
                    '&[data-active]': {
                      backgroundColor: 'transparent',
                      fontWeight: 'bold',
                      color: 'black',
                    },
                  },
                })}
              />
            </PaginationBox>
          )}
        </ListBox>
        <ListBox isLast>
          <ListTitle>Producing</ListTitle>
          {producerList.map((item) => (
            <ListItemBox key={`producer-${item.idx}`}>
              <ItemImage src={item.image[0]?.file_name ?? ''} />
              <ItemContentBox>
                <ListItemTitleRowWrap>
                  <ItemTitle>[{CATEGORY_PRODUCER[item.category]}]</ItemTitle>
                  <LikeCountWrap>
                    <LikeButton src={likeOffImage} />
                    <LikeCount>{item.like_count}</LikeCount>
                  </LikeCountWrap>
                </ListItemTitleRowWrap>
                <ItemSubTitle>{item.name}</ItemSubTitle>
              </ItemContentBox>
            </ListItemBox>
          ))}
          {total2 > 10 && (
            <PaginationBox>
              <Pagination
                page={page2}
                total={total2 / 10 + 1}
                position="center"
                onChange={setPage2}
                styles={(theme) => ({
                  item: {
                    border: 'none',
                    color: '#ccc',
                    '&[data-active]': {
                      backgroundColor: 'transparent',
                      fontWeight: 'bold',
                      color: 'black',
                    },
                  },
                })}
              />
            </PaginationBox>
          )}
        </ListBox>
      </ListWrap>
      <AlertModal
        visible={showAlert}
        setVisible={setShowAlert}
        onClick={() => {
          setShowAlert(false);
          navigate('/');
        }}
        text="접근 권한이 없습니다."
      />
    </>
  );
}

const TitleBox = styled.div`
  border-bottom: 1px solid #121212;
  height: 57px;
  display: flex;
  align-items: center;
  padding-left: 15px;
`;

const TitleText = styled.span`
  font-weight: 700;
  font-size: 18px;
  color: #121212;
`;

const RowWrap = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const TodayStatusBox = styled.div<{ isLast?: boolean }>`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  border-bottom: 1px solid #121212;
  padding: 35px 15px;
  border-right: ${(props) => (props.isLast ? 0 : ' 1px solid #121212')};
`;

const TodayStatusBoxSubTitle = styled.span`
  font-weight: 410;
  font-size: 12px;
  color: #121212;
`;

const CountText = styled.span`
  font-weight: 700;
  font-size: 36px;
  color: #121212;
  letter-spacing: -1px;
`;

const ChartBox = styled.div`
  border-bottom: 1px solid #121212;
  padding: 15px;
`;

const ChartWrap = styled.div`
  width: 100%;
  height: 310px;
  background-color: #f5f5f5;
  padding: 25px 25px 0px 0;
`;

const TabButtonWrap = styled.div`
  display: flex;
  margin-bottom: 15px;
`;

const LikeProductTabButtonWrap = styled.div`
  display: flex;
  margin: 15px;
`;

const TabButton = styled.div<{ selected: boolean }>`
  background-color: ${(props) => (props.selected ? '#121212' : '#fff')};
  border: 1px solid #121212;
  width: 78px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
  cursor: pointer;
`;

const TabButtonText = styled.span<{ selected: boolean }>`
  font-weight: 410;
  font-size: 12px;
  color: ${(props) => (props.selected ? '#fff' : '#121212')};
`;

const ListWrap = styled.div`
  display: flex;
  flex: 1;
  border-top: 1px solid;
`;

const ListBox = styled.div<{ isLast?: boolean }>`
  display: flex;
  flex: 1;
  padding: 20px 15px;
  border-right: ${(props) => (props.isLast ? 0 : '1px solid #121212')};
  flex-direction: column;
  align-items: flex-start;
`;

const ListItemBox = styled.div`
  display: flex;
  margin-top: 10px;
  width: 100%;
`;

const ItemImage = styled.img`
  display: block;
  width: 145px;
  height: 145px;
`;

const ItemContentBox = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-end;
  padding: 0 10px;
`;

const ItemTitle = styled.span`
  font-weight: 700;
  font-size: 12px;
  color: #121212;
`;

const ItemSubTitle = styled(ItemTitle)`
  font-weight: 410;
  align-self: flex-start;
`;

const LikeCount = styled.span`
  font-size: 12px;
  font-weight: 410;
  color: #121212;
`;

const LikeButton = styled.img`
  width: 18px;
  height: 18px;
  margin-right: 6px;
`;

const ListItemTitleRowWrap = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const ListTitle = styled(TitleText)`
  margin-bottom: 10px;
`;
const LikeCountWrap = styled.div``;

const PaginationBox = styled.div`
  margin: 20px 0;
  display: flex;
  width: 100%;
  justify-content: center;
`;

export default DashBoard;
