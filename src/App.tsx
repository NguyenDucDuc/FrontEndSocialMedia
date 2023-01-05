import React from 'react';
import "./App.scss"
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { Header } from './components/Header/Header';
import { Home } from './components/Home/Home';
import { Login } from './components/Login/Login';
import { PostDetail } from './components/PostDetail/PostDetail';
import { io } from 'socket.io-client';
import { Test } from './components/Test/Test';
import { AddPost } from './components/AddPost/AddPost';

export const socket = io("http://localhost:5000/")

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/post/:postId' element={<PostDetail />} />
        <Route path='/test' element={<Test />} />
        <Route path='/add-post' element={<AddPost />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
