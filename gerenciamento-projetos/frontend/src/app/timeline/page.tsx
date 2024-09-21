'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import ResponsiveAppBar from '../components/Navigation/AppBar';
import Footer from '../components/Navigation/Footer';
import Sidebar from '../components/Navigation/Sidebar';
import axios from 'axios';
import { tokens } from '../theme';
import { useCookies } from 'react-cookie';

import { toast, ToastContainer } from 'react-toastify';
import Header from '../components/Header';
import Calendar from '../components/Timeline/Calendar';

const Timeline: React.FC = () => {
    const [openSidebar, setOpenSidebar] = useState<boolean>(false);
    const [cookies, setCookie, removeCookie] = useCookies([]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

   useEffect(() => {
       const verifyUser = async () => {
           if(!cookies.jwt) {
               window.location.href = '/login';
           }else {
               const { data } = await axios.post('http://localhost:3000/api/auth/verify',{}, {
                   withCredentials: true
               });
               if(!data.status) {
                   removeCookie("jwt");
                   window.location.href = '/login';
               }
           }
       }
       verifyUser();
    }, [cookies, removeCookie, setCookie]);



const handleSidebar = () => {
    setOpenSidebar(!openSidebar);
}

return (
    <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
    }}
    >
        <ResponsiveAppBar open={openSidebar} handleSidebar={handleSidebar} />
        <Sidebar open={openSidebar} handleSidebar={handleSidebar} />
         <Box sx={{ml: 6, mt: 4}}>
             <Header title='Timeline' subtitle='Vizualize seus projetos numa forma de linha do tempo.'/>
            <Calendar />
        </Box>
        <Footer />
        <ToastContainer />
    </Box>
);
};

export default Timeline;