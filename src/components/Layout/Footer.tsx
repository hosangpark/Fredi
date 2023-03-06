import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../asset/image/logo.png';
import instaImage from '../../asset/image/instagram.png';
import { APICompanyInfo } from '../../api/SettingAPI';

export type TCompanyInfo = {
  representative: string;
  phone: string;
  address: string;
  business_number: string;
  business_number2: string;
  instagram: string;
  email: string;
  kakao_channel: string;
};

function Footer() {
  const navigate = useNavigate();
  const [companyInfo, setCompanyInfo] = useState<TCompanyInfo>();

  const getCompanyInfo = async () => {
    const data = await APICompanyInfo();
    // console.log('companyInfo', data);
    setCompanyInfo(data);
  };

  useEffect(() => {
    getCompanyInfo();
  }, []);

  return (
    <FooterWrap>
      <FooterBox>
        <FooterTopBox>
          <Logo src={logoImage} />
          <TextBox>
            <FooterText>대표 {companyInfo?.representative}</FooterText>
            <FooterText>대표전화 {companyInfo?.phone}</FooterText>
            <FooterText>{companyInfo?.address}</FooterText>
          </TextBox>
          <TextBox>
            <FooterText>사업자등록번호 {companyInfo?.business_number}</FooterText>
            <FooterText>통신판매업신고 {companyInfo?.business_number2}</FooterText>
          </TextBox>
        </FooterTopBox>
        <FooterBottomBox>
          <TextButton onClick={() => navigate('/contact/askinfo')}>입점문의</TextButton>
          <InstaButton href={companyInfo?.instagram} target="_blank">
            <InstaButtonImage src={instaImage} />
          </InstaButton>
        </FooterBottomBox>
      </FooterBox>
    </FooterWrap>
  );
}

const FooterWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  border-top: 1px solid #121212;
  padding: 45px 50px 0;
  @media only screen and (max-width: 768px) {
    padding: 25px 18px 0;
    margin-bottom: 60px;
  }
`;

const FooterBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  /* min-width: 768px; */
`;

const Logo = styled.img`
  width: 80px;
  margin-bottom: 30px;
  @media only screen and (max-width: 768px) {
    width: 65px;
    margin-bottom: 20px;
  }
`;

const FooterTopBox = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  border-bottom: 1px solid #e9e9e9;
  padding-bottom: 5px;
`;

const TextBox = styled.div`
  display: flex;
  margin-bottom: 3px;
  flex-wrap: wrap;
`;

const FooterText = styled.span`
  font-size: 12px;
  color: #121212;
  font-weight: 400;
  margin-right: 10px;
  @media only screen and (max-width: 768px) {
    font-size: 10px;
  }
`;

const FooterBottomBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  padding: 20px 0;
  @media only screen and (max-width: 768px) {
    padding: 10px 0 20px;
  }
`;

const TextButton = styled.a`
  font-size: 12px;
  color: #121212;
  font-weight: 500;
  cursor: pointer;
  @media only screen and (max-width: 768px) {
    font-size: 10px;
  }
`;

const InstaButton = styled.a`
  display: inline-block;
  width: 18px;
  height: 18px;
  margin-left: 20px;
  @media only screen and (max-width: 768px) {
    width: 15px;
    height: 15px;
    margin-left: 5px;
  }
`;

const InstaButtonImage = styled.img`
  width: 100%;
  height: 100%;
  vertical-align: top;
`;

export default memo(Footer);
