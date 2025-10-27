import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { getListingById } from "../api/listings";
import { sendMessage } from "../api/messages";

function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("I want to buy your bike!");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await getListingById(id);

      if (error) {
        setError(error);
      } else {
        setListing(data);
      }
    } catch (err) {
      console.error("Error fetching listing:", err);
      setError("Failed to load listing. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!buyerEmail.trim() || !message.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setSending(true);

      const { data, error } = await sendMessage({
        listing_id: listing.id,
        buyer_email: buyerEmail,
        seller_email: listing.seller_email,
        message: message,
      });

      if (error) {
        alert(error);
        return;
      }

      setMessageSent(true);
      setMessage("");
      setBuyerEmail("");

      setTimeout(() => {
        setMessageSent(false);
      }, 3000);
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
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

  if (loading)
    return (
      <main className="flex-1 p-8 overflow-y-auto bg-white">
        <div className="flex flex-col items-center justify-center py-20 text-dark-gray">
          <Loader2 className="animate-spin mb-3" size={40} />
          <p className="text-lg">Loading listing...</p>
        </div>
      </main>
    );
  if (error)
    return (
      <main className="flex-1 p-8 overflow-y-auto bg-white">
        <div className="max-w-2xl mx-auto text-center py-20 px-8 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="mx-auto mb-3 text-red-600" size={48} />
          <p className="text-lg text-red-600 font-semibold mb-2">
            Unable to load listing
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
  if (!listing)
    return (
      <main className="flex-1 p-8 overflow-y-auto bg-white">
        <div className="max-w-2xl mx-auto text-center py-20 px-8 bg-light-gray border border-border-gray rounded-lg">
          <AlertCircle className="mx-auto mb-3 text-dark-gray" size={48} />
          <p className="text-lg text-text-dark font-semibold mb-2">
            Listing not found
          </p>
          <p className="text-sm text-dark-gray mb-4">
            This listing may have been removed or doesn't exist.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-primary-blue text-white rounded-lg hover:bg-dark-blue transition-all"
          >
            Back to Marketplace
          </button>
        </div>
      </main>
    );

  return (
    <main className="flex-1 p-8 overflow-y-auto bg-white">
      <div className="max-w-[1400px] mx-auto w-full">
        <button
          className="flex items-center gap-2 bg-transparent border-none text-primary-blue text-base font-semibold cursor-pointer py-2 mb-6 transition-all hover:text-dark-blue hover:-translate-x-1"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={20} />
          Back to Marketplace
        </button>

        <div className="grid grid-cols-[1fr_500px] gap-8 bg-white border border-border-gray rounded-lg overflow-hidden shadow-sm">
          <div className="p-6">
            <div className="w-full h-[600px] bg-light-gray border border-border-gray rounded-lg overflow-hidden">
              {listing.image_url ? (
                <img
                  src={listing.image_url}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[linear-gradient(135deg,#b8e0ff_25%,transparent_25%),linear-gradient(225deg,#b8e0ff_25%,transparent_25%),linear-gradient(45deg,#b8e0ff_25%,transparent_25%),linear-gradient(315deg,#b8e0ff_25%,#e3f2ff_25%)] bg-[length:20px_20px] bg-[position:10px_0,10px_0,0_0,0_0]"></div>
              )}
            </div>
          </div>

          <div className="bg-light-gray p-8 border-l border-border-gray overflow-y-auto max-h-[700px]">
            <div className="flex flex-col gap-6">
              <h1 className="text-[32px] font-bold text-text-dark m-0">
                {listing.title}
              </h1>
              <h2 className="text-[40px] font-bold text-text-dark m-0">
                {formatPrice(listing.price)}
              </h2>

              <p className="text-base text-dark-gray leading-relaxed">
                Listed {getTimeAgo(listing.created_at)}
                <br />
                <span className="flex items-center gap-1 mt-1">
                  <MapPin size={16} className="text-dark-gray" />
                  {listing.location}
                </span>
              </p>

              <div className="p-4 bg-white border border-border-gray rounded-lg shadow-sm">
                <h3 className="text-lg mb-2 font-semibold">
                  Seller Information
                </h3>
                <p className="text-base text-dark-gray">
                  {listing.seller_email}
                </p>
              </div>

              {listing.description && (
                <div className="p-4 bg-white border border-border-gray rounded-lg shadow-sm">
                  <h3 className="text-lg mb-2 font-semibold">Description</h3>
                  <p className="leading-relaxed text-text-dark">
                    {listing.description}
                  </p>
                </div>
              )}

              <div className="mt-2">
                <h3 className="text-lg mb-3 font-semibold">
                  Send seller a message
                </h3>
                <form onSubmit={handleSendMessage}>
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full p-3 border border-border-gray rounded-lg text-sm bg-white transition-all focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-blue-100 mb-3"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    required
                  />
                  <textarea
                    className="w-full p-3 border border-border-gray rounded-lg text-sm resize-y min-h-[120px] bg-white transition-all focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-blue-100 mb-3"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    rows="6"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-primary-blue text-white text-base font-semibold rounded-lg cursor-pointer transition-all hover:bg-dark-blue disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={sending}
                  >
                    {sending && <Loader2 className="animate-spin" size={20} />}
                    {sending ? "Sending..." : "Send"}
                  </button>
                  {messageSent && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center gap-2">
                      <CheckCircle2 size={20} className="text-green-600" />
                      <p className="text-sm text-green-600 font-semibold">
                        Message sent successfully!
                      </p>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ListingDetail;
