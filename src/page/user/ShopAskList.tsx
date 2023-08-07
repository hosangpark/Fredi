import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Accordion, createStyles, Pagination } from '@mantine/core';
import { APIDeleteShopAsk, APIShopAskList } from '../../api/AskAPI';
import dayjs from 'dayjs';
import AlertModal from '../../components/Modal/AlertModal';
import ConfirmModal from '../../components/Modal/ConfirmModal';

type TShopAskListItem = {
  idx: number;
  category: 'product' | 'pay' | 'delivery' | 'cs';
  question: string;
  answer: string | null;
  created_time: Date;
};

const CATEGORY_ASK = {
  product: '제품 문의',
  pay: '결제 문의',
  delivery: '배송 문의',
  cs: 'CS 문의',
};

function ShopAskList() {
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

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isOpen, setOpen] = useState<string[]>([]);
  const [askList, setAskList] = useState<TShopAskListItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [confirmModal, setConfirmModal] = useState(false);
  const [itemIdx, setItemIdx] = useState<number | undefined>();

  const { classes } = useStyles();

  const getAskList = async () => {
    const data = {
      page: page,
    };
    const { list, total } = await APIShopAskList(data);
    console.log(list, total);
    setAskList(list);
    setTotal(total);
  };

  const onDeleteAsk = async () => {
    setConfirmModal(false);
    const data = {
      idx: itemIdx,
    };
    try {
      const res = await APIDeleteShopAsk(data);
      console.log(res);
      setShowModal(true);
      getAskList();
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  useEffect(() => {
    getAskList();
  }, [page]);

  useEffect(() => {
    if (itemIdx) {
      setConfirmModal(true);
    }
  }, [itemIdx]);

  return (
    <Container>
      <LeftBox>
        <LeftTopBox>
          <Title>상품문의내역</Title>
        </LeftTopBox>
      </LeftBox>
      <RightBox>
        {total === 0 ? (
          <NoDataBox>
            {/* <Logo src={logoImage} /> */}
            <Text>You haven't made an inquiry yet.</Text>
          </NoDataBox>
        ) : (
          <ListWrap>
            <Accordion
              value={isOpen}
              onChange={setOpen}
              multiple={true}
              variant="default"
              styles={{ control: { padding: 0, '&:hover': { backgroundColor: '#fff' } }, content: { padding: 0 }, chevron: { display: 'none' } }}
            >
              {askList.map((item) => (
                <Accordion.Item key={item.idx} className={classes.item} value={String(item.idx)}>
                  <Accordion.Control>
                    <TitleBox>
                      <RowWrap>
                        <ListItemTitle>{CATEGORY_ASK[item.category]}</ListItemTitle>
                        <StatusBox answerd={!!item.answer}>
                          <StatusBoxText>{item.answer ? '답변완료' : '답변대기'}</StatusBoxText>
                        </StatusBox>
                      </RowWrap>
                      <RowWrap last>
                        <RowWrap>
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
                        <ButtonWrap>
                          <WhiteButton onClick={() => setItemIdx(item.idx)}>
                            <WhiteButtonText>삭제하기</WhiteButtonText>
                          </WhiteButton>
                        </ButtonWrap>
                      </QuestionBox>
                      <AnswerBox>
                        <ContentRowWrap>
                          <IconText>A.</IconText>
                          <ContentText>{item.answer ?? '답변 대기 중'}</ContentText>
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
        )}
      </RightBox>
      <EmptyBox />
      <ConfirmModal visible={confirmModal} setVisible={setConfirmModal} text="1:1 문의를 삭제하시겠습니까?" onOk={onDeleteAsk} />
      <AlertModal
        visible={showModal}
        setVisible={setShowModal}
        onClick={() => {
          setShowModal(false);
        }}
        text="1:1 문의가 삭제되었습니다."
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  min-height: calc(100vh - 80px);
  flex-direction: row;
  border-top: 1px solid #121212;
  background-color: #ffffff;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
    border-top: 0;
  }
`;

const LeftBox = styled.div`
  display: flex;
  min-width: 290px;
  width: 400px;
  flex-direction: column;
  text-align: left;
  border-right: 1px solid #121212;
  @media only screen and (max-width: 1100px) {
    width: 300px;
  }
  @media only screen and (max-width: 768px) {
    display: flex;
    width: 100%;
    border-bottom: 1px solid #121212;
    border-right: 0;
  }
`;

const RightBox = styled.div`
  display: flex;
  flex: 1;
  min-width: 700px;
  flex-direction: column;
  @media only screen and (max-width: 768px) {
    min-width: 300px;
  }
`;

const LeftTopBox = styled.div`
  width: 100%;
  padding: 10px 50px;
  @media only screen and (max-width: 768px) {
    padding: 0 18px;
  }
`;

const Title = styled.h3`
  font-weight: 700;
  color: #121212;
  font-size: 36px;
  @media only screen and (max-width: 768px) {
    font-size: 22px;
  }
`;

const EmptyBox = styled.div`
  width: 280px;
  display: flex;
  border-left: 1px solid #121212;
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
  font-weight: 410;
  color: #121212;
  font-size: 18px;
  margin: 30px 0 50px;
  @media only screen and (max-width: 1000px) {
    font-size: 14px;
    margin: 10px 0 30px;
  }
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
  @media only screen and (max-width: 1000px) {
    width: 100px;
    height: 40px;
    margin: 20px;
  }
`;

const BlackButtonNoData = styled(BlackButton)`
  width: 350px;
  height: 60px;
  align-self: center;
  @media only screen and (max-width: 1000px) {
    width: 280px;
  }
`;

const BlackButtonText = styled.span`
  color: #ffffff;
  font-weight: 410;
  font-size: 16px;
  @media only screen and (max-width: 1000px) {
    font-size: 13px;
  }
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
  font-family:'Pretendard Variable' !important;

  font-weight: 700;
  color: #121212;
  font-size: 17px;
  @media only screen and (max-width: 1000px) {
    font-size: 14px;
  }
`;

const StatusBox = styled.div<{ answerd: boolean }>`
  width: 78px;
  height: 27px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.answerd ? '#121212' : '#398049')};
  @media only screen and (max-width: 1000px) {
    width: 65px;
    height: 25px;
  }
`;

const StatusBoxText = styled.span`
  font-family:'Pretendard Variable' !important;

  font-weight: 410;
  color: #fff;
  font-size: 12px;
  @media only screen and (max-width: 1000px) {
    font-size: 10px;
  }
`;
const Nickname = styled.span`
  font-family:'Pretendard Variable' !important;

  font-weight: 410;
  color: #121212;
  font-size: 16px;
  @media only screen and (max-width: 1000px) {
    font-size: 12px;
  }
`;
const Date = styled(Nickname)`
  font-size: 15px;
  @media only screen and (max-width: 1000px) {
    font-size: 12px;
  }
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
  font-family:'Pretendard Variable' !important;
  align-self: flex-start;
  display: inline-block;
  min-width: 45px;
  text-align: left;
  font-weight: 700;
  font-size: 30px;
  color: #121212;
  margin-right: 16px;
  @media only screen and (max-width: 1000px) {
    font-size: 20px;
  }
`;

const ContentText = styled.pre`
  font-family:'Pretendard Variable' !important;
  font-weight: 410;
  color: #121212;
  font-size: 16px;
  text-align: left;
  @media only screen and (max-width: 1000px) {
    font-size: 13px;
  }
`;

const ContentRowWrap = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
`;

const ButtonWrap = styled.div`
  display: flex;
  margin-top: 15px;
  align-self: flex-end;
`;

const WhiteButton = styled.div`
  width: 100px;
  height: 40px;
  border: 1px solid #121212;
  margin-left: 17px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  @media only screen and (max-width: 1000px) {
    width: 80px;
    height: 35px;
    margin-left: 10px;
  }
`;
const WhiteButtonText = styled.span`
  font-family:'Pretendard Variable' !important;

  color: #121212;
  font-size: 14px;
  font-weight: 410;
  @media only screen and (max-width: 1000px) {
    font-size: 12px;
  }
`;

const NoDataBox = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export default ShopAskList;
