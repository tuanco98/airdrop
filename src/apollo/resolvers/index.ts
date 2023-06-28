import { pr_airdrop_admin_addon_partner } from "./Mutations/pr_airdrop_admin_addon_partner";
import { pr_airdrop_admin_add_question } from "./Mutations/pr_airdrop_admin_add_question";
import { pr_airdrop_admin_enable_bot } from "./Mutations/pr_airdrop_admin_enable_bot";
import { pr_airdrop_admin_update_tickets_win_prize } from "./Mutations/pr_airdrop_admin_update_tickets_win_prize";
import { pr_airdrop_answer_user } from "./Mutations/pr_airdrop_answer_user";
import { pr_airdrop_claim_prize_ticket } from "./Mutations/pr_airdrop_claim_prize_ticket";
import { pr_airdrop_submit_quote_tweet_link } from "./Mutations/pr_airdrop_submit_quote_tweet_link";
import { pr_airdrop_unbox } from "./Mutations/pr_airdrop_unbox";
import { pr_airdrop_submit_ref_code } from "./Mutations/pr_aridrop_submit_ref_code";
import { pr_airdrop_admin_questions_get } from "./Queries/pr_airdrop_admin_questions_get";
import { pr_airdrop_admin_tickets_win_prize_get } from "./Queries/pr_airdrop_admin_tickets_win_prize_get";
import { pr_airdrop_question_get } from "./Queries/pr_airdrop_question_get";
import { pr_airdrop_user_information_get } from "./Queries/pr_airdrop_user_information_get";

const resolvers = {
    Mutation: {
        pr_airdrop_admin_add_question,
        pr_airdrop_answer_user,
        pr_airdrop_unbox,
        pr_airdrop_submit_quote_tweet_link,
        pr_airdrop_submit_ref_code,
        pr_airdrop_claim_prize_ticket,
        pr_airdrop_admin_update_tickets_win_prize,
        pr_airdrop_admin_enable_bot,
        pr_airdrop_admin_addon_partner,
    },
    Query: {
        pr_airdrop_question_get,
        pr_airdrop_user_information_get,
        pr_airdrop_admin_questions_get,
        pr_airdrop_admin_tickets_win_prize_get,
    }
};
export { resolvers };
