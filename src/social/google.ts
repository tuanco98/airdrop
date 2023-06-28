import { google, Auth } from "googleapis";
const fs = require('fs');

const keyPath = "google-token.json"
const keys = JSON.parse(fs.readFileSync(keyPath));
const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const sheetId = "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
export let googleClient: Auth.OAuth2Client
export let authorizeUrl: string

export const initGoogle = async () => {
    try {
        googleClient = new google.auth.OAuth2(
            keys.web.client_id,
            keys.web.client_secret,
            keys.web.redirect_uris[0]
        );
        authorizeUrl = googleClient.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
        })
        console.log(authorizeUrl)
        googleClient.getToken
        // console.log(authorizeUrl)
        // googleClient.getToken(`961352204226-fu82tladqfma3294qq0elte4s9rlhs2l.apps.googleusercontent.com`,(err,tokens)=>{
        //     console.log({err,tokens})
        // })
        const sheets = google.sheets('v4');
        sheets.spreadsheets.values.get(
            {
                auth: googleClient,
                spreadsheetId: sheetId,
                range: 'Class Data!A2:E',
            },
            (err, res) => {
                if (err || !res) {
                    console.error('The API returned an error.');
                    throw err;
                }
                const rows = res.data.values;
                if (!rows) throw new Error(`Don not have values`)
                if (rows.length === 0) {
                    console.log('No data found.');
                } else {
                    console.log('Name, Major:');
                    for (const row of rows) {
                        // Print columns A and E, which correspond to indices 0 and 4.
                        console.log(`${row[0]}, ${row[4]}`);
                    }
                }
            }
        )
    } catch (e) {
        throw e
    }
}

export const checkSubscribeYoutubeChannel = async (channelId: string) => {
    try {
        // const target_channel_id = config_PROJECT_AIRDROP_YOUTUBE_CHANNEL_ID
        // const google_api_key = config_GOOGLE_API_KEY
        // const url = `https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet%2CcontentDetails&channelId=${channelId}&forChannelId=${target_channel_id}&key=${google_api_key}`
        // const response = await axios.get(url, {
        //     headers: {
        //         'Accept': 'application/json'
        //     }
        // })
        // const { data } = response
        // console.log(data)
        // return data.items.length > 0
        return true
    } catch (e) {
        console.log(e)
    }
}