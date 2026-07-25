import { assets } from "../assets/assets";

const StarRating = ({ rating = 4 }) => {
  return (
    <div
      className="flex items-center"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <img
          key={index}
          src={rating > index ? assets.starIconFilled : assets.starIconOutlined}
          alt=""
          className="w-4.5 h-4.5"
        />
      ))}
    </div>
  );
};

export default StarRating;
