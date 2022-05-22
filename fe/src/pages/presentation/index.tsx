import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import type { NextPage } from 'next';

let PresentationComponent: any = null;
const PresentationPage: NextPage = () => {
    const [isSlide, setIsSlide] = useState<boolean>(false);

    useEffect(() => {
        setIsSlide(true);

        PresentationComponent = dynamic(() => import('comps/presentation'));
    }, []);

    return <>{isSlide ? <PresentationComponent /> : null}</>;
};

export default PresentationPage;
