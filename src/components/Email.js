import React, { useState } from 'react';
import "../Email.css"
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import unihat from '../images/uni_hat.png'

const LoginWithEmail = ({triggerEvent}) => {
  const [email, setEmail] = useState('');
  const [finished, setFinished] = useState(false)
  const inputElement = document.getElementById("emailInput")

  const handleChange = (e) => {
    setEmail(e.target.value);
  };
  const goBack = () => {
    triggerEvent()
  }

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
    inputElement.value = ""
    setFinished(true)
  };

  return (
    <div id='emailContainer'>
      <div className='header'>
        <h1 className="title">Rate My Uni <span><img id="unihat" src={unihat}></img></span></h1>
      </div>
      {finished ? 
      <div id='thankYou'>
        <h1>Thank you!</h1><br></br>
        <h3>Follow the link sent to your email <br></br><br></br>for your one time sign-in</h3>
      </div> :
        
      <div className='main'>
        <h2 id='emailTitel'>One time sign in with email</h2>
        <input id='emailInput'
            type="text"
            placeholder="example@example.com"
            value={email}
            onChange={handleChange}
        /><div></div>
        <button id='emailButton' onClick={handleButtonClick}>Get  Link</button>
        <button id='emailButton' onClick={goBack}>Go Back</button>
      </div>
}
    </div>
  );
};
export default LoginWithEmail;