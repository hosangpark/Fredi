import { ReactNode } from 'react';
import styled from 'styled-components';
import Content from './Content';
import Footer from './Footer';
import Header from './Header';
import ScrollToTop from './ScrollToTop';
import BottomNav from '../Navigation/BottomNav';
import { useLocation } from 'react-router-dom';

interface Props {
  children: ReactNode;
}


function Layout({ children }: Props) {
  const location = useLocation();
  const pathName = location.pathname.split('/')[1];
  // console.log('pathName:',pathName)
  return (
    
    <Container>
      <ScrollToTop>
        <Header />
        <Content>{children}</Content>

        <BottomNav/>
      </ScrollToTop>
    </Container>
  );
}


const EmptyBox = styled.div`
  height:5vh;
`;
const Container = styled.div`
  max-width: 100vw;
  min-width: 100vw;
  position: relative;
`;

export default Layout;
