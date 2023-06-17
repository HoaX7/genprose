import { IRequest } from "itty-router";
import { AUTH } from "../helper/authSecret";
import { jsonError } from "../helper/response";
import { Buffer } from "buffer"

export const withAuth = (request: IRequest) => {
    try {
        const authHeader = request.headers.get("Authorization");
        console.log(authHeader)
        if (!authHeader) {
            return jsonError({
                message: "Unauthorized",
                code: 401
            }, { status: 401 })
        }
        const auth = Buffer.from(authHeader.replace("Basic ", ""), "base64")
        const [key, secret] = auth.toString("ascii").split(":")
        if (key !== AUTH.key && secret !== AUTH.secret) {
            return jsonError({
                message: "Unauthorized",
                code: 401
            }, { status: 401 })
        }
    } catch (err) {
        console.error("Authentication failed: ", err)
        return jsonError({
            message: "Authentication failed, try again later"
        })
    }
}