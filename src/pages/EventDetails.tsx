import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import type { Event } from "../types/Event"; 

export default function EventDetail() {

  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await axios.get(`http://localhost:3000/events/${id}`);
        setEvent(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load event");
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!event) return <p>No event found.</p>;

  return (
    <div className="mt-5 p-6 max-w-2xl mx-auto border rounded shadow">
      <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
      <p className="mb-4">{event.description}</p>
      <p className="text-gray-600 mb-2">
        📍 {event.location} | {event.type}
      </p>
      <p className="text-gray-500 mb-4">
        🗓 {new Date(event.date_time).toLocaleString()}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {event.tags.map((tag) => (
          <span key={tag.id} className="bg-blue-200 px-2 py-1 rounded text-sm">
            {tag.name}
          </span>
        ))}
      </div>

      <Link to="/" className="text-blue-600 hover:underline">
        ← Back to Events
      </Link>
    </div>
  );
}
