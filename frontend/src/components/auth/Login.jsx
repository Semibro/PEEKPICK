// import axios from 'axios';
import { useEffect } from 'react';

import classes from './style/Login.module.css';

const Login = () => {
  const kakao = () => {
    console.log('kakao')
  };

  const naver = () => {
    console.log('naver')
  };

  const google = () => {
    console.log('google')
  };

  useEffect(() => {
    kakao();
    naver();
    google();
  }, [])
;
  return (
    <div className={classes.container}>
      <div className={classes.buttons}>
        <button onClick={kakao}>카카오 로그인</button>
        <button onClick={naver}>네이버 로그인</button>
        <button onClick={google}>구글 로그인</button>
      </div>
    </div>
  );
}
export default Login;