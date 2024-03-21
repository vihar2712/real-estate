import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { app } from "../../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";

const UpdateListing = () => {
  const params = useParams();
  const navigate = useNavigate();
  //   const { currentUser } = useSelector((store) => store.user);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [error, setError] = useState(false);
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    regularPrice: 50,
    discountPrice: 0,
    bedrooms: 1,
    bathrooms: 1,
    type: "rent",
    parking: false,
    furnished: false,
    offer: false,
    imageUrls: [],
  });
  const handleImageUpload = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setImageUploadError(false);
      const promises = [];
      Array.from(files).map((file) => {
        promises.push(storeImage(file));
      });
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setError(false);
        })
        .catch((err) => {
          setImageUploadError(err);
        });
    } else {
      setImageUploadError(
        "Total number of images must be less than 7 and at least 1 image must be selected"
      );
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setUploading(true);
        },
        (error) => {
          setUploading(false);
          reject(
            "Image upload error (Each file must be less than 5 MB & only image formats are allowed)"
          );
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUploading(false);
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleDeleteItem = (itemIndex) => {
    const restItems = formData.imageUrls.filter(
      (_, index) => index !== itemIndex
    );
    setFormData({ ...formData, imageUrls: restItems });
  };

  const handleChange = (e) => {
    if (e.target.id === "sell" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }
    if (e.target.id === "offer" && e.target.checked === false) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
        discountPrice: 0,
      });
    }

    if (
      e.target.id === "title" ||
      e.target.id === "description" ||
      e.target.id === "address" ||
      e.target.id === "bedrooms" ||
      e.target.id === "bathrooms" ||
      e.target.id === "regularPrice" ||
      e.target.id === "discountPrice"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(formData);
      if (formData.imageUrls.length < 1)
        return setError("You need to upload atleast one image");

      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discounted Price must be less than Regular Price");

      setLoading(true);
      setError(false);

      const res = await fetch("/api/listing/update/" + params.listingId, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // userRef is required to know which user has listed
      });

      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setSuccessMsg("successfully updated.. Redirecting to your listing...");
      setTimeout(() => {
        navigate(`/listing/${data._id}`);
      }, 2000);
    } catch (error) {
      // console.log(error);
      setError(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/listing/get/" + params.listingId);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
      }
      setFormData(data);
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-3">
      <h1 className="text-3xl font-bold text-center my-7">Update a Listing</h1>
      <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Title"
            id="title"
            className="p-3 rounded-lg"
            required
            maxLength="60"
            minLength="10"
            value={formData.title}
            onChange={handleChange}
          />
          <textarea
            placeholder="Description"
            id="description"
            rows="4"
            className="p-3 rounded-lg"
            required
            value={formData.description}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Address"
            id="address"
            className="p-3 rounded-lg"
            required
            value={formData.address}
            onChange={handleChange}
          />
          <div className="flex gap-7 flex-wrap">
            <div className="flex gap-1 items-center">
              <input
                type="checkbox"
                id="sell"
                className="w-5 h-5"
                checked={formData.type === "sell"}
                onChange={handleChange}
              />
              <label htmlFor="sell">Sell</label>
            </div>
            <div className="flex gap-1 items-center">
              <input
                type="checkbox"
                id="rent"
                className="w-5 h-5"
                checked={formData.type === "rent"}
                onChange={handleChange}
              />
              <label htmlFor="rent">Rent</label>
            </div>
            <div className="flex gap-1 items-center">
              <input
                type="checkbox"
                id="parking"
                className="w-5 h-5"
                checked={formData.parking}
                onChange={handleChange}
              />
              <label htmlFor="parking">Parking Spot</label>
            </div>
            <div className="flex gap-1 items-center">
              <input
                type="checkbox"
                id="furnished"
                className="w-5 h-5"
                checked={formData.furnished}
                onChange={handleChange}
              />
              <label htmlFor="furnished">Furnished</label>
            </div>
            <div className="flex gap-1 items-center">
              <input
                type="checkbox"
                id="offer"
                className="w-5 h-5"
                checked={formData.offer}
                onChange={handleChange}
              />
              <label htmlFor="offer">Offer</label>
            </div>
          </div>
          <div className="flex gap-5">
            <div className="flex items-center">
              <input
                type="number"
                id="bedrooms"
                className="p-3 mr-2 rounded-lg w-20"
                value={formData.bedrooms}
                onChange={handleChange}
              />
              <span>Beds</span>
            </div>
            <div className="flex items-center">
              <input
                type="number"
                id="bathrooms"
                className="p-3 mr-2 rounded-lg w-20"
                value={formData.bathrooms}
                onChange={handleChange}
              />
              <span>Baths</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <input
              type="number"
              className="p-3 rounded-lg w-36"
              id="regularPrice"
              min="50"
              max="1000000000"
              value={formData.regularPrice}
              onChange={handleChange}
            />
            <div className="flex flex-col">
              <span>Regular Price</span>
              {formData.type === "rent" && (
                <span className="text-xs text-center">(₹ /Month)</span>
              )}
            </div>
          </div>
          {formData.offer && (
            <div className="flex items-center gap-1">
              <input
                type="number"
                className="p-3 rounded-lg w-36"
                id="discountPrice"
                min="0"
                max="1000000000"
                value={formData.discountPrice}
                onChange={handleChange}
              />
              <div className="flex flex-col">
                <span>Discounted Price</span>
                {formData.type === "rent" && (
                  <span className="text-xs text-center">(₹ /Month)</span>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <h1 className="font-semibold">
            Images:{" "}
            <span className="font-normal text-slate-600">
              The first image will be the cover (max 6)
            </span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="file"
              accept="image/*"
              id="images"
              multiple
              className="border border-slate-300 rounded-md p-3"
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              disabled={uploading}
              type="button"
              className="uppercase p-3 border border-green-500 rounded-lg hover:shadow-lg disabled:opacity-85"
              onClick={(e) => handleImageUpload(e)}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {imageUploadError && (
            <p className="text-red-700 text-sm">{imageUploadError}</p>
          )}
          {formData.imageUrls.length > 0 && (
            <div className="h-[322px]  overflow-y-auto">
              {formData.imageUrls.map((imageUrl, index) => (
                <div key={imageUrl} className="flex justify-between p-3 border">
                  <img
                    src={imageUrl}
                    alt="listing-image"
                    className="w-32 h-32 rounded-md"
                  />
                  <button
                    className="uppercase text-red-700"
                    onClick={() => handleDeleteItem(index)}
                  >
                    <FaTrash className="text-red-700 hover:text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            disabled={uploading || loading}
            className="bg-slate-700 uppercase p-3 text-white rounded-lg mt-4 disabled:opacity-75"
          >
            {loading ? "Updating..." : "Update Listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
          {successMsg && <p className="text-green-700">{successMsg}</p>}
        </div>
      </form>
    </div>
  );
};

export default UpdateListing;
