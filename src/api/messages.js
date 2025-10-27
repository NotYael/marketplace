/**
 * Messages API
 * RESTful service for messaging operations
 */

import supabase from "../lib/supabase";

/**
 * GET /api/messages - Get messages for a listing
 * @param {string} listingId - Listing ID to get messages for
 * @returns {Promise<{data: Array, error: null} | {data: null, error: string}>}
 */
export const getMessages = async (listingId) => {
  try {
    if (!listingId) {
      throw new Error("Listing ID is required");
    }

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("listing_id", listingId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return {
      data: data || [],
      error: null,
    };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return {
      data: null,
      error: error.message || "Failed to fetch messages",
    };
  }
};

/**
 * GET /api/messages/seller - Get messages for a seller
 * @param {string} sellerEmail - Seller's email address
 * @returns {Promise<{data: Array, error: null} | {data: null, error: string}>}
 */
export const getMessagesBySeller = async (sellerEmail) => {
  try {
    if (!sellerEmail) {
      throw new Error("Seller email is required");
    }

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("seller_email", sellerEmail)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return {
      data: data || [],
      error: null,
    };
  } catch (error) {
    console.error("Error fetching seller messages:", error);
    return {
      data: null,
      error: error.message || "Failed to fetch messages",
    };
  }
};

/**
 * POST /api/messages - Send message to seller
 * @param {Object} messageData - Message data
 * @param {string} messageData.listing_id - Listing ID (required)
 * @param {string} messageData.buyer_email - Buyer's email (required)
 * @param {string} messageData.seller_email - Seller's email (required)
 * @param {string} messageData.message - Message content (required)
 * @returns {Promise<{data: Object, error: null} | {data: null, error: string}>}
 */
export const sendMessage = async (messageData) => {
  try {
    // Validate required fields
    const requiredFields = [
      "listing_id",
      "buyer_email",
      "seller_email",
      "message",
    ];
    const missingFields = requiredFields.filter((field) => !messageData[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    // Validate email formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(messageData.buyer_email)) {
      throw new Error("Invalid buyer email format");
    }
    if (!emailRegex.test(messageData.seller_email)) {
      throw new Error("Invalid seller email format");
    }

    // Validate message content
    if (!messageData.message.trim()) {
      throw new Error("Message content cannot be empty");
    }

    if (messageData.message.length > 1000) {
      throw new Error("Message is too long (max 1000 characters)");
    }

    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          listing_id: messageData.listing_id,
          buyer_email: messageData.buyer_email.trim(),
          seller_email: messageData.seller_email.trim(),
          message: messageData.message.trim(),
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
    console.error("Error sending message:", error);
    return {
      data: null,
      error: error.message || "Failed to send message",
    };
  }
};

/**
 * DELETE /api/messages/:id - Delete a message
 * @param {string} id - Message ID
 * @returns {Promise<{data: boolean, error: null} | {data: null, error: string}>}
 */
export const deleteMessage = async (id) => {
  try {
    if (!id) {
      throw new Error("Message ID is required");
    }

    const { error } = await supabase.from("messages").delete().eq("id", id);

    if (error) {
      throw error;
    }

    return {
      data: true,
      error: null,
    };
  } catch (error) {
    console.error("Error deleting message:", error);
    return {
      data: null,
      error: error.message || "Failed to delete message",
    };
  }
};
