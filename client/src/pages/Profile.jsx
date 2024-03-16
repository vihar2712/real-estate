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
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import Loading from "../components/Loading";
import { Link, useNavigate } from "react-router-dom";
import Warning from "../components/Warning";
const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const { currentUser, error } = useSelector((store) => store.user);
  const [formData, setFormData] = useState(currentUser);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListing, setShowListing] = useState(false);
  const [listingError, setListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [showWarning, setShowWarning] = useState({
    showSign: false,
    warningSign: null,
  });
  const [warningResult, setWarningResult] = useState(false);
  const [listingId, setListingId] = useState(null);

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
        setUpdateLoading(true);
        setFileUploadError(false);
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setUpdateLoading(false);
        setFileUploadError(true);
        // console.log(error.code, error.message);
      },
      () => {
        setUpdateLoading(false);
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
      setFilePerc(0);
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

  const handleDeleteAccount = async () => {
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

  const handleListings = async () => {
    try {
      if (!showListing) {
        const res = await fetch("/api/user/listings/" + currentUser._id);
        const data = await res.json();
        if (data.success === false || data.length === 0) {
          setUpdateLoading(false);
          setListingError("There are no listings posted by you..");
          return;
        }
        setShowListing(true);
        setListingError(false);
        setUserListings(data);
      } else {
        setShowListing(false);
      }
    } catch (error) {
      setListingError("There are no listings posted by you..");
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      const res = await fetch("/api/listing/delete/" + listingId, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        setListingError(data.message);
        return;
      }
      const filteredListings = userListings.filter(
        (listing) => listing._id !== listingId
      );
      if (filteredListings.length === 0) setShowListing(false);
      setUserListings(filteredListings);
      setWarningResult(false);
    } catch (error) {
      setListingError(error.message);
    }
  };

  if (warningResult === true && showWarning.warningSign === "delete-listing")
    handleDeleteListing(listingId);

  if (warningResult === true && showWarning.warningSign === "delete-account")
    handleDeleteAccount();
  return (
    <div className={showListing ? "flex justify-evenly" : ""}>
      <div
        className={showListing ? "w-6/12 animate-slideX" : "animate-reverseX"}
      >
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
                Error uploading the image. Please select only images less than 5
                MB.
              </h1>
            ) : filePerc > 0 && filePerc < 100 ? (
              <h1 className="text-green-600 text-center">
                Uploading: {filePerc}% done
              </h1>
            ) : (
              filePerc === 100 && (
                <h1 className="text-green-700 text-center">
                  Uploaded Successfully. Click on update to save changes..
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
              disabled={updateLoading}
              className="bg-slate-700 text-white p-3 rounded-lg disabled:bg-slate-500 uppercase hover:opacity-95"
              onClick={(e) => handleSubmit(e)}
            >
              {updateLoading ? "Loading" : "Update"}
            </button>
            <Link
              to="/create-listing"
              className="bg-green-700 text-white p-3 rounded-lg text-center uppercase hover:opacity-95"
            >
              Create Listing
            </Link>
          </form>
          <div className="flex justify-between text-red-700 mt-5">
            <span
              className="cursor-pointer"
              onClick={() => {
                setShowWarning({
                  showSign: true,
                  warningSign: "delete-account",
                });
              }}
            >
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
          <button
            onClick={handleListings}
            className="text-white p-3 w-full uppercase rounded-lg bg-green-700 my-3"
          >
            {showListing ? "Hide your listings" : "Show your listings"}
          </button>
          {listingError && (
            <p className="text-red-700 text-sm">{listingError}</p>
          )}

          {updateLoading && <Loading />}
        </div>
      </div>
      {showListing && (
        <div className="w-4/12 animate-slideY">
          <h1 className="text-center font-semibold text-2xl my-7">
            Your listings
          </h1>
          <div className=" h-[500px] overflow-auto">
            {userListings?.map((listing) => (
              <div
                key={listing._id}
                className="p-3 border border-gray-200 flex justify-between gap-5"
              >
                <div className="flex items-center gap-4 w-10/12">
                  <img
                    src={listing.imageUrls[0]}
                    alt="listing-image"
                    className="w-36 h-36 rounded-md cursor-pointer"
                    onClick={() => navigate(`/listing/${listing._id}`)}
                  />
                  <h1
                    className="uppercase font-semibold truncate cursor-pointer"
                    onClick={() => navigate(`/listing/${listing._id}`)}
                  >
                    {listing.title}
                  </h1>
                </div>
                <div className="flex flex-col justify-center">
                  <button
                    className="uppercase text-red-700 hover:underline"
                    onClick={() => {
                      setShowWarning({
                        showSign: true,
                        warningSign: "delete-listing",
                      });
                      setListingId(listing._id);
                    }}
                  >
                    Delete
                  </button>
                  <Link to={"/update-listing/" + listing._id}>
                    <span className="uppercase text-green-700 hover:underline">
                      Edit
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {showWarning.showSign && showWarning.warningSign === "delete-listing" && (
        <Warning
          text={"this listing"}
          deleteAns={(ans) => setWarningResult(ans)}
          closeWarningSign={() =>
            setShowWarning({
              showSign: false,
              warningSign: "delete-listing",
            })
          }
        />
      )}
      {showWarning.showSign && showWarning.warningSign === "delete-account" && (
        <Warning
          text={"your account"}
          deleteAns={(ans) => setWarningResult(ans)}
          closeWarningSign={() =>
            setShowWarning({
              showSign: false,
              warningSign: "delete-account",
            })
          }
        />
      )}
    </div>
  );
};

export default Profile;
