import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import axios from "axios";

export default function Home({ brandsWithModels }) {
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [availableModels, setAvailableModels] = useState([]);

  // Handle brand selection
  const handleBrandChange = (e) => {
    const brand = e.target.value;
    setSelectedBrand(brand);
    setSelectedModel(""); // Reset selected model when brand changes
    setAvailableModels(brandsWithModels[brand] || []);
  };

  // Handle model selection
  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  // Handle search button click
  const handleSearch = (e) => {
    e.preventDefault();
    if (selectedBrand) {
      const formattedBrand = selectedBrand.toLowerCase().replace(/\s+/g, "-");
      const formattedModel = selectedModel.toLowerCase().replace(/\s+/g, "-");
      router.push(`/${formattedBrand}/${formattedModel}`);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="bg-gray-100 w-[90%] sm:w-[75%] mt-12 px-8 py-12 border text-center">
        <h1 className="text-2xl font-bold">Select Brand and Model of Phone</h1>
        <div className="flex justify-between mt-8">
          {/* Form */}
          <div className="bg-white p-6 sm:p-12 w-[98%] md:w-[65%]">
            {/* Brand selection */}
            <div className="flex flex-col">
              <label htmlFor="mobileBrand">Select a Mobile Brand</label>
              <select
                id="mobileBrand"
                name="mobileBrand"
                className="border border-black h-12 mt-3"
                onChange={handleBrandChange}
                value={selectedBrand}
              >
                <option value="">Select Brand</option>
                {Object.keys(brandsWithModels).map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>
            {/* Model selection */}
            <div className="flex flex-col mt-8">
              <label htmlFor="mobileModel">Select a Mobile Model</label>
              <select
                id="mobileModel"
                name="mobileModel"
                className="border border-black h-12 mt-3"
                onChange={handleModelChange}
                value={selectedModel}
                disabled={!selectedBrand}
              >
                <option value="">Select Model</option>
                {availableModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
            {/* Search button */}
            <button
              onClick={handleSearch}
              className="px-8 py-2 rounded mt-5"
              style={{
                backgroundColor: !selectedBrand
                  ? "rgb(209 213 219 "
                  : "#ffd84d",
              }}
            >
              Search
            </button>
          </div>
          {/* Thumbnail */}
          <div className="hidden md:block ml-2">
            <Image
              src="/assets/images/backCoverThumbnail.webp"
              alt="Mobile back cover image"
              width={220}
              height={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const apiUrl = process.env.API_BASE_URL;

  try {
    const response = await axios.get(`${apiUrl}/api/brands/models`);
    const productData = response.data;

    const brandsWithModels = {};

    productData.forEach((item) => {
      const brandName = capitalizeFirstLetter(
        item.brandName.replace(/-/g, " ")
      );
      const modelName = capitalizeFirstLetter(
        item.modelName.replace(/-/g, " ")
      );

      if (!brandsWithModels[brandName]) {
        brandsWithModels[brandName] = [];
      }

      brandsWithModels[brandName].push(modelName);
    });

    return {
      props: {
        brandsWithModels,
      },
    };
  } catch (error) {
    return {
      props: {
        brandsWithModels: {},
      },
    };
  }
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
