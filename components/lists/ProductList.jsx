import ProductCard from "@/components/cards/ProductCard";

const ProductList = ({ productData }) => {
  return (
    <div className="flex bg-white flex-wrap justify-center">
      {productData &&
        productData.length > 0 &&
        productData.map((item, index) => (
          <ProductCard key={index} data={item} />
        ))}
    </div>
  );
};

export default ProductList;
