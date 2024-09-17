import { Box, CircularProgress, Typography } from "@mui/material";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import ProgressCircle from "./ProgressCircle";


interface IStatBoxProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    progress: number;
    increase: string;
}

const StatusBox = ({ title, subtitle, icon, progress, increase }: IStatBoxProps) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Box width="100%" m="0 30px"  sx={{ minWidth: "300px", p:{ xs: 2, sm: 3, md: 4 }, backgroundColor: colors.primary[400]}}>
            <Box display="flex" justifyContent="space-between">
                <Box>
                    {icon}
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        sx={{ color: colors.grey[100] }}
                    >
                        {title}
                    </Typography>
                </Box>
                <Box>
                    <ProgressCircle progress={progress} />
                </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" mt="2px">
                <Typography variant="h6" sx={{ color: colors.greenAccent[500] }}>
                    {subtitle}
                </Typography>
                <Typography
                    variant="h7"
                    fontStyle="italic"
                    sx={{ color: colors.greenAccent[600] }}
                >
                    {increase}
                </Typography>
            </Box>
        </Box>
    )
};

export default StatusBox;