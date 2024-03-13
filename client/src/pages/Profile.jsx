import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import {
  setLoading,
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import Loading from "./Loading";
import { Link } from "react-router-dom";
const Profile = () => {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const { currentUser, loading, error } = useSelector((store) => store.user);
  const [formData, setFormData] = useState(currentUser);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (selectedFile) {
      handleFileUpload();
    }
  }, [selectedFile]);

  const handleFileUpload = () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + selectedFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        dispatch(setLoading(true));
        setFileUploadError(false);
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        dispatch(setLoading(false));
        setFileUploadError(true);
        console.log(error.code, error.message);
      },
      () => {
        dispatch(setLoading(false));
        setFileUploadError(false);
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());

      const res = await fetch("/api/user/update/" + currentUser._id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      setUpdateSuccess(true);
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 2000);
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(signInStart());
      const res = await fetch("api/user/delete/" + currentUser._id, {
        method: "DELETE",
      });
      const data = res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(null));
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/auth/signout");
      const data = res.json();
      if (data.success === false) {
        dispatch(signInFailure(error.message));
        return;
      }
      dispatch(signInSuccess(null));
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center mt-4">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        <img
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="w-24 h-24 rounded-full self-center mt-2 cursor-pointer border-2 border-slate-700"
          onClick={() => {
            fileRef.current.click();
          }}
        />
        {fileUploadError ? (
          <h1 className="text-red-700 text-center">
            Error uploading the image. Please select only images less than 5 MB.
          </h1>
        ) : filePerc > 0 && filePerc < 100 ? (
          <h1 className="text-green-600 text-center">
            Uploading: {filePerc}% done
          </h1>
        ) : (
          filePerc === 100 && (
            <h1 className="text-green-700 text-center">
              Uploaded Successfully.
            </h1>
          )
        )}
        <input
          type="text"
          placeholder="username"
          id="username"
          className="p-3 rounded-lg"
          defaultValue={currentUser.username}
          onChange={(e) => handleChange(e)}
          required
        />
        <input
          type="email"
          id="email"
          placeholder="email"
          className="p-3 rounded-lg"
          defaultValue={currentUser.email}
          onChange={(e) => handleChange(e)}
          required
        />
        <input
          id="password"
          type="password"
          placeholder="password"
          className="p-3 rounded-lg"
          onChange={(e) => handleChange(e)}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg disabled:bg-slate-500 uppercase hover:opacity-95"
          onClick={(e) => handleSubmit(e)}
        >
          {loading ? "Loading" : "Update"}
        </button>
        <Link
          to="/create-listing"
          className="bg-green-700 text-white p-3 rounded-lg text-center uppercase hover:opacity-95"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between text-red-700 mt-5">
        <span className="cursor-pointer" onClick={handleDelete}>
          Delete account
        </span>
        <span className="cursor-pointer" onClick={handleSignOut}>
          Sign Out
        </span>
      </div>
      {error && <p className="text-red-700 mt-5 text-lg">{error}</p>}
      {updateSuccess && (
        <p className="text-green-700 mt-5 text-lg">
          Successfully updated your profile!
        </p>
      )}
      {loading && <Loading />}
    </div>
  );
};

export default Profile;
