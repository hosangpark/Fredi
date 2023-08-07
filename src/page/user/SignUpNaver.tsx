import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import 'dayjs/locale/ko';
import { useContext, useEffect, useState } from 'react';
import API from '../../api/default';
import axios from 'axios';
import { APISignInUsingSns } from '../../api/UserAPI';
import { UserContext } from '../../context/user';
import LoadingIndicator from '../../components/Product/LoadingIndicator';

function Naver() {
  const location = useLocation();
  const { patchUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [naverId, setNaverId] = useState<string>('');
  const [Loading, setLoading] = useState<boolean>(true)


  const checkUser = async () => {
    try {
      const access_token = location.hash.split('=')[1].split('&')[0];
      console.log(access_token);
      const res = await API.get('/user/auth-naver', { params: { access_token } });
      console.log('authNaver', res);
      setNaverId(res.data.id);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          onSignInWithNaver(error.response.data.id);
        }
      }
    }
  };
  
  
  const onSignInWithNaver = async (naverId: string) => {
    if (!naverId) return alert('No naverId');
    const uuid = sessionStorage.getItem('_u');
    const data = {
      user_id: naverId,
      uuid,
    };
    try {
      const res = await APISignInUsingSns(data);
      console.log(res);
      const token = res.token;
      patchUser(res.userInfo.idx, res.userInfo.level);
      sessionStorage.setItem('token', token);
      navigate('/', { replace: true });
    } catch (error) {
      setLoading(false)
      console.log(error);
      alert('falid Login');
    }
  };
  
  useEffect(() => {
    setLoading(true)
    checkUser();
  }, []);

  return (
    <Container>
      { !naverId?
      <LoadingIndicator loading={true} setLoading={()=>{}}/>
      :
      <>
      <SignUpTitle>
        Sign Up
      </SignUpTitle>
      <TypeContainer>
        <TypeBox onClick={()=>navigate('/SignUp3',{state:{
          level:3,
          type: 3,
          user_id: naverId,
          password: 'No Password',
        }})}>
          Customer
        </TypeBox>
        <TypeBox onClick={()=>{navigate('/SignUp3',{state:{
          level:2,
          type: 3,
          user_id: naverId,
          password: 'No Password',
        }})}}>
          Artist
        </TypeBox>
        <TypeBox onClick={()=>{navigate('/SignUp3',{state:{
          level:1,
          type: 3,
          user_id: naverId,
          password: 'No Password'
        }})}}>
          Brand
        </TypeBox>
      </TypeContainer>
      </>
      }
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

export default Naver;
