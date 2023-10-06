import Heading from "@/components/widgets/Heading";
import MainButton from "@/components/widgets/MainButton";
import BreadCrumb from "@/components/common/BreadCrumb";
import api from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import { LoginValidation } from "@/schema/LoginPageValidation"; // Create validation schema for login
import { FaSignInAlt } from "react-icons/fa"; // Import the login icon
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const { updateAccessToken, updateNoOfItemsInCart } = useAuth();

  const handleLogin = async (email, password) => {
    try {
      const response = await api.post("/users/login", {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        localStorage.setItem("accessToken", response.data.accessToken);
        updateNoOfItemsInCart(response.data.noItemsInCart);
        updateAccessToken(response.data.accessToken);
        localStorage.setItem(
          "wishListItems",
          JSON.stringify(response.data.wishListIems)
        );
        toast.success("Login successful", {
          onClose: () => {
            // Check if there is a previous page in the history
            if (router.query.from) {
              router.push(router.query.from.toString());
            } else {
              router.push("/");
            }
          },
        });
      }
    } catch (error) {
      if (error.response.status === 401) {
        toast.error("User not found. Please check your credentials.");
      } else {
        toast.error("There was an error logging in. Please try again later.");
      }
    }
  };

  const handleGuestLogin = (e) => {
    e.preventDefault();
    const guestEmail = "testing@gmail.com";
    const guestPassword = "12345@Test";
    handleLogin(guestEmail, guestPassword);
  };

  // Handling form using formik
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginValidation,
    onSubmit: (values) => {
      handleLogin(values.email, values.password);
    },
  });

  return (
    <div className="flex flex-col justify-center items-center pt-8">
      <BreadCrumb />
      <Heading text="Login into your Account" />
      <form
        className="border-2 w-4/5 lg:w-2/5 p-5 mt-5"
        onSubmit={formik.handleSubmit}
      >
        {/* Email Input */}
        <div className="relative z-0 w-full mb-6 group">
          <label htmlFor="email" className="">
            Email address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0  border-b-2 ${
              formik.touched.email && formik.errors.email
                ? "border-red-500"
                : "border-gray-300"
            } appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
            placeholder=" "
            required
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.email}
            </div>
          ) : null}
        </div>

        {/* Password Input */}
        <div className="relative z-0 w-full mb-6 group">
          <label htmlFor="email" className="">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0  border-b-2 ${
              formik.touched.email && formik.errors.email
                ? "border-red-500"
                : "border-gray-300"
            } appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
            placeholder=" "
            required
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.password}
            </div>
          ) : null}
        </div>

        <MainButton
          icon={<FaSignInAlt className="text-lg mr-2" />}
          text="LOG IN"
          bgColor="mainYellow"
          textColor="black"
          Type={"submit"}
        />
        <div onClick={handleGuestLogin}>
          <MainButton
            icon={<FaSignInAlt className="text-lg mr-2" />}
            text="LOGIN AS GUEST"
            bgColor="mainYellow"
            textColor="black"
          />
        </div>
      </form>
      <p className="mt-4">
        Please{" "}
        <Link href="/signup">
          <span className="font-bold text-yellow-500">Signup</span>
        </Link>{" "}
        if you dont have an Account
      </p>
    </div>
  );
};

export default Login;
