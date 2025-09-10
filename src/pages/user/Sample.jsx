import React from 'react'
import { useState,useEffect } from 'react';
import axios from 'axios';
export default function Sample() {

    useEffect (()=>{
handleAddAddress();
    },[]);

    const handleAddAddress = async (e) => {
   // prevent page reload
console.log("worked");
  try {
   
const  addressData= {
"fullName": "yguhi addressType",
  "phone": "0211234567",
  "street": "Queen Street",
  "streetNumber": "123d0000",
  "unitNumber": "2B",
  "suburb": "Mount Eden",
  "city": "Auckland",
  "region": "Auckland",
  "postalCode": "1010",
  "landmark": "Near Sky Tower",
  "addressType": "Home"
}
    //  console.log("Sending address payload:", addressData);

    // ✅ Use axios (with credentials for auth/session)
    //  console.log("📤 Sending POST /address/add payload:", addressData);
    // const response = await axios.post(
    //   `https://kerala-digital-park-server.vercel.app/api/address/add`,
    //   addressData,
    //   { withCredentials: true }
    // );

     const response = await axios.post(
      'https://kerala-digital-park-server.vercel.app/api/address/add',addressData,
     
      { withCredentials: true }
    );

    console.log("📥 Response from add:", response.data);

    // ✅ Reset form after success
    // setNewAddress({
    //   fullName: "Asha",
    //   phone: "9853124567",
    //   street: "aerd",
    //   streetNumber: "545",
    //   unitNumber: "987",
    //   suburb: "aerfty",
    //   city: "jgjyt",
    //   region: "auckland",
    //   postalCode: "1234",
    //   landmark: "cjghf",
    //   addressType: "Home",
    //   isDefault: false,
    //   country: "New Zealand",
    // });

   
    
  } catch (err) {
    console.log(err);
    
  }
};
  return (
    <div>
      Checkout
    </div>
  )
}
