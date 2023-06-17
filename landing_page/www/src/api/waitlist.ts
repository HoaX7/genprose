import { requester } from "../helpers/requester"

export const joinWaitlist = (email: string) => {
    return requester({
        url: "waitlist",
        method: "POST",
        data: { email }
    })
}