import React, { memo } from 'react';
import styled from 'styled-components';
import searchButtonImage from '../../asset/image/ico_search.png';
import arrDownImage from '../../asset/image/arr_down.png';
import { TextInput, Select } from '@mantine/core';

type TCategory = { value: string; label: string };
interface ICategorySelectButton {
  item: TCategory;
  isSelect: boolean;
  onClickFilter: (e: TCategory) => void;
}

const CategroySelectButtons = memo(({ item, isSelect, onClickFilter }: ICategorySelectButton) => {
  return (
    <CategorySelectButton selected={isSelect} onClick={() => onClickFilter(item)} key={item.label}>
      <CategorySelectButtonText selected={isSelect}>{item.label}</CategorySelectButtonText>
    </CategorySelectButton>
  );
});

function SearchBox({
  onClickSearch,
  onClickFilter,
  onKeyDown,
  categoryList,
  category,
  keyword,
  onChangeInput,
  onChangeCategory,
}: {
  onClickSearch: (e: any) => void;
  onClickFilter: (e: TCategory) => void;
  onKeyDown: (e: any) => void;
  categoryList: TCategory[];
  category: string;
  keyword: string;
  onChangeInput: (e: any) => void;
  onChangeCategory: (value: '1' | '2' | '3' | '4' | '5' | '6') => void;
}) {
  return (
    <Wrap>
      <SearchBoxWrap>
        <SearchButton onClick={onClickSearch} src={searchButtonImage} />
        <Input value={keyword} onChange={onChangeInput} onKeyDown={onKeyDown} type="text" variant="unstyled" />
        <CategorySelectButtonWrap>
          {categoryList.map((item) => {
            return (
              <CategroySelectButtons key={`Category-${item.value}`} item={item} isSelect={category === item.value} onClickFilter={onClickFilter} />
            );
          })}
        </CategorySelectButtonWrap>
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
                  fontSize: 12,
                  textTransform: 'capitalize',
                  '@media (max-width: 460px)': { fontSize: 11 },
                },
                fontSize: 12,
                textTransform: 'capitalize',
                '@media (max-width: 460px)': { fontSize: 11 },
              },
              input: {
                fontSize: 12,
                textAlign: 'center',
                paddingRight: 5,
                textTransform: 'capitalize',
                '@media (max-width: 460px)': { fontSize: 11 },
              },
            })}
            variant="unstyled"
            value={category}
            data={categoryList}
            onChange={onChangeCategory}
          />
        </UnderLineBox>
      </SearchBoxWrap>
    </Wrap>
  );
}

const Wrap = styled.div`
  position: -webkit-sticky;
  position: sticky;
  top: 80px;
  z-index: 97;
  background-color: #fff;
  @media only screen and (max-width: 768px) {
    top: 50px;
  }
`;

const SearchBoxWrap = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
  border: 1px solid #dfdfdf;
  border-radius: 30px;
  margin: 30px 30px;
  background-color: #f6f6f6;
  @media only screen and (max-width: 1024px) {
    margin: 20px 30px;
  }
  @media only screen and (max-width: 460px) {
    margin: 15px 20px;
    height: 40px;
  }
`;

const SearchButton = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 15px;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    width: 15px;
    height: 15px;
  }
`;

const Input = styled(TextInput)`
  flex: 1;
  padding: 5px 10px;
  height: 45px;
  @media only screen and (max-width: 460px) {
    height: 35px;
    padding: 0 10px;
  }
`;

const UnderLineBox = styled.div`
  display: none;
  width: 140px;
  padding: 0px 5px;
  align-items: center;
  border-left: 1px solid #dfdfdf;
  height: 100%;
  background-color: #fff;
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
  @media only screen and (max-width: 1024px) {
    display: flex;
  }
  @media only screen and (max-width: 460px) {
    width: 100px;
  }
`;

const DownIcon = styled.img`
  width: 10px;
  height: 10px;
  cursor: pointer;
  @media only screen and (max-width: 460px) {
    width: 8px;
    height: 8px;
    margin-left: 15px;
  }
`;

const CategorySelectButtonWrap = styled.div`
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-left: 1px solid #dfdfdf;
  height: 100%;
  background-color: #fff;
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
  @media only screen and (max-width: 1024px) {
    display: none;
  }
`;

const CategorySelectButton = styled.div<{ selected: boolean }>`
  background-color: ${(props) => (props.selected ? '#121212' : '#fff')};
  padding: 0 23px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 27px;
  cursor: pointer;
`;

const CategorySelectButtonText = styled.span<{ selected: boolean }>`
  color: ${(props) => (props.selected ? '#fff' : '#121212')};
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
`;

export default SearchBox;
