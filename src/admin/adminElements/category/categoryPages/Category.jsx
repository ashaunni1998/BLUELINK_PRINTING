import { useEffect, useState } from 'react';

import CategoryTopBar from '../categoryComponents/CategoryTopBar';
import BottomBar from '../categoryComponents/BottomBar';
import CategoryTable from '../categoryComponents/CategoryTable';

import { TAKE_CATEGORY_DATA } from '../../../apiServices/categoryApi'

function Category() {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [change, setChange] = useState(true)
    const [sort, setSort] = useState('')
    const [pagination, setPagination] = useState({ currentPage: currentPage, pageSize: itemsPerPage, totalItems: 0, totalPages: 1 });


    useEffect(() => {
        takeCategory()
    }, [currentPage, itemsPerPage, change, sort])

    const takeCategory = async () => {
        setLoading(true)
        try {
            const res = await TAKE_CATEGORY_DATA(itemsPerPage, currentPage, sort);
            // console.log(res.pagination);
            setCategories(res.categoryData)
            setPagination(res.pagination)

        } catch (error) {
            // console.log(44444,error);

        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">

                <CategoryTopBar setItemsPerPage={setItemsPerPage} itemsPerPage={itemsPerPage}
                    setCurrentPage={setCurrentPage} setCategories={setCategories} change={change} setChange={setChange} setPagination={setPagination} />

                <CategoryTable categories={categories} loading={loading} change={change} setChange={setChange} 
                   setSort={setSort} sort={sort} />

                <BottomBar setCurrentPage={setCurrentPage} currentPage={currentPage} pagination={pagination} />

            </div>
        </div>
    );
}

export default Category;
