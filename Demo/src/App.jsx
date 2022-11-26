import { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import Register from './Register';
import NavBar from './NavBar';
import MainPage from './MainPage';
import { Flex, Box, Image, Link, Spacer, Button, Heading } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
  const [accounts, setAccounts] = useState([]);
  

  return (
    <div className='overlay' >
      <div className='App'>


        <Flex height="100vh" justifyContent="center"  >
          <Flex width="100%" bg="blue.400" direction="column" >

            <NavBar accounts={accounts} setAccounts={setAccounts} />




            <BrowserRouter>

              <Routes>
                <Route path='/' element={<MainPage accounts={accounts} setAccounts={setAccounts} />}></Route>
                <Route path='register' element={<Register accounts={accounts} setAccounts={setAccounts} />}></Route>

              </Routes>

            </BrowserRouter>

          </Flex>
        </Flex>
      </div>
    <div className='moving-background'></div>


    </div>



  )
}

export default App
