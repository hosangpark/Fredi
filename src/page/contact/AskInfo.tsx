import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import logoImage from '../../asset/image/logo.png';
import { APICompanyInfo } from '../../api/SettingAPI';
import { TCompanyInfo } from '../../components/Layout/Footer';

function AskInfo() {
  const [companyInfo, setCompanyInfo] = useState<TCompanyInfo>();

  const getCompanyInfo = async () => {
    const data = await APICompanyInfo();
    console.log('companyInfo', data);
    setCompanyInfo(data);
  };

  useEffect(() => {
    getCompanyInfo();
  }, []);

  return (
    <Container>
      {/* <Logo src={logoImage} /> */}
      <Text>입점을 원하시는 자료를 첨부하여</Text>
      <Text>(이미지 5장 이상, 간단한 소개글 포함)</Text>
      <EmailText>{companyInfo?.email}</EmailText>
      <Text>으로 문의 바랍니다.</Text>
      <BlackButton href={companyInfo?.kakao_channel} target="_blank">
        <BlackButtonText>카카오톡 문의하기</BlackButtonText>
      </BlackButton>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img`
  width: 150px;
  height: 38px;
  margin-bottom: 30px;
  @media only screen and (max-width: 1000px) {
    width: 120px;
    height: 30px;
  }
  @media only screen and (max-width: 400px) {
    margin-top: 30px;
  }
`;

const Text = styled.p`
  font-weight: 500;
  color: #121212;
  font-size: 18px;
  margin: 0;
  @media only screen and (max-width: 1000px) {
    font-size: 14px;
  }
`;

const EmailText = styled(Text)`
  color: #398049;
`;

const BlackButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  width: 350px;
  height: 60px;
  background-color: #121212;
  margin-top: 57px;
  @media only screen and (max-width: 1000px) {
    width: 280px;
  }
  @media only screen and (max-width: 400px) {
    margin-bottom: 30px;
  }
`;
const BlackButtonText = styled.span`
  color: #ffffff;
  font-weight: 500;
  font-size: 18px;
  @media only screen and (max-width: 1000px) {
    font-size: 14px;
  }
`;

export default AskInfo;
