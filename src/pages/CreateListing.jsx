import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Package,
  Car,
  Home as HomeIcon,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Sidebar from "../components/layout/sidebar";
import { createListing } from "../api/listings";
import { uploadImage } from "../api/upload";

function CreateListing() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    email: "",
    description: "",
    category: "Vehicles",
    location: "Palo Alto, CA",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const processFile = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return null;

    try {
      setUploadProgress("Uploading image...");

      const { data, error } = await uploadImage(imageFile);

      if (error) throw new Error(error);

      return data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      setUploading(true);
      setUploadProgress("Preparing your listing...");

      let imageUrl = null;
      if (imageFile) {
        imageUrl = await handleImageUpload();
      }

      setUploadProgress("Creating listing...");

      const { data, error } = await createListing({
        title: formData.title,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        seller_email: formData.email,
        location: formData.location,
        image_url: imageUrl,
      });

      if (error) {
        setErrorMessage(error);
        return;
      }

      setSuccess(true);
      setUploadProgress("Success! Redirecting...");

      // Navigate after showing success message
      setTimeout(() => {
        navigate(`/listing/${data.id}`);
      }, 1500);
    } catch (error) {
      console.error("Error creating listing:", error);
      setErrorMessage(
        error.message || "Failed to create listing. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <Sidebar type="create" fixed={false} />
      <main className="p-6 max-w-full flex-1 overflow-y-auto bg-white">
        <h2 className="text-2xl font-semibold mb-4 text-text-dark">
          Choose listing type
        </h2>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-primary-blue rounded-lg p-5 text-center cursor-pointer transition-all hover:shadow-md bg-blue-50">
            <div className="w-16 h-16 bg-primary-blue rounded-full mx-auto mb-3 flex items-center justify-center">
              <Package size={28} className="text-white" />
            </div>
            <h3 className="text-sm font-semibold mb-1">Item for sale</h3>
            <p className="text-xs text-dark-gray">Sell a single item quickly</p>
          </div>
          <div className="bg-white border border-border-gray rounded-lg p-5 text-center cursor-pointer transition-all hover:shadow-md hover:border-primary-blue">
            <div className="w-16 h-16 bg-medium-gray rounded-full mx-auto mb-3 flex items-center justify-center">
              <Upload size={28} className="text-dark-gray" />
            </div>
            <h3 className="text-sm font-semibold mb-1">
              Create multiple listings
            </h3>
            <p className="text-xs text-dark-gray">List several items at once</p>
          </div>
          <div className="bg-white border border-border-gray rounded-lg p-5 text-center cursor-pointer transition-all hover:shadow-md hover:border-primary-blue">
            <div className="w-16 h-16 bg-medium-gray rounded-full mx-auto mb-3 flex items-center justify-center">
              <Car size={28} className="text-dark-gray" />
            </div>
            <h3 className="text-sm font-semibold mb-1">Vehicle for sale</h3>
            <p className="text-xs text-dark-gray">
              List your car or motorcycle
            </p>
          </div>
          <div className="bg-white border border-border-gray rounded-lg p-5 text-center cursor-pointer transition-all hover:shadow-md hover:border-primary-blue">
            <div className="w-16 h-16 bg-medium-gray rounded-full mx-auto mb-3 flex items-center justify-center">
              <HomeIcon size={28} className="text-dark-gray" />
            </div>
            <h3 className="text-sm font-semibold mb-1">
              Home for sale or rent
            </h3>
            <p className="text-xs text-dark-gray">
              List property to sell or rent
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_450px] gap-6">
          <div className="bg-white border border-border-gray rounded-lg p-6 shadow-sm">
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div
                    className={`w-full h-60 bg-light-gray border-2 border-dashed rounded-lg flex items-center justify-center transition-all overflow-hidden ${
                      isDragging
                        ? "border-primary-blue bg-blue-50 scale-[1.02]"
                        : "border-border-gray hover:border-primary-blue hover:bg-blue-50"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload size={32} className="text-primary-blue mb-2" />
                        <span className="text-sm font-medium text-dark-gray">
                          {isDragging
                            ? "Drop image here"
                            : "Click or drag image to upload"}
                        </span>
                        <span className="text-xs text-dark-gray mt-1">
                          Max 5MB
                        </span>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              <div className="mb-5">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Title"
                  className="w-full p-3 border border-border-gray rounded-lg text-sm bg-white transition-all focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div className="mb-5">
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Price"
                  className="w-full p-3 border border-border-gray rounded-lg text-sm bg-white transition-all focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-blue-100"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="mb-5">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full p-3 border border-border-gray rounded-lg text-sm bg-white transition-all focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div className="mb-5">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-border-gray rounded-lg text-sm bg-white transition-all focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-blue-100"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-5">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  className="w-full p-3 border border-border-gray rounded-lg text-sm resize-y min-h-[120px] bg-white transition-all focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-blue-100"
                  rows="6"
                />
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <p className="text-sm text-red-600">{errorMessage}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-green-600" />
                  <p className="text-sm text-green-600 font-semibold">
                    Listing created successfully!
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-primary-blue text-white text-base font-semibold rounded-lg cursor-pointer transition-all mt-4 hover:bg-dark-blue disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={uploading}
              >
                {uploading && <Loader2 className="animate-spin" size={20} />}
                {uploading ? uploadProgress || "Creating..." : "Next"}
              </button>
            </form>
          </div>

          <div className="bg-white border border-border-gray rounded-lg p-6 shadow-sm sticky top-8 max-h-[calc(100vh-64px)] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-center">Preview</h3>
            <div className="w-full h-[280px] bg-light-gray border border-border-gray rounded-lg mb-4 overflow-hidden">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-50"></div>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold line-clamp-2">
                {formData.title || "Title"}
              </h2>
              <h3 className="text-2xl font-bold text-text-dark">
                {formData.price ? formatPrice(formData.price) : "Price"}
              </h3>
              <p className="text-sm text-dark-gray">
                Listed 1 hour ago • {formData.location}
              </p>
              <div className="p-3 bg-light-gray border border-border-gray rounded-lg mt-2">
                <h4 className="text-sm mb-1 font-semibold">Seller</h4>
                <p className="text-sm text-dark-gray">
                  {formData.email || "Your email"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default CreateListing;
