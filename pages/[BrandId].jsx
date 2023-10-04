import { useState, useEffect } from "react";
import BreadCrumb from "@/components/common/BreadCrumb";
import ProductList from "@/components/lists/ProductList";
import GlobalLoader from "@/components/loaders/GlobalLoader";
import { getAllBrandNames, getProductDataByBrandId } from "@/config/api";
import usePagination from "@/hooks/usePagination";

const BrandId = ({ productData }) => {
  const { data, loading } = usePagination();
  const [producDataState, setProducDataState] = useState(productData);

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

export async function getStaticPaths() {
  try {
    const brandData = await getAllBrandNames();
    const paths = brandData.map((brand) => ({
      params: { BrandId: brand },
    }));

    return {
      paths,
      fallback: false,
    };
  } catch (error) {
    return {
      paths: [],
      fallback: false,
    };
  }
}

export async function getStaticProps({ params }) {
  const { BrandId } = params;
  try {
    const response = await getProductDataByBrandId(BrandId);
    const productData = response.products;

    return {
      props: {
        productData: productData,
      },
    };
  } catch (error) {
    return {
      props: {
        productData: [],
      },
    };
  }
}
