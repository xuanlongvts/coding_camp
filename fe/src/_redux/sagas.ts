import { all, fork } from 'redux-saga/effects';

import productsSaga from 'comps/admin/dashboard/slice/saga';

export default function* rootSaga() {
    // yield all([fork(productsSaga)]);
}
