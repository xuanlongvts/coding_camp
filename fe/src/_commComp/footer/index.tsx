import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
    return <footer id="footerSlim">&copy; xuanlongvts@gmail.com</footer>;
};

export default Footer;

export const FooterHome = () => {
    return (
        <footer id="footerFull">
            <div className="author">&copy; xuanlongvts</div>
            <div className="logos">
                <Link href="https://solana.com/">
                    <a target="_blank" rel="noopener">
                        <Image src="/imgs/sol.svg" alt="Solana" width={27} height={21} />
                    </a>
                </Link>
                <Link href="https://sentre.io/">
                    <a target="_blank" rel="noopener">
                        <Image src="/imgs/logo_sentre.svg" alt="Sentre" width={73} height={22} />
                    </a>
                </Link>
                <Link href="https://coin98.net/">
                    <a target="_blank" rel="noopener">
                        <Image src="/imgs/logo_coin_98.svg" alt="Coin 98" width={73} height={21} />
                    </a>
                </Link>
                <Link href="https://rove.to">
                    <a target="_blank" rel="noopener">
                        <Image src="/imgs/logo_rove.svg" alt="Rove" width={50} height={25} />
                    </a>
                </Link>
            </div>
        </footer>
    );
};
