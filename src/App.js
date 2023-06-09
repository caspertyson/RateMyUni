import logo from "./logo.svg";
import "./App.css";
import React from "react";
import AddSubmission from "./components/AddSubmission";
import Login from "./components/Login";
import {
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

function App() {
  const [todos, setTodos] = React.useState([]);
  const [login, setLogin] = React.useState(false);

  React.useEffect(() => {
    const q = query(collection(db, "todos"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let todosArray = [];
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArray);
    });
    return () => unsub();
  }, []);

  const handleEdit = async (todo, title) => {
    await updateDoc(doc(db, "todos", todo.id), { title: title });
  };
  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, "todos", todo.id), { completed: !todo.completed });
  };
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };

  const loginEvent = () => {
    setLogin(!login)
  };

  return (
    <div className="App">
      {!login ? (<Login triggerEvent={loginEvent}/>) : 
      (
        <>
          <AddSubmission triggerEvent={loginEvent}/>
        </>
      )
      }
    </div>
  );
}
export default App;