import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AlertModal from '../../components/Modal/AlertModal';
import { APIGetTerms, APIModifyTerms } from '../../api/SettingAPI';

function SettingTerms() {
  const [tab, setTab] = useState<1 | 2 | 3>(1);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [termsOfUse, setTermsOfUse] = useState<string>('');
  const [privacyPolicy, setPrivacyPolicy] = useState<string>('');
  const [termsOfWithdrawal, setTermsOfWithdrawal] = useState<string>('');

  const getTerms = async () => {
    const data = {
      type: tab,
    };
    try {
      const res = await APIGetTerms(data);
      if (tab === 1) {
        setTermsOfUse(res);
      } else if (tab === 2) {
        setPrivacyPolicy(res);
      } else {
        setTermsOfWithdrawal(res);
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const onModifyTerms = async () => {
    const data = {
      type: tab,
      text: tab === 1 ? termsOfUse : tab === 2 ? privacyPolicy : termsOfWithdrawal,
    };
    try {
      const res = await APIModifyTerms(data);
      setShowModal(true);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  useEffect(() => {
    getTerms();
  }, [tab]);

  return (
    <>
      <TitleBox>
        <TabButtonWrap>
          <TabButton onClick={() => setTab(1)} selected={tab === 1}>
            <TabButtonText selected={tab === 1}>Terms of Use</TabButtonText>
          </TabButton>
          <TabButton onClick={() => setTab(2)} selected={tab === 2}>
            <TabButtonText selected={tab === 2}>Privacy Policy</TabButtonText>
          </TabButton>
          <TabButton onClick={() => setTab(3)} selected={tab === 3}>
            <TabButtonText selected={tab === 3}>Terms of withdrawal</TabButtonText>
          </TabButton>
        </TabButtonWrap>
      </TitleBox>
      <TabContentBox>
        <TabContentTextArea
          value={tab === 1 ? termsOfUse : tab === 2 ? privacyPolicy : termsOfWithdrawal}
          onChange={(e) =>
            tab === 1 ? setTermsOfUse(e.target.value) : tab === 2 ? setPrivacyPolicy(e.target.value) : setTermsOfWithdrawal(e.target.value)
          }
          placeholder={tab === 1 ? 'Enter Terms of Use' : tab === 2 ? 'Enter Privacy Policy' : 'Enter Terms of withdrawal'}
        />
      </TabContentBox>
      <BlackButton onClick={onModifyTerms}>
        <BlackButtonText>Registration</BlackButtonText>
      </BlackButton>
      <AlertModal
        visible={showModal}
        setVisible={setShowModal}
        onClick={() => {
          setShowModal(false);
        }}
        text={(tab === 1 ? 'Terms of Use' : tab === 2 ? 'Privacy Policy' : 'Terms of withdrawal') + 'have been revised.'}
      />
    </>
  );
}

const TitleBox = styled.div`
  border-bottom: 1px solid #121212;
  height: 74px;
  display: flex;
  align-items: center;
  padding-left: 15px;
`;

const TabButtonWrap = styled.div`
  display: flex;
`;

const TabButton = styled.div<{ selected: boolean }>`
  background-color: ${(props) => (props.selected ? '#121212' : '#fff')};
  border: 1px solid #121212;
  height: 38px;
  padding: 0 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  cursor: pointer;
`;

const TabButtonText = styled.span<{ selected: boolean }>`
  font-weight: 410;
  font-size: 13px;
  line-height: 38px;
  color: ${(props) => (props.selected ? '#fff' : '#121212')};
`;

const TabContentBox = styled.div`
  width: 100%;
  height: 545px;
`;

const TabContentTextArea = styled.textarea`
  border: 0;
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #121212;
  padding: 20px;
  resize: none;
  font-size: 15px;
  font-weight: 410;
  color: #121212;
  outline: 0;
  line-height: 25px;
`;

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
  font-weight: 410;
`;

export default SettingTerms;
