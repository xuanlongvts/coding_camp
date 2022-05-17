import { put, takeLatest, call, select } from 'redux-saga/effects';
import { appLoadingActions } from '_commComp/loadingApp/slice';

import { Obj } from '_types/index';
import { T_PRODUCT } from 'comps/01-home/products/type';
import { LocalStorageServices, LocalStorageKey } from '_utils/localStorage';
import { transactionExplorer } from '_config';
import { appToastActions } from '_commComp/toast/slice';
import { FIELDS } from '_commComp/toast/types';

import { productsActions } from '.';
import { selectProductInit, selectProductAddOrUpdate, selectProductDelete } from './selector';
import * as ApiCall from './apiCall';

function* productInitSaga() {
    yield put(appLoadingActions.loadingOpen());

    const payload: T_PRODUCT[] = yield select(selectProductInit);
    const result: Obj = yield call(ApiCall.productsInitCallApi, payload);

    if (result && result.errMess) {
        yield put(appLoadingActions.loadingClose());
        yield put(productsActions.productsCallFailed(result.errMess));
    } else {
        const arrProducts: T_PRODUCT[] = result?.listProducts;
        yield put(productsActions.productsCallSuccess(arrProducts));

        const getTx = LocalStorageServices.getItem(LocalStorageKey().tx_lists.initProduct);
        yield put(productsActions.productsInitCallSuccess(getTx));

        const hrefLink = transactionExplorer(getTx);
        yield put(
            appToastActions.toastOpen({
                [FIELDS.typeAlert]: 'success',
                [FIELDS.mess]: 'Initial product success!',
                [FIELDS.linkRef]: {
                    mess: 'Transaction Link',
                    link: hrefLink,
                    target: '_blank',
                },
            }),
        );
    }

    yield put(appLoadingActions.loadingClose());
}

function* productCallSaga() {
    yield put(appLoadingActions.loadingOpen());

    const result: Obj = yield call(ApiCall.productsCallApi);

    if (result && result.errMess) {
        yield put(appLoadingActions.loadingClose());
        yield put(productsActions.productsCallFailed(result.errMess));
    } else {
        const arrProducts: T_PRODUCT[] = result?.listProducts;
        yield put(productsActions.productsCallSuccess(arrProducts));
    }

    yield put(appLoadingActions.loadingClose());
}

function* productAddOneCallSaga() {
    yield put(appLoadingActions.loadingOpen());

    const payload: T_PRODUCT = yield select(selectProductAddOrUpdate);
    const result: Obj = yield call(ApiCall.productAddOneProductCallApi, payload);

    if (result && result.errMess) {
        yield put(appLoadingActions.loadingClose());
        yield put(productsActions.productsCallFailed(result.errMess));
    } else {
        const arrProducts: T_PRODUCT[] = result?.listProducts;
        yield put(productsActions.productsCallSuccess(arrProducts));

        const getTx = LocalStorageServices.getItem(LocalStorageKey().tx_lists.addOneProduct);
        yield put(productsActions.productsAddOneProductCallSuccess(getTx));

        const hrefLink = transactionExplorer(getTx);
        yield put(
            appToastActions.toastOpen({
                [FIELDS.typeAlert]: 'success',
                [FIELDS.mess]: 'Add one product success!',
                [FIELDS.linkRef]: {
                    mess: 'Transaction Link',
                    link: hrefLink,
                    target: '_blank',
                },
            }),
        );
    }

    yield put(appLoadingActions.loadingClose());
}

function* productUpdateOneCallSaga() {
    yield put(appLoadingActions.loadingOpen());

    const payload: T_PRODUCT = yield select(selectProductAddOrUpdate);
    const result: Obj = yield call(ApiCall.productUpdateOneProductCallApi, payload);

    if (result && result.errMess) {
        yield put(productsActions.productsCallFailed(result.errMess));
    } else {
        const arrProducts: T_PRODUCT[] = result?.listProducts;
        yield put(productsActions.productsCallSuccess(arrProducts));

        const getTx = LocalStorageServices.getItem(LocalStorageKey().tx_lists.updateOneProduct);
        yield put(productsActions.productsUpdateOneProductCallSuccess(getTx));

        const hrefLink = transactionExplorer(getTx);
        yield put(
            appToastActions.toastOpen({
                [FIELDS.typeAlert]: 'success',
                [FIELDS.mess]: 'Update one product success!',
                [FIELDS.linkRef]: {
                    mess: 'Transaction Link',
                    link: hrefLink,
                    target: '_blank',
                },
            }),
        );
    }

    yield put(appLoadingActions.loadingClose());
}

function* productDeleteOneCallSaga() {
    yield put(appLoadingActions.loadingOpen());

    const payload: string = yield select(selectProductDelete);
    const result: Obj = yield call(ApiCall.productDeleteOneProductCallApi, payload);

    if (result && result.errMess) {
        yield put(appLoadingActions.loadingClose());
        yield put(productsActions.productsCallFailed(result.errMess));
    } else {
        const arrProducts: T_PRODUCT[] = result?.listProducts;
        yield put(productsActions.productsCallSuccess(arrProducts));

        const getTx = LocalStorageServices.getItem(LocalStorageKey().tx_lists.deleteOneProduct);
        yield put(productsActions.productsDeleteOneProductCallSuccess(getTx));

        const hrefLink = transactionExplorer(getTx);
        yield put(
            appToastActions.toastOpen({
                [FIELDS.typeAlert]: 'success',
                [FIELDS.mess]: 'Delete product success!',
                [FIELDS.linkRef]: {
                    mess: 'Transaction Link',
                    link: hrefLink,
                    target: '_blank',
                },
            }),
        );
    }

    yield put(appLoadingActions.loadingClose());
}

export default function* root() {
    yield takeLatest(productsActions.productsInitCall.type, productInitSaga);
    yield takeLatest(productsActions.productsCall.type, productCallSaga);

    yield takeLatest(productsActions.productAddOneCall.type, productAddOneCallSaga);
    yield takeLatest(productsActions.productUpdateOneCall.type, productUpdateOneCallSaga);
    yield takeLatest(productsActions.productDeleteOneCall.type, productDeleteOneCallSaga);
}
