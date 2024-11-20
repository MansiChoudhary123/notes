import React, { useContext, useEffect, useState } from "react";
import { EditIcon, SearchIcon } from "../../assets/icons/searchIcon";
import AddEditNote from "./AddEditNote";
import { NotesContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { DeleteIcon } from "../../assets/icons/DeleteIcon";
import { deleteDoc, doc } from "firebase/firestore";
import { database } from "../../../firebase";
import { AddNotes } from "../../assets/icons/AddNotes";

const Sidebar = ({ notes, loading }) => {
  const { allNotes, setAllNotes } = useContext(NotesContext);
  const navigate = useNavigate();
  const [selectedNote, setSelectedNote] = useState(null);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [activeItem, setActiveItem] = useState(null);
  const profile = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    setFilteredNotes(allNotes);
  }, [allNotes]);

  const handleSearch = (e) => {
    let value = e.target.value.trim();
    setSearchValue(value);
    if (value.length == 0) {
      setFilteredNotes(allNotes);
    } else {
      let temp = notes.filter((item) =>
        item.title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredNotes(temp);
    }
  };

  const handleEditClick = () => {
    navigate("/home/create");
  };

  async function handleDeleteNotes(id) {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this note?"
      );
      if (!confirmDelete) {
        return;
      }

      console.log(id);
      const noteRef = doc(database, "notes", id);

      await deleteDoc(noteRef);
      const updatedNotes = allNotes.filter((note) => note.id !== id);
      setAllNotes(updatedNotes);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  }

  return (
    <div className="flex">
      <div className="w-full w-md-[350px] h-screen bg-gray-50 border-r border-gray-400 overflow-y-auto">
        <div className="pt-3 pl-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {profile ? `${profile.firstName}'s` : "My"} Notes
            </h2>
            <button onClick={handleEditClick}>
              <AddNotes className="w-8 h-8 mr-3 cursor-pointer text-xl" />
            </button>
          </div>
          <div className="mb-4 relative">
            <input
              type="text"
              value={searchValue}
              placeholder="Search Using Title"
              className="w-[95%] px-4 py-2 pl-10 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleSearch}
            />
            <SearchIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
          </div>
          <div className="space-y-1">
            {loading && (
              <div className="text-center">
                <p className="text-md font-medium">Loading ...</p>
              </div>
            )}
            {filteredNotes.length == 0 && !loading && (
              <div className="text-center">
                <p className="text-md font-medium">No Data To Show</p>
              </div>
            )}
            {filteredNotes.map((note, index) => (
              <div
                key={index}
                onMouseEnter={() => setActiveItem(note.id)}
                onMouseLeave={() => setActiveItem(null)}
                className="bg-white p-3 shadow-sm hover:bg-gray-100 transition-all cursor-pointer flex justify-between"
              >
                <div
                  className="w-[80%]"
                  onClick={() => navigate(`/home/view/${note.id}`)}
                >
                  <h3 className="font-medium text-gray-800">{note.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    {note.note}
                  </p>
                </div>
                {activeItem === note.id && (
                  <button
                    className=" text-md"
                    onClick={() => handleDeleteNotes(note.id)}
                  >
                    <DeleteIcon className="w-6 h-6" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
