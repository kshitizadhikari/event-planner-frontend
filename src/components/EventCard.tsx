import { Link } from "react-router-dom";
import type { Event } from "../types/Event";

type EventCardProps = {
  event: Event;
  currentUserId: string;
  onDelete: (id: string) => void;
};

export default function EventCard({
  event,
  currentUserId,
  onDelete,
}: EventCardProps) {
  const handleDeleteClick = () => {
    if (confirm("Are you sure you want to delete this event?")) {
      onDelete(event.id);
    }
  };

  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition relative">
      <h2 className="text-xl font-semibold">{event.title}</h2>
      <p>{event.description}</p>
      <p className="text-sm text-gray-500">
        {new Date(event.date_time).toLocaleString()} - {event.location}
      </p>

      <div className="mt-2 flex flex-wrap gap-2">
        {event.tags.map((tag) => (
          <span key={tag.id} className="bg-blue-200 px-2 py-1 rounded text-sm">
            {tag.name}
          </span>
        ))}
      </div>

      <Link
        to={`/event/${event.id}`}
        className="text-blue-600 mt-2 inline-block"
      >
        View Details
      </Link>

      {event.user_id === currentUserId && (
        <button
          onClick={handleDeleteClick}
          className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
        >
          X
        </button>
      )}
    </div>
  );
}
