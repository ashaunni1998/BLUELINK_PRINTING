import React, { useEffect, useState } from 'react'
import { TAKE_TOP_DATA } from "../../../apiServices/dataApi"

function Dashboard() {

  const [topBarData, setTopBarData] = useState({ totalUsers: '0', totalProducts: '0', totalCategories: '0', totalOrders: '0' })


  useEffect(() => {
    takeTopBarData()
  }, [])

  const takeTopBarData = async () => {
    try {
      const res = await TAKE_TOP_DATA()
      // console.log(res);
      setTopBarData(res.data)

    } catch (error) {
      // console.log(error);

    }
  }

  return (
    <>
      <div className="flex-1 p-6 bg-gray-50">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Total Users', value: topBarData.totalUsers, change: '+12%', color: 'red' },
            { title: 'Total Products', value: topBarData.totalProducts, change: '+8%', color: 'blue' },
            { title: 'Total Orders', value: topBarData.totalOrders, change: '+15%', color: 'red' },
            { title: 'Total Categories', value: topBarData.totalCategories, change: '+2%', color: 'blue' },
          ].map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`
                    px-3 py-1 rounded-full text-sm font-medium
                    ${stat.color === 'red'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-blue-100 text-blue-600'
                  }
                  `}>
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { action: 'New user registered', time: '2 minutes ago', type: 'user' },
                { action: 'Job completed successfully', time: '15 minutes ago', type: 'job' },
                { action: 'System backup completed', time: '1 hour ago', type: 'system' },
                { action: 'New order received', time: '2 hours ago', type: 'order' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className={`
                      w-2 h-2 rounded-full
                      ${activity.type === 'user' ? 'bg-red-500' :
                      activity.type === 'job' ? 'bg-blue-500' :
                        activity.type === 'system' ? 'bg-green-500' : 'bg-yellow-500'
                    }
                    `}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>


          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Add User', color: 'red' },
                { name: 'Create Job', color: 'blue' },
                { name: 'Generate Report', color: 'red' },
                { name: 'System Settings', color: 'blue' },
              ].map((action, index) => (
                <button
                  key={index}
                  className={`
                      p-4 rounded-lg text-center font-medium transition-all
                      ${action.color === 'red'
                      ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                    }
                    `}
                >
                  {action.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard