import React, { useState } from "react";
import { Link } from "react-router-dom";
import { database } from "../../firebase";
import { collection } from "firebase/firestore";
import { getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email.length <= 4) {
      setError("Enter Valid Email");
      return;
    }
    if (password.length < 6) {
      setError("Password Must be Atleast 6 Character Long");
      return;
    }
    setError("");
    try {
      const userList = await getDocs(collection(database, "users"));
      const user = userList.docs.find(
        (doc) => doc.data().email === email && doc.data().password === password
      );

      if (!user) {
        setError("Invalid email or password");
        return;
      }

      const userData = user.data();

      localStorage.setItem(
        "user",
        JSON.stringify({
          firstName: userData.first_name,
          email: userData.email,
          id: user.id,
        })
      );
      navigate("/home/create");
    } catch (e) {
      setError("Failed to login");
      console.error("Error during login: ", e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Login Page
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-2"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-2"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>
          </div>
          <div>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "blue",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Login
            </button>
          </div>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <p>
            New User?
            <Link to="/register" style={{ color: "blue", marginLeft: "5px" }}>
              Click here to Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
