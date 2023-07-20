import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import 'dayjs/locale/ko';

function SignUp1() {
  const navigate = useNavigate();

  return (
    <Container>
      <SignUpTitle>
        Sign Up
      </SignUpTitle>
      <TypeContainer>
        <TypeBox onClick={()=>navigate('/SignUp2',{state:{type:1}})}>
          Customer
        </TypeBox>
        <TypeBox onClick={()=>{navigate('/SignUp2',{state:{type:2}})}}>
          Artist
        </TypeBox>
        <TypeBox onClick={()=>{navigate('/SignUp2',{state:{type:3}})}}>
          Brand
        </TypeBox>
      </TypeContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction:column;
  flex: 1;
  max-width:728px;
  margin:0 auto;
  min-height: calc(100vh - 80px);
  text-align: left;
  @media only screen and (max-width: 768px) {
    margin:40px 20px 0;
  }
`;

const TypeBox = styled.div`
font-family:'Pretendard Variable';
  width:100%;
  border:1px solid black;
  border-radius:40px;
  display:flex;
  justify-content:center;
  align-items:center;
  cursor: pointer;
  font-weight:410;
  padding:23px 0;
  margin: 0 0 60px;
  font-size: 17px;
  &:hover {
    background-color:#222222;
    color:white;
  }
  
  @media only screen and (max-width: 768px) {
    font-size: 15px;
    padding:18px 0;
    margin: 0 0 40px;
  }
  
`;

const SignUpTitle = styled.h1`
font-family:'Pretendard Variable';
  font-weight: 510;
  font-size: 26px;
  color: #121212;
  text-align: left;
  margin-bottom: 100px;
  @media only screen and (max-width: 768px) {
    font-size: 24px;
  }
`;

const TypeContainer = styled.div`
  margin-top:50px;
`;

export default SignUp1;
