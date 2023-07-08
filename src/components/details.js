import React, { useEffect, useState } from 'react';
import { collection, query , where, getDocs, doc, getDoc, updateDoc} from 'firebase/firestore';

import unihat from '../images/uni_hat.png'
import "../Login.css"
import { db } from '../firebase'; 
import Rating from '@mui/material/Rating';
import SchoolIcon from '@mui/icons-material/School';
import { useParams } from 'react-router-dom';
import { BrowserRouter as Router, Switch, Route, Routes, useNavigate  } from 'react-router-dom';
import Auckland from '../images/aucklanduni.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import ModalLogin from "../components/ModalLogin"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import DetailsUni from "../images/detailsUni.jpg"


const DetailComponent = ({ onRowClick, triggerEvent }) => {
  const {id} = useParams();
  const [queryData, setQueryData] = useState([]);
  const[average, setAverages] = useState([])
  const navigate = useNavigate();
  const [modal, setModal] = useState(false)
  const [signInText, setSignInText] = useState("Sign In")
  const auth = getAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('')
  const [sortBy, setSortBy] = useState("Highest Rating")
  const [isOpen, setIsOpen] = useState(false);

  const aboutOtago = "Otago University stands as the epitome of academic excellence, undeniably positioned as the premier educational institution in New Zealand. While occasional challenges such as the presence of scabies and the biting cold air persist, these only contribute to the unique character of the experience. Unmatched is the thrill of indulging in exuberant Castle revelries, only to embrace the aftermath by braving an early morning lecture amidst subzero temperatures—a foolproof remedy for any lingering hangover. It is worth noting that the local drug scene, while predominantly commendable, demands caution to ensure that one's intended purchases align with expectations. Nevertheless, the overall experience at Otago University remains truly exceptional."
  const aboutAuckland = "Nestled in the heart of Auckland, New Zealand, Auckland University stands as a shining testament to academic excellence, carving its place as the pinnacle of educational institutions in the city. With the backdrop of Auckland's breathtaking landscapes and the vibrant urban atmosphere, attending Auckland University becomes a truly one-of-a-kind experience. While occasional challenges like adapting to the city's ever-changing weather patterns and bustling city life may arise, they only add to the distinctive character of an Auckland University education. Amidst the academic rigors, students at Auckland University discover solace in the campus's green spaces and stunning views, providing moments of respite and inspiration. And when the time comes to unwind, Auckland's vibrant nightlife scene offers a tapestry of options, from live music performances to hidden speakeasies, ensuring that memorable moments are never in short supply."
  const aboutMassey = "Massey University, located in New Zealand, is known for its academic excellence and innovative approach to education. With campuses across the country, studying at Massey offers a diverse and enriching experience. The university's commitment to research and practical learning equips students with the skills needed for real-world success. Embrace the vibrant academic environment, engage in cutting-edge research, and embark on a transformative journey at Massey University."
  const aboutCanterbury = "Canterbury University, nestled in Christchurch, New Zealand, stands as a prestigious institution known for academic excellence. Embracing the city's vibrant culture and natural beauty, studying at Canterbury University becomes an extraordinary experience. Challenges like adapting to the weather and occasional seismic activity foster resilience. Students find inspiration in tranquil spots like Hagley Park and the Botanic Gardens. The university cultivates innovation and collaboration, empowering students to make meaningful contributions. Beyond academics, Christchurch offers a thriving arts scene and vibrant nightlife. It's important to approach the local environment with respect, cherishing the city's history. Embrace the fusion of academic rigor and Christchurch's spirit at Canterbury University, embarking on a transformative journey."
  const aboutWellington = "Victoria University of Wellington, located in vibrant Wellington, New Zealand's capital, is renowned for academic excellence and innovative research. The city's picturesque harbor and rolling hills create a captivating backdrop. Students can immerse themselves in the thriving arts and cultural scene, attending theater performances and visiting galleries. Wellington's political significance provides unique opportunities for internships and public policy engagement. Victoria University fosters critical thinking and global perspectives, preparing graduates for a changing world. Engage in community projects and environmental initiatives, making a positive impact. Embrace academic excellence, cultural vibrancy, and community spirit at Victoria University of Wellington for a transformative journey."
  const aboutLincoln = "Lincoln University, situated in picturesque Lincoln, New Zealand, is renowned for its academic excellence and agricultural expertise. Surrounded by the idyllic landscapes of Canterbury, studying at Lincoln University provides a unique experience. The university's focus on agriculture and environmental sciences aligns with the region's agricultural heritage. Embrace the beauty of the rural surroundings, immerse yourself in hands-on learning, and embark on a transformative journey at Lincoln University."
  const aboutAUT = "Auckland University of Technology (AUT) in vibrant Auckland, New Zealand, is renowned for its practical learning and industry engagement. With a focus on technological advancements, AUT prepares students for the modern world. The university's strong industry connections offer valuable internships and real-world experiences. Auckland's dynamic atmosphere adds to the AUT experience, with a vibrant arts scene, multicultural festivals, and a lively nightlife. AUT fosters an inclusive and diverse community, encouraging global perspectives. Embrace practical learning, industry connections, and the vibrant city life at AUT for a transformative journey."
  const aboutWaikato = "The University of Waikato in beautiful Waikato, New Zealand, is renowned for academic excellence and research innovation. Surrounded by stunning landscapes, studying here offers inspiration. Embrace the vibrant Māori culture and engage with the local community. The region's natural beauty invites outdoor adventures, from glowworm caves to scenic trails. The university's focus on experiential learning fosters practical skills and industry connections. Embrace academic excellence, cultural richness, and natural beauty at the University of Waikato for a transformative journey."
  
  let aboutUni;
  let banner;
  switch (id){
    case "Waikato":
      aboutUni = aboutWaikato
      break;
    case "Auckland":
      aboutUni = aboutAuckland
      break;
    case "Massey":
      aboutUni = aboutMassey
      break;
    case "AUT":
      aboutUni = aboutAUT
      break;
    case "Canterbury":
      aboutUni = aboutCanterbury
      break;
    case "Wellington":
      aboutUni = aboutWellington
      break;
    case "Otago":
      aboutUni = aboutOtago
      break;
    case "Lincoln":
      aboutUni = aboutLincoln
      break;
  }
  banner = <img id="uniImage" src={DetailsUni}></img>
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
    return t.getDate().toString() + nth(t.getDate().toString()) + " " + month[(t.getMonth()).toString()]
  }
  
  const handleRowClick = () => {
    // window.location.href = '/'
    navigate(`/`)
  };
  const aboutClick = () => {
    navigate(`/ambassador`)
  }  
  const onLogin = () => {
    navigate(`/review-reviews`)
  }

  const handleClick = () => {
    if(signInText == "Log Out"){
      signOut(auth).then(() => {
        console.log("user is signed out")
        window.localStorage.setItem('emailForSignIn', "")
        setSignInText("Sign In")
      }).catch((error) => {
        // An error happened.
      });
    }else{
      setModal(!modal)
    }
  };
  const reviewClick = () => {
    navigate(`/add-submission`)

  }
  const onSuccess = () => {
    setModal(!modal)
    setIsOpen(!isOpen);
    window.scrollTo(0, 0)
    console.log("this happened")
  }
  const onAnimationEnd = () => {
    if (!isOpen) {
      setIsOpen(false);
    }
  };
  const closePopDown = () => {
    setIsOpen(false)
  }



  const removeFromUp = async (item) => {
    const docRef = doc(db, "reviews", item.id);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data()
    const newArray = data.upvotes.filter(item => item !== userEmail);
    await updateDoc(docRef, { upvotes: newArray });

    setQueryData((prevState) => {
      const updatedData = prevState.map(obj => {
        if (obj.id === item.id) {
          const updatedNestedArray = obj.upvotes.filter(item => item !== userEmail);
          return { ...obj, upvotes: updatedNestedArray };
        }
        return obj;
      });
      return updatedData;
    })
  }
  const removeFromDown = async (item) => {
    const docRef = doc(db, "reviews", item.id);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data()
    const newArray = data.downvotes.filter(item => item !== userEmail);
    await updateDoc(docRef, { downvotes: newArray });
    setQueryData((prevState) => {
      const updatedData = prevState.map(obj => {
        if (obj.id === item.id) {
          const updatedNestedArray = obj.downvotes.filter(item => item !== userEmail);
          return { ...obj, downvotes: updatedNestedArray };
        }
        return obj;
      });
      return updatedData;
    })
  }

  const addToUp = async (item) => {
    const docRef1 = doc(db, "reviews", item.id);
    const docSnap1 = await getDoc(docRef1);
    const data1 = docSnap1.data();
    const newArray1 = [...data1.upvotes, userEmail]; // Add "Casper" to the array
    await updateDoc(docRef1, { upvotes: newArray1 });
    setQueryData((prevState) => {
      const updatedData = prevState.map(obj => {
        if (obj.id === item.id) {
          const newArray = [...data1.upvotes, userEmail]; // Add "Casper" to the array
          return { ...obj, upvotes: newArray };
        }
        return obj;
      });
      return updatedData;
    })
  }
  const addToDown = async (item) => {
    const docRef1 = doc(db, "reviews", item.id);
    const docSnap1 = await getDoc(docRef1);
    const data1 = docSnap1.data();
    const newArray1 = [...data1.downvotes, userEmail]; // Add "Casper" to the array

    await updateDoc(docRef1, { downvotes: newArray1 });

    setQueryData((prevState) => {
      const updatedData = prevState.map(obj => {
        if (obj.id === item.id) {
          const newArray = [...data1.downvotes, userEmail]; // Add "Casper" to the array
          return { ...obj, downvotes: newArray };
        }
        return obj;
      });
      return updatedData;
    })

  }
  const upVote = async (item) => {
    if(isLoggedIn){
      if(item.upvotes.includes(userEmail)){
        removeFromUp(item)
      }else if(item.downvotes.includes(userEmail)){
        removeFromDown(item)
        addToUp(item)
      }else{
        addToUp(item)
      }
    }else{
      setModal(true)
    }
  }
  const downVote = async (item) => {
    if(isLoggedIn){
      if(item.downvotes.includes(userEmail)){
        removeFromDown(item)
      }else if(item.upvotes.includes(userEmail)){
        removeFromUp(item)
        addToDown(item)
      }else{
        addToDown(item)
      }
    }else{
      setModal(true)
    }
  }
  const sortHighestRating = () => {
    const sortedData = [...queryData].sort((a, b) => (a.downvotes.length - a.upvotes.length) - (b.downvotes.length - b.upvotes.length));
    setQueryData(sortedData);
  };
  const sortDate = () => {
    const sortedData = [...queryData].sort((a, b) => b.date - a.date);
    setQueryData(sortedData);
  };

