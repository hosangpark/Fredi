import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function ContactNav({ selected, setSelected }: { selected: number; setSelected: (selected: number) => void }) {
  const navigate = useNavigate();
  return (
    <LeftBox>
        <Title>Contact</Title>

        <MenuBox>
          <MenuButton
            onClick={() => {
              setSelected(1);
              navigate('/asklist');
            }}
          >
            {/* {selected === 1 && <Hyphen>―</Hyphen>} */}
            <MenuButtonText>1:1 Message</MenuButtonText>
          </MenuButton>
          <MenuButton
            onClick={() => {
              setSelected(2);
              navigate('/askinfo');
            }}
          >
            {/* {selected === 2 && <Hyphen>―</Hyphen>} */}
            <MenuButtonText>Selling</MenuButtonText>
          </MenuButton>
          <MenuButton
            onClick={() => {
              setSelected(3);
              navigate('/faqlist');
            }}
          >
            {/* {selected === 3 && <Hyphen>―</Hyphen>} */}
            <MenuButtonText>FAQ</MenuButtonText>
          </MenuButton>
        </MenuBox>
    </LeftBox>
  );
}

const LeftBox = styled.div`
  display: flex;
  min-width: 290px;
  width: 400px;
  flex-direction: column;
  text-align: left;
  border-right: 1px solid #121212;
  @media only screen and (max-width: 1400px) {
    width: 370px;
  }
  @media only screen and (max-width: 1000px) {
    width: 100%;
    border-right: 0;
  }
`;

const SubTitle = styled.h4`
  margin: 0;
  font-weight: 500;
  color: #121212;
  font-size: 18px;
  @media only screen and (max-width: 1000px) {
    margin-left: 18px;
    font-size: 15px;
  }
`;

const MenuBox = styled.div`
  @media only screen and (max-width: 1000px) {
    width: 100%;
  }
`;

const MenuButton = styled.div`
font-family:'Pretendard Variable';
  padding: 5px 0;
  display: flex;
  cursor: pointer;
  line-height: 30px;
  margin-top: 10px;
  @media only screen and (max-width: 1000px) {
    width: 100%;
    /* border-top: 1px solid #121212; */
    align-items: center;
    padding-top: 13px;
    padding-bottom: 13px;
    margin: 0;
  }
`;

const MenuButtonText = styled(SubTitle)`
font-family:'Pretendard Variable';
  font-weight: 500;
  height: 100%;
`;

const Hyphen = styled.span`
  font-size: 12px;
  margin-right: 7px;
  display: inline-block;
  @media only screen and (max-width: 1000px) {
    margin-left: 20px;
    margin-right: -10px;
  }
`;

const LeftTopBox = styled.div`
  width: 100%;
  padding: 50px;
  @media only screen and (max-width: 1000px) {
    padding: 0;
    padding-top: 20px;
  }
`;

const Title = styled.h3`
font-family:'Pretendard Variable';
  font-weight: 700;
  color: #121212;
  font-size: 24px;
  padding:30px;
  border-bottom: 1px solid #8b8b8b;
  @media only screen and (max-width: 1000px) {
    padding:20px;
    font-size: 18px;
  }
`;

const BusinessHourText = styled.p`
  font-weight: 400;
  color: #121212;
  font-size: 16px;
  margin-top: 30px;
  @media only screen and (max-width: 1000px) {
    margin-top: 5px;
    margin-left: 18px;
    font-size: 13px;
  }
`;

const Text = styled.p`
  font-weight: 500;
  color: #121212;
  font-size: 18px;
  margin: 0;
`;

export default ContactNav;
