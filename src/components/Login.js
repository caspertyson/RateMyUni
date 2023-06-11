import "../Login.css"
import React, { useEffect, useState } from 'react';
import { collection, query , onSnapshot} from 'firebase/firestore';
import { db } from '../firebase'; 
import unihat from '../images/uni_hat.png'

const LoginPage = (props) => {
    const [data, setData] = useState([]);
    const [numUsers, setNumUsers] = useState("");

    const handleClick = () => {
      props.triggerEvent();
    };

    useEffect(() => {
      const q = query(collection(db, 'testingAuth'));
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
      });

      const q1 = query(collection(db, 'testingAuth'));

      const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
        const numDocuments = querySnapshot.size;
        setNumUsers(numDocuments);
      });

      return () => {
        unsubscribe();
        unsubscribe1();
      };
    }, []);  

    return (
      <div className="container">
      <div className='header'>
        <h1 className="title">Rate My Uni <span><img id="unihat" src={unihat}></img></span></h1>
        <form className="login-form">
          <button className="google-button" onClick={handleClick}>
          <span className="button-text">Start Survey! </span>
          </button>
        </form>
      </div>
      <div className="query-results">
        <h2>Your resource for real University reviews  <br></br> </h2>
        <button className="startSurvey" onClick={handleClick}>
          <span className="button-text">Start Survey! </span>
          </button>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>University Name</th>
              <th>Average Score / 5</th>
              <th>Number Of Ratings</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.uniName}>
                <td>{index + 1}</td>
                <td>{item.uniName}</td>
                <td>{item.averageOverallScore.toLocaleString("en-US")}</td>
                <td>{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoginPage;