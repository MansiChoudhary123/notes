import React, { useState, useEffect, useContext } from "react";
import { database } from "../../../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { NotesContext } from "../../App";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { BackButton } from "../../assets/icons/BackButton";

const AddEditNote = () => {
  const { allNotes, setAllNotes } = useContext(NotesContext);
  const [showButton, setShowButton] = useState(false);
  const [note, setNote] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const { notes_id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const temp = allNotes.find((item) => item.id == notes_id);
    setSelectedNote(temp);
  }, [notes_id, allNotes]);

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setNote(selectedNote.note);
      setShowButton(true);
    } else {
      setTitle("");
      setNote("");
      setShowButton(false);
    }
  }, [selectedNote]);

  const handleNoteChange = (e) => {
    setNote(e.target.value);
    setShowButton(true);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSaveNote = async () => {
    const profile = JSON.parse(localStorage.getItem("user"));
    if (title.trim() === "" || note.trim() === "") {
      setError("Title or note cannot be empty.");
    } else {
      try {
        if (selectedNote) {
          const noteRef = doc(database, "notes", selectedNote.id);
          await updateDoc(noteRef, {
            title: title,
            note: note,
            updatedAt: serverTimestamp(),
            user: doc(database, "users", profile.id),
          });
          console.log("Note updated with ID: ", selectedNote.id);

          const updatedNotes = allNotes.map((item) =>
            item.id === selectedNote.id ? { ...item, title, note } : item
          );
          setAllNotes(updatedNotes);
        } else {
          const docRef = await addDoc(collection(database, "notes"), {
            title: title,
            note: note,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            user: doc(database, "users", profile.id),
          });
          console.log("Document written with ID: ", docRef.id);

          const newNote = { id: docRef.id, title, note };
          setAllNotes([...allNotes, newNote]);
        }
        setError("");
        setTitle("");
        setNote("");
        setShowButton(false);
      } catch (error) {
        console.error("Error saving document: ", error);
        setError("Failed to save note. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="w-full px-4 flex justify-center items-center">
        <div className="flex flex-col my-14 w-full md:w-[80%] lg:w-[60%] mx-auto ">
          <div className="block md:hidden mb-4">
            <button
              onClick={() => navigate("/list")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg flex items-center"
            >
              <BackButton />
            </button>
          </div>
          <input
            className="outline-none my-3 text-xl font-bold text-black"
            placeholder="Title"
            value={title}
            onChange={handleTitleChange}
          />
          <textarea
            className="outline-none w-full min-h-[70vh] resize-y"
            placeholder="Enter your notes here"
            value={note}
            onChange={handleNoteChange}
          />
          {error && <div className="text-red-500 mx-20 my-2">{error}</div>}
          {showButton && (
            <div className="mt-10">
              <button
                className="bg-black text-white p-2 rounded-md"
                onClick={handleSaveNote}
              >
                {selectedNote ? "Update Note" : "Add Note"}
              </button>
            </div>
          )}
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default AddEditNote;
