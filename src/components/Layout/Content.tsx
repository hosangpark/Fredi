import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
}

function Content({ children }: Props) {
  return <ContentWrap>{children}</ContentWrap>;
}

const ContentWrap = styled.div`
  width: 100%;
  display: flex;
  min-height: calc(100vh - 80px);
  background-color: #ffffff;
  padding-top: 80px;
  @media only screen and (max-width: 768px) {
    padding-top: 50px;
    padding-bottom: 20px;
  }
`;

export default Content;
