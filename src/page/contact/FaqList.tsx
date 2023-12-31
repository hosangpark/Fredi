import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import logoImage from '../../asset/image/logo.png';
import searchButtonImage from '../../asset/image/ico_search.png';
import { Accordion, createStyles, Pagination } from '@mantine/core';
import { APIFaqList } from '../../api/FaqAPI';
import dayjs from 'dayjs';
import Nodata from '../../components/Product/NoData';

type TFaqListItem = {
  idx: number;
  title: string;
  question: string;
  answer: string;
  created_time: Date;
};

const useStyles = createStyles((theme) => ({
  item: {
    padding: '15px 0',
    borderRadius: 0,
    marginBottom: 0,
    backgroundColor: '#fff',
    border: 0,
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? '#121212' : '#121212'}`,
    paddingBottom: 0,
  },
}));

function FaqList() {
  const [isOpen, setOpen] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [faqList, setFaqList] = useState<TFaqListItem[]>([]);
  const [total, setTotal] = useState<number>(0);

  const { classes } = useStyles();

  const getFaqList = async () => {
    const data = {
      page: page,
      keyword: searchKeyword,
    };
    const { list, total } = await APIFaqList(data);
    console.log(list, total);
    setFaqList(list);
    setTotal(total);
  };

  useEffect(() => {
    getFaqList();
  }, [page]);

  return (
    <Container>
    <Title>FAQ</Title>
        <SearchBox>
          <SearchInput value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
          <SearchButton onClick={getFaqList} src={searchButtonImage} />
        </SearchBox>
        {faqList&&
        faqList.length > 0 ?

        <ListWrap>
        <Accordion
          value={isOpen}
          onChange={setOpen}
          multiple={true}
          variant="default"
          styles={{ control: { padding: 0, '&:hover': { backgroundColor: '#fff' } }, content: { padding: 0 }, chevron: { display: 'none' } }}
        >
          {faqList.map((item) => (
            <Accordion.Item key={item.idx} className={classes.item} value={String(item.idx)}>
              <Accordion.Control>
                <TitleBox>
                  <RowWrap>
                    <ListItemTitle>{item.title}</ListItemTitle>
                  </RowWrap>
                  <RowWrap last>
                    <RowWrap last>
                      <Nickname>관리자</Nickname>
                      <Line />
                      <Date>{dayjs(item.created_time).format('YYYY-MM-DD hh:mm:ss')}</Date>
                    </RowWrap>
                  </RowWrap>
                </TitleBox>
              </Accordion.Control>
              <Accordion.Panel>
                <ContentBox>
                  <QuestionBox>
                    <ContentRowWrap>
                      <IconText>Q.</IconText>
                      <ContentText>{item.question}</ContentText>
                    </ContentRowWrap>
                  </QuestionBox>
                  <AnswerBox>
                    <ContentRowWrap>
                      <IconText>A.</IconText>
                      <ContentText>{item.answer}</ContentText>
                    </ContentRowWrap>
                  </AnswerBox>
                </ContentBox>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>

        <Pagination
          page={page}
          total={total / 10 + 1}
          position="center"
          onChange={setPage}
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
        :
        <Nodata/>
        }
    </Container>
  );
}


const Container = styled.div`
  display: flex;
  min-width: 290px;
  width: 100%;
  flex-direction: column;
  text-align: left;
  padding:30px;
  @media only screen and (max-width: 768px) {
    width: 100%;
    padding:20px;
    border-right: 0;
  }
`
const Title = styled.h3`
font-family:'Pretendard Variable';
  font-weight: 410;
  color: #121212;
  font-size: 16px;
  border-bottom: 1px solid  #ECECEC;
  @media only screen and (max-width: 768px) {
  padding-bottom:40px;
    font-size: 14px;
  }
`;
const ListWrap = styled.div`
  width:768px;
  margin:0 auto;
  padding:0 20px 50px;
  @media only screen and (max-width: 768px) {
    width:100%;
  }
`;
const Logo = styled.img`
  width: 150px;
  height: 38px;
  margin-bottom: 20px;
  @media only screen and (max-width: 1000px) {
    width: 120px;
    height: 30px;
  }
`;

const Text = styled.h3`
  font-family:'Pretendard Variable' !important;

  font-weight: 410;
  color: #121212;
  font-size: 18px;
  margin: 30px 0 50px;
  @media only screen and (max-width: 1000px) {
    font-size: 14px;
    margin: 10px 0 30px;
  }
`;


const TitleBox = styled.div`
  padding: 10px 20px 20px;
`;
const ContentBox = styled.div`
  border-top: 1px solid #121212;
  padding: 10px 10px;
  margin-top: 5px;
`;
const RowWrap = styled.div<{ last?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(props) => (props.last ? 0 : 10)}px;
`;

const ListItemTitle = styled.span`
  font-family:'Pretendard Variable' !important;

  font-weight: 700;
  color: #121212;
  font-size: 17px;
  @media only screen and (max-width: 1000px) {
    font-size: 14px;
  }
`;

const Nickname = styled.span`
  font-family:'Pretendard Variable' !important;

  font-weight: 410;
  color: #121212;
  font-size: 15px;
  @media only screen and (max-width: 1000px) {
    font-size: 12px;
  }
`;
const Line = styled.div`
  background-color: #121212;
  width: 1px;
  height: 10px;
  margin: 0 10px;
`;

const Date = styled(Nickname)``;

const QuestionBox = styled.div`
  padding: 20px 0;
  display: flex;
  flex-direction: column;
`;

const AnswerBox = styled(QuestionBox)`
  border-top: 1px solid #e9e9e9;
`;

const IconText = styled.span`
  font-family:'Pretendard Variable' !important;
  align-self: flex-start;
  font-weight: 700;
  font-size: 30px;

  color: #121212;
  margin-right: 16px;
  @media only screen and (max-width: 1000px) {
    font-size: 20px;
  }
`;

const ContentText = styled.pre`
  display: flex;
  flex: 1;
  font-family:'Pretendard Variable';;
  font-weight: 410;
  color: #121212;
  font-size: 16px;
  text-align: left;
  overflow: scroll;
  &::-webkit-scrollbar {
    width: 0;
  }
  @media only screen and (max-width: 1000px) {
    font-size: 13px;
  }
`;

const ContentRowWrap = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
`;

const NoDataBox = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  width: 200px;
  height: 45px;
  position: relative;
  align-self: flex-end;
  margin: 30px 30px 0;
  @media only screen and (max-width: 1000px) {
    display: none;
  }
`;

const SearchButton = styled.img`
  width: 16px;
  height: 16px;
  position: absolute;
  right: 15px;
  cursor: pointer;
`;

const SearchInput = styled.input`
  border: 0;
  border-bottom: 1px solid #121212;
  padding: 8px 0;
  display: flex;
  flex: 1;
  outline: 0;
  padding-left: 15px;
`;

export default FaqList;
