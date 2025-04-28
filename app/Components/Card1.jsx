import React from "react";
import Link from "next/link";

export default function Card2(props) {
  // Format category for display
  const formatCategory = (cat) => {
    return cat.replace("Wisata_", "");
  };

  // Format distance to display in km with 1 decimal place
  const formatDistance = (distance) => {
    if (distance !== undefined) {
      return `${distance.toFixed(1)} km`;
    }
    return "";
  };

  return (
    <div className="card h-full relative">
      <div className="img-card overflow-hidden h-64 rounded-xl relative">
        <img
          src={props.img}
          alt={props.judul}
          className="w-full h-full object-cover"
        />

        {/* SAW Rank Badge (Only shown if rank is provided) */}
        {props.rank && (
          <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
            Rank #{props.rank}
          </div>
        )}
      </div>
      <div className="content-card mt-6">
        <div className="flex justify-between items-start mb-2">
          <div className="title">
            <h1 className="text-lg font-medium">{props.judul}</h1>
          </div>
          <span className="badge badge-primary">
            {formatCategory(props.kategori)}
          </span>
        </div>
        <div className="flex items-center gap-1 mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="size-4 text-yellow-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
          <span>{props.rating}</span>

          {/* Display distance from user if available */}
          {props.distanceFromUser && (
            <span className="ml-3 text-sm text-gray-500 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
              {formatDistance(props.distanceFromUser)}
            </span>
          )}
        </div>

        <div className="desc mt-2">
          <p className="text-gray-500 text-sm text-justify">{props.desc}</p>
        </div>
        <div className="flex justify-between mt-6">
          <Link
            href={`/destination/${encodeURIComponent(props.id)}`}
            className="text-primary text-sm flex gap-2 items-center"
          >
            Lihat Detail
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
              />
            </svg>
          </Link>
          <a
            href={props.links}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-primary"
          >
            Lihat Maps
          </a>
        </div>
      </div>
    </div>
  );
}
