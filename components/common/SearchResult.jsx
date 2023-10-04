import { useState } from "react";
import { useRouter } from "next/router";

const SearchResultBox = ({ result, searchFor, loading, emptySearchBox }) => {
  const router = useRouter();
  return (
    <div
      style={{ display: searchFor === "" ? "none" : "" }}
      className="fixed top-[100px] md:top-[80px] right-0 md:right-10 w-full md:w-2/5 bg-white border-2 p-2"
    >
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {result.map((result) => (
            <div
              onClick={() => {
                router.push(`/product/${result.product_link.split("/")[2]}`);
                emptySearchBox();
              }}
              className="py-2"
              key={result._id}
            >
              <p>{`${result.brand} ${result.model}`}</p>
              <div
                style={{
                  whiteSpace: "normal",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  maxHeight: "60px",
                }}
              >
                {result.product_name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SearchResult = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [abortController, setAbortController] = useState(null);

  // function to empty the search box input
  const emptySearchBox = () => {
    setSearchText("");
    setSearchResult([]);
  };

  // Function to make a fetch request with cancellation of ongoing requests
  async function makeFetchRequest(url) {
    // Cancel the previous request if there is one
    if (abortController) {
      abortController.abort();
    }

    // Create a new AbortController for this request
    const newAbortController = new AbortController();
    const newAbortSignal = newAbortController.signal;
    setAbortController(newAbortController);

    try {
      const response = await fetch(url, { signal: newAbortSignal });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setSearchResult(data.products);
    } catch (error) {}
  }

  const handleSearch = (e) => {
    const search = e.target.value;
    setSearchText(search);
    makeFetchRequest(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/search?query=${search}&page=1`
    );
  };
  return (
    <div className="md:flex md:items-center rounded-md md:p-1 border border-gray-300 w-full">
      <input
        type="text"
        placeholder="Search prodcut by name, brand or model"
        className=" p-2 w-full md:w-96"
        onChange={handleSearch}
        value={searchText}
      />
      <SearchResultBox
        result={searchResult}
        searchFor={searchText}
        loading={loading}
        emptySearchBox={emptySearchBox}
      />
    </div>
  );
};

export default SearchResult;
