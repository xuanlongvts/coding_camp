import type { NextPage } from 'next';

import Header from '_commComp/header';
import Footer from '_commComp/footer';
import HomeComp from 'comps/01-home';

const Home: NextPage = () => {
    return (
        <>
            <Header />
            <main>
                <HomeComp />
            </main>
            <Footer />
        </>
    );
};

export default Home;
