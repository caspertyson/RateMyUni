import React, { useState } from 'react';
import "../Login.css"
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";

function Modal({trigger,successSubmit}) {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);

  const auth = getAuth();
  const inputElement = document.getElementById("userEmail")

  const handleClose = () => {
    trigger()
};

const handleChange = (e) => {
    setEmail(e.target.value);
    setIsValidEmail(true); // Reset validation on each change
  };
  const validateEmail = (email) => {
    // Regular expression for email validation
    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return emailPattern.test(email);
  };
  const actionCodeSettings = {
    url: 'https://ratemyuni.co.nz/',
    handleCodeInApp: true,
  };

  const handleButtonClick = (event) => {
    event.preventDefault();
    if (!validateEmail(email)) {
      setIsValidEmail(false);
      return;
    }
    sendSignInLinkToEmail(auth, email, actionCodeSettings)
    .then(() => {
        window.localStorage.setItem('emailForSignIn', email);
        console.log("signed in ")
    })
    .catch((error) => {
        console.log(error)
    });
    inputElement.value = ""
    successSubmit()
  };


  return (
    <div className="modal">
      <div className="modal-content" >
      <button id="x"onClick={handleClose}>X</button>
      <h3>Sign In With Email</h3>
      <p>Passwordless Login</p>
        <input id='userEmail'
          autoCapitalize='none'
          type="text"
          value={email}
          onChange={handleChange}
          placeholder="example@example.com"
        />{!isValidEmail && <p id='emailError'>Please enter a valid email address.</p>}
        <button id='sendEmail' type='button' onClick={handleButtonClick}>Send Email</button>
      </div>
    </div>
  );
}

export default Modal;