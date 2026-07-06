import axios from "axios";
import { toast } from "react-toastify";

// Date formatting functions
export const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
};

export const formatDateTimeForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// API call functions
export const deleteRent = async (apiUrl, token, rentId, t) => {
  try {
    await axios.post(
      `${apiUrl}/rents/delete_user`,
      { id: rentId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success(t("Rent deleted successfully"));
    return true;
  } catch (error) {
    console.error("Error deleting rent:", error);
    toast.error(error.response?.data?.message || t("Failed to delete rent"));
    return false;
  }
};

export const deleteCode = async (apiUrl, token, code, userId, t) => {
  try {
    await axios.post(
      `${apiUrl}/rents/delete_code`,
      { code, user_id: userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success(t("Code deleted successfully"));
    return true;
  } catch (error) {
    console.error("Error deleting code:", error);
    toast.error(error.response?.data?.message || t("Failed to delete code"));
    return false;
  }
};

// Group rent data by owner and dates
export const groupRentsByOwner = (renters) => {
  const rentGroups = renters.reduce((acc, renter) => {
    const key = `${renter.owner_id}_${renter.from}_${renter.to}`;
    if (!acc[key]) {
      acc[key] = {
        key,
        owner: renter.owner || renter.user,
        from: renter.from,
        to: renter.to,
        people: renter.people,
        unit: renter.appartment,
        codes: [],
      };
    }
    acc[key].codes.push(renter);
    return acc;
  }, {});

  return Object.values(rentGroups);
};
