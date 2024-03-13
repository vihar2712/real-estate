import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useState } from "react";
import { app } from "../../firebase";

const CreateListing = () => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const handleImageUpload = (e) => {
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
          setLoading(true);
        },
        (error) => {
          setLoading(false);
          reject(
            "Image upload error (Each file must be less than 5 MB & only image formats are allowed)"
          );
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setLoading(false);
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
    setFormData({ imageUrls: restItems });
  };

  return (
    <div className="max-w-4xl mx-auto p-3">
      <h1 className="text-3xl font-bold text-center my-7">Create a Listing</h1>
      <form className="flex gap-3">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            id="name"
            className="p-3 rounded-lg"
            required
            maxLength="60"
            minLength="10"
          />
          <textarea
            placeholder="Description"
            id="description"
            className="p-3 rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Address"
            id="address"
            className="p-3 rounded-lg"
            required
          />
          <div className="flex gap-7 flex-wrap">
            <div className="flex gap-1 items-center">
              <input type="checkbox" id="sell" className="w-5 h-5" />
              <label htmlFor="sell">Sell</label>
            </div>
            <div className="flex gap-1 items-center">
              <input type="checkbox" id="rent" className="w-5 h-5" />
              <label htmlFor="rent">Rent</label>
            </div>
            <div className="flex gap-1 items-center">
              <input type="checkbox" id="parking" className="w-5 h-5" />
              <label htmlFor="parking">Parking Spot</label>
            </div>
            <div className="flex gap-1 items-center">
              <input type="checkbox" id="furnished" className="w-5 h-5" />
              <label htmlFor="furnished">Furnished</label>
            </div>
            <div className="flex gap-1 items-center">
              <input type="checkbox" id="offer" className="w-5 h-5" />
              <label htmlFor="offer">Offer</label>
            </div>
          </div>
          <div className="flex gap-5">
            <div className="flex items-center">
              <input
                type="number"
                id="bedrooms"
                defaultValue="1"
                className="p-3 mr-2 rounded-lg w-20"
              />
              <span>Beds</span>
            </div>
            <div className="flex items-center">
              <input
                type="number"
                id="bedrooms"
                defaultValue="1"
                className="p-3 mr-2 rounded-lg w-20"
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
            />
            <div className="flex flex-col">
              <span>Regular Price</span>
              <span className="text-xs text-center">($ /Month)</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <input
              type="number"
              className="p-3 rounded-lg w-36"
              id="discountPrice"
              min="50"
            />
            <div className="flex flex-col">
              <span>Discounted Price</span>
              <span className="text-xs text-center">($ /Month)</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <h1 className="font-semibold">
            Images:{" "}
            <span className="font-normal text-slate-600">
              The first image will be the cover (max 6)
            </span>
          </h1>
          <div className="flex gap-3">
            <input
              type="file"
              accept="image/*"
              id="images"
              multiple
              className="border border-slate-300 rounded-md p-3"
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              disabled={loading}
              type="button"
              className="uppercase p-3 border border-green-500 rounded-lg hover:shadow-lg disabled:opacity-85"
              onClick={(e) => handleImageUpload(e)}
            >
              {loading ? "Uploading..." : "Upload"}
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
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
          <button className="bg-slate-700 uppercase p-3 text-white rounded-lg mt-4">
            Create Listing
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListing;
