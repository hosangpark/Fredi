import React, { useState } from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import ContactNav from '../../components/Navigation/ContactNav';

function Contact() {
  const [selected, setSelected] = useState(1);

  return (
    <Container>
      <ContactNav selected={selected} setSelected={setSelected} />
      {/* <RightBox>
        <Outlet />
      </RightBox> */}
      <EmptyBox />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  min-height: calc(100vh - 80px);
  flex-direction: row;
  border-top: 1px solid #121212;
  background-color: #ffffff;
  @media only screen and (max-width: 1000px) {
    flex-direction: column;
    border-top: 0;
  }
`;

const RightBox = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  position: relative;
  @media only screen and (max-width: 1000px) {
    min-width: 300px;
  }
`;

const EmptyBox = styled.div`
  width: 280px;
  display: flex;
  border-left: 1px solid #121212;
  @media only screen and (max-width: 1400px) {
    display: none;
  }
`;

export default Contact;
