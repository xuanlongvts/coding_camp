import { Suspense, lazy, useEffect, ComponentType, ComponentProps, ReactNode, useState, useTransition } from 'react';
import { useRouter } from 'next/router';
import NoSsr from '@mui/material/NoSsr';

import { getCookie, ListCookieStorageName } from '_utils/cookieStorage';
import { adminHardcode } from 'comps/admin/const';
import Routers from '_routers';
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
        const [isPending, startTransition] = useTransition();
        const [isRender, setIsRender] = useState<boolean>(false);

        useEffect(() => {
            startTransition(() => {
                setIsRender(true);
            });
            const getUser = getCookie(ListCookieStorageName().user);
            const getPass = getCookie(ListCookieStorageName().pass);
            if (getUser !== adminHardcode.user || getPass !== adminHardcode.pass) {
                router.push(Routers.admin);
            }
        }, []);

        if (!isRender) {
            return (
                <NoSsr>
                    <SkeletonDefault />
                </NoSsr>
            );
        }

        return (
            <NoSsr>
                <Suspense fallback={opts.fallback! || <SkeletonDefault />}>
                    <LazyComponent {...props} />
                </Suspense>
            </NoSsr>
        );
    };

    // await new Promise(res => setTimeout(res, 100));

    return AsyncComponent;
};

export default AsyncCompWrap;
