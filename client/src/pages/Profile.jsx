import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { signInSuccess } from "../redux/user/userSlice";
const Profile = () => {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const { currentUser } = useSelector((store) => store.user);
  const [formData, setFormData] = useState(currentUser);

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
        setFileUploadError(false);
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        console.log(error.code, error.message);
      },
      () => {
        setFileUploadError(false);
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleUpdate = () => {
    dispatch(signInSuccess(formData));
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
          className="w-24 h-24 rounded-full self-center mt-2 cursor-pointer"
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
        <input type="text" placeholder="username" className="p-3 rounded-lg" />
        <input type="email" placeholder="email" className="p-3 rounded-lg" />
        <input
          type="password"
          placeholder="password"
          className="p-3 rounded-lg"
        />
        <button
          type="button"
          className="bg-slate-700 text-white p-3 rounded-lg"
          onClick={handleUpdate}
        >
          Update
        </button>
      </form>
      <div className="flex justify-between text-red-700 mt-5">
        <span className="cursor-pointer">Delete account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
};

export default Profile;
