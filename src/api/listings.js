/**
 * Listings API
 * RESTful service for listing operations
 */

import supabase from "../lib/supabase";

/**
 * GET /api/listings - Browse listings with search/filter
 * @param {Object} params - Query parameters
 * @param {string} params.category - Filter by category
 * @param {string} params.search - Search in title/description
 * @returns {Promise<{data: Array, error: null} | {data: null, error: string}>}
 */
export const getListings = async ({ category = null, search = null } = {}) => {
  try {
    let query = supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });

    // Filter by category
    if (category) {
      query = query.eq("category", category);
    }

    // Search in title and description
    if (search && search.trim()) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return {
      data: data || [],
      error: null,
    };
  } catch (error) {
    console.error("Error fetching listings:", error);
    return {
      data: null,
      error: error.message || "Failed to fetch listings",
    };
  }
};

/**
 * GET /api/listings/:id - Get specific listing by ID
 * @param {string} id - Listing ID
 * @returns {Promise<{data: Object, error: null} | {data: null, error: string}>}
 */
export const getListingById = async (id) => {
  try {
    if (!id) {
      throw new Error("Listing ID is required");
    }

    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return {
          data: null,
          error: "Listing not found",
        };
      }
      throw error;
    }

    return {
      data,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching listing:", error);
    return {
      data: null,
      error: error.message || "Failed to fetch listing",
    };
  }
};

/**
 * POST /api/listings - Create new listing
 * @param {Object} listingData - Listing data
 * @param {string} listingData.title - Listing title (required)
 * @param {number} listingData.price - Price (required)
 * @param {string} listingData.seller_email - Seller email (required)
 * @param {string} listingData.category - Category (required)
 * @param {string} listingData.description - Description (optional)
 * @param {string} listingData.location - Location (optional)
 * @param {string} listingData.image_url - Image URL (optional)
 * @returns {Promise<{data: Object, error: null} | {data: null, error: string}>}
 */
export const createListing = async (listingData) => {
  try {
    // Validate required fields
    const requiredFields = ["title", "price", "seller_email", "category"];
    const missingFields = requiredFields.filter((field) => !listingData[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(listingData.seller_email)) {
      throw new Error("Invalid email format");
    }

    // Validate price
    if (parseFloat(listingData.price) <= 0) {
      throw new Error("Price must be greater than 0");
    }

    const { data, error } = await supabase
      .from("listings")
      .insert([
        {
          title: listingData.title,
          description: listingData.description || null,
          price: parseFloat(listingData.price),
          category: listingData.category,
          seller_email: listingData.seller_email,
          location: listingData.location || "Palo Alto, CA",
          image_url: listingData.image_url || null,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      data,
      error: null,
    };
  } catch (error) {
    console.error("Error creating listing:", error);
    return {
      data: null,
      error: error.message || "Failed to create listing",
    };
  }
};

/**
 * PUT /api/listings/:id - Update existing listing
 * @param {string} id - Listing ID
 * @param {Object} updateData - Fields to update
 * @returns {Promise<{data: Object, error: null} | {data: null, error: string}>}
 */
export const updateListing = async (id, updateData) => {
  try {
    if (!id) {
      throw new Error("Listing ID is required");
    }

    const { data, error } = await supabase
      .from("listings")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      data,
      error: null,
    };
  } catch (error) {
    console.error("Error updating listing:", error);
    return {
      data: null,
      error: error.message || "Failed to update listing",
    };
  }
};

/**
 * DELETE /api/listings/:id - Delete listing
 * @param {string} id - Listing ID
 * @returns {Promise<{data: boolean, error: null} | {data: null, error: string}>}
 */
export const deleteListing = async (id) => {
  try {
    if (!id) {
      throw new Error("Listing ID is required");
    }

    const { error } = await supabase.from("listings").delete().eq("id", id);

    if (error) {
      throw error;
    }

    return {
      data: true,
      error: null,
    };
  } catch (error) {
    console.error("Error deleting listing:", error);
    return {
      data: null,
      error: error.message || "Failed to delete listing",
    };
  }
};
