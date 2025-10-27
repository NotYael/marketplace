import { useNavigate, useLocation } from "react-router-dom";
import { Plus, Tag, HelpCircle } from "lucide-react";

function Sidebar({
  type = "categories",
  activeCategory,
  onCategoryChange,
  fixed = false,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    "Vehicles",
    "Property Rentals",
    "Apparel",
    "Electronics",
    "Entertainment",
    "Family",
    "Free Stuff",
    "Garden & Outdoor",
    "Hobbies",
    "Home Goods",
    "Home Improvement",
    "Home Sales",
    "Musical Instruments",
    "Office Supplies",
    "Pet Supplies",
    "Sporting Goods",
    "Toys & Games",
  ];

  if (type === "categories") {
    return (
      <aside
        className={`w-[280px] bg-white border-r border-border-gray py-4 px-4 overflow-y-auto ${
          fixed ? "fixed top-[65px] left-0 bottom-0 h-[calc(100vh-65px)]" : ""
        }`}
      >
        <button
          onClick={() => navigate("/create")}
          className="w-full mb-4 px-4 py-2.5 bg-primary-blue text-white text-sm font-semibold rounded-lg cursor-pointer transition-all hover:bg-dark-blue flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Create new listing
        </button>
        <h2 className="text-lg font-semibold mb-2 text-text-dark px-2">
          Categories
        </h2>
        <ul className="list-none space-y-0">
          <li
            className={`py-1.5 px-2 rounded-lg cursor-pointer transition-all text-sm ${
              activeCategory === null
                ? "bg-blue-50 text-primary-blue font-semibold"
                : "text-text-dark hover:bg-gray-100"
            }`}
            onClick={() => onCategoryChange && onCategoryChange(null)}
          >
            All listings
          </li>
          {categories.map((category) => (
            <li
              key={category}
              className={`py-1.5 px-2 rounded-lg cursor-pointer transition-all text-sm ${
                activeCategory === category
                  ? "bg-blue-50 text-primary-blue font-semibold"
                  : "text-text-dark hover:bg-gray-100"
              }`}
              onClick={() => onCategoryChange && onCategoryChange(category)}
            >
              {category}
            </li>
          ))}
        </ul>
      </aside>
    );
  }

  if (type === "create") {
    return (
      <aside
        className={`w-[280px] bg-white border-r border-border-gray py-4 px-4 overflow-y-auto ${
          fixed ? "fixed top-[65px] left-0 bottom-0 h-[calc(100vh-65px)]" : ""
        }`}
      >
        <div className="space-y-1">
          <div
            className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all ${
              location.pathname === "/create"
                ? "bg-blue-50 text-primary-blue"
                : "hover:bg-gray-100"
            }`}
            onClick={() => navigate("/create")}
          >
            <div className="w-9 h-9 bg-medium-gray rounded-full flex items-center justify-center">
              <Plus size={20} className="text-dark-gray" />
            </div>
            <span className="text-[15px] font-medium">Create new listing</span>
          </div>
          <div className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all hover:bg-gray-100">
            <div className="w-9 h-9 bg-medium-gray rounded-full flex items-center justify-center">
              <Tag size={20} className="text-dark-gray" />
            </div>
            <span className="text-[15px] font-medium">Your listings</span>
          </div>
          <div className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all hover:bg-gray-100">
            <div className="w-9 h-9 bg-medium-gray rounded-full flex items-center justify-center">
              <HelpCircle size={20} className="text-dark-gray" />
            </div>
            <span className="text-[15px] font-medium">Seller help</span>
          </div>
        </div>
      </aside>
    );
  }

  return null;
}

export default Sidebar;
