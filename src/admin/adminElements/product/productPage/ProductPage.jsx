import { useState } from 'react'
import ProductDisplay from './ProductDisplay'
import ProductManagement from './ProductManagement'

function ProductPage() {
    const [purpose,setPurpose]=useState('display');
    const [productData,setProductData]=useState(null)
    const [change,setChange]=useState(true)
  return (
    <>
    {purpose==='display'?(<ProductDisplay setPurpose={setPurpose} setProductData={setProductData} change={change} setChange={setChange}/>)
    :(<ProductManagement purpose={purpose} productData={productData} setPurpose={setPurpose} setProductData={setProductData} setChange={setChange}/>)}
    </>
  )
}

export default ProductPage