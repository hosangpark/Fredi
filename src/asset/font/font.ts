import { createGlobalStyle } from 'styled-components';
import NotoSansBlack from './NotoSans/NotoSansKR-Black.woff2';
import NotoSansBold from './NotoSans/NotoSansKR-Bold.woff2';
import NotoSansLight from './NotoSans/NotoSansKR-Light.woff2';
import NotoSansMedium from './NotoSans/NotoSansKR-Medium.woff2';
import NotoSansRegular from './NotoSans/NotoSansKR-Regular.woff2';
import NotoSansThin from './NotoSans/NotoSansKR-Thin.woff2';

const GlobalFonts = createGlobalStyle`
 
@font-face {
	font-family:'Pretendard Variable';;
	font-weight: 900;
	font-display: swap;
	src: local('NotoSans Black'), url(${NotoSansBlack}) format('woff2');
}

@font-face {
	font-family:'Pretendard Variable';;
	font-weight: 700;
	font-display: swap;
	src: local('NotoSans Bold'), url(${NotoSansBold}) format('woff2');
}

@font-face {
	font-family:'Pretendard Variable';;
	font-weight: 500;
	font-display: swap;
	src: local('NotoSans Medium'), url(${NotoSansMedium}) format('woff2');
}

@font-face {
	font-family:'Pretendard Variable';;
	font-weight: 410;
	font-display: swap;
	src: local('NotoSans Regular'), url(${NotoSansRegular}) format('woff2');
}

@font-face {
	font-family:'Pretendard Variable';;
	font-weight: 310;
	font-display: swap;
	src: local('NotoSans Light'), url(${NotoSansLight}) format('woff2');
}

@font-face {
	font-family:'Pretendard Variable';;
	font-weight: 100;
	font-display: swap;
	src: local('NotoSans Thin'), url(${NotoSansThin}) format('woff2');
}

`;

export default GlobalFonts;
