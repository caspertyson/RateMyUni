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
  const degrees = ["Software Engineering", "Mechatronics", "Chemical Engineering", "Mechanical Engineering", "Law", "Accounting", "Social Work", "Civil Engineering", "Psychology", "Business Studies", "Environmental Sciences", "Biology", "Medicine", "Nursing"]
  const gradYear = ["2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022"]
  const cities = ["Northland", "Auckland", "Southland", "Otago", "Canterbury", "West Coast", "Marlborough", "Nelson", "Tasman", "Wellington", "Manawatū-Whanganui", "Taranaki", "Hawke's Bay", "Gisborne", "Bay of Plenty", "Waikato"]
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
    setEmail(localStorage.getItem("email"))
  }, []);

  const handleSubmit = async (e) => {
    const date = new Date()
    e.preventDefault();
    const emailExists = await checkEmailExists(email)

    if(emailExists){
      window.alert("Submission already received from this email");
      props.triggerEvent();
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
      });
      setUniName("");
      setCourse("");
      setJobTitle("");
      setCurrentPay("");
      setCity("");
      setGraduationYear("");

      localStorage.setItem("email", "");
      window.alert("Thank you for your submission!");
      props.triggerEvent();
    }else{
      window.alert("Please fill in all feilds");
    }
  };

  function returnToMain(){
    localStorage.setItem("email", "");
    props.triggerEvent();
  }

  return (
    <div className="container">
      <h1>Rate My Uni</h1>

      <h2>Sumbit Form</h2>
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
        <button type="submit">Submit!</button>
        <button onClick={returnToMain}>Back</button>
      </form>
    </div>
  );
}
