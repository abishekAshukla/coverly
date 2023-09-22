import React, { useState } from "react";

const QuantityInput = ({ onChange }) => {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
    onChange(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      onChange(quantity - 1);
    }
  };

  return (
    <div className="flex items-center mt-3">
      <p> Quantity:</p>
      <button
        className="bg-gray-200 px-3 py-1 rounded-full ml-3"
        onClick={decreaseQuantity}
      >
        -
      </button>
      <input
        type="number"
        className="w-12 mx-2 text-center"
        value={quantity}
        onChange={(e) => {
          const newQuantity = parseInt(e.target.value);
          setQuantity(newQuantity);
          onChange(newQuantity);
        }}
      />
      <button
        className="bg-gray-200 px-3 py-1 rounded-full"
        onClick={increaseQuantity}
      >
        +
      </button>
    </div>
  );
};

export default QuantityInput;
