import { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useClerk, useUser, UserButton } from "@clerk/react";
import { useAppContext } from "../context/useAppContext";

const BookIcon = () => (
  <svg
    className="w-4 h-4 text-gray-700"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4"
    />
  </svg>
);

const Navbar = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Hotels", path: "/rooms" },
    { name: "My Bookings", path: "/my-bookings" },
  ];

  const [atTop, setAtTop] = useState(() => window.scrollY <= 10);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { isOwner, setShowHotelReg } = useAppContext();

  // The transparent navbar only makes sense over the home page hero; every
  // other route gets the solid treatment straight away.
  const isHome = location.pathname === "/";
  const isScrolled = !isHome || !atTop;

  useEffect(() => {
    const handleScroll = () => setAtTop(window.scrollY <= 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scrolling while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleOwnerClick = () => {
    setIsMenuOpen(false);
    if (isOwner) {
      navigate("/owner");
    } else {
      setShowHotelReg(true);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0  w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}
    >
      {/* Logo */}
      <Link to="/">
        <img
          src={assets.logo}
          alt="logo"
          className={`h-9 ${isScrolled && "invert opacity-80"}`}
        />
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `group flex flex-col gap-0.5 ${isScrolled ? "text-gray-700" : "text-white"} ${isActive ? "font-medium" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                {link.name}
                <div
                  className={`${isScrolled ? "bg-gray-700" : "bg-white"} h-0.5 ${isActive ? "w-full" : "w-0 group-hover:w-full"} transition-all duration-300`}
                />
              </>
            )}
          </NavLink>
        ))}
        <button
          className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${isScrolled ? "text-black" : "text-white"} transition-all`}
          onClick={handleOwnerClick}
        >
          {isOwner ? "Dashboard" : "List Your Hotel"}
        </button>
      </div>

      {/* Desktop Right */}
      <div className="hidden md:flex items-center gap-4">
        <button
          type="button"
          aria-label="Search rooms"
          onClick={() => navigate("/rooms")}
        >
          <img
            src={assets.searchIcon}
            alt=""
            className={`${isScrolled && "invert"} h-7 cursor-pointer transition-all duration-500`}
          />
        </button>

        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Bookings"
                labelIcon={<BookIcon />}
                onClick={() => navigate("/my-bookings")}
              />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button
            onClick={() => openSignIn()}
            className={`px-8 py-2.5 rounded-full ml-4 cursor-pointer transition-all duration-500 ${isScrolled ? "text-white bg-black" : "bg-white text-black"}`}
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}

      <div className="flex items-center gap-3 md:hidden">
        {user && (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Bookings"
                labelIcon={<BookIcon />}
                onClick={() => navigate("/my-bookings")}
              />
            </UserButton.MenuItems>
          </UserButton>
        )}

        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(true)}
        >
          <img
            src={assets.menuIcon}
            alt=""
            className={`${isScrolled && "invert"} h-4 `}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button
          className="absolute top-4 right-4"
          aria-label="Close menu"
          onClick={() => setIsMenuOpen(false)}
        >
          <img src={assets.closeIcon} alt="" className="h-6.5" />
        </button>

        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={() => setIsMenuOpen(false)}
          >
            {link.name}
          </Link>
        ))}

        <button
          className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all"
          onClick={handleOwnerClick}
        >
          {isOwner ? "Dashboard" : "List Your Hotel"}
        </button>

        {!user && (
          <button
            onClick={() => {
              setIsMenuOpen(false);
              openSignIn();
            }}
            className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
