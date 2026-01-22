const BASE_URL = "https://ims-backend-10r7.onrender.com";

async function request(endpoint: string, options: RequestInit = {}) {
  const isBrowser = typeof window !== "undefined";
  const token = isBrowser ? localStorage.getItem("accessToken") : null;

  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle unauthorized access by redirecting to login
  if (response.status === 401 && isBrowser) {
    localStorage.removeItem("accessToken");
    if (window.location.pathname !== "/") {
      window.location.href = "/";
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export type MedicinePayload = {
  name: string;
  category: string;
  manufacturer: string;
  batchNumber: string;
  quantity: number;
  minStock: number;
  expiryDate: string;
  price: number;
};

export type UserProfile = {
  username: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
  profilePic: string;
  address: string;
};

export type UserProfileUpdate = {
  firstName?: string;
  lastName?: string;
  gender?: string;
  phoneNumber?: string;
  profilePic?: string;
  address?: string;
};

export type UserLoginUpdate = {
  username?: string;
  email?: string;
  newPassword?: string;
  currentPassword: string;
};

export const api = {
  getMedicines: () => request("/medicines"),

  getMedicine: (id: number) => request(`/medicines/${id}`),

  addMedicine: (medicine: MedicinePayload) =>
    request("/medicines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(medicine),
    }),

  updateMedicine: (id: number, updates: MedicinePayload) =>
    request(`/medicines/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    }),

  restockMedicine: (id: number, amount: number) =>
    request(`/medicines/${id}/restock?amount=${amount}`, {
      method: "PUT",
    }),

  dispenseMedicine: (id: number, amount: number) =>
    request(`/medicines/${id}/dispense?amount=${amount}`, {
      method: "PUT",
    }),

  deleteMedicine: (id: number) => request(`/medicines/${id}`, { method: "DELETE" }),

  exportMedicines: async (format: string = "csv") => {
    const isBrowser = typeof window !== "undefined";
    const token = isBrowser ? localStorage.getItem("accessToken") : null;

    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}/medicines/export?format=${format}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`Export failed with status ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `medicines-export.${format === "excel" ? "xlsx" : "csv"}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  getMedicinesStatus: () => request("/medicines/status"),

  searchMedicines: (query: string) => request(`/medicines/search?query=${query}`),

  login: async (formData: FormData) => {
    const response = await fetch(`${BASE_URL}/token`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Login failed");
    }
    return response.json();
  },

  createUser: (userData: any) =>
    request("/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    }),

  updateUser: (username: string, updates: any) =>
    request(`/users/${username}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    }),

  deleteUser: (username: string) =>
    request(`/users/${username}`, {
      method: "DELETE",
    }),

  getCurrentUser: () => request("/users/me"),

  getProfile: (): Promise<UserProfile> => request("/users/me/profile"),

  updateProfile: (updates: UserProfileUpdate): Promise<UserProfile> =>
    request("/users/me/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    }),

  updateLoginDetails: (updates: UserLoginUpdate) =>
    request("/users/me/login-details", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    }),
};
