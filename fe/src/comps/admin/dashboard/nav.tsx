import { useRouter } from 'next/router';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import TaskIcon from '@mui/icons-material/Task';
import SettingsIcon from '@mui/icons-material/Settings';
import TokenIcon from '@mui/icons-material/Token';

import Routers from '_routers';

const Nav = () => {
    const router = useRouter();

    const handleRedirect = (link: string) => () => {
        router.push(link);
    };

    const isSelectedProduct =
        router.pathname.includes(Routers.adminProductActions) || router.pathname.includes(Routers.adminDashboard) ? true : false;
    const isSelectedSetting = router.pathname.includes(Routers.setting) ? true : false;
    const isSelectedMintNft = router.pathname.includes(Routers.mintNft) ? true : false;

    return (
        <List component="nav">
            <ListItemButton selected={isSelectedProduct} onClick={handleRedirect(Routers.adminDashboard)}>
                <ListItemIcon>
                    <TaskIcon />
                </ListItemIcon>
                <ListItemText primary="Products" />
            </ListItemButton>
            <ListItemButton selected={isSelectedMintNft} onClick={handleRedirect(Routers.mintNft)}>
                <ListItemIcon>
                    <TokenIcon />
                </ListItemIcon>
                <ListItemText primary="Mint NFT" />
            </ListItemButton>
            <ListItemButton selected={isSelectedSetting} onClick={handleRedirect(Routers.setting)}>
                <ListItemIcon>
                    <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Setting" />
            </ListItemButton>
        </List>
    );
};

export default Nav;
