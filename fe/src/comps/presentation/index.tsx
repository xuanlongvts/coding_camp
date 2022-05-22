import { useEffect, useState } from 'react';
import ReactGoogleSlides from 'react-google-slides';

import { LocalStorageServices, LocalStorageKey } from '_utils/localStorage';

const PresentationComp = () => {
    const [valControls, setValControls] = useState<number>(1);

    useEffect(() => {
        const getValControls = LocalStorageServices.getItemJson(LocalStorageKey().presentControls);
        getValControls === 0 && setValControls(getValControls);
    }, []);

    return (
        <div className="presentationPage">
            <ReactGoogleSlides
                showControls={valControls === 1}
                slidesLink="https://docs.google.com/presentation/d/1BFfcB5pqDUAn7e8ZIdnHlGGD01DuO9KPexdD_y0YGsg/edit#slide=id.g12dc58ed60b_0_8"
            />
        </div>
    );
};

export default PresentationComp;
