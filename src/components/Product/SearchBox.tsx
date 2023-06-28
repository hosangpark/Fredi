import React, { memo } from 'react';
import styled from 'styled-components';
import searchButtonImage from '../../asset/image/ico_search.png';
import arrDownImage from '../../asset/image/arr_down.png';
import { TextInput, Select } from '@mantine/core';

type TCategory = { value: string; label: string };


function SearchBox({
  onClickSearch,
  onKeyDown,
  categoryList,
  category,
  keyword,
  none,
  onChangeInput,
  onChangeCategory,
}: {
  onClickSearch: (e: any) => void;
  onKeyDown: (e: any) => void;
  categoryList: TCategory[];
  category: string;
  keyword: string;
  none?:boolean;
  onChangeInput: (e: any) => void;
  onChangeCategory: (value: '1' | '2' | '3' | '4' | '5' | '6') => void;
}) {
  return (
    <Wrap none={none}>
      <SearchBoxWrap>
        <Input value={keyword} onChange={onChangeInput} onKeyDown={onKeyDown} type="text" variant="unstyled" />
        <SearchButton onClick={onClickSearch} src={searchButtonImage} />
        {/* <UnderLineBox>
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
        </UnderLineBox> */}
      </SearchBoxWrap>
    </Wrap>
  );
}

const Wrap = styled.div<{none?:boolean}>`
  position: -webkit-sticky;
  position: sticky;
  top: 80px;
  z-index: 97;
  width:30%;
  @media only screen and (max-width: 768px) {
    top: 50px;
    width:100%;
    display:${props => props.none? 'none':'block'};
  }
`;

const SearchBoxWrap = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
  border: 1px solid #dfdfdf;
  border-radius: 30px;
  margin: 10px 0;
  background-color: #ffffff;
  @media only screen and (max-width: 1024px) {
    margin: 20px 0px;
  }
  @media only screen and (max-width: 460px) {
    margin: 15px 0px;
    height: 40px;
  }
`;

const SearchButton = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 15px;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    width: 15px;
    height: 15px;
  }
`;

const Input = styled(TextInput)`
font-family:'Pretendard Variable';
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



export default SearchBox;
