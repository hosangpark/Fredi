import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AlertModal from '../../components/Modal/AlertModal';
import { APICompanyInfo, APIModifyCompanyInfo } from '../../api/SettingAPI';

function SettingCompanyInfo() {
  const [companyName, setCompanyName] = useState<string>('');
  const [businessNumber, setBusinessNumber] = useState<string>('');
  const [businessNumber2, setBusinessNumber2] = useState<string>('');
  const [representative, setRepresentative] = useState<string>('');
  const [personalInfoManager, setPersonalInfoManager] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [businessHour, setBusinessHour] = useState<string>('');

  const [showModal, setShowModal] = useState(false);

  const getCompanyInfo = async () => {
    try {
      const res = await APICompanyInfo();
      console.log(res);
      setCompanyName(res.company_name);
      setBusinessNumber(res.business_number);
      setBusinessNumber2(res.business_number2);
      setRepresentative(res.representative);
      setPersonalInfoManager(res.personal_info_manager);
      setAddress(res.address);
      setEmail(res.email);
      setPhone(res.phone);
      setBusinessHour(res.business_hour);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const onModifyCompanyInfo = async () => {
    const data = {
      company_name: companyName,
      business_number: businessNumber,
      business_number2: businessNumber2,
      representative: representative,
      personal_info_manager: personalInfoManager,
      address: address,
      email: email,
      phone: phone,
      business_hour: businessHour,
    };
    try {
      const res = await APIModifyCompanyInfo(data);
      console.log(res);
      setShowModal(true);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  useEffect(() => {
    getCompanyInfo();
  }, []);

  return (
    <>
      <RowWap>
        <LeftText>회사명</LeftText>
        <TextInput value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="회사명 입력" />
      </RowWap>
      <RowWap>
        <LeftText>사업자 등록번호</LeftText>
        <TextInput value={businessNumber} onChange={(e) => setBusinessNumber(e.target.value)} placeholder="사업자 등록번호 입력" />
      </RowWap>
      <RowWap>
        <LeftText>통신판매업 신고번호</LeftText>
        <TextInput value={businessNumber2} onChange={(e) => setBusinessNumber2(e.target.value)} placeholder="통신판매업 신고번호 입력" />
      </RowWap>
      <RowWap>
        <LeftText>대표자</LeftText>
        <TextInput value={representative} onChange={(e) => setRepresentative(e.target.value)} placeholder="대표자 입력" />
      </RowWap>
      <RowWap>
        <LeftText>개인정보책임관리자</LeftText>
        <TextInput value={personalInfoManager} onChange={(e) => setPersonalInfoManager(e.target.value)} placeholder="개인정보책임관리자 입력" />
      </RowWap>
      <RowWap>
        <LeftText>회사주소</LeftText>
        <TextInput value={address} onChange={(e) => setAddress(e.target.value)} placeholder="회사주소 입력" />
      </RowWap>
      <RowWap>
        <LeftText>고객센터 이메일</LeftText>
        <TextInput value={email} onChange={(e) => setEmail(e.target.value)} placeholder="고객센터 이메일 입력" />
      </RowWap>
      <RowWap>
        <LeftText>고객센터 연락처</LeftText>
        <TextInput value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="고객센터 연락처 입력" />
      </RowWap>
      <RowWap>
        <LeftText>고객센터 시간</LeftText>
        <TextInput value={businessHour} onChange={(e) => setBusinessHour(e.target.value)} placeholder="고객센터 시간 입력" />
      </RowWap>
      <BlackButton onClick={onModifyCompanyInfo}>
        <BlackButtonText>등록</BlackButtonText>
      </BlackButton>
      <AlertModal
        visible={showModal}
        setVisible={setShowModal}
        onClick={() => {
          setShowModal(false);
        }}
        text="회사 정보가 수정되었습니다."
      />
    </>
  );
}

const BlackButton = styled.div`
  width: 160px;
  height: 60px;
  background-color: #121212;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: flex-end;
  margin: 30px;
  cursor: pointer;
`;

const BlackButtonText = styled.span`
  color: #ffffff;
  font-size: 16px;
  font-weight: 400;
`;

const RowWap = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #121212;
  height: 80px;
`;

const LeftText = styled.span`
  color: #121212;
  font-size: 16px;
  font-weight: 700;
  width: 300px;
  min-width: 200px;
  border-right: 1px solid #121212;
  display: inline-block;
  height: 100%;
  line-height: 80px;
`;

const TextInput = styled.input`
  min-width: 700px;
  color: #121212;
  font-size: 16px;
  font-weight: 400;
  border: 0;
  height: 100%;
  line-height: 80px;
  padding-left: 20px;
  outline: 0;
  flex: 1;
`;

export default SettingCompanyInfo;
