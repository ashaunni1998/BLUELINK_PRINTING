import React, { act, useEffect, useState } from 'react';
import TopBarCom from '../couponsComponents/TopBarCom';
import MainCom from '../couponsComponents/mainCom';
import { GET_ALL_COUPONS } from '../../../apiServices/couponApi'

function CouponPage() {
  const [coupons, setCoupons] = useState([]);
  const [topData] = useState({
    totalCoupons: 1,
    activeCoupons: 2,
    AllCoupons: 3,
    expired: 4
  })
  const [loading, seLoading] = useState(false)


  useEffect(() => {
    fetchCoupons();

  }, [])

  const fetchCoupons = async () => {
    seLoading(true)
    try {
      const res = await GET_ALL_COUPONS();
      setCoupons(res.data);
      
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      seLoading(false)
    }
  };




  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">

        <TopBarCom setCoupons={setCoupons} topData={topData} />

        <MainCom coupons={coupons} setCoupons={setCoupons} loading={loading} />
      </div>
    </div>
  );
}

export default CouponPage;