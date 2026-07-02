import products from "@/data/products.json";
import ProductCard from "@/components/Product/ProductCard";

export default function TestProducts() {
  return (
    <div
      style={{
        maxWidth: "1400px",
        margin: "40px auto",
        padding: "0 40px",
        display: "grid",
        gridTemplateColumns:
          "repeat(4, 1fr)",
        gap: "30px",
      }}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}