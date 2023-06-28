import { getPostIdFromFacebookShareLink, getUserIdFromFacebookShareLink } from "../utils"
export const test_get_id_from_facebook_share_link = () => {
    const test_case = [
        "https://www.facebook.com/parallel/posts/4793957024002468",
        "https://m.facebook.com/story.php?story_fbid=598182094768313&id=100037295823275",
        "https://m.facebook.com/story.php?story_fbid=598182094768313&id=100037295823275&m_entstream_source=permalink",
        "https://www.facebook.com/permalink.php?story_fbid=598182094768313&id=100037295823275",
        "https://www.facebook.com/permalink.php?story_fbid=598182094768313&id=100037295823275",
    ]

    const result = test_case.map((el) => ({
        case: el,
        user_id: getUserIdFromFacebookShareLink(el),
        post_id: getPostIdFromFacebookShareLink(el)
    }))

    console.table(result)
}