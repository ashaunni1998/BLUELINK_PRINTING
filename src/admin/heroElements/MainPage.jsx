
import HandlingPage from './mainPages/HandlingPage'
import Header from '../commonElements/header/Header'
import Footer from '../commonElements/footer/Footer'

function MainPage() {
  return (
    <div className="flex flex-col min-h-screen mt-[60px]">
      <Header />

      {/* Main content takes full available space */}
      <div className="flex-grow">
        <HandlingPage />
      </div>

      {/* Footer sticks to bottom if page is short */}
      <Footer />
    </div>
  )
}

export default MainPage