import * as Yup from 'yup';

import { stringRequiredSchema, passwordField } from '_validate';

const LoginSchema = Yup.object().shape({
    username: stringRequiredSchema('Username'),
    password: passwordField,
});

export default LoginSchema;
