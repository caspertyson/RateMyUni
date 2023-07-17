import "../Login.css"
import React, { useEffect, useState } from 'react';
import { collection, query , where,onSnapshot} from 'firebase/firestore';
import { db } from '../firebase'; 
import unihat from '../images/uni_hat.png'
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
import BusinessMan from "../images/business-man.png"
import ReviewMan from "../images/review.png"
import AucklandUni from '../images/aucklanduni.jpg'
import MobileBanner from '../images/aucklanduniMobile.jpg'
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
    const [sortBy, setSortBy] = useState("Sort By Highest Rating")
    const [isMobile, setIsMobile] = useState(false);

    const auth = getAuth();

    const handleRowClick = (rowData) => {
      onRowClick(rowData);
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
    const reviewClick = () => {
      navigate(`/add-submission`)
    }  
    const aboutClick = () => {
      navigate(`/ambassador`)
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

    useEffect(() => {
      const sortedData = sortBy === "Sort By Highest Rating" ? sortedByScore(data) : sortedByNumReviews(data);
      setData(sortedData);
      console.log("sortby changed");
      console.log(sortedData)
    }, [sortBy]);
    
    const sortedByScore = (averages) => {
      const sortedData = [...averages].sort((a, b) => b.averageOverallScore - a.averageOverallScore);
      return sortedData
    }
    const sortedByNumReviews = (averages) => {
      const sortedData = [...averages].sort((a, b) => b.count - a.count);
      return sortedData
    }
    const getImageSource = () => {
      if (isMobile) {
        return MobileBanner;
      }
      return AucklandUni;
    };
    useEffect(() => {
      setIsMobile(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
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
        console.log("query happened")

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
        const sortedData = [...averages].sort((a, b) => b.averageOverallScore - a.averageOverallScore);
        setData(sortedData);
        const numDocuments = querySnapshot.size;
        setNumUsers(numDocuments);
        console.log("data: ")
        console.log(data)
  
      });      
      window.scrollTo(0, 0)
      return () => {
        unsubscribe();
      };
    }, []);  

    useEffect(() => {
      const image = new Image();
      image.src = getImageSource();
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
          <button type="button" className="review-button" onClick={reviewClick}>
          <span className="button-text"><span id="write">Write </span>Review</span>
          </button>
        </form>
        <button type="button" className="writeReview" onClick={handleClick}>{signInText}</button>

      </div>
      <div id="banner">
        <img id="uniImage" src={getImageSource()} alt="People At A University" />
        <div id="bannerText">100% <span id="NZ">  AUTHENTICATED</span> </div>
      </div>

      <div className="query-results">
        <h1 id="subHeaderLanding">NZ University Rankings as decided by students</h1>
        <p id="textLanding">We understand that when it comes to finding real information about New Zealand Universities, 10 year old reddit forums and vauge world rankings just don't cut it. With RateMyUni.co.nz you can gain access to 100% authenticated reviews from real students. Make your university choice based on real student reviews!</p>

        <select id="sortByLanding" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="Sort By Highest Rating" >Sort By: Highest Rating</option>
          <option value="Sort By Number Of Reviews">Sort By: Number Of Reviews</option>
        </select>

        <table id="table">
          <tbody>
            {data.map((item, index) => (
              <tr id="landingPageTR" key={item.uniName} onClick={() => handleRowClick(item)}>
              <td id="uniRow">
                  {item.uniName === "Canterbury" && <img className="emblem" src={Canterbury} alt="Uni Emblem" />}
                  {item.uniName === "Waikato" && <img className="emblem" src={Waikato} alt="Uni Emblem" />}
                  {item.uniName === "Auckland" && <img className="emblem" src={Auckland} alt="Uni Emblem" />}
                  {item.uniName === "Wellington" && <img className="emblem" src={Wellington} alt="Uni Emblem" />}
                  {item.uniName === "Otago" && <img className="emblem" src={Otago} alt="Uni Emblem" />}
                  {item.uniName === "Lincoln" &&  <img className="emblem" src={Lincoln} alt="Uni Emblem" />}
                  {item.uniName === "AUT" && <img className="emblem" src={AUT} alt="Uni Emblem" />}
                  {item.uniName === "Massey" && <img className="emblem" src={Massey} alt="Uni Emblem" />}
                  <a href={"https://ratemyuni.co.nz/detail/" + item.uniName} id="uniName">{item.uniName}</a>
                </td>
                <td className="ratingContainer"><Rating name="size-medium" size="medium"
                  icon={<SchoolIcon fontSize="5px"/>}
                  emptyIcon={<SchoolIcon fontSize="5px"/>}
                  // sx={{color: "#FFDF00"}}
                  value={parseFloat(item.averageOverallScore.toLocaleString("en-US"))} precision={0.1} readOnly/>
                  <span id="numRatings">{"(" + item.count + ")"}</span><span><img id="rightArrow" src={rightArrow} alt="right arrow"></img></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div id="writeReviewUniDiv">
          <div id="textReviewUniBanner">
            <p id="headingTextReview" >Review Your University</p>
            <p id="subTextReview">Share Your University Experience And Rate!</p>
          </div>
          <div id="actionReviewUniBanner">
            <p onClick={reviewClick} id="writeAReviewText">Rate Your Uni</p>
            <Rating onClick={reviewClick} id="writeAReviewStars" name="size-medium" size="medium"
                  icon={<SchoolIcon style={{ fontSize: "30px" }}/>}
                  emptyIcon={<SchoolIcon style={{ fontSize: "30px" }}/>}
                  value={0} precision={1} />
          </div>
        </div>
        {/* <p id="textLanding">When it comes to universities, my parents and teachers think I'm smart (I'm not). It's because I researched my choice of universities on RateMyUni.co.nz (and they have no idea it exists).</p> */}

        <div id="businessmanInfographs">
              <div id="bussinessmanImageDiv">
                <img id="businessmanImage" src={BusinessMan} alt="business man"></img>
              </div>
              <div id="businessmanText"><h3>100% Authenticated</h3>
                <p> Each review must be made with a verified ".ac.nz" email, and each email can only be used once</p>
              </div>

        </div>
        <div id="reviewManInfograph">
              <div id="reviewManImageDiv">
                <img id="reviewManImage" src={ReviewMan} alt="review man"></img>
              </div>
              <div id="reviewManText"><h3>Anonymous</h3>
                <p>Every review will always be displayed anonymously</p>
              </div>

        </div>
        <footer>
        <div id="footer">
          <h1 className="title">RateMy<span id="uniLogin">Uni</span><span id="conz">.co.nz</span></h1>
          <a href="https://ratemyuni.co.nz/add-submission" id="LoginReviews">Review</a><a href="https://ratemyuni.co.nz/ambassador" id="LoginReviews">Student Ambassador</a><a href="https://ratemyuni.co.nz/review-reviews" id="LoginReviews">Admin</a>
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