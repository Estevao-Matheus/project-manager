
import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

interface ConfirmDeleteModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    projectName: string;
}

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ open, onClose, onConfirm, projectName }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box  sx={modalStyle}>
                <Typography variant="h6"  color='white' sx={{ fontWeight: 'bold' }}>
                    Confirmar Exclusão
                </Typography>
                <Typography variant="body1" color='white' >
                   Tem certeza que quer excluir o projeto: "{projectName}"? Essa ação não pode ser revertida.
                </Typography>
                <Box display="flex" justifyContent="space-between" mt={2}>
                    <Button variant="contained" color="primary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button variant="contained" color="error" onClick={onConfirm}>
                        Deletar
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ConfirmDeleteModal;
