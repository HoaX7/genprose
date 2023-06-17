
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
        return fetch(url, {
            method,
            body: JSON.stringify(data),
            headers: {
                "accept": "application/json",
                "content-type": "application/json",
                ...headers
            },
            referrerPolicy: "no-referrer"
        }).then((res) => res.json())
            .catch(err => {
                throw err
            })
    } catch (err) {
        console.error("helpers.requester: Failed", err)
        throw err
    }
}