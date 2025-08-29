import envConfig from "@/config/envConfig";

const ChatApi = {
    fetchChats : `${envConfig.BASE_BACKEND_URL}/chats`
}

export default ChatApi;