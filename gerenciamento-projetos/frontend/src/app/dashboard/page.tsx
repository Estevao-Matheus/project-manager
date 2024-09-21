'use client';
import { Box, Button, colors, IconButton, Typography, useTheme } from "@mui/material";
import ResponsiveAppBar from '../components/Navigation/AppBar';
import Sidebar from '../components/Navigation/Sidebar';
import Footer from '../components/Navigation/Footer';
import { ToastContainer } from "react-toastify";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import { tokens } from "../theme";
//Icones
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import FolderIcon from '@mui/icons-material/Folder';

//components
import Header from "../components/Header";
import StatusBox from "../components/Dashboard/StatBox";
import MyResponsivePie from "../components/Dashboard/charts/PieChart";
import MyResponsiveBarChart from "../components/Dashboard/charts/BarChart";
//Helpers
import { calculateProgress } from "../Helpers/progressHelper";
import { transformRoleCounts } from "../Helpers/transformRoleCount";
import UserTable from "../components/User/UserTable";
import TableProjects from "../components/Project/TableProjects";


interface RoleCount {
  _id: string;
  count: number;
}



const Dashboard: React.FC = () => {
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const [roleCounts, setRoleCounts] = useState<RoleCount[]>([]);
  const [projectCounts, setProjectCounts] = useState<RoleCount[]>([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const totalUsers = roleCounts.find(role => role._id === "Total de Usuários")?.count || 0;
  const totalProjects = projectCounts.find(role => role._id === "Total de Projetos")?.count || 0;

  useEffect(() => {
    const verifyUser = async () => {
      if (!cookies.jwt) {
        window.location.href = '/login';
      } else {
        const { data } = await axios.post('http://localhost:3000/api/auth/verify', {}, {
          withCredentials: true
        });
        if (!data.status) {
          removeCookie("jwt");
          window.location.href = '/login';
        }
      }
    }
    verifyUser();
  }, [cookies, removeCookie, setCookie]);

  useEffect(() => {
    const fetchRoleCounts = async () => {
      try {
        const { data } = await axios.get('http://localhost:3000/api/auth/users/role-count');
        setRoleCounts(data);
      } catch (error) {
        console.error("Failed to fetch role counts", error);
      }
    };
    fetchRoleCounts();
  }, []);

  useEffect(() => {
    const fetchProjectCounts = async () => {
      try {
        const { data } = await axios.get('http://localhost:3000/api/projects/status-count');
        setProjectCounts(data);
      } catch (error) {
        console.error("Failed to fetch role counts", error);
      }
    };
    fetchProjectCounts();
  }, []);

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
      <Box
        sx={{
          padding: { xs: 2, sm: 4, md: 6 },

          maxWidth: '1200px',
        }}
      >
        <Header title="Dashboard" subtitle="Bem vindo ao seu dashboard" />
        <Typography
          variant="h4"
          color={colors.greenAccent[400]}
          sx={{ m: "0 0 40px 26px" }}
        >Usuarios</Typography>
        <Box display={'flex'} justifyContent={'space-between'} sx={{ maxWidth: '90vw' }}>

          {roleCounts.map((role, index) => (
            <StatusBox
              key={index}
              title={role.count.toString()}
              subtitle={role._id}
              icon={<PersonOutlinedIcon sx={{ color: colors.greenAccent[600], fontSize: '35px' }} />}
              progress={calculateProgress(role.count, totalUsers)}
              increase="increase"
            />
          ))}
        </Box>
         <Box display={'flex'} flexDirection={'column'} sx={{ backgroundColor: colors.primary[400], mb: '20px', mt: '20px', ml: '23px', width: '90vw' }} >
          <Box>
            <Typography variant="h5" fontWeight={'bold'} color={colors.greenAccent[400]} sx={{ mt: 2, ml: 4, mb: 4 }}>
              Usuario x Papel
            </Typography>
          </Box>
          <Box display={'flex'} sx={{ height: '50vh', width: '90vw' }} >
            <MyResponsivePie data={transformRoleCounts(roleCounts)} />
            <MyResponsiveBarChart data={transformRoleCounts(roleCounts)} />
          </Box>
        </Box>
        <Box
          sx={{
            padding: { xs: 2, sm: 4, md: 6 },
            margin: '0 auto',
            minWidth: '90vw',
            textAlign: 'center',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: colors.primary[400],
            ml: '20px'
          }}
        >
          <UserTable buttonShow={false} />
        </Box>
        <Box sx={{ margin: '20px 0 20px 0' }}>
          <Typography
            variant="h4"
            color={colors.greenAccent[400]}
            sx={{ m: "0 0 10px 26px" }}
          >Projetos</Typography>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'} sx={{ mt: '40px' }} >

          {projectCounts.map((project, index) => (
            <StatusBox
              key={index}
              title={project.count.toString()}
              subtitle={project._id}
              icon={<FolderIcon sx={{ color: colors.greenAccent[600], fontSize: '35px' }} />}
              progress={calculateProgress(project.count, totalProjects)}
              increase="increase"
            />
          ))}
        </Box>
      </Box>
      <Box display={'flex'} flexDirection={'column'} sx={{ backgroundColor: colors.primary[400], mb: '20px', mt: '20px', ml: '76px', width: '90vw' }} >
         <Box>
            <Typography variant="h5" fontWeight={'bold'} color={colors.greenAccent[400]} sx={{ mt: 2, ml: 4, mb: 4 }}>
              Projeto x Status
            </Typography>
          </Box>  
        <Box display={'flex'} sx={{ height: '50vh', width: '90vw' }} >
          <MyResponsivePie data={transformRoleCounts(projectCounts)} />
          <MyResponsiveBarChart data={transformRoleCounts(projectCounts)} />
        </Box>
      </Box>
      <Box
        sx={{
          padding: { xs: 2, sm: 4, md: 6 },
          margin: '0 auto',
          mb: '20px',
          ml: 10,
          minWidth: '90vw',
          textAlign: 'center',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: colors.primary[400]
        }}
      >
        <TableProjects buttonShow={false} />
      </Box>
      <Footer />
      <ToastContainer />
    </Box>
  )

}

export default Dashboard