import { useState } from 'react'
import HeaderDropDownMenu from './HeaderDropDownMenu'
import { useNavigate } from 'react-router-dom'
function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const navigate = useNavigate()
  return (
    <header className="bg-white w-full  shadow-lg border-b border-b-blue-100 fixed top-0 z-50">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">


            <div className="flex items-center space-x-3">
              <div className=" w-[140px] hover:cursor-pointer" onClick={() => navigate('/admin/')}>
                <img src="/mainLogo.png" alt="" />
              </div>
              {/* <div className="hidden sm:block">
                <h1 className="text-[20px] font-semibold text-blue-800">PRINTING LIMITED</h1>
                <p className="text-xs  text-black mt-[-4px]">Admin Dashboard</p>
              </div> */}
            </div>
          </div>


          {/* Right Side - Notifications and Profile */}
          <div className="flex items-center space-x-4">


            <HeaderDropDownMenu setIsProfileOpen={setIsProfileOpen} isProfileOpen={isProfileOpen} />

          </div>
        </div>


      </div>
    </header>
  )
}

export default Header