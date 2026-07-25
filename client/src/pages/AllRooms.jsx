import { useMemo, useState } from "react";
import { assets, facilityIcons } from "../assets/assets";
import { useNavigate, useSearchParams } from "react-router-dom";
import StarRating from "../components/StarRating";
import { useAppContext } from "../context/useAppContext";

const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="radio"
        name="sortOption"
        checked={selected}
        onChange={() => onChange(label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const roomTypes = ["Single Bed", "Double Bed", "Luxury Room", "Family Suite"];

const priceRanges = ["0 to 500", "500 to 1000", "1000 to 2000", "2000 to 3000"];

const sortOptions = ["Price Low to High", "Price High to Low", "Newest First"];

const AllRooms = () => {
  const navigate = useNavigate();
  const { rooms, currency } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const [openFilters, setOpenFilters] = useState(false);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [sortOption, setSortOption] = useState("");

  const destination = searchParams.get("destination") ?? "";

  const toggleInList = (setter) => (checked, value) =>
    setter((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value),
    );

  const clearFilters = () => {
    setSelectedRoomTypes([]);
    setSelectedPriceRanges([]);
    setSortOption("");
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedRoomTypes.length > 0 ||
    selectedPriceRanges.length > 0 ||
    Boolean(sortOption) ||
    Boolean(destination);

  const filteredRooms = useMemo(() => {
    const matchesDestination = (room) => {
      if (!destination) return true;
      const needle = destination.toLowerCase();
      return (
        room.hotel.city.toLowerCase().includes(needle) ||
        room.hotel.name.toLowerCase().includes(needle) ||
        room.hotel.address.toLowerCase().includes(needle)
      );
    };

    const matchesRoomType = (room) =>
      selectedRoomTypes.length === 0 ||
      selectedRoomTypes.includes(room.roomType);

    const matchesPrice = (room) =>
      selectedPriceRanges.length === 0 ||
      selectedPriceRanges.some((range) => {
        const [min, max] = range.split(" to ").map(Number);
        return room.pricePerNight >= min && room.pricePerNight <= max;
      });

    const sorted = rooms.filter(
      (room) =>
        matchesDestination(room) && matchesRoomType(room) && matchesPrice(room),
    );

    if (sortOption === "Price Low to High") {
      return [...sorted].sort((a, b) => a.pricePerNight - b.pricePerNight);
    }
    if (sortOption === "Price High to Low") {
      return [...sorted].sort((a, b) => b.pricePerNight - a.pricePerNight);
    }
    if (sortOption === "Newest First") {
      return [...sorted].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    }
    return sorted;
  }, [rooms, destination, selectedRoomTypes, selectedPriceRanges, sortOption]);

  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32">
      <div className="w-full lg:w-auto">
        <div className="flex flex-col items-start text-left">
          <h1 className="font-playfair text-4xl md:text-[40px]">Hotel Rooms</h1>
          <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-174">
            Take advantage of our limited-time offers and special packages to
            enhance your stay and create unforgettable memories.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            {filteredRooms.length}{" "}
            {filteredRooms.length === 1 ? "room" : "rooms"}
            {destination && ` in "${destination}"`}
          </p>
        </div>

        {filteredRooms.length === 0 && (
          <div className="mt-16 mb-30 rounded-xl border border-dashed border-gray-300 px-8 py-16 text-center">
            <p className="text-lg text-gray-800">No rooms match your filters</p>
            <p className="mt-2 text-sm text-gray-500">
              Try widening your price range or clearing the destination.
            </p>
            <button
              onClick={clearFilters}
              className="mt-6 cursor-pointer rounded bg-primary px-6 py-2 text-white transition-all hover:bg-primary-dull"
            >
              Clear filters
            </button>
          </div>
        )}

        {filteredRooms.map((room) => (
          <div
            key={room._id}
            className="flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0"
          >
            <img
              onClick={() => navigate(`/rooms/${room._id}`)}
              src={room.images[0]}
              alt={`${room.hotel.name} room`}
              title="View Room Details"
              className="max-h-65 md:w-1/2 rounded-xl shadow-xl object-cover cursor-pointer"
            />
            <div className="md:w-1/2 flex flex-col gap-2">
              <p className="text-gray-500">{room.hotel.city}</p>
              <p
                className="text-gray-800 text-3xl font-playfair cursor-pointer"
                onClick={() => navigate(`/rooms/${room._id}`)}
              >
                {room.hotel.name}
              </p>
              <div className="flex items-center">
                <StarRating />
                <p className="ml-2">200+ reviews</p>
              </div>
              <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                <img src={assets.locationIcon} alt="" />
                <span>{room.hotel.address}</span>
              </div>
              {/* Room Amenities */}
              <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
                {room.amenities.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70"
                  >
                    <img src={facilityIcons[item]} alt="" className="w-5 h-5" />
                    <p className="text-xs">{item}</p>
                  </div>
                ))}
              </div>
              {/* Room price per night */}
              <p className="text-xl font-medium text-gray-700">
                {currency}
                {room.pricePerNight} / night
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white w-full lg:w-80 border border-gray-300 text-gray-600 max-lg:mb-8 lg:mt-16">
        <div
          className={`flex items-center justify-between px-5 py-2.5 lg:border-b border-gray-300 ${openFilters && "border-b"}`}
        >
          <p className="text-base font-medium text-gray-800">FILTERS</p>
          <div className="text-xs">
            <button
              type="button"
              className="lg:hidden cursor-pointer"
              onClick={() => setOpenFilters(!openFilters)}
            >
              {openFilters ? "HIDE" : "SHOW"}
            </button>
            <button
              type="button"
              className="hidden lg:block cursor-pointer disabled:cursor-default disabled:opacity-40"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
            >
              CLEAR
            </button>
          </div>
        </div>

        <div
          className={`${openFilters ? "h-auto" : "h-0 lg:h-auto overflow-hidden transition-all duration-700"}`}
        >
          {destination && (
            <div className="px-5 pt-5">
              <p className="font-medium text-gray-800 pb-2">Destination</p>
              <div className="flex items-center justify-between rounded bg-gray-100 px-3 py-1.5 text-sm">
                <span className="font-light">{destination}</span>
                <button
                  type="button"
                  aria-label="Clear destination"
                  className="cursor-pointer text-xs"
                  onClick={() => setSearchParams({})}
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Popular filters</p>
            {roomTypes.map((room) => (
              <CheckBox
                key={room}
                label={room}
                selected={selectedRoomTypes.includes(room)}
                onChange={toggleInList(setSelectedRoomTypes)}
              />
            ))}
          </div>

          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Price Range</p>
            {priceRanges.map((range) => (
              <CheckBox
                key={range}
                label={`${currency} ${range}`}
                selected={selectedPriceRanges.includes(range)}
                onChange={(checked) =>
                  toggleInList(setSelectedPriceRanges)(checked, range)
                }
              />
            ))}
          </div>

          <div className="px-5 pt-5 pb-7">
            <p className="font-medium text-gray-800 pb-2">Sort By</p>
            {sortOptions.map((option) => (
              <RadioButton
                key={option}
                label={option}
                selected={sortOption === option}
                onChange={setSortOption}
              />
            ))}
          </div>

          <div className="px-5 pb-5 lg:hidden">
            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className="w-full cursor-pointer rounded border border-gray-300 py-2 text-sm disabled:cursor-default disabled:opacity-40"
            >
              Clear filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
