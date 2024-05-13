import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@mui/material';

const Dashboard = () => {
  const history = useHistory();

  const handleLogout = () => {
    // 로그아웃 버튼을 누르면 로그인 페이지로 이동합니다.
    history.push('/login');
  };

  return (
    <div>
      <h1>Welcome to Your Dashboard</h1>
      <p>Hello, [사용자 이름]!</p>
      <Button variant="contained" onClick={handleLogout}>로그아웃</Button>
    </div>
  );
};

export default Dashboard;
