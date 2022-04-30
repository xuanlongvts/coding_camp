import Header from '_commComp/header';
import Product from '_commComp/products';

const HomeComp = () => {
    return (
        <>
            <Header noBack />
            <section className="sec-home">
                <Product />
            </section>
        </>
    );
};

export default HomeComp;
