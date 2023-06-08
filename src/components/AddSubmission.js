import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AddSubmission() {
  const [uniName, setUniName] = useState("");
  const [course, setCourse] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [currentPay, setCurrentPay] = useState("");
  const [city, setCity] = useState("");
  const [graduationYear, setGraduationYear] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uniName !== "" || course !== "" || jobTitle !== "" || currentPay !== "" || city !== "" || graduationYear !== "") {
      await addDoc(collection(db, "record"), {
        uniName,
        course,
        jobTitle,
        currentPay,
        city,
        graduationYear,
      });
      setUniName("");
      setCourse("");
      setJobTitle("");
      setCurrentPay("");
      setCity("");
      setGraduationYear("");
    }
  };

  return (
    <div className="container">
      <h2>Sumbit Form</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name of Uni:
          <input
            type="text"
            value={uniName}
            onChange={(e) => setUniName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Course you took:
          <input
            type="text"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
        </label>
        <br />
        <label>
          Graduation Year:
          <input
            type="text"
            value={graduationYear}
            onChange={(e) => setGraduationYear(e.target.value)}
          />
        </label>
        <br />
        <label>
          City You Live In Now:
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
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
          Current pay:
          <input
            type="text"
            value={currentPay}
            onChange={(e) => setCurrentPay(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
