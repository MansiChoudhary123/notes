import { createContext, useState } from "react";
import "./App.css";
import Login from "./Components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Topbar from "./Components/Topbar";
import Registration from "./Components/Registration";
import MainLayout from "./Components/Layout/MainLayout";
import AddEditNote from "./Components/Layout/AddEditNote";
import Sidebar from "./Components/Layout/Sidebar";
export const NotesContext = createContext();

function App() {
  const [allNotes, setAllNotes] = useState([]);

  return (
    <>
      <NotesContext.Provider value={{ allNotes, setAllNotes }}>
        <Router>
          <Topbar />
          <Routes>
            <Route path="/" element={<Login />}></Route>
            <Route path="/register" element={<Registration />}></Route>
            <Route path="/list" element={<Sidebar />} />
            <Route path="/home" element={<MainLayout />}>
              <Route path="/home/create" element={<AddEditNote />} />
              <Route path="/home/view/:notes_id" element={<AddEditNote />} />
            </Route>
          </Routes>
        </Router>
      </NotesContext.Provider>
    </>
  );
}

export default App;
