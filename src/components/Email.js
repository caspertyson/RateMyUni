import React, { useState } from 'react';
import "../Email.css"
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";

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
      <h2 id='emailh2'>Login Using Email</h2>
      <div className='main'>
        <input id='emailInput'
            type="text"
            placeholder="example@example.com"
            value={email}
            onChange={handleChange}
        /><div></div>
        <button id='emailButton' onClick={handleButtonClick}>Get login link</button>
      </div>
    </div>
  );
};
export default LoginWithEmail;