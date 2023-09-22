import { FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();
  const handleLogOut = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("wishListItems");
    router.push("/login");
  };
  return (
    <nav className="bg-white border-b py-3 px-4 md:flex md:justify-between  md:items-center w-full fixed top-0">
      {/* logo and list */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <div className="h-[20px] w-[147px] text-3xl font-extrabold bg-white flex justify-center items-center">
              Coverly
            </div>
          </Link>
          <ul className="hidden md:flex space-x-4">
            <li>
              <Link href="/oppo">OPPO</Link>
            </li>
            <li>
              <Link href="/vivo">VIVO</Link>
            </li>
            <li>
              <Link href="/apple">APPLE</Link>
            </li>
            <li>
              <Link href="/apple">LAVA</Link>
            </li>
          </ul>
        </div>
        <div className="flex space-x-4 md:hidden">
          <FaHeart className="text-gray-500" />
          <FaShoppingCart className="text-gray-500" />
          <FaUser className="text-gray-500" />
        </div>
      </div>

      {/* search bar and icons */}
      <div className="flex items-center justify-between mt-4 md:mt-0">
        {/* search bar */}
        <div className="md:flex md:items-center rounded-md md:p-1 border border-gray-300 w-full">
          <input
            type="text"
            placeholder="Search"
            className=" p-2 w-full md:w-auto"
          />
        </div>
        {/* icons */}
        <div className="hidden md:flex space-x-4 ml-3">
          <FaHeart
            onClick={() => {
              router.push("/wishlist");
            }}
            className="text-gray-500"
          />
          <FaShoppingCart
            onClick={() => {
              router.push("/cart");
            }}
            className="text-gray-500"
          />
          <FaUser onClick={handleLogOut} className="text-gray-500" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
