import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { collection, getDocs } from "firebase/firestore";
import { database } from "../../../firebase";
import { NotesContext } from "../../App";

const MainLayout = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setAllNotes } = useContext(NotesContext);
  const profile = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(database, "notes"));
        const notesArray = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((note) => note.user.id === profile.id);
        setNotes(notesArray);
        setAllNotes(notesArray);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notes: ", error);
        setLoading(false);
      }
    };
    if (profile && profile.email) fetchNotes();
    else {
      navigate("/");
    }
  }, []);

  return (
    <div className="flex">
      <div className="hidden md:block w-[350px]">
        <Sidebar notes={notes} loading={loading} />
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
