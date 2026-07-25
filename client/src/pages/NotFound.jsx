import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-40 text-center">
      <p className="text-6xl font-playfair text-gray-800">404</p>
      <h1 className="mt-4 text-2xl font-playfair md:text-3xl">
        We couldn't find that page
      </h1>
      <p className="mt-2 max-w-md text-sm text-gray-500 md:text-base">
        The link may be broken, or the page may have moved. Let's get you back
        to somewhere useful.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/"
          className="rounded bg-primary px-6 py-2.5 text-white transition-all hover:bg-primary-dull"
        >
          Back to Home
        </Link>
        <Link
          to="/rooms"
          className="rounded border border-gray-300 px-6 py-2.5 transition-all hover:bg-gray-50"
        >
          Browse Rooms
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
