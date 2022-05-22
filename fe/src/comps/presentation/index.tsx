import { useEffect, useState } from 'react';
import ReactGoogleSlides from 'react-google-slides';

import { LocalStorageServices, LocalStorageKey } from '_utils/localStorage';

const PresentationComp = () => {
    const [valControls, setValControls] = useState<number>(0);
    useEffect(() => {
        const hardRate = LocalStorageServices.getItemJson(LocalStorageKey().presentControls) || 0;
        setValControls(hardRate);
    }, []);

    return (
        <div className="presentationPage">
            <ReactGoogleSlides
                showControls={valControls === 1 ? true : false}
                slidesLink="https://docs.google.com/presentation/d/1BFfcB5pqDUAn7e8ZIdnHlGGD01DuO9KPexdD_y0YGsg/edit#slide=id.g12dc58ed60b_0_8"
            />
        </div>
    );
};

export default PresentationComp;
