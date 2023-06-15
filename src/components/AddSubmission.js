import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import "../Submission.css"

export default function AddSubmission(props) {
  const [uniName, setUniName] = useState("");
  const [course, setCourse] = useState("");
  const [overall, setOverall] = useState("");
  const [friends, setFriends] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [materialQuality, setMaterialQuality] = useState("");
  const [jobChances, setJobChances] = useState("");
  const [oneOnOneTime, setOneOnOneTime] = useState("");
  const [notes, setNotes] = useState("")

  const univercities = ["University of Auckland", "AUT", "The University of  Waikato", "University of Otago	", "Lincoln University", "University of Canterbury", "Victoria University of Wellington", "Massey University"]
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
  const ratings = [1, 2, 3, 4, 5]
  const [email, setEmail] = useState("")
  const [liveNotification, setLiveNotification] = useState("")
  const [consent, setConsent] = useState(false)

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

      if(emailExists){
        window.alert("Submission already received from this email");
        localStorage.setItem("emailForSignIn", "");
        window.location.replace("https://ratemyuni.co.nz/");
      }
     else if (uniName !== "" && course !== "" && overall !== "" && consent !== false) {
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
        liveNotification,
        date,
        consent,
      });
      setUniName("");
      setCourse("");
      setOverall("");
      setFriends("");
      setDifficulty("");
      setMaterialQuality("");
      setJobChances("");
      setOneOnOneTime("");
      setNotes("");
      setLiveNotification(false)
      setConsent(false)

      localStorage.setItem("emailForSignIn", "");
      window.alert("Thank you for your submission! You will be re-directed to the main page now.");
      window.location.replace("https://ratemyuni.co.nz/");
    }else{
      window.alert("Please fill in the required fields");
    }
  };

  function returnToMain(){
    localStorage.setItem("emailForSignIn", "");
    window.location.replace("https://ratemyuni.co.nz/");
  }

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
            Name of Uni <span id="required">* required</span>: <br></br>
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
              Course you took <span id="required">* required</span>:<br></br>
              <select value={course} onChange={(e) => setCourse(e.target.value)}>
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
              Overall Experience <span id="required">* required</span>:<br></br>
              <select value={overall} onChange={(e) => setOverall(e.target.value)}>
                <option value="">Select A Rating</option>
                {ratings.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <br />        
            <label>
              Ease of making friends:<br></br>
              <select value={friends} onChange={(e) => setFriends(e.target.value)}>
                <option value="">Select A Rating</option>
                {ratings.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <br />        
            <label>
              Degree difficulty:<br></br>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="">Select A Rating</option>
                {ratings.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <br />        
            <label>
              Quality of Teaching Material:<br></br>
              <select value={materialQuality} onChange={(e) => setMaterialQuality(e.target.value)}>
                <option value="">Select A Rating</option>
                {ratings.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <br />        
            <label>
              Chances of getting a job related to your degree:<br></br>
              <select value={jobChances} onChange={(e) => setJobChances(e.target.value)}>
                <option value="">Select A Rating</option>
                {ratings.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <br />        
            <label>
              One on One with tutor/lecturer:<br></br>
              <select value={oneOnOneTime} onChange={(e) => setOneOnOneTime(e.target.value)}>
                <option value="">Select A Rating</option>
                {ratings.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <br />        
            <label>
              Other Notes:
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
            <br />        
            <label for="vehicle1"> Send me an email once the results are live?</label>
            <input type="checkbox" id="checkboxEmail" onChange={(e) => setLiveNotification(e.target.value)}/>
            <br />
            <label for="vehicle1"> I consent to participate in this survey? <span id="required">* required</span></label>
            <input type="checkbox" id="checkboxEmail" onChange={(e) => setConsent(e.target.value)}/>
            <br />
            <button type="submit">Submit!</button>
            <button type="button" onClick={returnToMain}>Back</button>
          </form>

        </div>

      </div>
    </div>
  );
}
