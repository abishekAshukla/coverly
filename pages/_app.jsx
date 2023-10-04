import Navbar from "@/components/layouts/Navbar";
import PageLoader from "@/components/loaders/PageLoader";
import { AuthProvider } from "@/contexts/AuthContext";
import { Inter } from "next/font/google";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  return (
    <div className={inter.className}>
      <AuthProvider>
        <ToastContainer />
        <PageLoader />
        <Head>
          <title>Coverly</title>
          <meta
            name="Ecommerce project by Abhishek Shukla"
            content="Ecommerce project by Abhishek Shukla"
          />
        </Head>
        <Navbar />
        <div className="pt-20 md:pt-16"></div>
        <Component {...pageProps} />
      </AuthProvider>
    </div>
  );
}
