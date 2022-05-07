import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TaskIcon from '@mui/icons-material/Task';

import Header from '_commComp/header';
import Footer from '_commComp/footer';

import ProductsManagment from './products';

import AddProduct from '../product-actions/add';
import UpdateProduct from '../product-actions/update';

const drawerWidth: number = 240;

const Drawer = styled(MuiDrawer, { shouldForwardProp: prop => prop !== 'open' })(({ theme, open }) => ({
    '& .MuiDrawer-paper': {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: 'border-box',
        ...(!open && {
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            width: theme.spacing(7),
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9),
            },
        }),
    },
}));

type T_ProductActions = {
    productUpdate?: boolean;
    productAdd?: boolean;
};
const Dashboard = ({ productUpdate, productAdd }: T_ProductActions) => {
    const [open, setOpen] = useState(true);
    const router = useRouter();

    useEffect(() => {
        console.log('productUpdate', productUpdate);
        console.log('productAdd', productAdd);
    }, []);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    let LayoutRender = <ProductsManagment />;
    productAdd && (LayoutRender = <AddProduct />);
    productUpdate && (LayoutRender = <UpdateProduct />);

    return (
        <Box sx={{ display: 'flex' }}>
            <Header menuHandle={{ isShow: !open, toggleDrawer: toggleDrawer }} isLogout />
            <Drawer variant="permanent" open={open}>
                <Toolbar
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        px: [1],
                        minHeight: '74px !important',
                        boxShadow: '1px 1px 10px rgba(0, 0, 0, .1)',
                    }}
                >
                    <IconButton onClick={toggleDrawer}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                    }}
                >
                    <List component="nav">
                        <ListItemButton>
                            <ListItemIcon>
                                <TaskIcon />
                            </ListItemIcon>
                            <ListItemText primary="Products" />
                        </ListItemButton>
                    </List>
                </Box>
            </Drawer>
            <Box
                sx={{
                    pt: 13,
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                    {LayoutRender}

                    <div className="footer-admin">
                        <Footer />
                    </div>
                </Container>
            </Box>
        </Box>
    );
};

export default Dashboard;
