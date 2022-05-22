import Grow from '@mui/material/Grow';
import Link from 'next/link';

import Routers from '_routers';

const Welcome = () => {
    const isOpen = true;

    return (
        <div className="Welcome">
            <Grow in={isOpen} style={{ transformOrigin: '0 0 0' }}>
                <div>Hi, </div>
            </Grow>
            <Grow in={isOpen} style={{ transformOrigin: '0 0 0' }} {...(isOpen ? { timeout: 3000 } : {})}>
                <div className="solana">
                    <Link href={Routers.presentation}>
                        <a target="_blank" rel="noopener">
                            Solana
                        </a>
                    </Link>
                </div>
            </Grow>
        </div>
    );
};

export default Welcome;
