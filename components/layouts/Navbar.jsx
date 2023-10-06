import { useState } from "react";
import ConfirmModal from "../common/ConfirmModal";
import SearchResult from "../common/SearchResult";
import Tooltip from "../widgets/Tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { FaHeart, FaShoppingCart, FaUser, FaShoppingBag } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import Link from "next/link";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();
  const {
    updateAcessTokenWhenLogout,
    isAuthenticated,
    removeNoOfItemsInCart,
    noOfItemsInCart,
  } = useAuth();

  const handleLogOut = () => {
    setIsConfirmationModalOpen(false);
    localStorage.removeItem("userInfo");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("wishListItems");
    removeNoOfItemsInCart();
    updateAcessTokenWhenLogout();
    router.push("/login");
  };

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const handleLogOutClick = () => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      setIsConfirmationModalOpen(true);
    }
  };

  const handleCancel = () => {
    setIsConfirmationModalOpen(false);
  };

  return (
    <nav className="bg-white border-b py-3 px-4 md:flex md:justify-between  md:items-center w-full fixed top-0">
      <ConfirmModal
        isOpen={isConfirmationModalOpen}
        message="Are you sure you want to logout?"
        onConfirm={handleLogOut}
        onCancel={handleCancel}
      />
      {/* logo and list */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <div className="h-[20px] w-[147px] text-3xl font-extrabold bg-white flex justify-center items-center">
              Coverly
            </div>
          </Link>
        </div>
        <div className="flex space-x-4 md:hidden">
          <AiFillHome
            onClick={() => {
              router.push("/");
            }}
            className="text-gray-500"
          />
          <FaHeart
            onClick={() => {
              router.push("/wishlist");
            }}
            className="text-gray-500"
          />
          <FaShoppingBag
            onClick={() => {
              router.push("/orders");
            }}
            className="text-gray-500"
          />
          <FaShoppingCart
            onClick={() => {
              router.push("/cart");
            }}
            className="text-gray-500"
          />
          <FaUser onClick={handleLogOutClick} className="text-gray-500" />
          {noOfItemsInCart > 0 && (
            <div className="absolute top-1 right-9 bg-red-500 rounded-full flex justify-center items-center text-center h-4 w-4 text-[10px] text-white">
              {noOfItemsInCart}
            </div>
          )}
        </div>
      </div>

      {/* search bar and icons */}
      <div className="flex items-center justify-between mt-4 md:mt-0">
        {/* search bar */}
        <SearchResult />
        {/* icons */}
        <div className="hidden md:flex space-x-4 ml-3">
          <Tooltip text="Home">
            <AiFillHome
              onClick={() => {
                router.push("/");
              }}
              className="text-gray-500"
            />
          </Tooltip>
          <Tooltip text="Wishlist">
            <FaHeart
              onClick={() => {
                router.push("/wishlist");
              }}
              className="text-gray-500"
            />
          </Tooltip>
          <Tooltip text="Orders">
            <FaShoppingBag
              onClick={() => {
                router.push("/orders");
              }}
              className="text-gray-500"
            />{" "}
          </Tooltip>
          <Tooltip text="Cart">
            <FaShoppingCart
              onClick={() => {
                router.push("/cart");
              }}
              className="text-gray-500"
            />
          </Tooltip>
          <Tooltip text="Logout">
            <FaUser onClick={handleLogOutClick} className="text-gray-500" />
          </Tooltip>

          {noOfItemsInCart > 0 && (
            <div className="absolute top-4 right-8 bg-red-500 rounded-full flex justify-center items-center text-center h-5 w-5 text-xs text-white">
              {noOfItemsInCart}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
