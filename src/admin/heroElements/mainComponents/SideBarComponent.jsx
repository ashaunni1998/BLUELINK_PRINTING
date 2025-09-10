import { X, ChevronRight } from "lucide-react";

function SideBarComponent({
  setIsSidebarOpen,
  setActiveItem,
  isSidebarOpen,
  menuItems,
  activeItem,
}) {
  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-[250px] min-w-[250px] max-w-[250px] flex-shrink-0 flex-grow-0
        bg-white border-r border-gray-200 shadow-right-lg
        transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        transition-transform duration-300 ease-in-out
      `}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-6 border-b mt-[58px] lg:mt-0 border-gray-200">
        <div className="flex flex-col items-center justify-center w-full">
          <h2 className="text-lg font-semibold text-red-600">
            <span className="text-blue-700">Blue</span> Link
          </h2>
          <p className="text-xs text-blue-900">Admin Panel</p>
        </div>

        <button
          className="lg:hidden text-gray-500 hover:text-gray-700 hover:cursor-pointer"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.name;

            return (
              <li key={item.name}>
                <button
                  onClick={() => {
                    setActiveItem(item.name);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all
                    ${
                      isActive
                        ? "bg-red-50 text-red-600 border border-red-200 shadow-sm"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-900"
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={18} />
                    <span className="font-medium">{item.name}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {item.count && (
                      <span
                        className={`
                          px-2 py-1 text-xs rounded-full font-medium
                          ${
                            isActive
                              ? "bg-red-100 text-red-600"
                              : "bg-gray-100 text-gray-600"
                          }
                        `}
                      >
                        {item.count}
                      </span>
                    )}
                    {isActive && <ChevronRight size={16} />}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-gradient-to-r from-red-50 to-blue-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              System Status
            </span>
          </div>
          <p className="text-xs text-gray-600">All services running</p>
        </div>
      </div>
    </aside>
  );
}

export default SideBarComponent;
