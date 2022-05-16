import { put, takeLatest, call, select } from 'redux-saga/effects';
import { appLoadingActions } from '_commComp/loadingApp/slice';

import { mintActions } from '.';

function* mintNftCallSaga() {
    console.log('mintNftCallSaga');
}

function* mintNftCallSuccessSaga() {
    console.log('mintNftCallSuccessSaga');
}

function* mintNftCallFailedSaga() {
    console.log('mintNftCallSuccessSaga');
}

export default function* root() {
    yield takeLatest(mintActions.mintNftCall.type, mintNftCallSaga);
    yield takeLatest(mintActions.mintNftCallSuccess.type, mintNftCallSuccessSaga);
    yield takeLatest(mintActions.mintNftCallFailed.type, mintNftCallFailedSaga);
}
