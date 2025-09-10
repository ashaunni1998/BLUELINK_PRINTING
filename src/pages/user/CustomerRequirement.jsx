import React, { useState, useEffect } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config";
import Swal from "sweetalert2";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function CustomerRequirement() {
  const location = useLocation();
  const { orderDetails } = location.state || {};
  console.log(orderDetails, "new");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState();
   const navigate = useNavigate();

  // Form states
  const [logo, setLogo] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [title, setTitle] = useState("");
  const [slogan, setSlogan] = useState("");
  const [website, setWebsite] = useState("");
  const [backInfo, setBackInfo] = useState("");
  const [extraNotes, setExtraNotes] = useState("");
  const [loading, setLoading] = useState(false);

    const [croppedImage, setCroppedImage] = useState(null); 
  const [mugText, setMugText] = useState(""); 

  // Fetch product details from order
useEffect(() => {
  if (orderDetails?.orderData?.orderItems?.length) {
    const fetchProducts = async () => {
      try {
        console.log("Fetching product details for:", orderDetails.orderData.orderItems);
        const productPromises = orderDetails.orderData.orderItems.map((item) =>
          
          fetch(`${API_BASE_URL}/product/productDetails/${item.product}`, {
            credentials: "include",
          }).then((res) => res.json())
        );
       
        const productData = await Promise.all(productPromises);
        console.log("Fetched product data:", productData);
        setProducts(productData);
        console.log(products,"asd");
      } catch (err) {
        console.error("Error fetching product details:", err);
      }
    };
    fetchProducts();
  }
}, [orderDetails]);


  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogo(URL.createObjectURL(file));
    }
  };

  const handleCustomize = (product) => {
    console.log(product.data);
   setSelectedProduct(product.data);
    console.log(selectedProduct,"asha");
  };

  const handleProcessWithoutCustomization = () => {
    Swal.fire("Processed", "Proceeding without customization", "info");
  };

  const handlePlaceOrder = () => {
    Swal.fire("Order Placed", "Your order has been placed successfully", "success");
  };

  const handleSubmit = async (selectedProduct) => {
    try {
      setLoading(true);
      const productId=selectedProduct._id;
      const orderId=orderDetails.orderId;
      const formData = new FormData();
       formData.append("orderId", orderId);   // ✅ required by backend
    formData.append("productId", productId); // ✅ required by backend
      formData.append("title", title);
      formData.append(
        "content",
        JSON.stringify({ slogan, website, backInfo, extraNotes , mugText})
      );
        if (croppedImage) {
        // If using cropped image as file
        const blob = await fetch(croppedImage).then((r) => r.blob());
        formData.append("images", blob, "mug-image.png");
      } else if (logoFile) {
        formData.append("images", logoFile);
      }
      if (logoFile) {
        formData.append("images", logoFile);
      }

      const res = await fetch(`${API_BASE_URL}/order/custom-data`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire("Success", data.message, "success").then(()=>{
          navigate("/checkout-form",{
            state:{
              orderDetails: {
              orderId,
              productId,
            amount: selectedProduct?.price
                  ? selectedProduct.price * 100 // Stripe expects cents
                  : 1000, // fallback amount
                description: selectedProduct?.name || "Custom Product",
              },
            },
          })
          });
        
        
        console.log("Saved Custom Data:", data);
      } else {
        Swal.fire("Error", data.message || "Something went wrong", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Server error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

   const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // For now, just preview directly
        // Later you can replace with your <CropImage /> modal logic
        setCroppedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <Header/>
        <h1 className="text-2xl font-bold mb-6 ">Customer Requirements</h1>

        {/* List Products */}
        <div className="space-y-4">
          {products.map((product, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold">{product.data.name}</h2>
                <p className="text-gray-500">
                  Category: {product.data.category?.name || "N/A"}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleCustomize(product)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg"
                >
                  Customize
                </button>
             
              </div>
            </div>
          ))}
        </div>

        {/* Customization Form */}
        {selectedProduct && (
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">
              Customize {selectedProduct.name}
            </h3>

            {/* Business Card Category Example */}
            {selectedProduct?.category?.name === "Business Cards" && (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Logo Upload */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-xl font-semibold mb-4">Upload Logo</h3>
                    <div className="flex flex-col items-center">
                      <div className="relative mb-4">
                        {logo ? (
                          <img
                            src={logo}
                            alt="Logo Preview"
                            className="w-40 h-40 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                          />
                        ) : (
                          <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 bg-gray-50">
                            <span className="text-sm font-medium">300×300</span>
                            <span className="text-xs">PNG/JPG</span>
                          </div>
                        )}
                      </div>
                      <label className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium text-sm">
                        Choose File
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Front Side */}
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-xl font-semibold mb-6">
                      Front Side Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Business Name *
                        </label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g., Crafted Charm"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Slogan / Tagline
                        </label>
                        <input
                          type="text"
                          value={slogan}
                          onChange={(e) => setSlogan(e.target.value)}
                          placeholder="e.g., Your Style, Your Identity"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Website URL
                        </label>
                        <input
                          type="text"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="www.yourwebsite.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-xl font-semibold mb-6">
                      Back Side Information
                    </h3>
                    <textarea
                      value={backInfo}
                      onChange={(e) => setBackInfo(e.target.value)}
                      placeholder="Enter contact info, address, phone, social media links..."
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-vertical"
                    />
                  </div>

                  {/* Extra Notes */}
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-xl font-semibold mb-6">
                      Design Preferences
                    </h3>
                    <textarea
                      value={extraNotes}
                      onChange={(e) => setExtraNotes(e.target.value)}
                      placeholder="Share design ideas, color preferences, style..."
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-vertical"
                    />
                  </div>

                  {/* Submit + Place Order */}
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">Ready to submit?</p>
                        <p>We'll review your requirements and create your business card.</p>
                      </div>
                      <div className="flex gap-3">
                        <button
  onClick={() => handleSubmit(selectedProduct)}   // ✅ FIX
  disabled={loading}
  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
>
  {loading ? "Submitting..." : "Submit Requirements"}
</button>

                       
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Generic Category */}
            {selectedProduct?.category?.name !== "Business Cards" && (
              <div>
                <p className="text-gray-600">
                  This product does not have specific customization fields.
                </p>
                <div className="mt-6 flex justify-end">
                
                </div>
              </div>
            
            )}
             <div className="d-flex justify-content-between mt-3">
                <button
                  onClick={handleProcessWithoutCustomization}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg"
                >
                  Process Without Customization
                </button>
             <button
                          onClick={handlePlaceOrder}
                          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
                        >
                          Place Order
                        </button>
                        </div>

          </div>
 )}

   {/* Personalized gift*/}
         {selectedProduct?.category?.name === "Personalized Gifts" &&  (
  <div className="grid lg:grid-cols-3 gap-6">
    {/* Image Upload + Cropping */}
    <div className="lg:col-span-1">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-xl font-semibold mb-4">Upload & Crop Image</h3>
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            {croppedImage ? (
              <img
                src={croppedImage}
                alt="Mug Preview"
                className="w-40 h-40 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
              />
            ) : (
              <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 bg-gray-50">
                <span className="text-sm font-medium">Upload Image</span>
                <span className="text-xs">PNG/JPG</span>
              </div>
            )}
          </div>
          <label className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium text-sm">
            Choose Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}   // ✅ call your crop modal
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>

    {/* Mug Customization Fields */}
    <div className="lg:col-span-2 space-y-6">
      {/* Text Field */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-xl font-semibold mb-6">Add Your Text</h3>
        <textarea
          value={mugText}
          onChange={(e) => setMugText(e.target.value)}
          placeholder="e.g., Best Dad Ever, Happy Birthday, or Your Quote Here"
          rows="3"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-vertical"
        />
      </div>

      {/* Extra Notes */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-xl font-semibold mb-6">Design Preferences</h3>
        <textarea
          value={extraNotes}
          onChange={(e) => setExtraNotes(e.target.value)}
          placeholder="Share color preferences, placement of text/image, or other ideas..."
          rows="4"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-vertical"
        />
      </div>

      {/* Submit */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            <p className="font-medium">Ready to customize your mug?</p>
            <p>We’ll print your text and image beautifully on the mug.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleSubmit(selectedProduct)}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Requirements"}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

  {/* PostCards Category Example */}
            {selectedProduct?.category?.name === "PostCards" && (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Logo Upload */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-xl font-semibold mb-4">Upload Logo</h3>
                    <div className="flex flex-col items-center">
                      <div className="relative mb-4">
                        {logo ? (
                          <img
                            src={logo}
                            alt="Logo Preview"
                            className="w-40 h-40 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                          />
                        ) : (
                          <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 bg-gray-50">
                            <span className="text-sm font-medium">300×300</span>
                            <span className="text-xs">PNG/JPG</span>
                          </div>
                        )}
                      </div>
                      <label className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium text-sm">
                        Choose File
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Front Side */}
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-xl font-semibold mb-6">
                      Front Side Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Business Name *
                        </label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g., Crafted Charm"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Slogan / Tagline
                        </label>
                        <input
                          type="text"
                          value={slogan}
                          onChange={(e) => setSlogan(e.target.value)}
                          placeholder="e.g., Your Style, Your Identity"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Website URL
                        </label>
                        <input
                          type="text"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="www.yourwebsite.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-xl font-semibold mb-6">
                      Back Side Information
                    </h3>
                    <textarea
                      value={backInfo}
                      onChange={(e) => setBackInfo(e.target.value)}
                      placeholder="Enter contact info, address, phone, social media links..."
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-vertical"
                    />
                  </div>

                  {/* Extra Notes */}
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-xl font-semibold mb-6">
                      Design Preferences
                    </h3>
                    <textarea
                      value={extraNotes}
                      onChange={(e) => setExtraNotes(e.target.value)}
                      placeholder="Share design ideas, color preferences, style..."
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-vertical"
                    />
                  </div>

                  {/* Submit + Place Order */}
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">Ready to submit?</p>
                        <p>We'll review your requirements and create your business card.</p>
                      </div>
                      <div className="flex gap-3">
                        <button
  onClick={() => handleSubmit(selectedProduct)}   // ✅ FIX
  disabled={loading}
  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
>
  {loading ? "Submitting..." : "Submit Requirements"}
</button>

                       
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

  {/* Flyers and leaflets Category Example */}
            {selectedProduct?.category?.name === "Flyers & Leaflets" && (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Logo Upload */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-xl font-semibold mb-4">Upload Logo</h3>
                    <div className="flex flex-col items-center">
                      <div className="relative mb-4">
                        {logo ? (
                          <img
                            src={logo}
                            alt="Logo Preview"
                            className="w-40 h-40 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                          />
                        ) : (
                          <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 bg-gray-50">
                            <span className="text-sm font-medium">300×300</span>
                            <span className="text-xs">PNG/JPG</span>
                          </div>
                        )}
                      </div>
                      <label className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium text-sm">
                        Choose File
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Front Side */}
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-xl font-semibold mb-6">
                      Front Side Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Business Name *
                        </label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g., Crafted Charm"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Slogan / Tagline
                        </label>
                        <input
                          type="text"
                          value={slogan}
                          onChange={(e) => setSlogan(e.target.value)}
                          placeholder="e.g., Your Style, Your Identity"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Website URL
                        </label>
                        <input
                          type="text"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="www.yourwebsite.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-xl font-semibold mb-6">
                      Back Side Information
                    </h3>
                    <textarea
                      value={backInfo}
                      onChange={(e) => setBackInfo(e.target.value)}
                      placeholder="Enter contact info, address, phone, social media links..."
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-vertical"
                    />
                  </div>

                  {/* Extra Notes */}
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-xl font-semibold mb-6">
                      Design Preferences
                    </h3>
                    <textarea
                      value={extraNotes}
                      onChange={(e) => setExtraNotes(e.target.value)}
                      placeholder="Share design ideas, color preferences, style..."
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-vertical"
                    />
                  </div>

                  {/* Submit + Place Order */}
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">Ready to submit?</p>
                        <p>We'll review your requirements and create your business card.</p>
                      </div>
                      <div className="flex gap-3">
                        <button
  onClick={() => handleSubmit(selectedProduct)}   // ✅ FIX
  disabled={loading}
  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
>
  {loading ? "Submitting..." : "Submit Requirements"}
</button>

                       
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
<Footer/>
      </div>
    </div>
  );
}
