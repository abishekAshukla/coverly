import "@/styles/globals.css";
import Navbar from "@/components/layouts/Navbar";
import { Inter } from "next/font/google";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  return (
    <div className={inter.className}>
      <ToastContainer />
      <Head>
        <title>Coverly</title>
        <meta
          name="description"
          content="Ecommerce project by Abhishek Shukla"
        />
      </Head>
      <Navbar />
      <div className="mt-20"></div>
      <Component {...pageProps} />
    </div>
  );
}
