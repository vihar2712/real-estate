import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import OAuth from "./OAuth";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((store) => store.user);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await res.json(); // result is the json object sent via server response (check inside /api/controller/auth.controller.js)
      if (result.success === false) {
        dispatch(signInFailure(result.message));
        return;
      }
      dispatch(signInSuccess(result));
      navigate("/");
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };
  return (
    <div>
      <h1 className="text-center text-3xl font-semibold my-7">Sign Up</h1>
      <form
        className="flex flex-col gap-4 max-w-xl p-3 mx-auto"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          onChange={handleChange}
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg"
          required
        />
        <input
          type="email"
          onChange={handleChange}
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
          required
        />
        <input
          type="password"
          onChange={handleChange}
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          required
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase disabled:opacity-90 hover:opacity-95"
        >
          {loading ? "loading" : "Sign Up"}
        </button>
        <OAuth signUp={true} />
        <p>
          Have an account?{" "}
          <Link to={"/sign-in"}>
            <span className="text-blue-600">Sign In</span>
          </Link>
        </p>
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  );
};

export default SignUp;
