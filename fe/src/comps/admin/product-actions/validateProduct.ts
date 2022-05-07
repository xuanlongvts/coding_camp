import * as Yup from 'yup';

import { stringRequiredSchema } from '_validate';

const ProductSchema = Yup.object().shape({
    title: stringRequiredSchema('Title'),
    imgs: stringRequiredSchema('Images'),
    price: stringRequiredSchema('Price'),
    description: stringRequiredSchema('Description'),
});

export default ProductSchema;
