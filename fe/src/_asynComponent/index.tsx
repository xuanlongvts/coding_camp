import { Suspense, lazy, useEffect, ComponentType, ComponentProps, ReactNode } from 'react';
import { useRouter } from 'next/router';

import { getCookie } from '_utils/cookieStorage';
import { adminHardcode, EnumAccountInfor } from 'comps/admin/const';

import SkeletonDefault from './skeleton';

type UnPromisify<T> = T extends Promise<infer P> ? P : never;
type Opts = {
    fallback: ReactNode;
};
const AsyncCompWrap = <T extends Promise<any>, U extends ComponentType<any>>(
    importFunc: () => T,
    selectorFunc?: (s: UnPromisify<T>) => U,
    opts: Opts = { fallback: null },
) => {
    let lazyFactory: () => Promise<{ default: U }> = importFunc;

    if (selectorFunc) {
        lazyFactory = () => importFunc().then(module => ({ default: selectorFunc(module) }));
    }
    const LazyComponent = lazy(lazyFactory);

    const AsyncComponent = (props: ComponentProps<U>): JSX.Element => {
        const router = useRouter();

        useEffect(() => {
            const getUser = getCookie(EnumAccountInfor.user);
            const getPass = getCookie(EnumAccountInfor.pass);
            if (getUser !== adminHardcode.user || getPass !== adminHardcode.pass) {
                router.push('/admin');
            }
        }, []);

        return (
            <Suspense fallback={opts.fallback! || <SkeletonDefault />}>
                <LazyComponent {...props} />
            </Suspense>
        );
    };

    return AsyncComponent;
};

export default AsyncCompWrap;
