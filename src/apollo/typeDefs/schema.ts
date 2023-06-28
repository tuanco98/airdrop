import { gql } from "apollo-server";

export const typeDefs = gql`
    scalar JSON
    type Answer {
        id: String
        answer: String
    }
    type QuestionAdmin{
        question_id: String
        question: String
        question_slug: String
        answers: [Answer]
        correct_answer: String
        createdAt: Float
    }
    type Question {
        question_id: String
        question: String
        answers: [Answer]
    }
    type QuestionPage {
        total: Int
        questions: [QuestionAdmin]
    }
    type Ticket {
        _id: String
        address: String
        code: String
        is_win_prize: Boolean
        is_claimed_prize: Boolean
        createdAt: Float
        mint_prize_txid: String
        prize_rank: Int
    }
    type UserData {
        address: String
        ticket_count: Int
        tickets: [Ticket]
        friends_invited: Int
        ref_code: String
        unbox_results: [Int]
        para_art_copy: Int
        createdAt: Float
        is_pass_squizz: Boolean
        is_unbox: Boolean
        is_reweet_link_correct: Boolean
        is_active: Boolean
        quote_tweet_link: String
        ref_by: String
    }
    type AdminUpdateWinPrize {
        total_success: Int,
        total_error: Int,
        errors: [String]
    }
    type AdminCheckWinPrizeGet {
        total: Int,
        tickets: [Ticket]
    }
    enum BotType {
        reward_paraart_copy
        reward_paragon
    }
    type EnableBotResponse {
        bot: String
        status: String
    }
    type AdminAddonPartner {
        message: String
        partner_name: String
        ref_code: String
    }
    type Mutation {
        # ADMIN
        pr_airdrop_admin_add_question(question: String! answers: [String]! correct_answer: Int!): JSON
        pr_airdrop_admin_update_tickets_win_prize(prize_rank: Int! code_tickets:[String]!): AdminUpdateWinPrize
        pr_airdrop_admin_enable_bot(bot_type: BotType!, enable: Boolean!): EnableBotResponse
        pr_airdrop_admin_addon_partner(partner_name: String! ref_code: String!): AdminAddonPartner

        # Client
        pr_airdrop_answer_user(signed_message: String! signature: String! address: String! question_id: String! answer_id: String!): Boolean
        pr_airdrop_unbox(signed_message: String! signature: String! address: String!): [Int]
        pr_airdrop_submit_quote_tweet_link(signed_message: String! signature: String! address: String! tweet_link: String!): Boolean
        pr_airdrop_submit_ref_code(signed_message: String! signature: String! address: String! ref_code: String!): Boolean
        pr_airdrop_claim_prize_ticket(signed_message: String! signature: String! address: String! code: String!): Boolean
    }
    type Query {
        pr_airdrop_question_get: Question
        pr_airdrop_user_information_get(signed_message: String! signature: String! address: String! pageSizeTicket: Int pageTicket: Int): UserData
        pr_airdrop_admin_questions_get(pageSize: Int!, page: Int!): QuestionPage
        pr_airdrop_admin_tickets_win_prize_get(pageSize: Int!, page: Int! rank: Int): AdminCheckWinPrizeGet
    }
`;
