import { Link } from "react-router-dom";
type Event = {
  id: string;
  title: string;
  description: string;
  date_time: string;
  location: string;
  type: string;
  user_id: string;
  tags: [];
};

type EventCardProps = {
  event: Event;
};

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <h2 className="text-xl font-semibold">{event.title}</h2>
      <p>{event.description}</p>
      <p className="text-sm text-gray-500">
        {new Date(event.date_time).toLocaleString()} - {event.location}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {event.tags.map((tag: any) => (
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
    </div>
  );
}
