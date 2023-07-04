import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import searchButtonImage from '../../asset/image/ico_search.png';
import { Pagination, Select } from '@mantine/core';
import { TImage } from './ProducerList';
import { APIDeleteProduct, APIProductListAdmin } from '../../api/ProductAPI';
import arrDownImage from '../../asset/image/arr_down.png';
import dayjs from 'dayjs';
import AlertModal from '../../components/Modal/AlertModal';
import ConfirmModal from '../../components/Modal/ConfirmModal';
import { CategoryList } from '../../components/List/List';

export type TProductListItem = {
  idx: number;
  category: 1 | 2 | 3 | 4 | 5 | 6;
  name: string;
  size: string;
  weight: string;
  country: string;
  designer: string;
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

export const CATEGORY_PRODUCT = {
  1: 'all',
  2: 'furniture',
  3: 'lighting',
  4: 'fabric',
  5: 'tableware',
  6: 'art&objet',
};


function ProductList() {
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();

  const [showModal, setShowModal] = useState<boolean>(false);

  const [productList, setProductList] = useState<TProductListItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [keyword, setKeyword] = useState<string>('');
  const [category, setCategory] = useState<'1' | '2' | '3' | '4' | '5' | '6'>('1');
  const [confirmModal, setConfirmModal] = useState(false);
  const [itemIdx, setItemIdx] = useState<number | undefined>();

  const getProductList = async (page: number, category: '1' | '2' | '3' | '4' | '5' | '6', keyword: string) => {
    const data = {
      page: page,
      category: Number(category),
      keyword: keyword,
    };
    console.log('data', data);
    try {
      const { list, total } = await APIProductListAdmin(data);
      console.log(list, total);
      setProductList(list);
      setTotal(total);
      console.log(list);
    } catch (error) {
      console.log(error);
    }
  };

  const onDeleteProduct = async () => {
    setConfirmModal(false);
    const data = {
      idx: itemIdx,
    };
    try {
      const res = await APIDeleteProduct(data);
      console.log(res);
      setShowModal(true);
      getProductList(page, category, keyword);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const handlePage = (page: number) => {
    const category = (searchParams.get('category') as '1' | '2' | '3' | '4' | '5' | '6') ?? '1';
    const keyword = searchParams.get('keyword') ?? '';
    setSearchParams({ page: String(page), category, keyword });
  };

  useEffect(() => {
    const page = searchParams.get('page') ?? 1;
    const category = (searchParams.get('category') as '1' | '2' | '3' | '4' | '5' | '6') ?? '1';
    const keyword = searchParams.get('keyword') ?? '';

    setPage(Number(page));
    setCategory(category);
    setKeyword(keyword);

    getProductList(Number(page), category, keyword);
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
              onChange={(value: '1' | '2' | '3' | '4' | '5' | '6') => setCategory(value)}
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
        {productList.map((item) => (
          <ListItemWrap key={item.idx}>
            <ListItemBox>
              <ListItemImage src={item.image[0].file_name} />
              <ListItemTextBox>
                <ListItemName>[{CATEGORY_PRODUCT[item.category]}]</ListItemName>
                <ListItemName> {item.name}</ListItemName>
                <ListItemTextRowWrap>
                  <ListItemSubTitle>디자이너명</ListItemSubTitle>
                  <ListItemSubContent>{item.designer}</ListItemSubContent>
                </ListItemTextRowWrap>
                <ListItemTextRowWrap>
                  <ListItemSubTitle>등록일시</ListItemSubTitle>
                  <ListItemSubContent>{dayjs(item.created_time).format('YYYY-MM-DD HH:mm:ss')}</ListItemSubContent>
                </ListItemTextRowWrap>
              </ListItemTextBox>
            </ListItemBox>
            <ButtonWrap>
              <WhiteButton onClick={() => navigate(`/admin/product/${item.idx}`)}>
                <WhiteButtonText>수정</WhiteButtonText>
              </WhiteButton>
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
      <ConfirmModal visible={confirmModal} setVisible={setConfirmModal} text="선택한 항목을 삭제하시겠습니까?" onOk={onDeleteProduct} />
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
  font-weight: 410;
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

export default ProductList;
