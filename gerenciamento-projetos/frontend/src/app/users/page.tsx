'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import ResponsiveAppBar from '../components/Navigation/AppBar';
import Footer from '../components/Navigation/Footer';
import Sidebar from '../components/Navigation/Sidebar';
import axios from 'axios';
import { useCookies } from 'react-cookie';

// Components
import { toast, ToastContainer } from 'react-toastify';
import UserTable from '../components/User/UserTable';
import Header from '../components/Header';


const Users: React.FC = () => {
    const [openSidebar, setOpenSidebar] = useState<boolean>(false);
    const [cookies, setCookie, removeCookie] = useCookies([]);


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
             <Header title='Usuários' subtitle='Gerencie os usuários do sistema.'/>
        </Box>
        <Box
            sx={{
                padding: { xs: 2, sm: 4, md: 6 },
                margin: '0 auto',
                maxWidth: '1200px',
                textAlign: 'center',
            }}
        >
            <UserTable buttonShow={false} />
        </Box>
        <Footer />
        <ToastContainer />
    </Box>
);
};

export default Users;