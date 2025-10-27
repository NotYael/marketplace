import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Mail, Clock, ArrowLeft } from "lucide-react";
import { getMessagesBySeller } from "../api/messages";
import { getListingById } from "../api/listings";

function Messages() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [listingsMap, setListingsMap] = useState({});

  // Current user's email (in a real app, this would come from authentication)
  const USER_EMAIL = "contactdanyael@gmail.com";

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await getMessagesBySeller(USER_EMAIL);

      if (error) {
        setError(error);
        return;
      }

      setMessages(data);

      // Fetch listing details for each message
      const uniqueListingIds = [...new Set(data.map((msg) => msg.listing_id))];
      const listingPromises = uniqueListingIds.map((id) => getListingById(id));
      const listingResults = await Promise.all(listingPromises);

      const listingsData = {};
      listingResults.forEach((result) => {
        if (result.data) {
          listingsData[result.data.id] = result.data;
        }
      });

      setListingsMap(listingsData);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600)
      return `${Math.floor(seconds / 60)} minute${
        Math.floor(seconds / 60) > 1 ? "s" : ""
      } ago`;
    if (seconds < 86400)
      return `${Math.floor(seconds / 3600)} hour${
        Math.floor(seconds / 3600) > 1 ? "s" : ""
      } ago`;
    if (seconds < 604800)
      return `${Math.floor(seconds / 86400)} day${
        Math.floor(seconds / 86400) > 1 ? "s" : ""
      } ago`;
    return `${Math.floor(seconds / 604800)} week${
      Math.floor(seconds / 604800) > 1 ? "s" : ""
    } ago`;
  };

  if (loading) {
    return (
      <main className="flex-1 p-8 overflow-y-auto bg-white">
        <div className="flex flex-col items-center justify-center py-20 text-dark-gray">
          <Loader2 className="animate-spin mb-3" size={40} />
          <p className="text-lg">Loading messages...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 p-8 overflow-y-auto bg-white">
        <div className="max-w-2xl mx-auto text-center py-20 px-8 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-lg text-red-600 font-semibold mb-2">
            Unable to load messages
          </p>
          <p className="text-sm text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-primary-blue text-white rounded-lg hover:bg-dark-blue transition-all"
          >
            Back to Marketplace
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-8 overflow-y-auto bg-white">
      <div className="max-w-[1200px] mx-auto">
        <button
          className="flex items-center gap-2 bg-transparent border-none text-primary-blue text-base font-semibold cursor-pointer py-2 mb-6 transition-all hover:text-dark-blue hover:-translate-x-1"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={20} />
          Back to Marketplace
        </button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-dark mb-2">
            Your Messages
          </h1>
          <p className="text-dark-gray">
            Messages from buyers interested in your listings
          </p>
        </div>

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-8 bg-light-gray border border-border-gray rounded-lg">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Mail size={40} className="text-primary-blue" />
            </div>
            <h3 className="text-xl font-semibold text-text-dark mb-2">
              No messages yet
            </h3>
            <p className="text-dark-gray mb-6 text-center max-w-md">
              When buyers send you messages about your listings, they'll appear
              here.
            </p>
            <button
              onClick={() => navigate("/create")}
              className="px-6 py-2.5 bg-primary-blue text-white font-semibold rounded-lg hover:bg-dark-blue transition-all"
            >
              Create New Listing
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const listing = listingsMap[message.listing_id];
              return (
                <div
                  key={message.id}
                  className="bg-white border border-border-gray rounded-lg p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail size={18} className="text-primary-blue" />
                        <span className="font-semibold text-text-dark">
                          {message.buyer_email}
                        </span>
                      </div>
                      {listing && (
                        <div
                          className="text-sm text-dark-gray mb-2 cursor-pointer hover:text-primary-blue"
                          onClick={() => navigate(`/listing/${listing.id}`)}
                        >
                          Re:{" "}
                          <span className="font-medium">{listing.title}</span> (
                          {formatPrice(listing.price)})
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-dark-gray">
                      <Clock size={14} />
                      <span>{getTimeAgo(message.created_at)}</span>
                    </div>
                  </div>

                  <div className="bg-light-gray p-4 rounded-lg border border-border-gray">
                    <p className="text-text-dark whitespace-pre-wrap">
                      {message.message}
                    </p>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <a
                      href={`mailto:${message.buyer_email}?subject=Re: ${
                        listing?.title || "Your inquiry"
                      }&body=Hi,%0D%0A%0D%0AThank you for your interest in my listing.%0D%0A%0D%0A`}
                      className="px-4 py-2 bg-primary-blue text-white text-sm font-semibold rounded-lg hover:bg-dark-blue transition-all"
                    >
                      Reply via Email
                    </a>
                    {listing && (
                      <button
                        onClick={() => navigate(`/listing/${listing.id}`)}
                        className="px-4 py-2 bg-light-gray text-text-dark text-sm font-semibold rounded-lg hover:bg-gray-300 transition-all"
                      >
                        View Listing
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default Messages;
