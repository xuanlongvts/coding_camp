import Image from 'next/image';
import Link from 'next/link';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';
import useMediaQuery from '@mui/material/useMediaQuery';

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

const Header = ({ props }: { props?: Props }) => {
    const matches = useMediaQuery('(max-width:450px)');

    return (
        <HideOnScroll {...props}>
            <AppBar>
                <Toolbar>
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
