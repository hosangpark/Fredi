import styled from 'styled-components';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import 'dayjs/locale/ko';
import { useContext, useEffect, useRef, useState } from 'react';
import API from '../../api/default';
import axios from 'axios';
import { APISignInUsingSns } from '../../api/UserAPI';
import { UserContext } from '../../context/user';
import AlertModal from '../../components/Modal/AlertModal';
import LoadingIndicator from '../../components/Product/LoadingIndicator';


const RESTAPI_KEY = 'e02372a61c8e0045150426a18b5dbe1b';
const JAVASCRIPT_KEY = '1abc385bc918f8e46dfb85b5128a89d5';
// const REDIRECT_URI = 'http://localhost:3000/SignUpKaKao';
const REDIRECT_URI = 'https://new.fredi.co.kr/SignUpKaKao';
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${RESTAPI_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
const grantType = "authorization_code";


function SignUpKaKao() {
  const location = useLocation();
  let [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const { patchUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [kakaoId, setKakaoId] = useState<string>("");
  const [alertType, setAlertType] = useState<string>('')
  const [ShowAlertModal, setShowAlertModal] = useState(false);
  const [Loading, setLoading] = useState(true);

  const checkUser = async() => {
    // console.log('0');
    const userAgent = window.navigator.userAgent;
    const code = searchParams.get("code");
    if (userAgent === "APP-android" || userAgent === "APP-ios") {}
    axios.post(
          `https://kauth.kakao.com/oauth/token?grant_type=${grantType}&client_id=${RESTAPI_KEY}&redirect_uri=${REDIRECT_URI}&code=${code}`,
          {},
          { headers: { "Content-type": "application/x-www-form-urlencoded;charset=utf-8" } }
      )
      .then((res: any) => {
          console.log('1번쨰',res);
          const { access_token } = res.data;
          axios.post(
              `https://kapi.kakao.com/v2/user/me`,
              {},
              {
                  headers: {
                      Authorization: `Bearer ${access_token}`,
                      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
                  }
              }
          )
          .then((res: any) => {
              console.log('2번쨰', res);
              setKakaoId(res.data.kakao_account.email);
              onSignInWithKakao(res.data.kakao_account.email)
              setLoading(false)
          })
      })
      .catch((error: any) => {
        console.log('3번쨰',error)
        setLoading(false)
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 409) {
            onSignInWithKakao(error.response.data.id);
          }
        }
    })
  }



  const onSignInWithKakao = async (kakaoId: string) => {
    const uuid = sessionStorage.getItem("_u");
    const data = {
      user_id: kakaoId,
      uuid: uuid,
    };

    try {
      const res = await APISignInUsingSns(data);
      const token = res.token;
      patchUser(res.userInfo.idx, res.userInfo.level);
      sessionStorage.setItem("token", token);
      if(res.message == 'Deleted User'){
        setAlertType(`Account withdrawal and withdrawal processing`)
        setShowAlertModal(true)
      }else{
        navigate("/", { replace: true });
      }
    } catch (error) {
      // setAlertType(`카카오정보 불러오기에 실패하였습니다. 기존 회원가입으로 진행해주세요.`)
      // setShowAlertModal(true)
      setLoading(false)
    }
  };
  
  useEffect(() => {
    checkUser();
  }, []);



  return (
  <>
    {Loading?
      <LoadingIndicator loading={true} setLoading={()=>{}}/>
      :
    <Container>
      <SignUpTitle>
        Sign Up
      </SignUpTitle>
      <TypeContainer>
        <TypeBox onClick={()=>navigate('/SignUp3',{state:{
          level:3,
          type: 2,
          user_id: kakaoId,
          password: 'No Password',
        }})}>
          Customer
        </TypeBox>
        <TypeBox onClick={()=>{navigate('/SignUp3',{state:{
          level:2,
          type: 2,
          user_id: kakaoId,
          password: 'No Password',
        }})}}>
          Artist
        </TypeBox>
        <TypeBox onClick={()=>{navigate('/SignUp3',{state:{
          level:1,
          type: 2,
          user_id: kakaoId,
          password: 'No Password'
        }})}}>
          Brand
        </TypeBox>
      </TypeContainer>
      <AlertModal
        visible={ShowAlertModal}
        setVisible={setShowAlertModal}
        onClick={() => {
          if(
            alertType == `카카오정보 불러오기에 실패하였습니다.`
          ){
            // removeHistory();
            navigate('/signin');
          } else {
            setShowAlertModal(false);
          }
        }}
        text={alertType}
      />
    </Container>
  }
  </>
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

export default SignUpKaKao;
