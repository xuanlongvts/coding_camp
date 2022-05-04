import Image from 'next/image';
import Link from 'next/link';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

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
const Header = ({ props, menuHandle }: { props?: Props; menuHandle?: T_Menu }) => {
    const matches = useMediaQuery('(max-width:450px)');

    return (
        <HideOnScroll {...props}>
            <AppBar sx={{ zIndex: menuHandle?.isShow ? '1201' : '1100' }}>
                <Toolbar>
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

                    {!matches ? <WalletMultiButton /> : null}
                </Toolbar>
            </AppBar>
        </HideOnScroll>
    );
};

export default Header;
