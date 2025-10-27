import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Bell, User, Store } from "lucide-react";
import { getMessagesBySeller } from "../../api/messages";

function Header() {
  const navigate = useNavigate();
  const [messageCount, setMessageCount] = useState(0);

  // Current user's email (in a real app, this would come from authentication)
  const USER_EMAIL = "contactdanyael@gmail.com";

  useEffect(() => {
    fetchMessageCount();
  }, []);

  const fetchMessageCount = async () => {
    try {
      const { data, error } = await getMessagesBySeller(USER_EMAIL);
      if (!error && data) {
        setMessageCount(data.length);
      }
    } catch (err) {
      console.error("Error fetching message count:", err);
    }
  };

  return (
    <header className="bg-white border-b border-border-gray shadow-sm px-8 py-3">
      <div className="flex items-center justify-between w-full">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-10 h-10 bg-primary-blue rounded-full flex items-center justify-center text-xl font-bold text-white">
            <Store size={24} />
          </div>
          <h1 className="text-xl font-semibold text-text-dark">Marketplace</h1>
        </div>
        <div className="flex gap-2 items-center">
          <button
            className="w-10 h-10 bg-medium-gray rounded-full flex items-center justify-center cursor-pointer transition-all hover:bg-gray-300 relative"
            title="Messages"
            onClick={() => navigate("/messages")}
          >
            <MessageSquare size={20} className="text-dark-gray" />
            {messageCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                {messageCount > 99 ? "99+" : messageCount}
              </span>
            )}
          </button>
          <button
            className="w-10 h-10 bg-medium-gray rounded-full flex items-center justify-center cursor-pointer transition-all hover:bg-gray-300"
            title="Notifications"
          >
            <Bell size={20} className="text-dark-gray" />
          </button>
          <button
            className="w-10 h-10 bg-medium-gray rounded-full flex items-center justify-center cursor-pointer transition-all hover:bg-gray-300"
            title="Profile"
          >
            <User size={20} className="text-dark-gray" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
