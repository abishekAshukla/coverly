// this hook  generates and returns new product data when user reaches at bottom of the page

import { useState, useEffect } from "react";
import useBottomReached from "./useBottomReached";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const usePagination = () => {
  const router = useRouter();
  const pathname = router.asPath;
  const [pageNumber, setPageNumber] = useState(2);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomReached = useBottomReached();
  const hostName = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Function to convert pathname to an array of segments
  const convertPathnameToArray = (pathname) => {
    return pathname
      .split("/")
      .filter((param) => param.trim() !== "") // Remove empty segments
      .map((param) => param); // Map segments to an array
  };

  const pathSegments = convertPathnameToArray(pathname); // Get an array of path segments to decide whether fetch data for brand or model

  useEffect(() => {
    const fetchData = async () => {
      if (pageNumber === 1 || pageNumber === -1) {
        // terminate if its first page or last page
        return;
      }
      try {
        setLoading(true);
        setError(null);
        let finalApiUrl;
        if (pathSegments.length === 1) {
          // for /:brandid
          finalApiUrl = `${hostName}/api/products/brand/${pathSegments[0]}?page=${pageNumber}`;
        } else if (pathSegments.length === 2) {
          // for /:brandid/:modelid
          finalApiUrl = `${hostName}/api/products/model/${pathSegments[0]}/${pathSegments[1]}?page=${pageNumber}`;
        }

        const response = await axios.get(finalApiUrl);
        setData(response.data.products);
        if (response.data.hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        } else {
          // no more data is available to fetch
          setPageNumber(-1);
        }

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    if (bottomReached) {
      fetchData();
    }
    // eslint-disable-next-line
  }, [bottomReached]);

  return { data, loading, error };
};

export default usePagination;
