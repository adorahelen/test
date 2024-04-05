import React, { useState } from 'react';
import { Link, Element } from 'react-scroll';
import Section1 from './components/Section1';
import Section2 from './components/Section2';
import Section3 from './components/Section3';
import './App.css';
// eslint-disable-next-line no-unused-vars
import logo from './img/njlogo.png'; // 로고 경로 확인 필요

const App = () => {
  const [activeSection, setActiveSection] = useState('');

  return (
    <div>
      <nav className="navbar">
        <img src={logo} className="App-logo" alt="njlogo" />
        <ul>
          <li>
            <Link activeClass="active" to="section1" spy={true} smooth={true} offset={-70} duration={500} onSetActive={() => setActiveSection('section1')}>
              njBrella소개
            </Link>
          </li>
          <li>
            <Link activeClass="active" to="section2" spy={true} smooth={true} offset={-70} duration={500} onSetActive={() => setActiveSection('section2')}>
              이용 방법
            </Link>
          </li>
          <li>
            <Link activeClass="active" to="section3" spy={true} smooth={true} offset={-70} duration={500} onSetActive={() => setActiveSection('section3')}>
              보행자 길찾기
            </Link>
          </li>
        </ul>
      </nav>
      {/* 각 Section 컴포넌트를 Element로 감싸주어야 합니다. */}
      <Element name="section1">
        <Section1 />
      </Element>
      <Element name="section2">
        <Section2 />
      </Element>
      <Element name="section3">
        <Section3 />
      </Element>
    </div>
  );
};

export default App;
