import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { APIAskDetails, APIModifyAsk, APIRegisterAsk } from '../../api/AskAPI';
import AlertModal from '../../components/Modal/AlertModal';
import { UserContext } from '../../context/user';
import axios from 'axios';
import { AskTitleList } from '../../components/List/List';
import ButtonContainer from '../../components/Layout/ButtonBox';




function RegisterAsk() {
  const { idx } = useParams();
  console.log('idxxxxxxxxxxxxxxxxxxxxxxxxxxx',idx);
  const navigate = useNavigate();
  const [titlechecked, setTitleChecked] = useState(0);
  const [title, setTitle] = useState<string>('About Product');
  const [content, setContent] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const { patchUser } = useContext(UserContext);

  const getAskDetails = async () => {
    const data = {
      idx: idx,
    };
    try {
      const res = await APIAskDetails(data);
      console.log(res);
      setTitle(res.title);
      setContent(res.question);
      setTitleChecked(res.ask_type)
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const onRegisterAsk = async () => {
    console.log(title)
    console.log(content)
    if (!title) return setShowTitleModal(true);
    if (!content) return setShowContentModal(true);
    const data = {
      title: title,
      question: content,
      ask_type: titlechecked
    };
    try {
      const res = await APIRegisterAsk(data);
      console.log(res);
      setShowModal(true);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const onModifyAsk = async () => {
    if (!title) return setShowTitleModal(true);
    if (!content) return setShowContentModal(true);
    const data = {
      idx: idx,
      title: title,
      question: content,
      ask_type: titlechecked
    };
    try {
      const res = await APIModifyAsk(data);
      console.log(res);
      setShowModal(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          sessionStorage.clear();
          patchUser(0, 3);
          window.location.replace('/');
          console.log(error);
          alert(error);
        }
      }
    }
  };

  useEffect(() => {
    if (idx) {
      console.log('수정');
      getAskDetails();
    } else {
      console.log('등록');
    }
  }, []);

  return (
    <Container>
      <Title>1:1 Message</Title>
      <CheckMessagebox>
        <MessageInform>
          What information are you looking for?
        </MessageInform>
        <CheckBoxContainer>
          {AskTitleList.map((item,index)=>{
            return(
            <CheckboxItems onClick={()=>{setTitleChecked(index);setTitle(item.value)}}>
              <Check>
                {titlechecked == index &&
                <CheckImage src={require('../../asset/image/check_on2.png')}/>
                }
              </Check>
              <CheckBoxText>{item.value}</CheckBoxText>
            </CheckboxItems>
            )
          })
          }
        </CheckBoxContainer>
      </CheckMessagebox>
      <CheckMessagebox>
        <MessageInform style={{marginTop:40,marginBottom:30}}>
          ADD MESSAGE
        </MessageInform>
        <ContentTextArea
          value={content}
          minLength={15}
          maxLength={500}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Please write in Korea or English\n한국어 또는 영어로 작성해주세요.`}/>
      </CheckMessagebox>

      {/* <InputRowWrap>
        <LeftText>제목</LeftText>
        <TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력해 주세요." />
      </InputRowWrap>
      <ContentInputRowWrap>
        <LeftText>내용</LeftText>
        <ContentTextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="비방글, 욕설 등 부적절한 내용이 포함된 글은 임의로 삭제될 수 있습니다."
        />
      </ContentInputRowWrap> */}
    
    <ButtonContainer
      idx={idx}
      text1={'Send'}
      text2={'Cancel'}
      onClick1={onModifyAsk}
      onClick2={onRegisterAsk}
      cancle={()=>navigate(-1)}
      marginT={50}
      marginB={100}
    />
      
    <AlertModal
      visible={showModal}
      setVisible={setShowModal}
      onClick={() => {
        setShowModal(false);
        navigate(-1);
      }}
      text={'1:1 문의가 등록되었습니다.'}
    />
    <AlertModal
      visible={showTitleModal}
      setVisible={setShowTitleModal}
      onClick={() => {
        setShowTitleModal(false);
      }}
      text="제목을 입력해 주세요."
    />
    <AlertModal
      visible={showContentModal}
      setVisible={setShowContentModal}
      onClick={() => {
        setShowContentModal(false);
      }}
      text="내용을 입력해 주세요."
    />
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
  @media only screen and (max-width: 1000px) {
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
  @media only screen and (max-width: 1000px) {
  padding-bottom:40px;
    font-size: 14px;
  }
`;
const CheckBoxContainer = styled.div`
  padding:10px 5px;
  display:flex;
  flex-direction:column;

`
const CheckBoxText = styled.span`
  font-family:'Pretendard Variable';
  margin: 0px 20px;
  font-weight: 310;
  font-size: 14px;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`;
const CheckboxItems = styled.div`
  display:flex;
  align-items:center;
  padding:10px 15px;
`
const Check = styled.div`
  width:20px;
  height:20px;
  border:1px solid #707070;
  display:flex;
  align-items:center;

  cursor: pointer;
`
const CheckImage = styled.img`
  width:100%;
  height:100%;
`

const InputRowWrap = styled.div`
  display: flex;
  border-bottom: 1px solid #121212;
  height: 80px;
  @media only screen and (max-width: 1000px) {
    height: 50px;
  }
`;

const ButtonWrap = styled.div`
  display: flex;
  gap:10px;
  width:100%;
  margin:37px auto;
  min-height:55px;
  
  @media only screen and (max-width: 1000px) {
    min-height:45px;
  }
`;

const BlackButton = styled.div`
  background-color: #131313;
  border: 1px solid #131313;
  cursor: pointer;
  border-radius:5px;
  flex:1;
  display:flex;
  justify-content:center;
  align-items:center;
  @media only screen and (max-width: 768px) {
  }
`;
const BlackButtonText = styled.span`
font-family:'Pretendard Variable';
  color: #ffffff;
  font-size: 14px;
  font-weight: 410;
  cursor: pointer;
  @media only screen and (max-width: 1000px) {
    font-size: 12px;
  }
`;

const WhiteButton = styled(BlackButton)`
  background-color: #ffffff;
  flex:1;
`;

const WhiteButtonText = styled(BlackButtonText)`
  color: #121212;
`;

const CheckMessagebox = styled.div`
  width:768px;
  margin:0 auto;
  padding:0 20px 50px;
  @media only screen and (max-width: 768px) {
    width:100%;
  }

`
const MessageInform = styled.div`
  font-family:'Pretendard Variable';
  font-weight: 410;
  margin:20px 0 10px 0;
  @media only screen and (max-width:768){
    font-size:14px;
  }
`


const ContentTextArea = styled.textarea`
font-family:'Pretendard Variable';
font-weight: 310;
  line-height:24px;
  border: 1px solid #e4e4e4;
  padding: 22px;
  width:100%;
  height:200px;
  font-size: 16px;
  color: #121212;
  vertical-align: top;
  resize: none;
  outline: 0;
  ::placeholder{
    color:#AAAAAA;
  }
  @media only screen and (max-width: 1000px) {
    font-size: 14px;

    line-height: 22px;
  }
`;

export default RegisterAsk;
