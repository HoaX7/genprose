import { IRequest } from "itty-router";
import { Env } from "..";
import { Waitlist as WaitlistController } from "../controllers/waitlist";
import { ThrowableRouter, withContent } from "itty-router-extras";

export function Waitlist(router: ThrowableRouter) {
	router.post("/waitlist", withContent, WaitlistController.create);
}
