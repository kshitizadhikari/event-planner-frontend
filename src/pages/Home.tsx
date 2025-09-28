import { useEffect, useState } from "react";
import { getEvents, deleteEvent } from "../api/events";
import EventCard from "../components/EventCard";
import LogoutButton from "../components/LogoutButton";
import type { Event } from "../types/Event";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  userId: string;
  iat: number;
  exp: number;
};

export default function Home() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);

  const token = localStorage.getItem("token");
  let currentUserId = "";
  if (token) {
    const decoded = jwtDecode<JwtPayload>(token);
    currentUserId = decoded.userId;
  }

  // Fetch events
  useEffect(() => {
    async function fetchEvents() {
      const res = await getEvents({});
      setEvents(res.data);
    }
    fetchEvents();
  }, []);

  // Delete event
  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      await deleteEvent(id); // call API
      setEvents(events.filter((e) => e.id !== id)); // remove from UI
    } catch (err) {
      console.error("Failed to delete event", err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Events</h1>
        <LogoutButton />
      </div>

      <button
        onClick={() => navigate("/create")}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
      >
        + Create Event
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            currentUserId={currentUserId}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
