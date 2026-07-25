import { useEffect, useState } from "react";
import { assets, cities } from "../assets/assets";
import { useAppContext } from "../context/useAppContext";

const HotelReg = () => {
  const { setShowHotelReg, registerHotel } = useAppContext();

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  const close = () => setShowHotelReg(false);

  // Escape closes the dialog, and the page behind it should not scroll.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setShowHotelReg(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [setShowHotelReg]);

  const handleSubmit = (event) => {
    event.preventDefault();
    registerHotel({ name, contact, address, city });
  };

  return (
    <div
      onClick={close}
      className="fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-black/70"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="flex gap-6 bg-white rounded-xl max-w-4xl max-md:mx-2 relative overflow-hidden"
      >
        <img
          src={assets.regImage}
          alt=""
          className="w-1/2 rounded-l-xl object-cover max-md:hidden"
        />

        <div className="w-full md:w-1/2 p-8">
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 cursor-pointer"
          >
            <img src={assets.closeIcon} alt="" className="h-4 w-4" />
          </button>
          <p className="text-2xl font-semibold mt-6">Register Your Hotel</p>

          {/* Hotel Name */}
          <div className="w-full mt-4">
            <label htmlFor="name" className="font-medium text-gray-500">
              Hotel Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type here"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              required
            />
          </div>
          {/* Phone */}
          <div className="w-full mt-4">
            <label htmlFor="contact" className="font-medium text-gray-500">
              Phone
            </label>
            <input
              id="contact"
              type="tel"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Type here"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              required
            />
          </div>
          {/* Address */}
          <div className="w-full mt-4">
            <label htmlFor="address" className="font-medium text-gray-500">
              Address
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Type here"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              required
            />
            {/* Select City Drop Down */}
            <div className="w-full mt-4 max-w-60 mr-auto">
              <label htmlFor="city" className="font-medium text-gray-500">
                City
              </label>
              <select
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
                required
              >
                <option value="">Select City</option>
                {cities.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white mr-auto px-6 py-2 rounded cursor-pointer mt-6"
            >
              Register
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default HotelReg;
