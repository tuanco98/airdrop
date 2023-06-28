import { twitter_dev } from "./social/twitter"
type SearchMetadata = {
    completed_in?: number
    max_id?: number,
    max_id_str?: string,
    next_results?: string,
    query?: string,
    refresh_url?: string,
    count?: number,
    since_id?: number,
    since_id_str?: string
}
import fs from "fs"
export const craw_tweet_by_hashtag = async (hashtag: string) => {
    const max_result = 100
    let count = 1
    let query = `?q=${hashtag}&include_entities=true&count=${max_result}`
    while (true) {
        console.log(query)
        const result = await twitter_dev.getTweetsByQuery(query) as { statuses: any[], search_metadata: SearchMetadata }
        if (result) {
            const { statuses, search_metadata } = result
            if (statuses.length > 0)
                if (statuses.length === 0) break;
            if (search_metadata.next_results) { query = search_metadata.next_results } else break;
            const writeStream = fs.createWriteStream(`./crawl_tweet/result_${count++}.json`)
            writeStream.write(JSON.stringify(statuses.map((el) => {
                const { created_at, id_str, text, user } = el
                const link = `https://twitter.com/${user.screen_name}/status/${id_str}`
                const user_name = user.name
                return el
            })))
            writeStream.close()
            break;
        } else break;
    }

}