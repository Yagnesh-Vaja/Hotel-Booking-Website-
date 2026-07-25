import { useState } from "react";
import { useParams } from "react-router-dom";
import { assets, facilityIcons, roomCommonData } from "../assets/assets";
import StarRating from "../components/StarRating";
import NotFound from "./NotFound";
import { nightsBetween } from "../context/booking";
import { useAppContext } from "../context/useAppContext";

const today = () => new Date().toISOString().split("T")[0];

// Keyed on the room id by the wrapper below, so switching rooms remounts this
// component and clears the gallery selection and any pending availability check.
const RoomDetailsView = ({ room }) => {
  const { currency, isRoomAvailable, bookRoom, notify, navigate } =
    useAppContext();

  const [mainImage, setMainImage] = useState(room.images[0]);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [availability, setAvailability] = useState(null);

  const nights =
    checkInDate && checkOutDate
      ? nightsBetween(checkInDate, checkOutDate)
      : 0;
  const totalPrice = nights > 0 ? nights * room.pricePerNight : 0;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (nights <= 0) {
      notify("Check-out must be after check-in.", "error");
      return;
    }

    // First submit checks the dates; the second one confirms the booking.
    if (!availability?.ok) {
      const ok = isRoomAvailable({
        roomId: room._id,
        checkInDate,
        checkOutDate,
      });
      setAvailability({ ok, checkInDate, checkOutDate });
      notify(
        ok
          ? "Room is available. Review the total and book now."
          : "Those dates are already taken. Try another range.",
        ok ? "success" : "error",
      );
      return;
    }

    bookRoom({ room, checkInDate, checkOutDate, guests });
    notify("Booked. You can pay from My Bookings.");
    navigate("/my-bookings");
  };

  // Any date edit invalidates a previous availability check.
  const resetAvailability = () => setAvailability(null);

  return (
    <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* Room Details */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
        <h1 className="text-3xl md:text-4xl font-playfair">
          {room.hotel.name}{" "}
          <span className="font-inter text-sm">({room.roomType})</span>{" "}
        </h1>
        <p className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full">
          20% OFF
        </p>
      </div>
      {/* Room  Rating */}
      <div className="flex items-center gap-1 mt-2">
        <StarRating />
        <p className="ml-2">200+ reviews</p>
      </div>
      {/* Room Address */}
      <div className="flex items-center gap-1 text-gray-500 mt-2">
        <img src={assets.locationIcon} alt="" />
        <span>{room.hotel.address}</span>
      </div>

      {/* Room Images */}
      <div className="flex flex-col lg:flex-row mt-6 gap-6">
        <div className="lg:w-1/2 w-full">
          <img
            src={mainImage}
            alt={`${room.hotel.name} main view`}
            className="w-full rounded-xl shadow-lg object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
          {room.images.length > 1 &&
            room.images.map((image, index) => (
              <img
                onClick={() => setMainImage(image)}
                key={index}
                src={image}
                alt={`${room.hotel.name} view ${index + 1}`}
                className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${mainImage === image && "outline-3 outline-orange-500"}`}
              />
            ))}
        </div>
      </div>

      {/* Room Highlights */}
      <div className="flex flex-col md:flex-row md:justify-between mt-10">
        <div className="flex flex-col">
          <h2 className="text-3xl md:text-4xl font-playfair">
            Experience Luxury Like Never Before
          </h2>
          <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
            {room.amenities.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-200"
              >
                <img src={facilityIcons[item]} alt="" className="w-5 h-5" />
                <p className="text-xs">{item}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Room Prices*/}
        <p className="text-2xl font-medium">
          {currency}
          {room.pricePerNight}/night
        </p>
      </div>

      {/* CheckIn CheckOut Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500">
            <div className="flex flex-col">
              <label htmlFor="checkInDate">Check-In</label>
              <input
                type="date"
                id="checkInDate"
                min={today()}
                value={checkInDate}
                onChange={(e) => {
                  setCheckInDate(e.target.value);
                  if (checkOutDate && e.target.value >= checkOutDate) {
                    setCheckOutDate("");
                  }
                  resetAvailability();
                }}
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>
            <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>

            <div className="flex flex-col">
              <label htmlFor="checkOutDate">Check-Out</label>
              <input
                type="date"
                id="checkOutDate"
                min={checkInDate || today()}
                value={checkOutDate}
                onChange={(e) => {
                  setCheckOutDate(e.target.value);
                  resetAvailability();
                }}
                disabled={!checkInDate}
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none disabled:bg-gray-100"
                required
              />
            </div>

            <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>

            <div className="flex flex-col">
              <label htmlFor="guests">Guests</label>
              <input
                type="number"
                id="guests"
                min={1}
                max={4}
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer"
          >
            {availability?.ok ? "Book Now" : "Check Availability"}
          </button>
        </div>

        {nights > 0 && (
          <p className="mt-4 text-sm text-gray-500">
            {nights} {nights === 1 ? "night" : "nights"} · Total{" "}
            <span className="font-medium text-gray-800">
              {currency}
              {totalPrice}
            </span>
          </p>
        )}

        {availability && !availability.ok && (
          <p className="mt-2 text-sm text-red-500">
            This room is already booked for those dates.
          </p>
        )}
      </form>

      {/* Common Specifications */}
      <div className="mt-25 space-y-4">
        {roomCommonData.map((spec) => (
          <div key={spec.title} className="flex items-start gap-2">
            <img src={spec.icon} alt="" className="w-6.5" />
            <div>
              <p className="text-base">{spec.title}</p>
              <p className="text-gray-500">{spec.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500">
        <p>
          Guests will be allocated on the ground floor according to
          availability. You get a comfortable two bedroom apartment that has a
          true city feeling. The price quoted is for two guests; at the guest
          slot please mark the number of guests to get the exact price for
          groups.
        </p>
      </div>

      {/* Hosted by */}
      <div className="flex flex-col items-start gap-4">
        <div className="flex gap-4">
          <img
            src={assets.userIcon}
            alt=""
            className="h-14 w-14 md:h-18 md:w-18 rounded-full bg-gray-500 p-2"
          />
          <div>
            <p className="text-lg md:text-xl">Hosted by {room.hotel.name}</p>
            <div className="flex items-center mt-1">
              <StarRating />
              <p className="ml-2">200+ reviews</p>
            </div>
          </div>
        </div>

        <a
          href={`tel:${room.hotel.contact}`}
          className="px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer"
        >
          Contact Now
        </a>
      </div>
    </div>
  );
};

const RoomDetails = () => {
  const { id } = useParams();
  const { rooms } = useAppContext();

  const room = rooms.find((item) => item._id === id);
  if (!room) return <NotFound />;

  return <RoomDetailsView key={room._id} room={room} />;
};

export default RoomDetails;
