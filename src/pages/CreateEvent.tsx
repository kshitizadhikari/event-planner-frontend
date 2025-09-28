import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Tag } from "../types/Event";
import { getAllTags } from "../api/tags";
import { jwtDecode } from "jwt-decode";
import { createEvent } from "../api/events";

type FormData = {
  title: string;
  description: string;
  date_time: string;
  location: string;
  type: "public" | "private";
  tag_ids: string[];
};

type JwtPayload = {
  userId: string; // match your backend JWT payload
  iat: number;
  exp: number;
};

export default function CreateEvent() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    date_time: "",
    location: "",
    type: "public",
    tag_ids: [],
  });
  const [tags, setTags] = useState<Tag[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch event types/tags
  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await getAllTags();
        setTags(res.data);
      } catch (err) {
        console.error("Failed to fetch tags", err);
      }
    }
    fetchTags();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if (e.target.name === "tag_ids" && e.target instanceof HTMLSelectElement) {
      const selectedOptions = Array.from(e.target.selectedOptions).map(
        (option) => option.value
      );
      setFormData({ ...formData, tag_ids: selectedOptions });
    } else if (e.target.name === "type") {
      setFormData({
        ...formData,
        type: e.target.value as "public" | "private",
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      // Decode token to get user_id
      const decoded = jwtDecode<JwtPayload>(token);
      const user_id = decoded.userId;

      const payload = {
        ...formData,
        user_id,
      };

      await createEvent(payload);
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to create event"
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Create Event</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="datetime-local"
          name="date_time"
          placeholder="Date and Time"
          value={formData.date_time}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        {/* Type dropdown */}
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>

        {/* Multi-select for tags */}
        <select
          name="tag_ids"
          value={formData.tag_ids}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          multiple
        >
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Event
        </button>
      </form>
    </div>
  );
}
