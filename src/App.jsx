import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import { Header } from './components/Header'

function App() {
  const location = useLocation();

  const hideHeaderRoutes = ['/login', '/signup', '/', '/adminlogin', '/admindashboard'];

  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideHeader && <Header />}
      <Outlet />
    </>
  )
}

export default App
