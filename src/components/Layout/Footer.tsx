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
          {/* <InstaBox>
            <InstaButton href={companyInfo?.instagram} target="_blank">
              <InstaButtonImage src={instaImage} />
            </InstaButton>
            <TextButton onClick={() => navigate('/contact/askinfo')}>입점문의</TextButton>
          </InstaBox> */}
          <TextBox>
            <FooterText>대표 {companyInfo?.representative}</FooterText>
            <FooterText>대표전화 {companyInfo?.phone}</FooterText>
            <FooterText>{companyInfo?.address}</FooterText>
          </TextBox>
          <TextBox>
            <FooterText>사업자등록번호 {companyInfo?.business_number}</FooterText>
            <FooterText>통신판매업신고 {companyInfo?.business_number2}</FooterText>
          </TextBox>
            {/* <FooterText Bold={true}>@copyright. FREDI</FooterText> */}
        </FooterTopBox>
        <TermsBox>
          <FooterText>
            이용약관
          </FooterText>
          <FooterText>
            개인정보처리방침
          </FooterText>
          <FooterText>
            FAQ
          </FooterText>
        </TermsBox>
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
  /* background-color: #2e2e2e; */
  /* border-top: 1px solid #121212; */
  padding: 100px 50px 95px;
  @media only screen and (max-width: 1440px) {
    padding: 25px 20px;
  }
  @media only screen and (max-width: 768px) {
    display:none;
  }
`;

const FooterBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  color:white;
  /* min-width: 768px; */
  padding-bottom:37px;
  @media only screen and (max-width: 768px) {
     padding-bottom:0px;
  }
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
  border-bottom: 0;
  padding-bottom: 20px;
  @media only screen and (max-width: 768px) {
    border-bottom: 1px solid #8b8b8b;
  }
`;

const TextBox = styled.div`
  display: flex;
  margin-bottom: 7px;
  flex-wrap: wrap;
  /* justify-content:center; */
`;

const FooterText = styled.span<{Bold?:boolean}>`
font-family:'Pretendard Variable';
  font-size: 15px;
  color: #121212;
  /* color:white; */
  font-weight: ${(props)=>props.Bold? 'bold':400};
  margin-right: 10px;
  @media only screen and (max-width: 768px) {
    font-size: 13px;
  }
  @media only screen and (max-width: 450px) {
    font-size: 11px;
  }
`;

const InstaBox = styled.div`
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
  color:white;
  @media only screen and (max-width: 768px) {
    font-size: 10px;
  }
`;

const InstaButton = styled.a`
  display: inline-block;
  width: 18px;
  height: 18px;
  margin-right: 20px;
  @media only screen and (max-width: 768px) {
    width: 15px;
    height: 15px;
    margin-right: 5px;
  }
`;

const InstaButtonImage = styled.img`
  width: 100%;
  height: 100%;
  vertical-align: top;
`;
const TermsBox = styled.div`
display:none;
  width:100%;
  padding:5% 10% 10% 10%;
  gap:10px;
  /* display:flex; */
  justify-content:center;
  align-items:center;
  @media only screen and (max-width:768){
    display:block;
  }
`;

export default memo(Footer);
