import { Blogs as BlogsController } from "../controllers/blogs";
import { ThrowableRouter, withContent } from "itty-router-extras";
import { withAuth } from "../auth";

export function Blogs(router: ThrowableRouter) {
	router.get("/blogs", BlogsController.getAll);
    router.get("/blogs/slugUrls/getAll", BlogsController.getSlugUrls)
    router.get("/blogs/:slug", BlogsController.getBySlug)
    router.post("/blogs", withAuth, withContent, BlogsController.create)
    // router.patch("/blogs/:slug", withAuth, withContent, BlogsController.update)
}
