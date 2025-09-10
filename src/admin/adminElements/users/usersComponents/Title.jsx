import React from 'react'

function Title() {
    return (
        <div className="mb-4 mt-[-10px]">
            <div className="bg- rounded-2xl px-4 ">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Users Directory</h1>
                            <p className="text-blue-500">Manage your users</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Title