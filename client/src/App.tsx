import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import AnalyseProject from './pages/AnalyseProject'
import Login from './pages/Login'
import SignUp from './pages/SignUp'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/analyse' element={<AnalyseProject />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App