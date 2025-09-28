import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Event, Tag } from "../types/Event";
import { getAllTags } from "../api/tags";
import { jwtDecode } from "jwt-decode";
import { createEvent, getEvent, updateEvent } from "../api/events";
import { formatDateForInput } from "../utils/utils";

type FormData = {
  title: string;
  description: string;
  date_time: string;
  location: string;
  type: "public" | "private";
  tag_ids: string[];
};

type JwtPayload = { userId: string; iat: number; exp: number };

export default function CreateEvent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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
  const [fetchedEvent, setFetchedEvent] = useState<Event | null>(null);

  // Fetch tags for dropdown
  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await getAllTags();
        setTags(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchTags();
  }, []);

  // Fetch event if editing
  useEffect(() => {
    if (!id) return;

    async function fetchEventData() {
      try {
        const res = await getEvent(id);
        const eventData = res.data;
        setFetchedEvent(eventData);
        setFormData({
          title: eventData.title,
          description: eventData.description,
          date_time: formatDateForInput(eventData.date_time),
          location: eventData.location,
          type: eventData.type as "public" | "private",
          tag_ids: eventData.tags.map((t: Tag) => t.id),
        });
      } catch (err) {
        console.error("Failed to fetch event", err);
      }
    }
    fetchEventData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if (e.target.name === "tag_ids" && e.target instanceof HTMLSelectElement) {
      const selected = Array.from(e.target.selectedOptions).map(
        (opt) => opt.value
      );
      setFormData({ ...formData, tag_ids: selected });
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

      const decoded = jwtDecode<JwtPayload>(token);
      const user_id = decoded.userId;

      const payload = { ...formData, user_id };

      if (fetchedEvent) {
        await updateEvent(fetchedEvent.id, payload);
      } else {
        await createEvent(payload);
      }
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to save event"
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">
        {fetchedEvent ? "Edit Event" : "Create Event"}
      </h1>

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
          {fetchedEvent ? "Update Event" : "Create Event"}
        </button>
      </form>
    </div>
  );
}
