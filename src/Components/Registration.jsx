import React, { useState } from "react";
import { Link } from "react-router-dom";
import { database } from "../../firebase";
import { collection } from "firebase/firestore";
import { addDoc, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Registration() {
  // Define state variables
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [firstName, setFirstName] = useState("");
  let [lastName, setLastName] = useState("");
  let [error, setError] = useState("");
  let [loading, setLoading] = useState(false); // Fixed typo in variable name
  let navigate = useNavigate();

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); // Show loading state

    // Form validation
    if (firstName.length < 3) {
      setError("First Name is Too Short");
      setLoading(false);
      return;
    }

    if (lastName.length < 2) {
      // Simplified validation
      setError("Last Name is Too Short"); // Fixed error message
      setLoading(false);
      return;
    }

    if (!email.includes("@")) {
      // Simple email validation
      setError("Enter Valid Email");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password Must be Atleast 6 Character Long");
      setLoading(false);
      return;
    }

    setError("");

    // Database operations
    try {
      // Check if user exists
      let users = await getDocs(collection(database, "users"));
      let exists = false;

      users.docs.forEach((doc) => {
        if (doc.data().email === email) {
          exists = true;
        }
      });

      if (exists) {
        setError("User with this email already Exists");
        setLoading(false);
        return;
      }

      // Add new user
      let newUser = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
      };

      let result = await addDoc(collection(database, "users"), newUser);
      console.log("New user added with ID:", result.id);

      // Save to local storage and redirect
      localStorage.setItem(
        "user",
        JSON.stringify({ firstName, email, id: result.id })
      ); // Fixed localStorage
      setLoading(false);
      navigate("/home/create");
    } catch (error) {
      console.log("Error:", error);
      setError("Failed to register the user");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 rounded-md">
      <div className="max-w-md w-full p-8 bg-white rounded-md-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-8">
            Create Account
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="mb-4">
              <label htmlFor="firstName">First Name:</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="lastName">Last Name:</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="mb-4">
              <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>
            </div>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "blue",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? "Please wait..." : "Register Now"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <p>
            Already have an account?
            <Link to="/" style={{ color: "blue", marginLeft: "5px" }}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Registration;
