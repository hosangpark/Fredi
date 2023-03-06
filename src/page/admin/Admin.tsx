import React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import AdminNav from '../../components/Navigation/AdminNav';

function Admin() {
  return (
    <Container>
      <AdminNav />
      <RightBox>
        <Outlet />
      </RightBox>
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
`;

const RightBox = styled.div`
  display: flex;
  min-width: 734px;
  flex: 1;
  flex-direction: column;
`;

const EmptyBox = styled.div`
  width: 280px;
  display: flex;
  border-left: 1px solid #121212;
`;

export default Admin;
