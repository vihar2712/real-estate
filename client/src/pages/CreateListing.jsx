import React from "react";

const CreateListing = () => {
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
          <div className="flex gap-5 flex-wrap">
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
              multiple
              className="border border-slate-300 rounded-md p-3"
            />
            <button className="uppercase p-3 border border-green-500 rounded-lg hover:shadow-lg">
              Upload
            </button>
          </div>
          <button className="bg-slate-700 uppercase p-3 text-white rounded-lg mt-4">
            Create Listing
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListing;
