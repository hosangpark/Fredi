import { ReactNode } from 'react';
import styled from 'styled-components';
import Content from './Content';
import Footer from './Footer';
import Header from './Header';
import ScrollToTop from './ScrollToTop';
import BottomNav from '../Navigation/BottomNav';

interface Props {
  children: ReactNode;
}

function Layout({ children }: Props) {
  return (
    <Container>
      <ScrollToTop>
        <Header />
        <Content>{children}</Content>
        <Footer />
        <BottomNav />
      </ScrollToTop>
    </Container>
  );
}

const Container = styled.div`
  max-width: 100vw;
  min-width: 100vw;
  position: relative;
`;

export default Layout;
