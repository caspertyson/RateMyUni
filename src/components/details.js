import React, { useEffect, useState } from 'react';
import { collection, query , where,getDocs} from 'firebase/firestore';
import { db } from '../firebase'; 

import unihat from '../images/uni_hat.png'
import uniImage from '../images/University.jpg'
import "../Login.css"
import Rating from '@mui/material/Rating';
import SchoolIcon from '@mui/icons-material/School';
import { useParams } from 'react-router-dom';
import { BrowserRouter as Router, Switch, Route, Routes, useNavigate  } from 'react-router-dom';
import Waikato from '../images/waikatouni.jpeg'
import Auckland from '../images/aucklanduni.jpg'
import AUT from '../images/autUni.jpg'
import Christchurch from '../images/christchurchuni.png'
import Wellington from '../images/victoria-university.jpg'
import Otago from '../images/University.jpg'
import Lincoln from '../images/lincolnUni.jpg'
import Massey from '../images/masseyuni.jpg'


const DetailComponent = ({ onRowClick, triggerEvent }) => {
  const {id} = useParams();
  const [queryData, setQueryData] = useState([]);
  const[average, setAverages] = useState([])
  const navigate = useNavigate();
  let banner;
  switch (id){
    case "Waikato":
      banner = <img id="uniImage" src={Waikato}></img>
      break;
    case "Auckland":
      banner = <img id="uniImage" src={Auckland}></img>
      break;
    case "Massey":
      banner = <img id="uniImage" src={Massey}></img>
      break;
    case "AUT":
      banner = <img id="uniImage" src={AUT}></img>
      break;
    case "Canterbury":
      banner = <img id="uniImage" src={Christchurch}></img>
      break;
    case "Wellington":
      banner = <img id="uniImage" src={Wellington}></img>
      break;
    case "Otago":
      banner = <img id="uniImage" src={Otago}></img>
      break;
    case "Lincoln":
      banner = <img id="uniImage" src={Lincoln}></img>
      break;
                                                        
  }
  const calculateAverage = (array, property) => {
    const values = array.map((item) => parseFloat(item[property]));
    const sum = values.reduce((acc, val) => acc + val, 0);
    const average = sum / values.length;
    return average;
  };
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const nth = function(d) {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  }
  
  function toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    
    return t.getDate().toString() + nth(t.getDate().toString()) + " " + month[(t.getMonth() + 1).toString()]
  }
  
  const handleRowClick = () => {
    // window.location.href = '/'
    navigate(`/`)
  };

  const handleClick = () => {
    // triggerEvent();
    // window.location.href = `/add-submission`
    navigate(`/add-submission`)
  };
  useEffect(() => {
    const ref = collection(db, 'reviews');
    const q = query(ref, where('uniName', '==', id), where('approved', '==', true));
    
    getDocs(q)
      .then((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });

        const averages = {
          difficulty: calculateAverage(data, 'difficulty'),
          friends: calculateAverage(data, 'friends'),
          jobChances: calculateAverage(data, 'jobChances'),
          materialQuality: calculateAverage(data, 'materialQuality'),
          oneOnOneTime: calculateAverage(data, 'oneOnOneTime'),
          overallScore: calculateAverage(data, 'overall'),
        };
  
        setAverages(averages)
        setQueryData(data);
      })
      .catch((error) => {
        console.log('Error getting documents:', error);
      });
      window.scrollTo(0, 0)

    },[]);
  
  return (
    <div className="container">
      <div id="mainDetails">
        <div className='header'>
          <h1 onClick={handleRowClick} className="title">RateMy<span id="uniLogin">Uni</span><span id="conz">.co.nz</span></h1>
          <form className="login-form">
              <button type="button" className="review-button" onClick={handleClick}>
              <span className="button-text">Write a review </span>
              </button>
          </form>
          </div>
          <div id="banner">
          {/* <img id="uniImage" src={uniImage}></img> */}
          {banner}
          <div id="bannerText"><div id="NZ">{id}</div> <div>Reviews</div></div>
          </div>
          <div id="UniDetails">
              <div>
                <div id="overallAverageScore">
                  <h2>{id} Average Score </h2>
                  <Rating name="size-large" size="large"
                    icon={<SchoolIcon style={{ fontSize: "50px" }}/>}
                    emptyIcon={<SchoolIcon style={{ fontSize: "50px" }}/>}
                    value={parseFloat(average.overallScore)} precision={0.1} readOnly/>            
                </div>
                <div id='averageScoreDetails'>
                  <h3>{id} Score Details</h3>
                    <table id="averagesReviewTable">
                      <tr>
                        <td id='leftColumn'>Course difficulty:</td>
                        <td>
                        <span className='ratingAverageDetailsStars'><Rating name="size-small" size="small"
                        icon={<SchoolIcon style={{ fontSize: "30px" }}/>}
                        emptyIcon={<SchoolIcon style={{ fontSize: "30px" }}/>}
                        value={parseFloat(average.difficulty)} precision={0.1} readOnly/></span>
                        </td>
                      </tr>
                      <tr>
                        <td>Meeting people: </td>
                        <td>
                        <span className='ratingAverageDetailsStars'><Rating name="size-small" size="small"
                        icon={<SchoolIcon style={{ fontSize: "30px" }}/>}
                        emptyIcon={<SchoolIcon style={{ fontSize: "30px" }}/>}
                        value={parseFloat(average.friends)} precision={0.1} readOnly/></span>
                        </td>
                      </tr>
                      <tr>
                        <td>Job chances: </td>
                        <td>
                        <span className='ratingAverageDetailsStars'><Rating name="size-small" size="small"
                        icon={<SchoolIcon style={{ fontSize: "30px" }}/>}
                        emptyIcon={<SchoolIcon style={{ fontSize: "30px" }}/>}
                        value={parseFloat(average.jobChances)} precision={0.1} readOnly/></span>
                        </td>
                      </tr>
                      <tr>
                        <td>Lecture quality: </td>
                        <td>
                        <Rating name="size-small" size="small"
                        icon={<SchoolIcon style={{ fontSize: "30px" }}/>}
                        emptyIcon={<SchoolIcon style={{ fontSize: "30px" }}/>}
                        value={parseFloat(average.materialQuality)} precision={0.1} readOnly/>
                        </td>
                      </tr>
                      <tr>
                        <td>One on one time:</td>
                        <td>
                        <Rating name="size-small" size="small"
                        icon={<SchoolIcon style={{ fontSize: "30px" }}/>}
                        emptyIcon={<SchoolIcon style={{ fontSize: "30px" }}/>}
                        value={parseFloat(average.oneOnOneTime)} precision={0.1} readOnly/>
                        </td>
                      </tr>

                    </table>
                    <button id="writeReview" type="button" onClick={handleClick}>Write a review</button>
                </div>
                <div id='browseRatings'>
                  <h3 >Student Reviews ({queryData.length})</h3>
                  <div>
                    {queryData.map((item, index) => (
                        <div className="review" key={index}>
                          <div className='userIndividualRating'> 
                          <Rating name="size-small" size="small"
                            icon={<SchoolIcon style={{ fontSize: "25px" }}/>}
                            emptyIcon={<SchoolIcon style={{ fontSize: "25px" }}/>}
                            value={parseFloat(item.overall.toLocaleString("en-US"))} precision={0.1} readOnly/>
                            </div><label>{item.course } </label>
                            <div className='dateReview'> {toDateTime(item.date.seconds)}</div>
                          <div className='notes'>{item.notes}</div>
                        <table id='reviewTable'>
                          <tbody>
                            <tr>
                              <td id='leftColumn'>Course difficulty:</td>
                              <td>
                              <span className='ratingsStars'><Rating name="size-small" size="small"
                                icon={<SchoolIcon fontSize="20px"/>}
                                emptyIcon={<SchoolIcon fontSize="20px"/>}
                                value={parseFloat(item.difficulty.toLocaleString("en-US"))} precision={0.1} readOnly/></span>
                              </td>
                            </tr>
                            <tr>
                              <td>Meeting people: </td>
                              <td>
                              <span className='ratingsStars'><Rating name="size-small" size="small"
                                icon={<SchoolIcon fontSize="20px"/>}
                                emptyIcon={<SchoolIcon fontSize="20px"/>}
                                value={parseFloat(item.friends.toLocaleString("en-US"))} precision={0.1} readOnly/>
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>Job chances: </td>
                              <td>
                              <span className='ratingsStars'><Rating name="size-small" size="small"
                                icon={<SchoolIcon fontSize="20px"/>}
                                emptyIcon={<SchoolIcon fontSize="20px"/>}
                                value={parseFloat(item.jobChances.toLocaleString("en-US"))} precision={0.1} readOnly/>
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>Lecture quality: </td>
                              <td>
                              <span className='ratingsStars'><Rating name="size-small" size="small"
                                icon={<SchoolIcon fontSize="20px"/>}
                                emptyIcon={<SchoolIcon fontSize="20px"/>}
                                value={parseFloat(item.materialQuality.toLocaleString("en-US"))} precision={0.1} readOnly/>
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>One on one time: </td>
                              <td>
                                <span className='ratingsStars'><Rating name="size-small" size="small"
                                  icon={<SchoolIcon fontSize="20px"/>}
                                  emptyIcon={<SchoolIcon fontSize="20px"/>}
                                  value={parseFloat(item.oneOnOneTime.toLocaleString("en-US"))} precision={0.1} readOnly/>
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
          </div>
        </div>
        {
          "Otago" == id ?         
        <div id='aboutUni'>
          <div id='aboutPanel'>
            <h3>About Otago Uni</h3>
            Otago University stands as the epitome of academic excellence, undeniably positioned as the premier educational institution in New Zealand. While occasional challenges such as the presence of scabies and the biting cold air persist, these only contribute to the unique character of the experience. Unmatched is the thrill of indulging in exuberant Castle revelries, only to embrace the aftermath by braving an early morning lecture amidst subzero temperatures—a foolproof remedy for any lingering hangover. It is worth noting that the local drug scene, while predominantly commendable, demands caution to ensure that one's intended purchases align with expectations. Nevertheless, the overall experience at Otago University remains truly exceptional.
          </div>
        </div>
        :
        <div></div>
        }

        <footer>
        <div id="footer">
          <h1 onClick={handleRowClick} className="title">RateMy<span id="uniLogin">Uni</span><span id="conz">.co.nz</span></h1>
        </div>

        </footer>

    </div>
  );
};

export default DetailComponent;
