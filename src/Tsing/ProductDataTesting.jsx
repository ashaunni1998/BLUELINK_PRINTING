import { useEffect, useState } from 'react';
import axios from 'axios';
import EditImage from './EditImage';

const ProductForm = () => {
  const [product, setProduct] = useState(null); // change from {} to null
  const [isOpen,setIsOpen]=useState(false)
  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await axios.get('http://localhost:3000/api/admin/products?limit=15&page=1', {
          withCredentials: true,
        });

        // Assuming response.data.data is an array of products
        const firstProduct = response.data.productData[0]; 
        console.log(response);
        
        setProduct(firstProduct);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    }

    fetchProduct();
  }, []);

  const openModal=()=>{
    setIsOpen(true)
  }

  if (!product) return <div className="text-center mt-10">Loading product...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
      {isOpen&&(<EditImage product={product} setProduct={setProduct}/>)}
      <h2 className="text-2xl font-bold mb-6 text-center">Product Details</h2>

      <div className="space-y-4">
        <div><strong>Name:</strong> {product.name}</div>
        <div><strong>Description:</strong> {product.description}</div>
        <div><strong>Price:</strong> ₹{product.price}</div>
        <div><strong>Category:</strong> {product.category.name}</div>
        <div><strong>Brand:</strong> {product.brand}</div>
        <div><strong>Stock:</strong> {product.stock}</div>
        <div><strong>Rating:</strong> {product.rating?.total || 0} / {product.rating?.count || 0}</div>
        <div><strong>Images:</strong></div>
        <div className="grid grid-cols-2 gap-4">
          {product.images?.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Product Image ${index + 1}`}
              className="w-full h-40 object-cover rounded-md border"
            />
          ))}
        </div>
        <button  type='button' onClick={openModal}
         className='bg-blue-400 p-2 hover:cursor-pointer' >Edit Image</button>
      </div>
    </div>
  );
};

export default ProductForm;
