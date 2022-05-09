import type { NextPage } from 'next';

import Header from '_commComp/header';
import { FooterHome } from '_commComp/footer';
import HomeComp from 'comps/01-home';

const Home: NextPage = () => {
    return (
        <>
            <Header />
            <main>
                <HomeComp />
            </main>
            <FooterHome />
        </>
    );
};

export default Home;
