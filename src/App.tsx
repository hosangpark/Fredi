import React, { useEffect, useState } from 'react';
import './App.css';
import { MantineProvider } from '@mantine/core';
import { v4 as uuidv4 } from 'uuid';
import GlobalFonts from './asset/font/font';
import "./asset/font/variable/pretendardvariable-dynamic-subset.css";
import "./asset/font/variable/PretendardVariable-VF.css";
import "./asset/font/variable/pretendardvariable.css";
import Router from './Router';
import API from './api/default';
import { UserProvider } from './context/user';
import { useLayoutEffect } from 'react';
import { removeHistory } from './components/Layout/Header';
import axios from 'axios'

function App() {
  const [ip, setIP] = useState('');

  const check = async (uuid: string) => {
    console.log(uuid);
    getData().then((res) => {
      console.log('ip => ', res);
      const result = API.get('/setting/count', { params: { uuid, res } });
      console.log('result', result);
    });
  };

  const getData = async () => {
    const res = await axios.get('https://geolocation-db.com/json/')
    console.log('res.data', res.data);
    setIP(res.data.IPv4);
    return res.data.IPv4;
  }

  useLayoutEffect(() => {
    // console.log('getData()', getData().then((res) => console.log(res)));

    const uuid = sessionStorage.getItem('_u');
    if (!uuid) {
      const uuid = uuidv4();
      sessionStorage.setItem('_u', uuid);
      check(uuid);
    }
    const global = globalThis;
    if (global.history.scrollRestoration) {
      global.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    const jquery = document.createElement('script');
    jquery.src = 'https://code.jquery.com/jquery-1.12.4.min.js';
    const iamport = document.createElement('script');
    iamport.src = 'https://cdn.iamport.kr/js/iamport.payment-1.2.0.js';
    document.head.appendChild(jquery);
    document.head.appendChild(iamport);

    return () => removeHistory();
  }, []);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <UserProvider>
        <div className="App">
          <GlobalFonts />
          <Router />
        </div>
      </UserProvider>
    </MantineProvider>
  );
}

export default App;
