import { useState } from "react";
import Heading from "@/components/widgets/Heading";
import MainButton from "@/components/widgets/MainButton";
import BreadCrumb from "@/components/common/BreadCrumb";
import GlobalLoader from "@/components/loaders/GlobalLoader";
import api from "@/config/api";
import { SignUpValidation } from "@/schema/SignupPageValidation";
import { useFormik } from "formik";
import { FaUserCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Link from "next/link";

const Signup = () => {
  const router = useRouter();
  const [showSignupLoader, setShowSignupLoader] = useState(false);

  const handleSignup = async (firstName, lastName, email, password) => {
    try {
      setShowSignupLoader(true);
      const response = await api.post("/users/register", {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      });
      setShowSignupLoader(false);

      if (response.status === 201) {
        toast.success("Signup successful! Redirecting to login...", {
          onClose: () => {
            router.push("/login");
          },
        });
      }
    } catch (error) {
      setShowSignupLoader(false);
      if (error.response.status === 400) {
        toast.error("User already exists with this email");
      } else {
        toast.error("There was an error signing up. Please try again later.");
      }
    }
  };

  // handling form using formik
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      repeatPassword: "",
      firstName: "",
      lastName: "",
    },
    validationSchema: SignUpValidation,
    onSubmit: (values) => {
      handleSignup(
        values.firstName,
        values.lastName,
        values.email,
        values.password
      );
    },
  });

  return (
    <div className="flex flex-col justify-center items-center pt-3">
      {showSignupLoader && (
        <GlobalLoader tag="Signing up....." color="black" size={60} width={6} />
      )}
      <BreadCrumb />
      <Heading text="Sign Up for an Account" />
      <form
        className="border-2 w-4/5 lg:w-2/5 px-5 py-2  mt-2"
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
          <label htmlFor="password" className="">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0  border-b-2 ${
              formik.touched.password && formik.errors.password
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

        {/* Repeat Password Input */}
        <div className="relative z-0 w-full mb-6 group">
          <label htmlFor="repeatPassword" className="">
            Repeat Password
          </label>
          <input
            type="repeatPassword"
            name="repeatPassword"
            id="repeatPassword"
            className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0  border-b-2 ${
              formik.touched.repeatPassword && formik.errors.repeatPassword
                ? "border-red-500"
                : "border-gray-300"
            } appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
            placeholder=" "
            required
            {...formik.getFieldProps("repeatPassword")}
          />
          {formik.touched.repeatPassword && formik.errors.repeatPassword ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.repeatPassword}
            </div>
          ) : null}
        </div>

        {/* First Name Input */}
        <div className="relative z-0 w-full mb-6 group">
          <label htmlFor="firstName" className="">
            First Name
          </label>
          <input
            type="firstName"
            name="firstName"
            id="firstName"
            className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0  border-b-2 ${
              formik.touched.firstName && formik.errors.firstName
                ? "border-red-500"
                : "border-gray-300"
            } appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
            placeholder=" "
            required
            {...formik.getFieldProps("firstName")}
          />
          {formik.touched.firstName && formik.errors.firstName ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.firstName}
            </div>
          ) : null}
        </div>

        {/* Last Name Input */}
        <div className="relative z-0 w-full mb-6 group">
          <label htmlFor="lastName" className="">
            Last Name
          </label>
          <input
            type="lastName"
            name="lastName"
            id="lastName"
            className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0  border-b-2 ${
              formik.touched.lastName && formik.errors.lastName
                ? "border-red-500"
                : "border-gray-300"
            } appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
            placeholder=" "
            required
            {...formik.getFieldProps("lastName")}
          />
          {formik.touched.lastName && formik.errors.lastName ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.lastName}
            </div>
          ) : null}
        </div>

        <MainButton
          icon={<FaUserCheck className="text-lg mr-2" />}
          text="CREATE NEW ACCOUNT"
          bgColor="mainYellow"
          textColor="black"
          Type={"submit"}
        />
      </form>
      <p className="mt-2 pb-4">
        Please{" "}
        <Link href="/login">
          <span className="font-bold text-yellow-500">Login</span>
        </Link>{" "}
        if you already have an Account
      </p>
    </div>
  );
};

export default Signup;
