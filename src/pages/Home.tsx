import { useEffect, useState } from "react";
import { getEvents, deleteEvent } from "../api/events";
import EventCard from "../components/EventCard";
import LogoutButton from "../components/LogoutButton";
import type { Event, Tag } from "../types/Event";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getAllTags } from "../api/tags";

type JwtPayload = {
  userId: string;
  iat: number;
  exp: number;
};

export default function Home() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);

  const [tags, setTags] = useState<Tag[]>([]); // fetched from API
  const [selectedTag, setSelectedTag] = useState<string>(""); // tag ID or name
  const [selectedType, setSelectedType] = useState<"past" | "upcoming" | "">(
    ""
  );

  const handleEdit = (event: Event) => {
    navigate(`/edit/${event.id}`, { state: { event } });
  };

  const token = localStorage.getItem("token");
  let currentUserId = "";
  if (token) {
    const decoded = jwtDecode<JwtPayload>(token);
    currentUserId = decoded.userId;
  }

  useEffect(() => {
    async function fetchEvents() {
      const res = await getEvents({});
      setEvents(res.data);
    }

    fetchEvents();
  }, []);

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

  const handleFilter = async () => {
    const params: any = {};
    if (selectedTag) params.tags = selectedTag;
    if (selectedType) params.type = selectedType;

    try {
      const res = await getEvents(params);
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to fetch filtered events", err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Events</h1>
        <LogoutButton />
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <button
            onClick={() => navigate("/create")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
          >
            + Create Event
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="">All Tags</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.name}>
                {tag.name}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) =>
              setSelectedType(e.target.value as "past" | "upcoming" | "")
            }
            className="border px-2 py-1 rounded"
          >
            <option value="">All Types</option>
            <option value="past">Past</option>
            <option value="present">Present</option>
          </select>

          <button
            onClick={handleFilter}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Filter
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            currentUserId={currentUserId}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  );
}
