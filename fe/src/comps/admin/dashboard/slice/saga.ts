import { put, takeLatest, call, select } from 'redux-saga/effects';
import { appLoadingActions } from '_commComp/loadingApp/slice';

import { Obj } from '_types/index';
import { T_PRODUCT } from 'comps/01-home/products/type';

import { productsActions } from '.';
import { selectProductInit } from './selector';

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

export default function* root() {
    yield takeLatest(productsActions.productsInitCall.type, productInitSaga);
    yield takeLatest(productsActions.productsCall.type, productCallSaga);
}
