import React, { useState, useEffect } from 'react';
import "../Login.css"
import AucklandUni from '../images/aucklanduni.jpg'
import { BrowserRouter as Router, Switch, Route, Routes, useNavigate  } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import ModalLogin from "./ModalLogin"
import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";


const StudentAmbassador = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [signInText, setSignInText] = useState("Sign In")
    const navigate = useNavigate();
    const auth = getAuth();
    const [modal, setModal] = useState(false)
    const [uniName, setUniName] = useState("");
    const univercities = ["Auckland", "AUT", "Waikato", "Otago", "Lincoln", "Canterbury", "Wellington", "Massey"]
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [email, setEmail] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
      window.scrollTo(0, 0)
    }, []);

    const handleChange = (e) => {
      setEmail(e.target.value);
      setIsValidEmail(true); // Reset validation on each change
    };
    const validateEmail = (email) => {
      // Regular expression for email validation
      const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      return emailPattern.test(email);
    };
    const submitAmbassadorInterest = async(e) =>{
      e.preventDefault();
      if (!validateEmail(email)) {
        setIsValidEmail(false);
        return;
      }
      if(firstName != "" && lastName != "" && uniName != "" && email != ""){
        await addDoc(collection(db, "Ambassadors"), {
          firstName,
          lastName,
          uniName,
          email,
        });
        setSubmitted(true)  
        setFirstName("")
        setLastName("")
        setEmail("")
        setUniName("")
      }else{
        window.alert("Please fill in the required fields");
      }
    }
    const goBack = () => {
      navigate(`/`)
    }
    const aboutClick = () => {
      navigate(`/ambassador`)
    }  
    const reviewClick = () => {
        navigate(`/add-submission`)
      }  
      const onLogin = () => {
        navigate(`/review-reviews`)
      }
  
      const handleClick = () => {
        if(signInText == "Log Out"){
          signOut(auth).then(() => {
            console.log("user is signed out")
            window.localStorage.setItem('emailForSignIn', "")
            setSignInText("Sign In")
          }).catch((error) => {
            // An error happened.
          });
        }else{
          setModal(!modal)
        }
      };
      const onSuccess = () => {
        setModal(!modal)
        setIsOpen(!isOpen);
        window.scrollTo(0, 0)
        console.log("this happened")
      }
  
      const onAnimationEnd = () => {
        if (!isOpen) {
          setIsOpen(false);
        }
      };
      const closePopDown = () => {
        setIsOpen(false)
      }
      const closePopDownSubmit = () => {
        setSubmitted(false)
        navigate('/')
      }

  return (
    <div id='aboutContainer'>
    {isOpen && (
      <div className={`pop-down ${isOpen ? "open" : ""}`} onAnimationEnd={onAnimationEnd}>
        <h2 className="pop-down-title">Login Link Sent!</h2>
        <p className="pop-down-text">Keep calm and check your spam folder</p>
        <button id='closePopDown' onClick={closePopDown}>Close</button>
        </div>
      )}
      {submitted && (
      <div className={`pop-down ${submitted ? "open" : ""}`} onAnimationEnd={onAnimationEnd}>
        <h2 className="pop-down-title">Thank You For Your Submission!</h2>
        <button id='closePopDown' onClick={closePopDownSubmit}>Take Me Home</button>
        </div>
      )}


        <div className='header'>
        <h1 onClick={goBack} className="title">RateMy<span id="uniLogin">Uni</span><span id="conz">.co.nz</span></h1>
        
        <form className="login-form">
          <button type="button" className="review-button" onClick={reviewClick}>
          <span className="button-text"><span id='write'>Write</span> Review </span>
          </button>
        </form>
        <button type="button" className="writeReview" onClick={handleClick}>{signInText}</button>

      </div>
      <div id="banner">
        <img id="uniImage" src={AucklandUni}></img>
        <div id="bannerText"><span id="NZ">New Zealand</span> Universities</div>
      </div>
      <div id='ambassadorMain'>
       <h1>Become a brand ambassador</h1>
       <p>Help get reviews for this site and get paid for your efforts</p>
       <p>Get $20 for every 10 reviews that use your referral code</p>
       <p>Enter your details below to get started</p>
       <input id='name' placeholder="First Name"                  
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}/>
       <input id='name' placeholder="Last Name"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}/>
       <select id="selectUniAmbassador" value={uniName} onChange={(e) => setUniName(e.target.value)}>
              <option value="">Select a University</option>
              {univercities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <input id='emailSubInput'
                  autoCapitalize='none'
                  type="text"
                  placeholder="example@example.com"
                  value={email}
                  onChange={handleChange}
              />{!isValidEmail && <p id='emailError'>Please enter a valid email address.</p>}
       <button onClick={submitAmbassadorInterest} id='ambassadorButton'>Register Your Interest</button>
      </div>
      <footer>
        <div id="footer">
          <h1 onClick={goBack} className="title">RateMy<span id="uniLogin">Uni</span><span id="conz">.co.nz</span></h1>
          <span onClick={reviewClick} id="LoginReviews">Review</span><span onClick={aboutClick} id="LoginReviews">Student Ambassador</span><span onClick={onLogin} id="LoginReviews">Admin</span>
        </div>
        </footer>

      {modal && (
        <ModalLogin trigger={handleClick} successSubmit={onSuccess}/>
      )}
    </div>
  );
};
export default StudentAmbassador;