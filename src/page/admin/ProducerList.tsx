import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';
import logoImage from '../../asset/image/logo.png';
import searchButtonImage from '../../asset/image/ico_search.png';
import { Pagination, Select } from '@mantine/core';
import { APIDeleteProducer, APIProducerListAdmin } from '../../api/ProducerAPI';
import arrDownImage from '../../asset/image/arr_down.png';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import AlertModal from '../../components/Modal/AlertModal';
import ConfirmModal from '../../components/Modal/ConfirmModal';
import { CATEGORY_PRODUCER } from './DashBoard';
import { CategoryList } from '../../components/List/List';

export type TImage = {
  idx: number;
  file_name: string;
};

export type TProducerListItem = {
  idx: number;
  name: string;
  category: 1 | 2 | 3 | 4 | 5 | 6;
  address_text: string;
  zipcode: string;
  address1: string;
  address2: string;
  phone: string;
  business_hour: string;
  sns: string;
  email: string;
  website: string;
  description: string;
  created_time: Date;
  updated_time: Date;
  deleted_time: Date;
  image: TImage[];
  isLike: boolean;
  like_count: number;
};


function ProducerList() {
  let [searchParams, setSearchParams] = useSearchParams();

  const [showModal, setShowModal] = useState<boolean>(false);

  const [producerist, setProducerist] = useState<TProducerListItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [keyword, setKeyword] = useState<string>('');
  const [category, setCategory] = useState<'0' | '1' | '2' | '3' | '4' | '5' | '6'>('0');
  const [confirmModal, setConfirmModal] = useState(false);
  const [itemIdx, setItemIdx] = useState<number | undefined>();

  const getProducerList = async (page: number, category: '0' | '1' | '2' | '3' | '4' | '5' | '6', keyword: string) => {
    const data = {
      page: page,
      category: category === '0' ? undefined : Number(category),
      keyword: keyword,
    };
    console.log('data', data);
    try {
      const { list, total } = await APIProducerListAdmin(data);
      console.log(list, total);
      setProducerist(list);
      setTotal(total);
      console.log(list);
    } catch (error) {
      console.log(error);
    }
  };

  const onDeleteProducer = async () => {
    setConfirmModal(false);
    const data = {
      idx: itemIdx,
    };
    try {
      const res = await APIDeleteProducer(data);
      console.log(res);
      setShowModal(true);
      getProducerList(page, category, keyword);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const handlePage = (page: number) => {
    const category = (searchParams.get('category') as '0' | '1' | '2' | '3' | '4' | '5' | '6') ?? '0';
    const keyword = searchParams.get('keyword') ?? '';
    setSearchParams({ page: String(page), category, keyword });
  };

  useEffect(() => {
    const page = searchParams.get('page') ?? 1;
    const category = (searchParams.get('category') as '0' | '1' | '2' | '3' | '4' | '5' | '6') ?? '0';
    const keyword = searchParams.get('keyword') ?? '';

    setPage(Number(page));
    setCategory(category);
    setKeyword(keyword);

    getProducerList(Number(page), category, keyword);
  }, [searchParams]);

  useEffect(() => {
    if (itemIdx) {
      setConfirmModal(true);
    }
  }, [itemIdx]);

  return (
    <>
      <ListWrap>
        <SearchBox>
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
                  },
                },
                input: { fontSize: 14 },
              })}
              variant="unstyled"
              value={category}
              data={CategoryList}
              onChange={(value: '0' | '1' | '2' | '3' | '4' | '5' | '6') => setCategory(value)}
            />
          </UnderLineBox>
          <SearchInput
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setSearchParams({ page: String(1), category, keyword });
              }
            }}
          />
          <SearchButton onClick={() => setSearchParams({ page: String(1), category, keyword })} src={searchButtonImage} />
        </SearchBox>
        <TitleBox>
          <TitleText>정보</TitleText>
          <TitleText>관리</TitleText>
        </TitleBox>
        {producerist.map((item) => (
          <ListItemWrap key={item.idx}>
            <ListItemBox>
              <ListItemImage src={item.image[0].file_name} />
              <ListItemTextBox>
                <ListItemName>[{CATEGORY_PRODUCER[item.category]}]</ListItemName>
                <ListItemTextRowWrap>
                  <ListItemSubTitle>업체명</ListItemSubTitle>
                  <ListItemSubContent>{item.name}</ListItemSubContent>
                </ListItemTextRowWrap>
                <ListItemTextRowWrap>
                  <ListItemSubTitle>주소</ListItemSubTitle>
                  <ListItemSubContent>{item.address_text}</ListItemSubContent>
                </ListItemTextRowWrap>
                <ListItemTextRowWrap>
                  <ListItemSubTitle>등록일시</ListItemSubTitle>
                  <ListItemSubContent>{dayjs(item.created_time).format('YYYY-MM-DD HH:mm:ss')}</ListItemSubContent>
                </ListItemTextRowWrap>
              </ListItemTextBox>
            </ListItemBox>
            <ButtonWrap>
              <Link to={`/admin/producer/${item.idx}`} style={{ textDecoration: 'none' }}>
                <WhiteButton>
                  <WhiteButtonText>수정</WhiteButtonText>
                </WhiteButton>
              </Link>
              <WhiteButton onClick={() => setItemIdx(item.idx)}>
                <WhiteButtonText>삭제</WhiteButtonText>
              </WhiteButton>
            </ButtonWrap>
          </ListItemWrap>
        ))}
        <Pagination
          page={page}
          total={Math.ceil(total / 10)}
          position="center"
          onChange={handlePage}
          styles={(theme) => ({
            item: {
              marginTop: 20,
              marginBottom: 20,
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
      </ListWrap>
      <ConfirmModal visible={confirmModal} setVisible={setConfirmModal} text="선택한 항목을 삭제하시겠습니까?" onOk={onDeleteProducer} />
      <AlertModal
        visible={showModal}
        setVisible={setShowModal}
        onClick={() => {
          setShowModal(false);
        }}
        text="삭제되었습니다."
      />
    </>
  );
}

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  align-self: flex-end;
  margin: 30px 50px 20px;
`;

const SearchButton = styled.img`
  width: 18px;
  height: 18px;
  position: absolute;
  right: 15px;
  cursor: pointer;
`;

const SearchInput = styled.input`
  border: 0;
  border-bottom: 1px solid #121212;
  padding: 10px 0;
  display: flex;
  flex: 1;
  width: 230px;
  outline: 0;
  padding-left: 15px;
  font-size: 14px;
`;

const TitleBox = styled.div`
  border-top: 1px solid #121212;
  border-bottom: 1px solid #121212;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 50px;
`;

const TitleText = styled.span`
  font-weight: 700;
  font-size: 16px;
  color: #121212;
`;

const ListWrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const ListItemWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 50px;
  border-bottom: 1px solid #121212;
`;

const ListItemBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const ListItemImage = styled.img`
  width: 145px;
  height: 145px;
  margin-right: 15px;
`;

const ListItemTextBox = styled.div`
  text-align: left;
`;

const ListItemTextRowWrap = styled.div`
  margin-top: 7px;
`;

const ListItemName = styled.span`
  font-weight: 700;
  font-size: 13px;
  color: #121212;
`;

const ListItemSubTitle = styled(ListItemName)`
  display: inline-block;
  font-weight: 500;
  width: 75px;
`;

const ListItemSubContent = styled(ListItemSubTitle)`
  width: auto;
`;

const ButtonWrap = styled.div`
  display: flex;
  align-items: center;
`;

const WhiteButton = styled.div`
  width: 90px;
  height: 40px;
  border: 1px solid #121212;
  margin-left: 10px;
  cursor: pointer;
`;
const WhiteButtonText = styled.span`
  color: #121212;
  font-size: 14px;
  font-weight: 400;
  line-height: 40px;
`;
const UnderLineBox = styled.div`
  width: 120px;
  padding: 0px 5px;
  border-bottom: 1px solid #121212;
  text-align: left;
  margin-right: 30px;
`;

const DownIcon = styled.img`
  width: 14px;
  height: 14px;
  cursor: pointer;
`;

export default ProducerList;