useEffect(() => {
  if(sortBy == "Highest Rating"){
    sortHighestRating()
  }else{
    sortDate()
  }
  console.log("sortby changed")
},[sortBy]);

useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setSignInText("Log Out")
        setIsLoggedIn(true)
        setUserEmail(user.email)
        console.log("user is signed in")
        console.log("user: " + user.email)
      } else {
        setSignInText("Sign In")
        setIsLoggedIn(false)
        setUserEmail("")
        console.log("user is signed out")
        console.log("user " + userEmail)
      }
    });

    const ref = collection(db, 'reviews');
    const q = query(ref, where('uniName', '==', id), where('approved', '==', true));
    
    getDocs(q)
      .then((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          // data.push(doc.data());
          data.push({
            id: doc.id,
            ...doc.data(),
            });
        });

        const averages = {
          difficulty: calculateAverage(data, 'difficulty'),
          friends: calculateAverage(data, 'friends'),
          jobChances: calculateAverage(data, 'jobChances'),
          materialQuality: calculateAverage(data, 'materialQuality'),
          oneOnOneTime: calculateAverage(data, 'oneOnOneTime'),
          overallScore: calculateAverage(data, 'overall'),
        };
        const sortedData = [...data].sort((a, b) => (a.downvotes.length - a.upvotes.length) - (b.downvotes.length - b.upvotes.length));

        setAverages(averages)
        setQueryData(sortedData);
      })
      .catch((error) => {
        console.log('Error getting documents:', error);
      });
      window.scrollTo(0, 0)

    },[]);
  
  return (
    <div className="container">
      {isOpen && (
      <div className={`pop-down ${isOpen ? "open" : ""}`} onAnimationEnd={onAnimationEnd}>
        <h2 className="pop-down-title">Login Link Sent!</h2>
        <p className="pop-down-text">Keep calm and check your spam folder</p>
        <button id='closePopDown' onClick={closePopDown}>Close</button>
        </div>
      )}
      <div id="mainDetails">
        <div className='header'>
          <h1 onClick={handleRowClick} className="title">RateMy<span id="uniLogin">Uni</span><span id="conz">.co.nz</span></h1>
          
          <form className="login-form">
          <button type="button" className="review-button" onClick={reviewClick}>
          <span className="button-text"><span id='write'>Write</span> Review </span>
          </button>
        </form>
        <button type="button" className="writeReview" onClick={handleClick}>{signInText}</button>

          </div>
          <div id="banner">
          {banner}
          <div id="bannerText"><div id="NZ">{id}</div> <div>Reviews</div></div>
          </div>
          <div id="UniDetails">
              <div>
                <div id="overallAverageScore">
                  <h2>{id} Average Score </h2>
                  <Rating name="size-large" size="large"
                    icon={<SchoolIcon style={{ fontSize: "40px" }}/>}
                    emptyIcon={<SchoolIcon style={{ fontSize: "40px" }}/>}
                    value={parseFloat(average.overallScore)} precision={0.1} readOnly/>            
                </div>
                <div id='averageScoreDetails'>
                  <h3>{id} Score Details</h3>
                    <table id="averagesReviewTable">
                    <tbody>
                      <tr>
                        <td id='leftColumn'>Course difficulty:</td>
                        <td>
                        <span className='ratingAverageDetailsStars'><Rating name="size-small" size="small"
                        icon={<SchoolIcon style={{ fontSize: "25px" }}/>}
                        emptyIcon={<SchoolIcon style={{ fontSize: "25px" }}/>}
                        value={parseFloat(average.difficulty)} precision={0.1} readOnly/></span>
                        </td>
                      </tr>
                      <tr>
                        <td>Meeting people: </td>
                        <td>
                        <span className='ratingAverageDetailsStars'><Rating name="size-small" size="small"
                        icon={<SchoolIcon style={{ fontSize: "25px" }}/>}
                        emptyIcon={<SchoolIcon style={{ fontSize: "25px" }}/>}
                        value={parseFloat(average.friends)} precision={0.1} readOnly/></span>
                        </td>
                      </tr>
                      <tr>
                        <td>Job chances: </td>
                        <td>
                        <span className='ratingAverageDetailsStars'><Rating name="size-small" size="small"
                        icon={<SchoolIcon style={{ fontSize: "25px" }}/>}
                        emptyIcon={<SchoolIcon style={{ fontSize: "25px" }}/>}
                        value={parseFloat(average.jobChances)} precision={0.1} readOnly/></span>
                        </td>
                      </tr>
                      <tr>
                        <td>Lecture quality: </td>
                        <td>
                        <Rating name="size-small" size="small"
                        icon={<SchoolIcon style={{ fontSize: "25px" }}/>}
                        emptyIcon={<SchoolIcon style={{ fontSize: "25px" }}/>}
                        value={parseFloat(average.materialQuality)} precision={0.1} readOnly/>
                        </td>
                      </tr>
                      <tr>
                        <td>One on one time:</td>
                        <td>
                        <Rating name="size-small" size="small"
                        icon={<SchoolIcon style={{ fontSize: "25px" }}/>}
                        emptyIcon={<SchoolIcon style={{ fontSize: "25px" }}/>}
                        value={parseFloat(average.oneOnOneTime)} precision={0.1} readOnly/>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                    <button id="writeReview" type="button" onClick={reviewClick}>Write Review</button>
                </div>
                <div id='browseRatings'>
                  <h3 >Student Reviews ({queryData.length})</h3>
                  <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="Highest Rating">Highest Rating</option>
                    <option value="Date" >Most Recent</option>
                  </select>

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
                        <div className="rating">
                              <span  className={item.upvotes.includes(userEmail) ? "mythumb" : "thumb"}>
                                <FontAwesomeIcon onClick={ () => upVote(item)} icon={faThumbsUp} /> <span id='numVotes'>{item.upvotes.length}</span>
                              </span>
                              <span className={item.downvotes.includes(userEmail) ? "mythumb" : "thumb"}>
                                <FontAwesomeIcon onClick={ () => downVote(item)}icon={faThumbsDown} /> <span id='numVotes'>{item.downvotes.length}</span>
                              </span>
                            </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div id='aboutUni'>
                  <div id='aboutPanel'>
                    <h3>About {id} Uni</h3>
                    {aboutUni}
                  </div>
                </div>
              </div>
          </div>
        </div>
        <footer>
          <div id="footer">
            <h1 onClick={handleRowClick} className="title">RateMy<span id="uniLogin">Uni</span><span id="conz">.co.nz</span></h1>
            <span onClick={reviewClick} id="LoginReviews">Review</span><span onClick={aboutClick} id="LoginReviews">Student Ambassador</span><span onClick={onLogin} id="LoginReviews">Admin</span>
          </div>
        </footer>
        {modal && (
        <ModalLogin trigger={handleClick} successSubmit={onSuccess}/>
      )}

    </div>
  );
};
export default DetailComponent;