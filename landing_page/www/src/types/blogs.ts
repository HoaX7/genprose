export type BlogProps = {
    id: number;
    created_at: number;
    updated_at: number;
    slug: string;
    title: string;
    content: string;
    sub_title: string;
    description: string;
    keywords: string;
    featured_image_url: string;
    metadata?: {
        author?: string;
    }
}