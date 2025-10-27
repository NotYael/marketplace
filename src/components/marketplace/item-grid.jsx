import { useNavigate } from "react-router-dom";
import { PackageOpen, MapPin } from "lucide-react";
import ItemCard from "./item-card";

function ItemGrid({ listings, viewMode = "grid" }) {
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-8 bg-light-gray border border-border-gray rounded-lg">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <PackageOpen size={40} className="text-primary-blue" />
        </div>
        <h3 className="text-xl font-semibold text-text-dark mb-2">
          No listings found
        </h3>
        <p className="text-dark-gray mb-6 text-center max-w-md">
          We couldn't find any items matching your search. Try adjusting your
          filters or be the first to create a listing!
        </p>
        <button
          onClick={() => navigate("/create")}
          className="px-6 py-2.5 bg-primary-blue text-white font-semibold rounded-lg hover:bg-dark-blue transition-all"
        >
          Create New Listing
        </button>
      </div>
    );
  }

  // Grid View
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 mb-8">
        {listings.map((listing) => (
          <ItemCard key={listing.id} listing={listing} />
        ))}
      </div>
    );
  }

  // List View
  return (
    <div className="flex flex-col gap-3 mb-8">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="bg-white border border-border-gray rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg flex items-center gap-4"
          onClick={() => navigate(`/listing/${listing.id}`)}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-text-dark mb-1 truncate">
                  {formatPrice(listing.price)}
                </h3>
                <p className="text-[15px] text-text-dark mb-2 line-clamp-1">
                  {listing.title}
                </p>
                <div className="flex items-center gap-4 text-sm text-dark-gray">
                  <div className="flex items-center gap-1">
                    <MapPin
                      size={14}
                      className="text-dark-gray flex-shrink-0"
                    />
                    <span>{listing.location}</span>
                  </div>
                  {listing.category && (
                    <span className="px-2 py-0.5 bg-light-gray rounded text-xs">
                      {listing.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ItemGrid;
