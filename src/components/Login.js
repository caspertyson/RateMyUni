import "../Login.css"
import React, { useEffect, useState } from 'react';
import { collection, query , where,onSnapshot} from 'firebase/firestore';
import { db } from '../firebase'; 
import unihat from '../images/uni_hat.png'
import uniImage from '../images/University.jpg'
import Canterbury from "../images/UC.png"
import Waikato from "../images/Waikato.png"
import Auckland from "../images/auckland.png"
import Wellington from "../images/wellington.png"
import Otago from "../images/Otago.png"
import Lincoln from "../images/lincoln.png"
import AUT from "../images/aut.png"
import Rating from '@mui/material/Rating';
import Massey from "../images/massey.png"
import ModalLogin from "../components/ModalLogin"

import SvgIcon from '@mui/material/SvgIcon';
import Kiwi from "./svg"
import SchoolIcon from '@mui/icons-material/School';
import rightArrow from "../images/rightArrow.png"
import { BrowserRouter as Router, Switch, Route, Routes, useNavigate  } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";



const LoginPage = ({login, triggerEvent, onRowClick}) => {
    const [data, setData] = useState([]);
    const [numUsers, setNumUsers] = useState("");
    const [selectedRow, setSelectedRow] = useState(null);    
    const navigate = useNavigate();
    const [modal, setModal] = useState(false)
    const [signInText, setSignInText] = useState("Sign In")
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const auth = getAuth();

    const handleRowClick = (rowData) => {
      onRowClick(rowData);
    };
    const onSuccess = () => {
      setModal(!modal)
      setIsOpen(!isOpen);
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
    const onLogin = () => {
      navigate(`/review-reviews`)
    }
  
    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setSignInText("Log Out")
          setIsLoggedIn(true)
          console.log("user is signed in")
          console.log("user: " + user.email)
        } else {
        }
      });

      const q = query(collection(db, 'reviews'), where('approved', '==', true));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {

        const records = querySnapshot.docs.map((doc) => doc.data());
        const groupedData = records.reduce((acc, record) => {
          if (!acc[record.uniName]) {
            acc[record.uniName] = {
              uniName: record.uniName,
              overallScore: Number(record.overall),
              count: 1,
            };
          } else {
            acc[record.uniName].overallScore += Number(record.overall);
            acc[record.uniName].count += 1;
          }
          return acc;
        }, {});

        const averages = Object.values(groupedData).map((group) => ({
          uniName: group.uniName,
          averageOverallScore: Math.round((group.overallScore / group.count) * 10) / 10,
          count: group.count
        }));
  
        const sortedAverages = averages.sort(
          (a, b) => b.averageOverallScore - a.averageOverallScore
        );
  
        setData(sortedAverages);

        const numDocuments = querySnapshot.size;
        setNumUsers(numDocuments);
  
      });

      return () => {
        unsubscribe();
      };
    }, []);  

    return (
      <div className="container">
      {isOpen && (
      <div className={`pop-down ${isOpen ? "open" : ""}`} onAnimationEnd={onAnimationEnd}>
        <h2 className="pop-down-title">Login Link Sent!</h2>
        <p className="pop-down-text">Keep calm and check your spam folder</p>
        <button id='closePopDown' onClick={closePopDown}>Close</button>
        </div>
      )}
      <div className='header'>
        <h1 className="title">RateMy<span id="uniLogin">Uni</span><span id="conz">.co.nz</span></h1>
        <form className="login-form">
          <button type="button" className="review-button" onClick={handleClick}>
          <span className="button-text">{signInText} </span>
          </button>
        </form>
      </div>
      <div id="banner">
        <img id="uniImage" src={uniImage}></img>
        <div id="bannerText"><span id="NZ">New Zealand</span> Universities</div>
      </div>
      
      <div className="query-results">
        <table id="table">
          <tbody>
            {data.map((item, index) => (
              <tr key={item.uniName} onClick={() => handleRowClick(item)}>
                <td id="uniRow">
                  {item.uniName === "Canterbury" && <img className="emblem" src={Canterbury} alt="Uni1" />}
                  {item.uniName === "Waikato" && <img className="emblem" src={Waikato} alt="Uni1" />}
                  {item.uniName === "Auckland" && <img className="emblem" src={Auckland} alt="Uni1" />}
                  {item.uniName === "Wellington" && <img className="emblem" src={Wellington} alt="Uni1" />}
                  {item.uniName === "Otago" && <img className="emblem" src={Otago} alt="Uni1" />}
                  {item.uniName === "Lincoln" &&  <img className="emblem" src={Lincoln} alt="Uni1" />}
                  {item.uniName === "AUT" && <img className="emblem" src={AUT} alt="Uni1" />}
                  {item.uniName === "Massey" && <img className="emblem" src={Massey} alt="Uni1" />}
                  <span id="uniName">{item.uniName}</span>
                </td>
                <td className="ratingContainer"><Rating name="size-medium" size="medium"
                  icon={<SchoolIcon fontSize="5px"/>}
                  emptyIcon={<SchoolIcon fontSize="5px"/>}
                  // sx={{color: "#FFDF00"}}
                  value={parseFloat(item.averageOverallScore.toLocaleString("en-US"))} precision={0.1} readOnly/>
                  <span id="numRatings">{"(" + item.count + ")"}</span><span><img id="rightArrow" src={rightArrow}></img></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <footer>
        <div id="footer">
          <h1 className="title">RateMy<span id="uniLogin">Uni</span><span id="conz">.co.nz</span></h1>
          <a onClick={onLogin} id="LoginReviews">Admin</a>
        </div>
        </footer>
      </div>
      {modal && (
        <ModalLogin trigger={handleClick} successSubmit={onSuccess}/>
      )}
    </div>
  );
};

export default LoginPage;