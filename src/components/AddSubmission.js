import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

export default function AddSubmission(props) {
  const [uniName, setUniName] = useState("");
  const [course, setCourse] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [currentPay, setCurrentPay] = useState("");
  const [city, setCity] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
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
  const gradYear = ["Before 1970", "1970 - 1980", "1980 - 1990", "1990 - 2000", "2000 - 2010", "2010 - 2015","2015 - 2020","2020 - now"]
  const cities = ["Northland", "Auckland", "Southland", "Otago", "Canterbury", "West Coast", "Marlborough", "Nelson", "Tasman", "Wellington", "Manawatū-Whanganui", "Taranaki", "Hawke's Bay", "Gisborne", "Bay of Plenty", "Waikato"]
  const [email, setEmail] = useState("")
  const [liveNotification, setLiveNotification] = useState("")

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
    setEmail(localStorage.getItem("emailForSignIn"))
  }, []);

  const handleSubmit = async (e) => {
    const date = new Date()
    e.preventDefault();
    const emailExists = await checkEmailExists(email)

    if(emailExists){
      window.alert("Submission already received from this email");
      localStorage.setItem("emailForSignIn", "");
      window.location.replace("https://ratemyuni.co.nz/");

    }else if (uniName !== "" && course !== "" && jobTitle !== "" && currentPay !== "" && city !== "" && graduationYear !== "") {
      await addDoc(collection(db, "testingAuth"), {
        uniName,
        course,
        jobTitle,
        currentPay,
        city,
        graduationYear,
        email,
        date,
        liveNotification,
      });
      setUniName("");
      setCourse("");
      setJobTitle("");
      setCurrentPay("");
      setCity("");
      setGraduationYear("");
      setLiveNotification(false)

      localStorage.setItem("emailForSignIn", "");
      window.alert("Thank you for your submission!");
      window.location.replace("https://ratemyuni.co.nz/");
    }else{
      window.alert("Please fill in all feilds");
    }
  };

  function returnToMain(){
    localStorage.setItem("emailForSignIn", "");
    window.location.replace("https://ratemyuni.co.nz/");
  }

  return (
    <div className="container">
      <h2>Join Our Community</h2>
      <h4></h4>
      <h5>Become part of our community and share your experiences. Your input will help future students make informed decisions about their education.</h5>
      <form onSubmit={handleSubmit}>
      <label>
        Name of Uni: <br></br>
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
          Course you took:<br></br>
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
          Graduation Year:<br></br>
          <select value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)}>
            <option value="">Select a Year</option>
            {gradYear.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <br />        
        <label>
          Area You Live In Now:<br></br>
          <select value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">Select an Area</option>
            {cities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <br />        
        <label>
          Current Job title:
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </label>
        <br />        
        <label>
          Current Yearly Salary:
          <input
            type="text"
            value={currentPay}
            onChange={(e) => setCurrentPay(e.target.value)}
          />
        </label>
        <br />        
        <label for="vehicle1"> Send me an email once the results are live?</label>
        <input type="checkbox" id="checkboxEmail" onChange={(e) => setLiveNotification(e.target.value)}/>
        <br />
        <button type="submit">Submit!</button>
        <button type="button" onClick={returnToMain}>Back</button>
      </form>
    </div>
  );
}
