# 📖 FREDI - Front(사용자 웹&앱)

- 사용자 웹(pc / mobile)
- 사용자 앱(android / ios)

## ⚙️ 개발 환경

- TypeScript, React(웹), React Native(앱)
- Styled-Component, Mantine(웹)

## 🗄웹 구조

- Router.tsx - 구성 메뉴를 정의한 파일(라우팅되는 페이지들에 주석 달아 놓았습니다.)

- src > api - API 통신 함수가 담겨있는 폴더

- src > asset - 이미지, 폰트 파일이 담겨있는 폴더

- src > components - 컴포넌트들이 선언되어있는 폴더

- src > context - 유저 정보를 보관하는 전역 스토어가 담긴 폴더

- src > page - 라우팅되는 페이지가 담겨있는 폴더

- src > types - 전역 타입이 선언된 폴더

- src > util - 필요한 함수나 변수를 선언해둔 폴더

## 🛠️ 웹 수정사항 반영하기

1. 프로젝트 빌드하기
2. fileZila로 서버 접속하여 home/ubuntu/www 경로에 빌드한 파일 업로드 (서버 접속 정보는 백엔드 안내 문서 참고)

## 🛠️ 앱 수정사항 반영하기

- android, ios 각각 빌드하여 각 스토어에 업데이트된 앱 심사 요청하기
  - alias: fredi
  - password: dmonster1234
  - 키파일: android 폴더 내 fredi

## 📝 유의사항

- 애플 심사기간 동안은 로그인 화면에 있는 SNS로그인 버튼을 숨겨야 하며, 심사가 통과되면 다시 보이도록 처리해야 합니다.
- 세션스토리지로 상품 상세 페이지 갔다가 뒤로가기 시 목록을 복원하는 로직이 포함되어 있습니다.
- 결제 시 pc웹, 모바일웹(m_redirect_url로 이동하여 모바일 전용 결제 api 사용), 앱(RN 아임포트 사용) 모두 다른 로직으로 돌아갑니다.
- 로그인하는 계정에따라 노출되는 메뉴가 다릅니다. (MANAGER - 관리자에게만 노출됨 / Producing - 관리자, 입점업체회원에게만 노출됨)
- shop 관련 관리자페이지는 별개로 존재하며, shop 관련되지 않은 부분들은 이 프로젝트 안에 존재합니다(admin 로그인 시 MANAGER 메뉴 노출).
- 관리자 계정: admin / 1234
