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
            const { results } = await env.HVEC_MARKETING_DB.prepare("select * from blogs order by created_at desc")
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
                `select * from blogs where slug = ?`
            ).bind(slug.trim())
            .all()
            return jsonSuccess(results)
        } catch (err) {
            console.error("Error while fetching blog content for id: ", params)
            return jsonError({ message: INTERNAL_SERVER_ERROR.error, code: INTERNAL_SERVER_ERROR.code }, { status: 500 });
        }
    },

    // async update({ content, params }: IRequest, env: Env) {
    //     try {
    //         const { slug } = params;
    //         if (!slug) {
    //             return jsonError({ message: NOT_FOUND_ERROR.error, code: NOT_FOUND_ERROR.code })
    //         }
    //         const description = content.description?.trim();
    //         const keywords = content.keywords?.trim();
    //         const featured_image = content.featuredImage?.trim();
    //         if (!description || !keywords || !featured_image) {
    //             return jsonError({
    //                 code: INVALID_BLOG_CONTENT_ERROR.code,
    //                 message: INVALID_BLOG_CONTENT_ERROR.error
    //             }, { status: 422 }) 
    //         }
    //         const { results } = await env.HVEC_MARKETING_DB.prepare(
    //             `update blogs set description = ?, keywords = ?, featured_image_url = ? where slug = ?`
    //         ).bind(description, keywords, featured_image, slug).run()
    //         return jsonSuccess({})
    //     } catch (err) {
    //         console.error("Error while updating blog", err)
    //         return jsonError({ message: INTERNAL_SERVER_ERROR.error, code: INTERNAL_SERVER_ERROR.code }, { status: 500 });
    //     }
    // },

    async create({ content }: IRequest, env: Env) {
        try {
            const title = content.title?.trim()
            const blogContent = content.content?.trim()
            const subTitle = content.subTitle?.trim()
            const featuredImage = content.featuredImage?.trim()
            const description = content.description?.trim();
            const keywords = content.keywords?.trim();
            const slugText = content.slug?.trim();
            const author = content.author?.trim() || "Admin";
            const metadata = { author }
            if (!title || !blogContent || !description || !keywords) {
                return jsonError({
                    code: INVALID_BLOG_CONTENT_ERROR.code,
                    message: INVALID_BLOG_CONTENT_ERROR.error
                }, { status: 422 })
            }
            const slug = slugify(slugText || title, {
                remove: /[*+~.()'"!:@]/g,
                replacement: "-",
                trim: true,
                strict: true,
                lower: true
            })
            const valuesToinsert = [title, blogContent, slug, description, keywords, metadata]
            let columnNames = "title, content, slug, description, keywords, metadata"
            if (featuredImage) {
                columnNames += ", featuredImage"
                valuesToinsert.push(featuredImage)
            }
            if (subTitle) {
                columnNames += ", sub_title"
                valuesToinsert.push(subTitle)
            }
            console.log("Slug:", slug)
            const { results } = await env.HVEC_MARKETING_DB.prepare(
                `INSERT INTO blogs (${columnNames}) VALUES (${valuesToinsert.map(() => "?").join(",")}) RETURNING *`
            )
            .bind(valuesToinsert)
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