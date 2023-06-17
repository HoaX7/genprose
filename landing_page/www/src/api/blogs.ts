import { requester } from "../helpers/requester"
import { BlogProps } from "../types/blogs"

export const getAllBlogs = (): Promise<{
    success: boolean;
    data: BlogProps[];
}> => {
    return requester({
        url: "blogs",
        method: "GET",
        data: ""
    })
}

export const getAllBlogSlugUrls = () => {
    return requester({
        url: "blogs/slugUrls/getAll",
        method: "GET",
        data: ""
    })
}