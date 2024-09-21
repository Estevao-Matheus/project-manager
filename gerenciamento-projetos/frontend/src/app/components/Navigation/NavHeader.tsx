import React from 'react';
import { Typography, Box, Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from '../../theme';
interface HeaderProps {
  name: string;
  role: string;
  withHeader?: boolean;
}

const NavHeader: React.FC<HeaderProps> = ({ name, role, withHeader = true }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} mb="30px" mr={1}>
      { withHeader && (  
        <Avatar alt={name} src="/static/images/avatar/2.jpg" sx={{mt: 4}}/>
      )}
      <Typography
        variant="h6"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ m: "0 0 5px 0" }}
      >
        {name}
      </Typography>
      <Typography variant="subtitle2" color={colors.greenAccent[400]}>
        {role}
      </Typography>
    </Box>
  );
};

export default NavHeader;