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
  width: 100%;
  flex-direction: column;
  text-align: left;
  padding:30px;
  @media only screen and (max-width: 1000px) {
    width: 100%;
    padding:20px;
    border-right: 0;
  }
`;

const SubTitle = styled.h4`
  margin: 0;
  font-weight: 500;
  color: #121212;
  font-size: 18px;

  @media only screen and (max-width: 1000px) {

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
  padding: 20px 0;
  display: flex;
  cursor: pointer;
  line-height: 30px;
  margin-top: 10px;
  @media only screen and (max-width: 1000px) {
    width: 100%;
    /* border-top: 1px solid #121212; */
    align-items: center;
    padding:20px 0;
    margin: 0;
  }
`;

const MenuButtonText = styled(SubTitle)`
font-family:'Pretendard Variable';
  font-weight: 360;
  height: 100%;
  font-size: 16px;
  @media only screen and (max-width: 1000px) {
    font-size: 14px;
  }
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
  font-weight: 360;
  color: #121212;
  font-size: 16px;
  border-bottom: 1px solid  #ECECEC;
  @media only screen and (max-width: 1000px) {
  padding-bottom:40px;
    font-size: 14px;
  }
`;

const BusinessHourText = styled.p`
  font-weight: 410;
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
