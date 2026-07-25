import { useState } from "react";
import Title from "../../components/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/useAppContext";

const emptyImages = { 1: null, 2: null, 3: null, 4: null };

const emptyInputs = {
  roomType: "",
  pricePerNight: "",
  amenities: {
    "Free WiFi": false,
    "Free Breakfast": false,
    "Room Service": false,
    "Mountain View": false,
    "Pool Access": false,
  },
};

const AddRoom = () => {
  const { addRoom, notify, navigate, currency } = useAppContext();

  // Each slot holds { file, url }. The preview URL is minted once per pick and
  // revoked when the slot is replaced, so re-renders never leak blob URLs.
  const [images, setImages] = useState(emptyImages);
  const [inputs, setInputs] = useState(emptyInputs);

  const selectSlot = (key, file) =>
    setImages((prev) => {
      if (prev[key]) URL.revokeObjectURL(prev[key].url);
      return {
        ...prev,
        [key]: file ? { file, url: URL.createObjectURL(file) } : null,
      };
    });

  const selectedImages = Object.values(images).filter(Boolean);
  const selectedAmenities = Object.keys(inputs.amenities).filter(
    (amenity) => inputs.amenities[amenity],
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    if (selectedImages.length === 0) {
      notify("Add at least one room image.", "error");
      return;
    }
    if (Number(inputs.pricePerNight) <= 0) {
      notify("Price per night must be greater than zero.", "error");
      return;
    }
    if (selectedAmenities.length === 0) {
      notify("Select at least one amenity.", "error");
      return;
    }

    // The preview URLs are handed over to the room record, which keeps them
    // alive for the rest of the session.
    addRoom({
      roomType: inputs.roomType,
      pricePerNight: inputs.pricePerNight,
      amenities: selectedAmenities,
      images: selectedImages.map((slot) => slot.url),
    });

    setImages(emptyImages);
    setInputs(emptyInputs);
    navigate("/owner/list-room");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Title
        align="left"
        font="outfit"
        title="Add Room"
        subTitle="Fill in accurate room details, pricing, and amenities to enhance the user booking experience."
      />
      {/* Upload Area For Images */}
      <p className="text-gray-800 mt-10">Images</p>
      <div className="grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap">
        {Object.keys(images).map((key) => (
          <label htmlFor={`roomImages${key}`} key={key}>
            <img
              className="h-13 w-24 cursor-pointer rounded object-cover opacity-80"
              src={images[key]?.url ?? assets.uploadArea}
              alt={images[key] ? `Room image ${key}` : "Upload area"}
            />
            <input
              type="file"
              accept="image/*"
              id={`roomImages${key}`}
              hidden
              onChange={(e) => selectSlot(key, e.target.files?.[0] ?? null)}
            />
          </label>
        ))}
      </div>

      <div className="w-full flex max-sm:flex-col sm:gap-4 mt-4">
        <div className="flex-1 max-w-48">
          <label htmlFor="roomType" className="text-gray-800">
            Room Type
          </label>
          <select
            id="roomType"
            value={inputs.roomType}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, roomType: e.target.value }))
            }
            required
            className="border border-gray-300 mt-1 rounded p-2 w-full outline-none"
          >
            <option value="">Select Room Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Room">Luxury Room</option>
            <option value="Family Suite">Family Suite</option>
          </select>
        </div>

        <div>
          <label htmlFor="pricePerNight" className="text-gray-800">
            Price <span className="text-xs">/night</span>
          </label>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-800">{currency}</span>
            <input
              id="pricePerNight"
              type="number"
              min={1}
              placeholder="0"
              value={inputs.pricePerNight}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  pricePerNight: e.target.value,
                }))
              }
              required
              className="border border-gray-300 rounded p-2 w-24 outline-none"
            />
          </div>
        </div>
      </div>

      <p className="text-gray-800 mt-6">Amenities</p>
      <div className="flex flex-col flex-wrap mt-1 text-gray-500 max-w-sm">
        {Object.keys(inputs.amenities).map((amenity, index) => (
          <div key={amenity}>
            <input
              type="checkbox"
              id={`amenities${index + 1}`}
              checked={inputs.amenities[amenity]}
              onChange={() =>
                setInputs((prev) => ({
                  ...prev,
                  amenities: {
                    ...prev.amenities,
                    [amenity]: !prev.amenities[amenity],
                  },
                }))
              }
            />
            <label htmlFor={`amenities${index + 1}`} className="ml-2">
              {amenity}
            </label>
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="bg-primary hover:bg-primary-dull transition-all text-white px-8 py-2 rounded mt-8 cursor-pointer"
      >
        Add Room
      </button>
    </form>
  );
};

export default AddRoom;
