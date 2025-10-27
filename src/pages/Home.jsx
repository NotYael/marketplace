import { useState, useEffect } from "react";
import { Search, Loader2, Grid3x3, List } from "lucide-react";
import ItemGrid from "../components/marketplace/item-grid";
import Sidebar from "../components/layout/sidebar";
import { getListings } from "../api/listings";

function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"

  useEffect(() => {
    fetchListings();
  }, [activeCategory, searchQuery]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await getListings({
        category: activeCategory,
        search: searchQuery,
      });

      if (error) {
        setError(error);
      } else {
        setListings(data);
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError("Failed to load listings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sidebar
        type="categories"
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <main className="flex-1 p-6 overflow-y-auto bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-text-dark">
              {activeCategory || "All listings"}
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-light-gray rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "grid"
                      ? "bg-white text-primary-blue shadow-sm"
                      : "text-dark-gray hover:text-text-dark"
                  }`}
                  title="Grid view"
                >
                  <Grid3x3 size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "list"
                      ? "bg-white text-primary-blue shadow-sm"
                      : "text-dark-gray hover:text-text-dark"
                  }`}
                  title="List view"
                >
                  <List size={20} />
                </button>
              </div>
              <div className="relative w-80">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-gray"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search marketplace..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-border-gray rounded-full text-sm bg-light-gray transition-all focus:outline-none focus:bg-white focus:border-primary-blue focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-dark-gray">
              <Loader2 className="animate-spin mb-3" size={40} />
              <p className="text-lg">Loading listings...</p>
            </div>
          )}
          {error && (
            <div className="text-center py-12 px-8 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-lg text-red-600 font-semibold mb-2">
                Oops! Something went wrong
              </p>
              <p className="text-sm text-red-500">{error}</p>
              <button
                onClick={fetchListings}
                className="mt-4 px-6 py-2 bg-primary-blue text-white rounded-lg hover:bg-dark-blue transition-all"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && (
            <ItemGrid listings={listings} viewMode={viewMode} />
          )}
        </div>
      </main>
    </>
  );
}

export default Home;
