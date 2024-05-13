import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link as RouterLink } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll'; // react-scroll의 Link 임포트
import Section1 from './components/Section1';
import Section2 from './components/Section2';
import Section3 from './components/Section3';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';
import logo from './img/njlogo.png';
import { Button } from '@mui/material';

const App = () => {
  return (
    <Router>
      <div>
        <nav className="navbar">
          {/* 로고 이미지에 Link 컴포넌트 적용 */}
          <RouterLink to="/">
            <img src={logo} className="App-logo" alt="njlogo" />
          </RouterLink>
          <ul>
            <li>
              <ScrollLink to="section1" spy={true} smooth={true} duration={500} offset={-70}>
                보행자 길찾기
              </ScrollLink>
            </li>
            <li>
              <ScrollLink to="section2" spy={true} smooth={true} duration={500} offset={-70}>
                이용 방법
              </ScrollLink>
            </li>
            <li>
              <ScrollLink to="section3" spy={true} smooth={true} duration={500} offset={-70}>
                njBrella소개
              </ScrollLink>
            </li>
            <li>
              <Button component={RouterLink} to="/login" variant="contained">
                로그인
              </Button>
            </li>
            <li>
              <Button component={RouterLink} to="/signup" variant="contained">
                회원가입
              </Button>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={
            <>
              <div id="section1" style={{ height: '500px' }}><Section1 /></div>
              <div id="section2" style={{ height: '500px' }}><Section2 /></div>
              <div id="section3" style={{ height: '500px' }}><Section3 /></div>
            </>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
