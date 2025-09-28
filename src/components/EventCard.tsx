import { Link } from "react-router-dom";
import type { Event } from "../types/Event";
import { PencilIcon, TrashIcon } from "@heroicons/react/16/solid";

type EventCardProps = {
  event: Event;
  currentUserId: string;
  onDelete: (id: string) => void;
  onEdit: (event: Event) => void;
};

export default function EventCard({
  event,
  currentUserId,
  onDelete,
  onEdit,
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
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={() => onEdit(event)}
            className="bg-yellow-500 p-1 rounded hover:bg-yellow-600"
            title="Edit Event"
          >
            <PencilIcon className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={handleDeleteClick}
            className="bg-red-500 p-1 rounded hover:bg-red-600"
            title="Delete Event"
          >
            <TrashIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}
