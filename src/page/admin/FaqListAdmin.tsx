import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../asset/image/logo.png';
import { Accordion, createStyles, Pagination } from '@mantine/core';
import AlertModal from '../../components/Modal/AlertModal';
import { APIDeleteFaq, APIFaqList } from '../../api/FaqAPI';
import dayjs from 'dayjs';
import ConfirmModal from '../../components/Modal/ConfirmModal';

type TFaqListItem = {
  idx: number;
  title: string;
  question: string;
  answer: string;
  created_time: Date;
};

function FaqListAdmin() {
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
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState<string[]>([]);
  const [faqList, setFaqList] = useState<TFaqListItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [itemIdx, setItemIdx] = useState<number | undefined>();

  const { classes } = useStyles();

  const getFaqList = async () => {
    const data = {
      page: page,
    };
    const { list, total } = await APIFaqList(data);
    console.log(list, total);
    setFaqList(list);
    setTotal(total);
  };

  const onDeleteFaq = async () => {
    setConfirmModal(false);
    const data = {
      idx: itemIdx,
    };
    console.log(itemIdx);
    try {
      const res = await APIDeleteFaq(data);
      console.log(res);
      setShowModal(true);
      getFaqList();
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  useEffect(() => {
    getFaqList();
  }, [page]);

  useEffect(() => {
    if (itemIdx) {
      setConfirmModal(true);
    }
  }, [itemIdx]);

  return (
    <>
      {faqList.length < 1 ? (
        <NoDataBox>
          {/* <Logo src={logoImage} /> */}
          <Text>등록된 FAQ가 없습니다.</Text>
          <BlackButtonNoData onClick={() => navigate('/admin/registerfaq')}>
            <BlackButtonText>등록하기</BlackButtonText>
          </BlackButtonNoData>
        </NoDataBox>
      ) : (
        <ListWrap>
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
                        <DeleteButton
                          onClick={() => {
                            setItemIdx(item.idx);
                          }}
                        >
                          <DeleteButtonText>삭제</DeleteButtonText>
                        </DeleteButton>
                      </RowWrap>
                      <RowWrap last>
                        <RowWrap>
                          <Nickname>관리자</Nickname>
                          <Line />
                          <Date>{dayjs(item.created_time).format('YYYY.MM.DD. HH:mm:ss')}</Date>
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
              total={Math.ceil(total / 10)}
              position="center"
              onChange={setPage}
              styles={(theme) => ({
                item: {
                  marginTop: 20,
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
          <BlackButton onClick={() => navigate('/admin/registerfaq')}>
            <BlackButtonText>글쓰기</BlackButtonText>
          </BlackButton>
        </ListWrap>
      )}
      <ConfirmModal visible={confirmModal} setVisible={setConfirmModal} text="FAQ를 삭제하시겠습니까?" onOk={onDeleteFaq} />
      <AlertModal
        visible={showModal}
        setVisible={setShowModal}
        onClick={() => {
          setShowModal(false);
        }}
        text="FAQ가 삭제되었습니다."
      />
    </>
  );
}

const Logo = styled.img`
  width: 150px;
  height: 38px;
  margin-bottom: 20px;
`;

const Text = styled.h3`
  font-family: 'NotoSans';
  font-weight: 500;
  color: #121212;
  font-size: 18px;
  margin: 30px 0 50px;
`;

const BlackButton = styled.div`
  width: 160px;
  height: 60px;
  align-self: flex-end;
  margin: 30px;
  background-color: #121212;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const BlackButtonNoData = styled(BlackButton)`
  width: 350px;
  align-self: center;
`;

const BlackButtonText = styled.span`
  font-family: 'NotoSans';
  color: #ffffff;
  font-weight: 410;
  font-size: 16px;
`;

const ListWrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const TitleBox = styled.div`
  padding: 10px 20px 20px;
`;
const ContentBox = styled.div`
  border-top: 1px solid #121212;
  padding: 10px 20px;
  margin-top: 5px;
`;

const RowWrap = styled.div<{ last?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(props) => (props.last ? 0 : 7)}px;
`;

const ListItemTitle = styled.span`
  font-family: 'NotoSans';
  font-weight: 700;
  color: #121212;
  font-size: 17px;
`;
const DeleteButton = styled.div`
  width: 58px;
  height: 27px;
  background-color: #121212;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: flex-end;
`;

const DeleteButtonText = styled.span`
  font-family: 'NotoSans';
  font-weight: 410;
  color: #fff;
  font-size: 12px;
`;

const Nickname = styled.span`
  font-family: 'NotoSans';
  font-weight: 410;
  color: #121212;
  font-size: 15px;
`;

const Date = styled(Nickname)`
  font-size: 15px;
`;
const Line = styled.div`
  background-color: #121212;
  width: 1px;
  height: 10px;
  margin: 0 10px;
`;

const QuestionBox = styled.div`
  padding: 20px 0;
  display: flex;
  flex-direction: column;
`;

const AnswerBox = styled(QuestionBox)`
  border-top: 1px solid #e9e9e9;
`;

const IconText = styled.span`
  font-family: 'NotoSans';
  display: inline-block;
  min-width: 45px;
  text-align: left;
  font-weight: 700;
  font-size: 30px;
  color: #121212;
  margin-right: 16px;
  align-self: flex-start;
`;

const ContentText = styled.pre`
  display: flex;
  flex: 1;

  font-family: 'NotoSans';
  font-weight: 410;
  color: #121212;
  font-size: 16px;
  text-align: left;
  overflow: scroll;
  &::-webkit-scrollbar {
    width: 0;
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

export default FaqListAdmin;
