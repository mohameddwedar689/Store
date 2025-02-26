import * as yup from "yup";
import { getRouterParams, readBody , H3Event } from "h3";


export const validateCreateCategory = async (event: H3Event) => {
    const body = await readBody(event);
    const schema = yup.object({
        name: yup.string().trim().min(2, "Name must be at least 2 characters").required("Category name is required"),
        picture: yup.string().matches(/\.(png|jpg|jpeg)$/i, "Picture must be a PNG or JPG file").nullable(),
        parent_id: yup.number().nullable(),
    });
    return schema.validate(body, { abortEarly: false });
};

export const validateUpdateCategory = async (event: H3Event) => {
    const body = await readBody(event);
    const schema = yup.object({
        name: yup.string().trim().min(2, "Name must be at least 2 characters").optional(),
        picture: yup.string().matches(/\.(png|jpg|jpeg)$/i, "Picture must be a PNG or JPG file").nullable().optional(),
        parent_id: yup.number().nullable().optional(),
    });
    return schema.validate(body, { abortEarly: false });
};

export const validateGetCategory = async (event: H3Event) => {
    const params = getRouterParams(event); 
    const schema = yup.object({
        id: yup.number().positive().integer().nullable(),
    });
    return schema.validate(params, { abortEarly: false });
};

export const validateDeleteCategory = async (event: H3Event) => {
    const params = getRouterParams(event);
    const schema = yup.object({
        id: yup.number().positive().integer().nullable(),
    });
    return schema.validate(params, { abortEarly: false });
};