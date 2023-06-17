import { ALREADY_EXISTS_ERROR, INTERNAL_SERVER_ERROR, INVALID_BLOG_CONTENT_ERROR, NOT_FOUND_ERROR } from "../helper/errors";
import { jsonError, jsonSuccess } from "../helper/response";
import { Env } from "..";
import { IRequest } from "itty-router";
import slugify from "slugify";

export const Blogs = {
    /**
     * Returns the slug of all blogs
     */
    async getAll(req: IRequest, env: Env) {
        try {
            console.log("Fetching blog slugs")
            const { results } = await env.HVEC_MARKETING_DB.prepare("select id, title, content, metadata, sub_title, slug, updated_at, created_at from blogs")
                .all()

            return jsonSuccess(results)
        } catch (err) {
            console.error("Error while fetching all blogs: ", err)
            return jsonError({ message: INTERNAL_SERVER_ERROR.error, code: INTERNAL_SERVER_ERROR.code }, { status: 500 });
        }
    },

    async getSlugUrls(req: IRequest, env: Env) {
        try {
            console.log("fetching slug urls")
            const { results } = await env.HVEC_MARKETING_DB.prepare("select slug from blogs")
                .all()

            return jsonSuccess(results)
        } catch (err) {
            console.log("Error while fetching slug urls:", err)
            return jsonError({ message: INTERNAL_SERVER_ERROR.error, code: INTERNAL_SERVER_ERROR.code }, { status: 500 });
        }
    },

    async getBySlug({ params }: IRequest, env: Env) {
        try {
            const { slug } = params;
            if (!slug) {
                return jsonError({ message: NOT_FOUND_ERROR.error, code: NOT_FOUND_ERROR.code })
            }
            console.log("Fetching blog content for slug:", slug)
            const { results } = await env.HVEC_MARKETING_DB.prepare(
                `select id, title, content, metadata, slug, sub_title, updated_at, created_at from blogs where slug = ?`
            ).bind(slug.trim())
            .all()

            return jsonSuccess(results)
        } catch (err) {
            console.error("Error while fetching blog content for id: ", params)
            return jsonError({ message: INTERNAL_SERVER_ERROR.error, code: INTERNAL_SERVER_ERROR.code }, { status: 500 });
        }
    },

    async create({ content }: IRequest, env: Env) {
        try {
            const title = content.title?.trim()
            const blogContent = content.content?.trim()
            const subTitle = content.subTitle.trim()
            if (!title || !blogContent || !subTitle) {
                return jsonError({
                    code: INVALID_BLOG_CONTENT_ERROR.code,
                    message: INVALID_BLOG_CONTENT_ERROR.error
                }, { status: 422 })
            }
            const slug = slugify(title, {
                remove: /[*+~.()'"!:@]/g,
                replacement: "-",
                trim: true,
                strict: true,
                lower: true
            })
            console.log("Blog Content:", content)
            console.log("Slug:", slug)
            const { results } = await env.HVEC_MARKETING_DB.prepare(
                "INSERT INTO blogs (title, content, slug, sub_title) VALUES (?, ?, ?, ?) RETURNING *"
            )
            .bind(title, blogContent, slug, subTitle)
            .all()
            return jsonSuccess(results, { status: 201 })
        } catch (err) {
            const error = err as Error & { cause: { message: string } };
			console.error("Error while inserting blog content", { msg: error.cause?.message || error.message });
			if (error.message === "D1_ERROR" && error.cause?.message?.toLowerCase().includes("unique constraint failed")) {
				return jsonError({ message: "Blog already exists", code: ALREADY_EXISTS_ERROR.code }, { status: 422 });
			}
            return jsonError({ message: INTERNAL_SERVER_ERROR, code: INTERNAL_SERVER_ERROR }, { status: 500 })
        }
    }
}