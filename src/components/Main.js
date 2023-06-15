import "../Main.css"
import React, { useEffect, useState } from 'react';
import { collection, query , onSnapshot} from 'firebase/firestore';
import { db } from '../firebase'; 
import unihat from '../images/uni_hat.png'
import review from '../images/review.png'
import businessman from '../images/business-man.png'

const LoginPage = (props) => {
    const [data, setData] = useState([]);
    const [numUsers, setNumUsers] = useState("");

    const handleClick = () => {
      props.triggerEvent();
    };

    useEffect(() => {
    }, []);  

    return (
    <div className="container">
      <div className='header'>
        <h1 className="title">Rate My <span id="uni">Uni</span> <span><img id="unihat" src={unihat}></img></span></h1>
        <form className="login-form">
          <button type="button" className="google-button" onClick={handleClick}>
          <span className="button-text">Start Survey! </span>
          </button>
        </form>
      </div>
      <div className="main-button">
        <h2>Your resource for real University reviews  <br></br> </h2>
        <button type="button" className="startSurvey" onClick={handleClick}>
          <span className="button-text">Start 1 min survey to see what other students say! </span>
          </button>
      </div>
      <div id="Modules">
        <div id="firstMod">
          <div id="firstModImg">
            <img id="reviewImg" src={review}></img>
          </div>
          <div id="firstModTxt">
          <h3>
          Auckland University
          </h3>
          Auckland university anecdotally has less available one on one time with the lecturer, but is ranked NZ's No. 1 university. <br></br><br></br><b>Is Auckland University Living Up to Its No. 1 Ranking?</b> 
          </div>

        </div>
        <div id="secondMod">
          <div id="secondModImg">
            <img id="reviewImg" src={businessman}></img>
          </div>
          <div id="secondModTxt">
          <h3>
          Waikato University
          </h3>
          Waikato is ranked NZ's second to last university, but students report quality content and more one on one time with tutors and lecturers.  <br></br><br></br><b>Waikato University's Low Ranking vs. Student Satisfaction! </b>
          </div>
        </div>
        <div className="second-button">
        <button type="button" className="startSurvey" onClick={handleClick}>
          <span className="button-text">Start 1 min survey to see what other students say! </span>
          </button>
        </div>

      </div>

    </div>
  );
};

export default LoginPage;