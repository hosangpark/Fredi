import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { APIGetTerms } from '../../api/SettingAPI';

// 스토어에 앱 등록 시 개인정보 처리방침 링크 추가를 위한 페이지(아무데도 안 씀)
function Privacy() {
  const [privacyPolicy, setPrivacyPolicy] = useState<string>('');

  const getTerms = async () => {
    const data = {
      type: 2,
    };
    try {
      const resData = await APIGetTerms(data);
      setPrivacyPolicy(resData);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  useEffect(() => {
    getTerms();
  }, []);

  return (
    <Container>
      <Title>개인정보처리방침</Title>
      <p>{privacyPolicy}</p>
    </Container>
  );
}

const Container = styled.div`
  padding: 30px 50px;
  min-height: calc(100vh - 80px);
  border-top: 1px solid #121212;
  text-align: left;
`;

const Title = styled.h1`
  font-weight: 700;
  font-size: 30px;
  color: #121212;
  margin-bottom: 30px;
`;

export default Privacy;
