import { FaMapMarkerAlt } from "react-icons/fa";

const ListingCard = ({ listing }) => {
  const {
    title,
    type,
    imageUrls,
    regularPrice,
    discountPrice,
    address,
    description,
    bedrooms,
    bathrooms,
  } = listing;
  return (
    <div className="relative bg-white flex flex-col gap-4 shadow-md hover:shadow-lg rounded-md overflow-hidden transition-shadow w-full sm:w-[330px] border">
      <div className="absolute top-0 left-0 bg-orange-700 p-1 rounded-r-lg rounded-tr-none z-20 ">
        {discountPrice > 0 && (
          <span className="text-white font-semibold">offer available</span>
        )}
      </div>
      <img
        src={imageUrls[0]}
        className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
      />
      <div className="p-3 flex flex-col gap-2 h-[175px]">
        <h1 className="text-slate-700 font-semibold truncate text-lg">
          {title}
        </h1>
        <div className="flex gap-1 items-center">
          <FaMapMarkerAlt className="text-orange-700" />
          <p className="truncate text-xs">{address}</p>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
        <div className="flex gap-2">
          <p className="text-slate-500 font-semibold">
            ₹ {regularPrice.toLocaleString("en-IN")}
            {type === "sell" ? "" : " / month"}
          </p>
        </div>
        <div className="flex gap-3 text-slate-700 font-bold text-xs">
          <p>
            {bedrooms}
            {bedrooms > 1 ? " beds" : " bed"}
          </p>
          <p>
            {bathrooms}
            {bathrooms > 1 ? " baths" : " bed"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
