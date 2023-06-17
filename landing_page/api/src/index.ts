import { ThrowableRouter, error } from "itty-router-extras";
import { jsonError, jsonSuccess } from "./helper/response";
import { Waitlist } from "./router/waitlist";
import { NOT_FOUND_ERROR } from "./helper/errors";
import { createCors } from "itty-cors";
import { Blogs } from "./router/blogs";
/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	HVEC_MARKETING_DB: D1Database;
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
}

// export default {
// 	async fetch(
// 		request: Request,
// 		env: Env,
// 		ctx: ExecutionContext
// 	): Promise<Response> {
// 		return new Response("Hello World!");
// 	},
// };
const { preflight, corsify } = createCors({ methods: ["GET", "POST", "PUT"] });
const router = ThrowableRouter();
router.all("*", preflight);
// https://developers.cloudflare.com/workers/wrangler/configuration/#email-bindings
router.get("/", () => {
	return jsonSuccess({});
});

Waitlist(router);
Blogs(router)

router.all("*", () => jsonError({ code: NOT_FOUND_ERROR.code, message: NOT_FOUND_ERROR.error }, { status: 404 }));

// https://mailrelay.com/en/ 80.000 messages/month
export default {
	fetch: (request: Request, ...args: unknown[]) =>
		router
			.handle(request, ...args)
			.catch((err) => error(500, err.stack))
			.then(corsify), // cors should be applied to error responses as well
};
