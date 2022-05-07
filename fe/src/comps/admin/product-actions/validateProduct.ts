import * as Yup from 'yup';

import { stringRequiredSchema, priceFiled } from '_validate';

const ProductSchema = Yup.object().shape({
    title: stringRequiredSchema('Title'),
    imgs: stringRequiredSchema('Images'),
    price: priceFiled('SOL'),
    description: stringRequiredSchema('Description'),
});

export default ProductSchema;
