import axios from "axios";
import { useState, useEffect } from "react";
import BreadCrumb from "@/components/common/BreadCrumb";
import ProductList from "@/components/lists/ProductList";
import usePagination from "@/hooks/usePagination";
import GlobalLoader from "@/components/loaders/GlobalLoader";

const BrandId = ({ productData }) => {
  const [producDataState, setProducDataState] = useState(productData);
  const { data, loading } = usePagination();

  // add new products into existing state when user reaches to bottom of the page
  useEffect(() => {
    if (data && data.length > 0) {
      setProducDataState((prevData) => [...prevData, ...data]);
    }
  }, [data]);

  return (
    <div className="flex justify-center my-6">
      <div className="w-[90%] sm:w-[75%]">
        <BreadCrumb />
        <ProductList productData={producDataState} />
        {loading && (
          <GlobalLoader
            tag="Fetching more items....."
            color="black"
            size={60}
            width={6}
          />
        )}
      </div>
    </div>
  );
};

export default BrandId;

const data = [
  { brandName: "apple", modelName: "iphone-13" },
  { brandName: "apple", modelName: "iphone-14" },
  { brandName: "apple", modelName: "iphone-3" },
];

export async function getStaticPaths() {
  const apiUrl = process.env.API_BASE_URL;
  try {
    const response = await axios.get(`${apiUrl}/api/brands`);
    const brandData = response.data;

    const paths = brandData.map((brand) => ({
      params: { BrandId: brand },
    }));

    return {
      paths,
      fallback: false,
    };
  } catch (error) {
    console.error("Error fetching brand data:", error);
    return {
      paths: [],
      fallback: false,
    };
  }
}

export async function getStaticProps({ params }) {
  const { BrandId } = params;
  const apiUrl = process.env.API_BASE_URL;

  try {
    const response = await axios.get(
      `${apiUrl}/api/products/brand/${BrandId}?page=1`
    );
    const productData = response.data.products;

    return {
      props: {
        productData: productData,
      },
    };
  } catch (error) {
    console.error("Error fetching product data:", error);
    return {
      props: {
        productData: [],
      },
    };
  }
}
