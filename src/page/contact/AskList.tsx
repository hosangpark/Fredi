import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../asset/image/logo.png';
import { Accordion, createStyles, Pagination } from '@mantine/core';
import { APIAskList, APIDeleteAsk } from '../../api/AskAPI';
import dayjs from 'dayjs';
import AlertModal from '../../components/Modal/AlertModal';
import { UserContext } from '../../context/user';
import ConfirmModal from '../../components/Modal/ConfirmModal';
import { removeHistory } from '../../components/Layout/Header';

type TAskListItem = {
  idx: number;
  title: string;
  question: string;
  answer: string | null;
  created_time: Date;
};

function AskList() {
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
  const { user } = useContext(UserContext);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isOpen, setOpen] = useState<string[]>([]);
  const [askList, setAskList] = useState<TAskListItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [showLogin, setShowLogin] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [itemIdx, setItemIdx] = useState<number | undefined>();

  const { classes } = useStyles();

  const getAskList = async () => {
    const data = {
      page: page,
    };
    const { list, total } = await APIAskList(data);
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
      const res = await APIDeleteAsk(data);
      console.log(res);
      setShowModal(true);
      getAskList();
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const handleAsk = () => {
    setTotal(1);
    setAskList([
      {
        idx: 1,
        title: 'title1',
        question: 'question1',
        answer: '답변1',
        created_time: date
      },
      {
        idx: 2,
        title: 'title2',
        question: 'question2',
        answer: null,
        created_time: date
      },
      {
        idx: 3,
        title: 'title3',
        question: 'question3',
        answer: '답변1',
        created_time: date
      },
    ])
  };
  const date = new Date()
  useEffect(() => {
    // getAskList();
    setTotal(total);
    
  }, [page]);


  useEffect(() => {
    if (itemIdx) {
      setConfirmModal(true);
    }
  }, [itemIdx]);

  return (
    <Container>
    <Title>1:1 Message</Title>
      {total === 0 ? (
        <NoDataBox>
          <>
          {/* <Logo src={logoImage} /> */}
          <Text onClick={handleAsk}>문의글이 없습니다.</Text>
          {/* <BlackButtonNoData onClick={handleAsk}>
            <BlackButtonText>문의하기</BlackButtonText>
          </BlackButtonNoData> */}
          </>
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
                      <ListItemTitle>{item.title}</ListItemTitle>
                      <StatusBox answerd={!!item.answer}>
                        <StatusBoxText>{item.answer ? '답변완료' : '답변대기'}</StatusBoxText>
                      </StatusBox>
                    </RowWrap>
                    <RowWrap last>
                      <RowWrap>
                        <OnDate>{dayjs(item.created_time).format('YYYY.MM.DD. HH:mm:ss')}</OnDate>
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
                        <WhiteButton onClick={() => navigate(`/registerask/${item.idx}`)}>
                          <WhiteButtonText>수정하기</WhiteButtonText>
                        </WhiteButton>
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
{/* 
          <BlackButton onClick={handleAsk}>
            <BlackButtonText>문의하기</BlackButtonText>
          </BlackButton> */}
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
        visible={showLogin}
        setVisible={setShowLogin}
        onClick={() => {
          removeHistory();
          setShowLogin(false);
          navigate('/signin');
        }}
        text="회원가입 후 이용 가능합니다."
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  width:100%;
`
const Title = styled.h3`
font-family:'Pretendard Variable';
  font-weight: 500;
  color: #121212;
  padding:30px;
  border-bottom: 1px solid #e4e4e4;
  @media only screen and (max-width: 1000px) {
    padding:20px;
    font-size: 14px;
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
font-family:'Pretendard Variable';
  font-weight: 500;
  color: #121212;
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
  font-family:'Pretendard Variable';

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
  font-family:'Pretendard Variable';
  font-weight: 400;
  color: #fff;
  font-size: 12px;
  @media only screen and (max-width: 1000px) {
    font-size: 10px;
  }
`;
const Nickname = styled.span`
  font-family:'Pretendard Variable';

  font-weight: 400;
  color: #121212;
  font-size: 16px;
  @media only screen and (max-width: 1000px) {
    font-size: 12px;
  }
`;
const OnDate = styled(Nickname)`
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
  font-family:'Pretendard Variable';
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
  font-family:'Pretendard Variable';
  font-weight: 400;
  color: #121212;
  font-size: 16px;
  text-align: left;
  margin:5px 0;
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
  text-align:center;
  border: 1px solid #121212;
  margin-left: 17px;
  cursor: pointer;
  @media only screen and (max-width: 1000px) {
    width: 80px;
    height: 35px;
    margin-left: 10px;
  }
`;
const WhiteButtonText = styled.span`
  font-family:'Pretendard Variable';
  text-align:center;
  color: #121212;
  font-size: 14px;
  line-height: 40px;
  font-weight: 400;
  @media only screen and (max-width: 1000px) {
    font-size: 12px;
    line-height: 35px;
  }
`;

const NoDataBox = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export default AskList;
