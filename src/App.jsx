import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layout/header";
import Home from "./pages/Home";
import ListingDetail from "./pages/ListingDetail";
import CreateListing from "./pages/CreateListing";
import Messages from "./pages/Messages";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1 w-full relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listing/:id" element={<ListingDetail />} />
            <Route path="/create" element={<CreateListing />} />
            <Route path="/messages" element={<Messages />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
