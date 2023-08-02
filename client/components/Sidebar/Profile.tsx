import React, { useState } from "react";
import { IoPersonCircle } from "react-icons/io5";
import Modal from "react-modal";
import { supabase } from "../../utils/supabaseClient";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#141619",
    color: "white",
    borderRadius: "10px",
    padding: "20px",
  },
};

// Modal.setAppElement("#root");

const Profile = () => {
  //   const user = useUser();
  const [modalIsOpen, setIsOpen] = useState(false);

  console.log("supabase.auth", supabase.auth);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full bg-[#141619] text-white">
      <button
        onClick={openModal}
        className="flex items-center space-x-2 text-white text-lg"
      >
        <IoPersonCircle className="text-2xl" />
        <h2>Lucas</h2>
        {/* <h2>{user?.email}</h2> */}
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="User Menu"
      >
        <h2 className="text-lg font-bold mb-4">User Menu</h2>
        <button
          onClick={closeModal}
          className="w-full h-12 text-lg text-center rounded-md bg-gray-700 my-2 text-white"
        >
          Settings
        </button>
        <button
          onClick={() => {
            supabase.auth.signOut();
            closeModal();
          }}
          className="w-full h-12 text-lg text-center rounded-md bg-gray-700 my-2 text-white"
        >
          Log out
        </button>
      </Modal>
    </div>
  );
};

export default Profile;
