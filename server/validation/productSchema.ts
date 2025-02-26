import * as yup from "yup";
import { getRouterParams, readBody } from "h3";
import type { H3Event } from "h3";

export const validateCreateProduct = async (event: H3Event) => {
    const body = await readBody(event);
    const schema = yup.object({
        name: yup.string().trim().min(2, "Product name must be at least 2 characters").required("Product name is required"),
        picture: yup.string().matches(/\.(png|jpg|jpeg)$/i, "Picture must be a PNG or JPG file").nullable(),
        category_id: yup.number().integer().positive("Category ID must be a positive integer").required("Category ID is required"),
    });
    return schema.validate(body, { abortEarly: false });
};

export const validateUpdateProduct = async (event: H3Event) => {
    const body = await readBody(event);
    const schema = yup.object({
        name: yup.string().trim().min(2, "Product name must be at least 2 characters").optional(),
        picture: yup.string().matches(/\.(png|jpg|jpeg)$/i, "Picture must be a PNG or JPG file").nullable().optional(),
        category_id: yup.number().integer().positive("Category ID must be a positive integer").optional(),
    });
    return schema.validate(body, { abortEarly: false });
};

export const validateGetProduct = async (event: H3Event) => {
    const params = getRouterParams(event);
    const schema = yup.object({
        id: yup.number().positive().integer().nullable(),
    });
    return schema.validate(params, { abortEarly: false });
};

export const validateDeleteProduct = async (event: H3Event) => {
    const params = getRouterParams(event);
    const schema = yup.object({
        id: yup.number().positive().integer().nullable(),
    });
    return schema.validate(params, { abortEarly: false });
};