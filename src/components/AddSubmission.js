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
    "Bachelor of Arts (BA)",
    "Bachelor of Science (BSc)",
    "Bachelor of Commerce (BCom)",
    "Bachelor of Engineering (BE)",
    "Bachelor of Education (BEd)",
    "Bachelor of Fine Arts (BFA)",
    "Bachelor of Nursing (BN)",
    "Bachelor of Architecture (BArch)",
    "Bachelor of Information Technology (BIT)",
    "Bachelor of Laws (LLB)",
    "Bachelor of Medicine, Bachelor of Surgery (MBChB)",
    "Bachelor of Dental Surgery (BDS)",
    "Bachelor of Pharmacy (BPharm)",
    "Bachelor of Veterinary Science (BVSc)",
    "Bachelor of Physiotherapy (BPT)",
    "Bachelor of Occupational Therapy (BOT)",
    "Bachelor of Social Work (BSW)",
    "Bachelor of Speech and Language Therapy (BSLT)",
    "Master of Arts (MA)",
    "Master of Science (MSc)",
    "Master of Business Administration (MBA)",
    "Master of Engineering (ME)",
    "Master of Education (MEd)",
    "Master of Fine Arts (MFA)",
    "Master of Nursing (MN)",
    "Master of Architecture (MArch)",
    "Master of Information Technology (MIT)",
    "Doctor of Philosophy (PhD)",
    "Doctor of Education (EdD)",
    "Doctor of Business Administration (DBA)",
    "Doctor of Engineering (DEng)",
    "Doctor of Clinical Psychology (DClinPsych)",
    "Doctor of Medicine (MD)",
    "Doctor of Veterinary Medicine (DVM)",
    "Doctor of Musical Arts (DMA)",
    "Doctor of Information Technology (DIT)"
]
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
    // if (!isOpen) {
    //   setIsOpen(false);
    // }
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
    setEmail(e.target.value);
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
    if(isReferral){
      if (!validateUniEmail(email)) {
        setIsValidEmail(false);
        return;
      }  
    }else{
      if (!validateEmail(email)) {
        setIsValidEmail(false);
        return;
      }  
    }

    const emailExists = await checkEmailExists(email)
    const overall = Math.round(((difficulty + oneOnOneTime + jobChances + materialQuality + friends) / 5) * 10) /10;
    const approved = false;
    const verifiedUniStudent = false;
    const upvotes = []
    const downvotes = []

    if (notes !== "" && uniName !== "" && course !== "" && overall !== "" && friends !== "" && difficulty !== "" && 
      materialQuality !== "" && jobChances !== "" && oneOnOneTime !== "" && email !== "" && date !== "") {

      if(emailExists){
        window.alert("Submission already received from this email");
        localStorage.setItem("emailForSignIn", "");
        // window.location.replace("/");
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

      // confirm uni email if they're using a referral code
      if(isReferral){
        sendSignInLinkToEmail(auth, email, actionCodeSettings)
        .then(() => {
            window.localStorage.setItem('emailForSignIn', email);
            console.log("signed in ")
        })
        .catch((error) => {
            console.log(error)
        });
      }
      onSuccess()
    }else{
      window.alert("Please fill in the required fields");
    }
  };

  return (
    <div className="container">
      {isOpen && !isReferral && (
      <div className={`pop-down ${isOpen ? "open" : ""}`} onAnimationEnd={onAnimationEnd}>
        <h2 className="pop-down-title">Thank You For Your Submission!</h2>
        <button id='closePopDown' onClick={closePopDown}>Take Me Home</button>
        </div>
      )}
      {isOpen && isReferral && (
        <div className={`pop-down ${isOpen ? "open" : ""}`} onAnimationEnd={onAnimationEnd}>
          <h2 className="pop-down-title">Complete Your Review</h2>
          <p className="pop-down-title">Complete your review by clicking the link in the email sent to you</p>
          <button id='closePopDown' onClick={closePopDown}>Take Me Home</button>
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
            A few words for other students
              </label>
              <textarea maxLength="500" id="lastNotes" value={notes} onChange={(e) => 
                setNotes(e.target.value)}></textarea>
              <br></br>
              <label>
            Name of uni <br></br>
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
              Course you took<br></br>
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
            Your email (preferably university email)
              </label>
              <input id='emailSubInput'
                  autoCapitalize='none'
                  type="text"
                  placeholder="example@youruni.ac.nz"
                  value={email}
                  onChange={handleChange}
              />{!isReferral &&!isValidEmail && <p id='emailError'>Enter a valid email</p>}
              {isReferral && !isValidEmail && <p id='emailError'>When using referrals enter a valid university email </p>}
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
