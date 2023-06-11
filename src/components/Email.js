import React, { useState } from 'react';
import "../Email.css"
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import unihat from '../images/uni_hat.png'

const LoginWithEmail = (props) => {
  const [email, setEmail] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const actionCodeSettings = {
    url: 'https://ratemyuni.co.nz/',
    handleCodeInApp: true,
  };
  const auth = getAuth();
  const handleButtonClick = () => {
    sendSignInLinkToEmail(auth, email, actionCodeSettings)
    .then(() => {
        window.localStorage.setItem('emailForSignIn', email);
        console.log("signed in ")
    })
    .catch((error) => {
        console.log(error)
    });
    window.alert("Email Sent to: " + email)
    props.triggerEvent();
  };

  return (
    <div id='emailContainer'>
      <div className='header'>
        <h1 className="title">Rate My Uni <span><img id="unihat" src={unihat}></img></span></h1>
      </div>
      <div className='main'>
        <h2 id='emailTitel'>Login With Email</h2>
        <input id='emailInput'
            type="text"
            placeholder="example@example.com"
            value={email}
            onChange={handleChange}
        /><div></div>
        <button id='emailButton' onClick={handleButtonClick}>Get Login Link</button>
      </div>
    </div>
  );
};
export default LoginWithEmail;