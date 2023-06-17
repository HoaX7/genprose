
interface Props {
    headers?: Record<string, unknown>,
    url: string;
    method: "GET" | "POST" | "PATCH" | "DELETE",
    data: any;
}
export const requester = async ({
    url,
    method,
    data = {},
    headers
}: Props) => {
    try {
        // const base = "https://api.genprose.com"
        const base = "http://192.168.0.105:6002"
        const options: RequestInit = {
            method,
            headers: {
                "accept": "application/json",
                "content-type": "application/json",
                ...headers
            },
            referrerPolicy: "no-referrer"
        }
        if (method !== "GET") {
            options.body = JSON.stringify(data)
        }
        return fetch(`${base}/${url}`, options).then((res) => res.json())
            .catch(err => {
                throw err
            })
    } catch (err) {
        console.error("helpers.requester: Failed", err)
        throw err
    }
}