import { requester } from "../helpers/requester"

export const joinWaitlist = (email: string) => {
    return requester({
        url: "https://api.genprose.com/waitlist",
        method: "POST",
        data: { email }
    })
}