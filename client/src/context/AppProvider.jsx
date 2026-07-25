import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/react";
import {
  hotelDummyData,
  roomsDummyData,
  userBookingsDummyData,
  userDummyData,
} from "../assets/assets";
import { AppContext } from "./AppContext";
import { createId, nightsBetween } from "./booking";

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useUser();

  const currency = "$";

  const [rooms, setRooms] = useState(roomsDummyData);
  const [bookings, setBookings] = useState(userBookingsDummyData);
  const [hotel, setHotel] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const notify = (message, type = "success") =>
    setToast({ id: createId("toast"), message, type });

  // The signed-in Clerk user when available, otherwise the demo user, so that
  // bookings always carry an author even before you log in.
  const currentUser = user
    ? {
        _id: user.id,
        username: user.fullName || user.username || "Guest",
        email: user.primaryEmailAddress?.emailAddress ?? "",
        image: user.imageUrl,
      }
    : userDummyData;

  const registerHotel = (details) => {
    const registered = {
      ...hotelDummyData,
      _id: createId("hotel"),
      ...details,
      owner: currentUser,
    };
    setHotel(registered);
    setIsOwner(true);
    setShowHotelReg(false);
    notify(`${registered.name} is registered. Welcome to your dashboard.`);
    navigate("/owner");
  };

  const addRoom = ({ roomType, pricePerNight, amenities, images }) => {
    const room = {
      _id: createId("room"),
      hotel: hotel ?? hotelDummyData,
      roomType,
      pricePerNight: Number(pricePerNight),
      amenities,
      images,
      isAvailable: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRooms((prev) => [room, ...prev]);
    notify(`${roomType} added to your listings.`);
    return room;
  };

  const toggleRoomAvailability = (roomId) => {
    setRooms((prev) =>
      prev.map((room) =>
        room._id === roomId
          ? {
              ...room,
              isAvailable: !room.isAvailable,
              updatedAt: new Date().toISOString(),
            }
          : room,
      ),
    );
  };

  // A room is bookable when the owner has it listed and no existing booking
  // overlaps the requested range.
  const isRoomAvailable = ({ roomId, checkInDate, checkOutDate }) => {
    const room = rooms.find((item) => item._id === roomId);
    if (!room?.isAvailable) return false;

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    return !bookings.some(
      (booking) =>
        booking.room._id === roomId &&
        start < new Date(booking.checkOutDate) &&
        new Date(booking.checkInDate) < end,
    );
  };

  const bookRoom = ({ room, checkInDate, checkOutDate, guests }) => {
    const nights = nightsBetween(checkInDate, checkOutDate);
    const booking = {
      _id: createId("booking"),
      user: currentUser,
      room,
      hotel: room.hotel,
      checkInDate: new Date(checkInDate).toISOString(),
      checkOutDate: new Date(checkOutDate).toISOString(),
      totalPrice: room.pricePerNight * nights,
      guests: Number(guests),
      status: "pending",
      paymentMethod: "Pay At Hotel",
      isPaid: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBookings((prev) => [booking, ...prev]);
    return booking;
  };

  const payBooking = (bookingId) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking._id === bookingId
          ? {
              ...booking,
              isPaid: true,
              status: "confirmed",
              paymentMethod: "Stripe",
              updatedAt: new Date().toISOString(),
            }
          : booking,
      ),
    );
    notify("Payment received. Your stay is confirmed.");
  };

  const cancelBooking = (bookingId) => {
    setBookings((prev) => prev.filter((booking) => booking._id !== bookingId));
    notify("Booking cancelled.", "info");
  };

  const rememberCity = (city) => {
    if (!city) return;
    setSearchedCities((prev) =>
      [city, ...prev.filter((item) => item !== city)].slice(0, 3),
    );
  };

  const dashboard = {
    totalBookings: bookings.length,
    totalRevenue: bookings.reduce((sum, booking) => sum + booking.totalPrice, 0),
    bookings,
  };

  const value = {
    currency,
    navigate,
    user,
    currentUser,
    rooms,
    bookings,
    hotel,
    isOwner,
    setIsOwner,
    showHotelReg,
    setShowHotelReg,
    searchedCities,
    rememberCity,
    registerHotel,
    addRoom,
    toggleRoomAvailability,
    isRoomAvailable,
    bookRoom,
    payBooking,
    cancelBooking,
    dashboard,
    notify,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-200 max-w-xs rounded-lg px-4 py-3 text-sm text-white shadow-lg ${
            toast.type === "error"
              ? "bg-red-600"
              : toast.type === "info"
                ? "bg-gray-800"
                : "bg-green-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </AppContext.Provider>
  );
};

export default AppProvider;
