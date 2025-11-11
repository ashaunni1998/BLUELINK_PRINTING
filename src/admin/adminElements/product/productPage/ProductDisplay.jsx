import { useEffect, useState } from 'react';
import TopBar from '../productComponents/TopBar';
import ProductTable from '../productComponents/ProductTable';
import BottomBar from '../productComponents/BottomBar';
import {ALL_PRODUCT_API} from "../../../apiServices/productApi.js"

function Product({ setPurpose, setProductData,change,setChange }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [apiPagination, setApiPagination] = useState({
        totalItems: products.length,
        currentPage: currentPage,
        totalPages: 1,
        pageSize: itemsPerPage,
        outOfStock: 0
    });
    const [productSort,setProductSort]=useState('')
    
   useEffect(()=>{
      takeProductData()
   },[currentPage,itemsPerPage,change,productSort])

   const takeProductData=async ()=>{
    setLoading(true)
    try {
        const res=await ALL_PRODUCT_API(itemsPerPage,currentPage,productSort);
        // console.log(2222,res);
        setProducts(res.productData)
        setApiPagination(res.pagination)
    } catch (error) {
        console.log(4444,error);
        
    }finally{
        setLoading(false)
    }
   }

    return (
        <div className="min-h-screen bg-gray-100 p-3 sm:p-6 pt-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}

                <TopBar itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} setCurrentPage={setCurrentPage} setPurpose={setPurpose}
                 setProducts={setProducts} setChange={setChange}/>
                {/* Responsive Table */}
                <ProductTable products={products} apiPagination={apiPagination} loading={loading} setProductDataForEditing={setProductData}
                 setPurpose={setPurpose} setChange={setChange} setProductSort={setProductSort} productSort={productSort}/>

                {/* Pagination */}

                <BottomBar  apiPagination={apiPagination} setCurrentPage={setCurrentPage}/>
            </div>
        </div>
    );
}

export default Product;