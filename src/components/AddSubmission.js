import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import "../Submission.css"
import SchoolIcon from '@mui/icons-material/School';
import Rating from '@mui/material/Rating';

export default function AddSubmission(props) {
  const [uniName, setUniName] = useState("");
  const [course, setCourse] = useState("");
  const [friends, setFriends] = useState(0);
  const [difficulty, setDifficulty] = useState(0);
  const [materialQuality, setMaterialQuality] = useState(0);
  const [jobChances, setJobChances] = useState(0);
  const [oneOnOneTime, setOneOnOneTime] = useState(0);
  const [notes, setNotes] = useState("")

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

  const checkEmailExists = async (email) => {
    try {
      const q = query(collection(db, 'testingAuth'), where('email', '==', email));
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
    setEmail(localStorage.getItem("emailForSignIn").toLocaleLowerCase())
  }, []);

  const handleSubmit = async (e) => {
    const date = new Date()
    e.preventDefault();
    const emailExists = await checkEmailExists(email)
    const overall = Math.round(((difficulty + oneOnOneTime + jobChances + materialQuality + friends) / 5) * 10) /10;
      if(emailExists){
        window.alert("Submission already received from this email");
        localStorage.setItem("emailForSignIn", "");
        window.location.replace("https://ratemyuni.co.nz/");
      }
      else if (uniName !== "" && course !== "" && overall !== "" && friends !== "" && difficulty !== "" && 
        materialQuality !== "" && jobChances !== "" && oneOnOneTime !== "" && email !== "" && date !== "") {
      document.getElementsByClassName("AddSubmissionButtons").disabled = true
      await addDoc(collection(db, "testingAuth"), {
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
      });
      console.log("happeneded")
      
      setUniName("");
      setCourse("");
      setFriends(0);
      setDifficulty(0);
      setMaterialQuality(0);
      setJobChances(0);
      setOneOnOneTime(0);
      setNotes("");

      localStorage.setItem("emailForSignIn", "");
      window.alert("Thank you for your submission! You will be re-directed to the main page now.");
      window.location.replace("https://ratemyuni.co.nz/");
    }else{
      window.alert("Please fill in the required fields");
    }
  };

  return (
    <div className="container">
      <div id="submissionElements">
        <h2 id="titleSubmission">Rate Your University</h2>
        <br></br>
        <p>We've always disliked the "official" university rankings - they seem to give very general perspectives, but may not align with individual needs.</p>
        <p>What about real reviews from real students...?</p>
        <br></br>
        <div id='submissionForm'>
          <form onSubmit={handleSubmit}>
          <label>
            1. What was the quality of lecture materials like?
          </label>
          <Rating name="size-large" size="large"
                  icon={<SchoolIcon style={{ fontSize: "40px" }}/>}
                  emptyIcon={<SchoolIcon style={{ fontSize: "40px" }}/>}
                  value={materialQuality} 
                  onChange={(event, newValue) => {
                    setMaterialQuality(newValue);
                  }}
                  precision={1} />
            <br />
            <label>
            2. How easy was it to meet new people at uni?
            </label>
            <Rating name="size-large" size="large"
                    icon={<SchoolIcon style={{ fontSize: "40px" }}/>}
                    emptyIcon={<SchoolIcon style={{ fontSize: "40px" }}/>}
                    value={friends} 
                    onChange={(event, newValue) => {
                      setFriends(newValue);
                    }}
                    precision={1} />
              <br />
              <label>
            3. What was the one on one time with tutors/lecturers like?
            </label>
            <Rating name="size-large" size="large"
                    icon={<SchoolIcon style={{ fontSize: "40px" }}/>}
                    emptyIcon={<SchoolIcon style={{ fontSize: "40px" }}/>}
                    value={oneOnOneTime} 
                    onChange={(event, newValue) => {
                      setOneOnOneTime(newValue);
                    }}
                    precision={1} />
              <br />
              <label>
            4. What are the chances of you landing a job related to your studies?
            </label>
            <Rating name="size-large" size="large"
                    icon={<SchoolIcon style={{ fontSize: "40px" }}/>}
                    emptyIcon={<SchoolIcon style={{ fontSize: "40px" }}/>}
                    value={jobChances} 
                    onChange={(event, newValue) => {
                      setJobChances(newValue);
                    }}
                    precision={1} />
              <br />
              <label>
            5. What was the difficulty of your studies like?
            </label>
            <Rating name="size-large" size="large"
                    icon={<SchoolIcon style={{ fontSize: "40px" }}/>}
                    emptyIcon={<SchoolIcon style={{ fontSize: "40px" }}/>}
                    value={difficulty} 
                    onChange={(event, newValue) => {
                      setDifficulty(newValue);
                    }}
                    precision={1} />
              <br />
              <label>
            6. A few words for other students:
              </label>
              <textarea maxLength="500" id="lastNotes" value={notes} onChange={(e) => 
                setNotes(e.target.value)}></textarea>
              <br></br>
              <label>
            7. Name of Uni <br></br>
            <select value={uniName} onChange={(e) => setUniName(e.target.value)}>
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
              8. Course you took<br></br>
              <select value={course} onChange={(e) => setCourse(e.target.value)}>
                <option value="">Select a Degree</option>
                {degrees.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
              <button className="AddSubmissionButtons" type="submit">Done</button>
          </form>
        </div>
      </div>
    </div>
  );
}
