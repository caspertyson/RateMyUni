import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import "../Submission.css"
import SchoolIcon from '@mui/icons-material/School';
import Rating from '@mui/material/Rating';
import { BrowserRouter as Router, Switch, Route, Routes, useNavigate  } from 'react-router-dom';
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";


export default function AddSubmission({triggerEvent}) {
  const [uniName, setUniName] = useState("");
  const [course, setCourse] = useState("");
  const [friends, setFriends] = useState(0);
  const [difficulty, setDifficulty] = useState(0);
  const [materialQuality, setMaterialQuality] = useState(0);
  const [jobChances, setJobChances] = useState(0);
  const [oneOnOneTime, setOneOnOneTime] = useState(0);
  const [notes, setNotes] = useState("")
  const [isValidEmail, setIsValidEmail] = useState(true);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [referralCode, setReferralCode] = useState("")
  const [isReferral, setIsReferral] = useState(false)
  const auth = getAuth();

  

  const univercities = ["Auckland", "AUT", "Waikato", "Otago", "Lincoln", "Canterbury", "Wellington", "Massey"]
  const degrees = [
    "Bachelor of Accountancy",
    "Bachelor of Agribusiness",
    "Bachelor of Agricultural Science",
    "Bachelor of Animal Science",
    "Bachelor of Architecture (BArch)",
    "Bachelor of Arts (BA)",
    "Bachelor of Aviation",
    "Bachelor of Aviation Management",
    "Bachelor of Business",
    "Bachelor of Commerce (BCom)",
    "Bachelor of Commercial Music",
    "Bachelor of Communication",
    "Bachelor of Construction",
    "Bachelor of Criminal Justice",
    "Bachelor of Data Science",
    "Bachelor of Dental Surgery (BDS)",
    "Bachelor of Digital Screen with Honours",
    "Bachelor of Education (BEd)",
    "Bachelor of Engineering (BE)",
    "Bachelor of Environmental Science with Honours",
    "Bachelor of Fine Arts (BFA)",
    "Bachelor of Forestry Science",
    "Bachelor of Health Sciences",
    "Bachelor of Horticultural Science",
    "Bachelor of Information Sciences",
    "Bachelor of Information Technology (BIT)",
    "Bachelor of Laws (LLB)",
    "Bachelor of Māori Innovation",
    "Bachelor of Māori Visual Arts",
    "Bachelor of Medicine, Bachelor of Surgery (MBChB)",
    "Bachelor of Music",
    "Bachelor of Nursing (BN)",
    "Bachelor of Occupational Therapy (BOT)",
    "Bachelor of Pharmacy (BPharm)",
    "Bachelor of Physiotherapy (BPT)",
    "Bachelor of Product Design",
    "Bachelor of Resource and Environmental Planning",
    "Bachelor of Science (BSc)",
    "Bachelor of Social and Environmental Sustainability",
    "Bachelor of Social Work (BSW)",
    "Bachelor of Speech and Language Therapy (BSLT)",
    "Bachelor of Sport and Exercise",
    "Bachelor of Sport Coaching",
    "Bachelor of Teaching and Learning Kura Kaupapa Māori (Te Aho Tātairangi)",
    "Bachelor of Veterinary Science",
    "Bachelor of Veterinary Science Pre-Selection",
  ];  

  const [email, setEmail] = useState("")

  const goBack = () => {
    navigate(`/`)
  }
  const onSuccess = () => {
    setIsOpen(!isOpen);
    window.scrollTo(0, 0)
    console.log("this happened")
  }
  const onAnimationEnd = () => {
  };
  const closePopDown = () => {
    setIsOpen(false)
    navigate(`/`)
  }

  const handelReferral = (e) => {
    setReferralCode(e.target.value)
    setIsReferral(true)
    if(e.target.value == ""){
      setIsReferral(false)
    }
  }
  const handleChange = (e) => {
    setEmail(e.target.value.toLowerCase());
    setIsValidEmail(true); // Reset validation on each change
  };
  const validateEmail = (email) => {
    // Regular expression for email validation
    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return emailPattern.test(email);
  };
  const validateUniEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.ac\.nz$/;
    return emailPattern.test(email);
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

  const checkEmailExists = async (email) => {
    try {
      const q = query(collection(db, 'reviews'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking email existence: ', error);
      return false;
    }
  };
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  const actionCodeSettings = {
    url: 'https://ratemyuni.co.nz/',
    handleCodeInApp: true,
  };

  const handleSubmit = async (e) => {
    const date = new Date()
    e.preventDefault();

    if (!validateUniEmail(email)) {
      setIsValidEmail(false);
      return;
    }  

    const emailExists = await checkEmailExists(email)
    const overall = Math.round(((difficulty + oneOnOneTime + jobChances + materialQuality + friends) / 5) * 10) /10;
    const approved = false;
    const verifiedUniStudent = false;
    const upvotes = []
    const downvotes = []
    
    if(notes.length < 50){
      document.getElementById("lastNotes").focus();
    }
    else if (uniName !== "" && course !== "" && friends !== 0 && difficulty !== 0 && 
      materialQuality !== 0 && jobChances !== 0 && oneOnOneTime !== 0 && email !== "") {
      
      if(emailExists){
        window.alert("Submission already received from this email");
        localStorage.setItem("emailForSignIn", "");
        navigate(`/`)
        return;
      } 
    
      document.getElementsByClassName("AddSubmissionButtons").disabled = true
      await addDoc(collection(db, "reviews"), {
        uniName,
        course,
        overall,
        friends,
        difficulty,
        materialQuality,
        jobChances,
        oneOnOneTime,
        notes,
        email,
        date,
        approved,
        upvotes,
        downvotes,
        verifiedUniStudent,
        referralCode,
      });
      console.log("review submitted successfully")
      
      setUniName("");
      setCourse("");
      setFriends(0);
      setDifficulty(0);
      setMaterialQuality(0);
      setJobChances(0);
      setOneOnOneTime(0);
      setNotes("");
      setEmail("");
      localStorage.setItem("emailForSignIn", "");

      sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
          window.localStorage.setItem('emailForSignIn', email);
          console.log("signed in ")
      })
      .catch((error) => {
          console.log(error)
      });
      
      onSuccess()
    }else{
      window.alert("Please fill in the required fields");
    }
  };

  return (
    <div className="container">
      {isOpen && (
        <div className={`pop-down ${isOpen ? "open" : ""}`} onAnimationEnd={onAnimationEnd}>
          <h2 className="pop-down-title">Waiting for email verification... </h2>
          <p className="pop-down-title">To complete your review, click the link in the email sent to you</p><br></br>
          </div>
        )}
      <div className='header'>
        <h1 onClick={goBack} className="title">RateMy<span id="uniLogin">Uni</span><span id="conz">.co.nz</span></h1>
      </div>
      <div id="submissionElements">
        <h2 id="titleSubmission">Write A Review</h2>
        <div id="submissionSpeil">
          <p>Share your thoughts about</p>
          <p> - your experience</p>
          <p> - why others will/will not enjoy your uni</p>
        </div>
        <div id='submissionForm'>
          <form onSubmit={handleSubmit}>
          <label>
            Quality of lecture materials
          </label>
          <Rating id="rating" name="size-large" size="large"
                  icon={<SchoolIcon style={{ fontSize: "32px" }}/>}
                  emptyIcon={<SchoolIcon style={{ fontSize: "32px" }}/>}
                  value={materialQuality} 
                  onChange={(event, newValue) => {
                    setMaterialQuality(newValue);
                  }}
                  precision={1} />
            <br />
            <label>
            Ease of meeting new people
            </label>
            <Rating id="rating" name="size-large" size="large"
                    icon={<SchoolIcon style={{ fontSize: "32px" }}/>}
                    emptyIcon={<SchoolIcon style={{ fontSize: "32px" }}/>}
                    value={friends} 
                    onChange={(event, newValue) => {
                      setFriends(newValue);
                    }}
                    precision={1} />
              <br />
              <label>
            One on one time with tutors/lecturers
            </label>
            <Rating id="rating" name="size-large" size="large"
                    icon={<SchoolIcon style={{ fontSize: "32px" }}/>}
                    emptyIcon={<SchoolIcon style={{ fontSize: "32px" }}/>}
                    value={oneOnOneTime} 
                    onChange={(event, newValue) => {
                      setOneOnOneTime(newValue);
                    }}
                    precision={1} />
              <br />
              <label>
          Landing a job related to your studies
            </label>
            <Rating id="rating" name="size-large" size="large"
                    icon={<SchoolIcon style={{ fontSize: "32px" }}/>}
                    emptyIcon={<SchoolIcon style={{ fontSize: "32px" }}/>}
                    value={jobChances} 
                    onChange={(event, newValue) => {
                      setJobChances(newValue);
                    }}
                    precision={1} />
              <br />
              <label>
            Difficulty of your studies
            </label>
            <Rating id="rating" name="size-large" size="large"
                    icon={<SchoolIcon style={{ fontSize: "32px" }}/>}
                    emptyIcon={<SchoolIcon style={{ fontSize: "32px" }}/>}
                    value={difficulty} 
                    onChange={(event, newValue) => {
                      setDifficulty(newValue);
                    }}
                    precision={1} />
              <br />
              <label>
            Name of University <br></br>
            <select id="selectUniDegree" value={uniName} onChange={(e) => setUniName(e.target.value)}>
              <option value="">Select a University</option>
              {univercities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
            <br />
            <label>
              Degree you took <br></br>(choose the closest or write in the notes what it was)<br></br>
              <select id="selectUniDegree" value={course} onChange={(e) => setCourse(e.target.value)}>
                <option value="">Select a Degree</option>
                {degrees.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <br />
              <label>
            Referral code
              </label>
              <input id='emailSubInput'
                  autoCapitalize='none'
                  type="text"
                  placeholder="Referral Code"
                  value={referralCode}
                  onChange={handelReferral}
              />
            <br />
            <label>
            A few words for other students (min. 50 characters)
              </label>
              <textarea maxLength="500" id="lastNotes" value={notes} onChange={(e) => 
                setNotes(e.target.value)}></textarea>
                <p>Characters: {notes.length}</p>
              <br></br>

              <label>
            Your University email
              </label>
              <input id='emailSubInput'
                  autoCapitalize='none'
                  type="text"
                  placeholder="username@youruni.ac.nz"
                  value={email}
                  onChange={handleChange}
              />{!isValidEmail && <p id='emailError'>Enter a valid university email</p>}
            <div id="submissionSubmitButton">
              <button className="AddSubmissionButtons" type="submit">Done</button>
              <button className="BackButton" onClick={goBack} type="button">Back</button>
            </div>
          </form>
        </div>
      </div>
      <footer>
        <div id="footer">
          <h1 onClick={goBack} className="title">RateMy<span id="uniLogin">Uni</span><span id="conz">.co.nz</span></h1>
          <span onClick={reviewClick} id="LoginReviews">Review</span><span onClick={aboutClick} id="LoginReviews">Student Ambassador</span><span onClick={onLogin} id="LoginReviews">Admin</span>
        </div>
        </footer>
    </div>
  );
}
