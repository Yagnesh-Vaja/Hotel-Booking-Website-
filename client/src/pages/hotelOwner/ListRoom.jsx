import { Link } from "react-router-dom";
import Title from "../../components/Title";
import { useAppContext } from "../../context/useAppContext";

const ListRoom = () => {
  const { rooms, currency, toggleRoomAvailability } = useAppContext();

  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Room Listings"
        subTitle="View, edit, or manage all listed rooms. Keep the information up to date to provide the best experience for users."
      />
      <p className="text-gray-500 mt-8">All Rooms</p>

      {rooms.length === 0 ? (
        <div className="mt-4 max-w-3xl rounded-lg border border-dashed border-gray-300 px-8 py-12 text-center">
          <p className="text-gray-800">You haven't listed any rooms yet</p>
          <Link
            to="/owner/add-room"
            className="mt-4 inline-block rounded bg-primary px-6 py-2 text-white transition-all hover:bg-primary-dull"
          >
            Add your first room
          </Link>
        </div>
      ) : (
        <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-auto mt-3">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-gray-800 font-medium">Name</th>
                <th className="py-3 px-4 text-gray-800 font-medium max-sm:hidden">
                  Facility
                </th>
                <th className="py-3 px-4 text-gray-800 font-medium">
                  Price / night
                </th>
                <th className="py-3 px-4 text-gray-800 font-medium text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {rooms.map((room) => (
                <tr key={room._id}>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                    {room.roomType}
                  </td>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">
                    {room.amenities.join(", ")}
                  </td>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                    {currency}
                    {room.pricePerNight}
                  </td>
                  <td className="py-3 px-4 border-t border-gray-300 text-sm text-red-500 text-center">
                    <label className="relative inline-flex items-center cursor-pointer gap-3">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={room.isAvailable}
                        onChange={() => toggleRoomAvailability(room._id)}
                        aria-label={`Toggle availability for ${room.roomType}`}
                      />
                      <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                      <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListRoom;
