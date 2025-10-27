import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

function ItemCard({ listing }) {
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      className="bg-white border border-border-gray rounded-lg overflow-hidden cursor-pointer transition-all duration-200 h-full flex flex-col hover:shadow-lg"
      onClick={() => navigate(`/listing/${listing.id}`)}
    >
      <div className="w-full h-[200px] overflow-hidden bg-light-gray relative">
        {listing.image_url ? (
          <img
            src={listing.image_url}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-50"></div>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-text-dark m-0">
          {formatPrice(listing.price)}
        </h3>
        <p className="text-[15px] text-text-dark m-0 leading-tight line-clamp-2">
          {listing.title}
        </p>
        <div className="flex items-center gap-1 mt-1">
          <MapPin size={14} className="text-dark-gray" />
          <p className="text-sm text-dark-gray m-0">{listing.location}</p>
        </div>
      </div>
    </div>
  );
}

export default ItemCard;
