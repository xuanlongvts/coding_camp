import { put, takeLatest, call, select } from 'redux-saga/effects';
import { appLoadingActions } from '_commComp/loadingApp/slice';
import { Obj } from '_types';
import { transactionExplorer } from '_config';
import { appToastActions } from '_commComp/toast/slice';
import { FIELDS } from '_commComp/toast/types';
import { selectCommState } from '_redux/selector';
import { T_COMMON } from '_redux/types';

import { selectMintPrepare } from './selector';
import { T_DATA_PREPARE } from './types';
import { mintActions } from '.';
import * as ApiCall from './apiCall';

function* mintNftCallSaga() {
    yield put(appLoadingActions.loadingOpen());

    const payload: T_DATA_PREPARE = yield select(selectMintPrepare);
    const commonState: T_COMMON = yield select(selectCommState);
    const dataSendApi: T_DATA_PREPARE = {
        ...payload,
        ...commonState,
    };
    const result: Obj = yield call(ApiCall.mintNftlApi, dataSendApi);

    if (result && result.errMess) {
        yield put(appLoadingActions.loadingClose());
        yield put(mintActions.mintNftCallFailed(result.errMess));
        yield put(
            appToastActions.toastOpen({
                [FIELDS.typeAlert]: 'error',
                [FIELDS.mess]: 'Mint Nft to customer account failed!',
            }),
        );
    } else {
        yield put(mintActions.mintNftCallSuccess(result.tx));

        const hrefLink = transactionExplorer(result.tx);
        yield put(
            appToastActions.toastOpen({
                [FIELDS.typeAlert]: 'success',
                [FIELDS.mess]: 'Mint Nft to customer account success!',
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
    yield takeLatest(mintActions.mintNftCall.type, mintNftCallSaga);
}
