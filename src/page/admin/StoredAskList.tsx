import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import logoImage from '../../asset/image/logo.png';
import { Accordion, createStyles, Pagination } from '@mantine/core';
import { APIAnswerAsk, APIDeleteAsk, APIStoredAskList } from '../../api/AskAPI';
import dayjs from 'dayjs';
import AlertModal from '../../components/Modal/AlertModal';
import ConfirmModal from '../../components/Modal/ConfirmModal';

type TAskListItemAdmin = {
  idx: number;
  title: string;
  question: string;
  answer: string | null;
  created_time: Date;
  show: boolean;
  user: {
    nickname: string;
  };
};

function StoredAskList() {
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
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAnswerModal, setShowAnswerModal] = useState<boolean>(false);
  const [isOpen, setOpen] = useState<string[]>([]);
  const [askList, setAskList] = useState<TAskListItemAdmin[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [answer, setAnswer] = useState<string>('');
  const [confirmModal, setConfirmModal] = useState(false);
  const [itemIdx, setItemIdx] = useState<number | undefined>();

  const { classes } = useStyles();

  const getAskList = async () => {
    const data = {
      page: page,
    };
    try {
      const { list, total } = await APIStoredAskList(data);
      console.log(list, total);
      setAskList(list);
      setTotal(total);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const onAnswerAsk = async (idx: number) => {
    if (!answer) return setShowAlert(true);
    const data = {
      idx: idx,
      answer: answer,
    };
    try {
      const res = await APIAnswerAsk(data);
      console.log(res);
      setShowAnswerModal(true);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const onDeleteAsk = async () => {
    setConfirmModal(false);
    const data = {
      idx: itemIdx,
    };
    try {
      const res = await APIDeleteAsk(data);
      console.log(res);
      setShowModal(true);
      // const newList = askList.filter((item) => item.idx !== itemIdx);
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
    <>
      {total === 0 ? (
        <NoDataBox>
          {/* <Logo src={logoImage} /> */}
          <Text>보관된 1:1 문의가 없습니다.</Text>
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
              {askList.map((item) => (
                <Accordion.Item key={item.idx} className={classes.item} value={String(item.idx)}>
                  <Accordion.Control>
                    <TitleBox>
                      <RowWrap>
                        <ListItemTitle>{item.title}</ListItemTitle>
                        <StatusBox answerd={!!item.answer}>
                          <StatusBoxText>{item.answer ? '답변완료' : '답변대기'}</StatusBoxText>
                        </StatusBox>
                      </RowWrap>
                      <RowWrap last>
                        <RowWrap>
                          <Nickname>{item.user.nickname}</Nickname>
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
                          {item.answer ? (
                            <ContentText>{item.answer}</ContentText>
                          ) : (
                            <AnswerTextArea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="답변을 작성해 주세요." />
                          )}
                        </ContentRowWrap>
                        <ButtonWrap>
                          {!item.answer && (
                            <WhiteButton
                              onClick={() => {
                                onAnswerAsk(item.idx);
                              }}
                            >
                              <WhiteButtonText>답변등록</WhiteButtonText>
                            </WhiteButton>
                          )}
                          <WhiteButton onClick={() => setItemIdx(item.idx)}>
                            <WhiteButtonText>삭제하기</WhiteButtonText>
                          </WhiteButton>
                        </ButtonWrap>
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
        </ListWrap>
      )}
      <ConfirmModal visible={confirmModal} setVisible={setConfirmModal} text="1:1 문의를 삭제하시겠습니까?" onOk={onDeleteAsk} />
      <AlertModal
        visible={showModal}
        setVisible={setShowModal}
        onClick={() => {
          setShowModal(false);
        }}
        text="1:1 문의가 삭제되었습니다."
      />
      <AlertModal
        visible={showAnswerModal}
        setVisible={setShowAnswerModal}
        onClick={() => {
          setShowAnswerModal(false);
          getAskList();
        }}
        text="답변이 등록되었습니다."
      />
      <AlertModal
        visible={showAlert}
        setVisible={setShowAlert}
        onClick={() => {
          setShowAlert(false);
        }}
        text="내용을 입력해 주세요."
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
  font-family:'Pretendard Variable';;
  font-weight: 410;
  color: #121212;
  font-size: 18px;
  margin: 30px 0 50px;
`;

const ListWrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-bottom: 30px;
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
  font-family:'Pretendard Variable';;
  font-weight: 700;
  color: #121212;
  font-size: 17px;
`;

const StatusBox = styled.div<{ answerd: boolean }>`
  width: 78px;
  height: 27px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.answerd ? '#121212' : '#398049')};
`;

const StatusBoxText = styled.span`
  font-family:'Pretendard Variable';;
  font-weight: 410;
  color: #fff;
  font-size: 12px;
`;
const Line = styled.div`
  background-color: #121212;
  width: 1px;
  height: 10px;
  margin: 0 10px;
`;

const Nickname = styled.span`
  font-family:'Pretendard Variable';;
  font-weight: 410;
  color: #121212;
  font-size: 15px;
`;

const Date = styled(Nickname)`
  font-size: 15px;
`;
const QuestionBox = styled.div`
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const AnswerBox = styled(QuestionBox)`
  border-top: 1px solid #e9e9e9;
`;
const IconText = styled.span`
  font-family:'Pretendard Variable';;
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

  font-family:'Pretendard Variable';;
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

const ButtonWrap = styled.div`
  display: flex;
  margin-top: 20px;
  align-self: flex-end;
`;

const WhiteButton = styled.div`
  width: 100px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #121212;
  margin-left: 17px;
  cursor: pointer;
`;
const WhiteButtonText = styled.span`
  font-family:'Pretendard Variable';;
  color: #121212;
  font-size: 14px;
  font-weight: 410;
`;

const AnswerTextArea = styled.textarea`
  font-family:'Pretendard Variable';;
  display: flex;
  flex: 1;
  min-height: 160px;
  border: 1px solid #e9e9e9;
  padding: 15px;
  font-size: 15px;
  font-weight: 410;
  color: #121212;
  vertical-align: top;
  resize: none;
  margin-bottom: 5px;
  outline: 0;
`;

export default StoredAskList;
