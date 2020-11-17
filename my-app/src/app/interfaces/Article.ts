export interface Article {
    url: string
    title: string,
    description: string,
    content: string,
    source: {
        id: string,
        name: string
    }
    urlToImage: string,
    publishedAt: Date
}