import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Feed from "./components/Feed";
import SearchResult from "./components/SearchResult";
import VideoDetail from "./components/VideoDetail";
import { AppContext } from './context/contextApi';

const App = () => {
    return (
        <AppContext>
            <BrowserRouter>
                <div className='text-3xl'>
                    <Header />
                    <Routes>
                        <Route path='/' element={<Feed />}/>
                        <Route path='/searchResult/:searchQuery' element={<SearchResult />}/>
                        <Route path='/video/:id' element={<VideoDetail/>}/>
                    </Routes>
                </div>
            </BrowserRouter>
        </AppContext>
    )
}

export default App;