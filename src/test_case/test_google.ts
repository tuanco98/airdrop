import { checkYoutubeChannel, connectGoogle } from "../social/youtube"


export const test_google = async () => {
    try {
       await connectGoogle()
       await checkYoutubeChannel("UC0ZjqfeMqfVBa8C7fQVCk2A")
    } catch (e) {
        throw e
    }
}