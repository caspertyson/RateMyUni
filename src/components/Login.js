import "../Login.css"
import React, { useEffect, useState } from 'react';
import { collection, query , onSnapshot} from 'firebase/firestore';
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
import SvgIcon from '@mui/material/SvgIcon';
import Kiwi from "./svg"
import SchoolIcon from '@mui/icons-material/School';

const LoginPage = ({triggerEvent, onRowClick}) => {
    const [data, setData] = useState([]);
    const [numUsers, setNumUsers] = useState("");
    const [selectedRow, setSelectedRow] = useState(null);    

    const handleRowClick = (rowData) => {
      onRowClick(rowData);
    };
    
    const handleClick = () => {
      triggerEvent();
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
        <h1 className="title">Rate My <span id="uniLogin">Uni</span> <span id="unihat"><img id="unihat" src={unihat}></img></span></h1>
        <form className="login-form">
          <button className="review-button" onClick={handleClick}>
          <span className="button-text">Write a review </span>
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
                <td id="index">{index + 1}</td>
                <td id="uniRow">
                  {item.uniName === "Canterbury" && <img className="emblem" src={Canterbury} alt="Uni1" />}
                  {item.uniName === "Waikato" && <img className="emblem" src={Waikato} alt="Uni1" />}
                  {item.uniName === "Auckland" && <img className="emblem" src={Auckland} alt="Uni1" />}
                  {item.uniName === "Wellington" && <img className="emblem" src={Wellington} alt="Uni1" />}
                  {item.uniName === "Otago" && <img className="emblem" src={Otago} alt="Uni1" />}
                  {item.uniName === "Lincoln" &&  <img className="emblem" src={Lincoln} alt="Uni1" />}
                  {item.uniName === "AUT" && <img className="emblem" src={AUT} alt="Uni1" />}
                  <span id="uniName">{item.uniName}</span>
                </td>
                <td className="ratingContainer"><Rating name="size-small" size="small"
                  icon={<SchoolIcon fontSize="5px"/>}
                  emptyIcon={<SchoolIcon fontSize="5px"/>}
                  value={parseFloat(item.averageOverallScore.toLocaleString("en-US"))} precision={0.1} readOnly/>
                  <span id="numRatings">{item.count}{item.count > 1 ? "\treviews" : "\treview"}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoginPage;