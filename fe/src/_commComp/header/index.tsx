import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';

import Routers from '_routers';
import { deleteCookie, ListCookieStorageName } from '_utils/cookieStorage';

interface Props {
    window?: () => Window;
    children: React.ReactElement;
}

function HideOnScroll(props: Props) {
    const { children, window } = props;
    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
    });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

type T_Menu = {
    isShow: boolean;
    toggleDrawer: () => void;
};
const Header = ({ props, menuHandle, isLogout = false }: { props?: Props; menuHandle?: T_Menu; isLogout?: boolean }) => {
    const matches = useMediaQuery('(max-width:500px)');
    const router = useRouter();

    const handleLogout = () => {
        deleteCookie(ListCookieStorageName().user);
        deleteCookie(ListCookieStorageName().pass);
        router.push(Routers.admin);
    };

    return (
        <HideOnScroll {...props}>
            <AppBar sx={{ zIndex: menuHandle?.isShow ? '1201' : '1100' }}>
                <Toolbar className="headerInner">
                    {menuHandle?.isShow && (
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={menuHandle?.toggleDrawer}
                            sx={{
                                marginRight: '36px',
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    <Link href="/">
                        <a className="logo">
                            <Image src="/imgs/SolanaPayLogo.svg" alt="Solana Pay" width={100} height={50} />
                        </a>
                    </Link>

                    <div className="boxRight">
                        {!matches ? (
                            <div className="walletConn">
                                <WalletMultiButton />
                            </div>
                        ) : null}
                        {isLogout ? <LogoutIcon className="logout" onClick={handleLogout} /> : null}
                    </div>
                </Toolbar>
            </AppBar>
        </HideOnScroll>
    );
};

export default Header;
