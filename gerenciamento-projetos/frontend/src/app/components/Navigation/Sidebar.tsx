
'use client';
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { User } from '@/app/types/User';
import axios from 'axios';
import { Typography } from '@mui/material';
import NavHeader from './NavHeader';

const drawerWidth = 240;


interface SidebarProps {
  open?: boolean;
  handleSidebar?: () => void;
}

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft({ open, handleSidebar }: SidebarProps) {
  const theme = useTheme(); 
  const [user, setUser] = useState<User>();
   
 useEffect(() => {
  const getUser = async () => {
    try {
      const { data } = await axios.post('http://localhost:3000/api/auth/verify', {}, { withCredentials: true });
      if (data.status) {
        setUser(data.user);
      } else {
        console.error('User verification failed');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };
  getUser();

}, []); 



  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <NavHeader name={user?.nome} role={user?.papel} />
          <IconButton onClick={handleSidebar}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
            <Link href={'/dashboard'}>
            <ListItem key={'Dashboard'} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <DashboardCustomizeRoundedIcon />
                </ListItemIcon>
                <ListItemText primary='Dashboard' />
              </ListItemButton>
            </ListItem>
            </Link>
        </List>
        <Divider />
        <List>
           <Link href={'/users'}>
            <ListItem key={'users'} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                 <AccountCircleRoundedIcon />
                </ListItemIcon>
                <ListItemText primary={'Usuarios'} />
              </ListItemButton>
            </ListItem>
            </Link>
            <Link href={'/projects'}>
            <ListItem key={'projects'} disablePadding>
              <ListItemButton >
                <ListItemIcon>
                 <WorkOutlineIcon />
                </ListItemIcon>
                <ListItemText primary={'Projetos'} />
              </ListItemButton >
            </ListItem>
            </Link>
        </List>
      </Drawer>
    </Box>
  );
}
