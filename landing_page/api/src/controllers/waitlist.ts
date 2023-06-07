import { jsonError, jsonSuccess } from "../helper/response";
import { IRequest } from "itty-router";
import { Env } from "..";
import { ALREADY_EXISTS_ERROR, INTERNAL_SERVER_ERROR, INVALID_EMAIL_ERROR } from "../helper/errors";
import { validateEmail } from "../helper/email";

export const Waitlist = {
	async create({ content }: IRequest, env: Env) {
		console.log(`Content: `, content);
		try {
			const email: string = content.email?.trim();
			if (!validateEmail(email)) {
				return jsonError(
					{
						success: false,
						data: { message: INVALID_EMAIL_ERROR.error, code: INVALID_EMAIL_ERROR.code },
					},
					{ status: 422 }
				);
			}

			const { results } = await env.<DB_NAME>.prepare(
				"INSERT INTO waitlist (email_address) VALUES (?) RETURNING *"
			)
				.bind(content.email.trim())
				.all();
			console.log(`Inserted result`, JSON.stringify(results));
			return jsonSuccess({});
		} catch (err) {
			const error = err as Error & { cause: { message: string } };
			console.error("Error while inserting waitlist email", { msg: error.cause?.message || error.message });
			if (error.message === "D1_ERROR" && error.cause?.message?.toLowerCase().includes("unique constraint failed")) {
				return jsonError({ message: ALREADY_EXISTS_ERROR.error, code: ALREADY_EXISTS_ERROR.code }, { status: 422 });
			}
			return jsonError({ message: INTERNAL_SERVER_ERROR.error, code: INTERNAL_SERVER_ERROR.code }, { status: 500 });
		}
	},
};
