const {
  chatErrors
} = require("../error_handling/errors");
// const UserService = require("./pinService");
const { Configuration, OpenAIApi } = require("openai");

const config = new Configuration({
	apiKey: "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",
});

const openai = new OpenAIApi(config);

/**
 * Post Service class for handling Post model and services
 */
class ChatService {
  constructor({ChatRepository,MessageRepository}) {
    this.chatRepository = ChatRepository;
    this.messageRepository = MessageRepository;
  }
  async startConversation(message,userId) {
  


    try {

      const messages = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: message }

      ];
    

      const response = await openai.createChatCompletion({
        model: "text-davinci-003",
        messages: messages
      });

	
      const answer = response.choices[0].message.content;

      //add to messge and to chat
      const firstMessage = await this.messageRepository.addMessage(messages[0].content, "system");
      const addedQuestion = await this.messageRepository.addMessage(message, "user");
      const addedAnswer = await this.messageRepository.addMessage(answer, "assisstant");
      if (firstMessage.success && addedQuestion.success && addedAnswer.success) {
        //create chat with first message
        const chatObject = await this.chatRepository.addChat(firstMessage.doc._id, userId);
        //append other messages to the chat 
        const appendQuestion = await this.chatRepository.appendToChat(addedQuestion.doc._id, chatObject.doc._id);
        const appendAnswer = await this.chatRepository.appendToChat(addedAnswer.doc._id, chatObject.doc._id);
      
        return { success: true, data:{chat_id:chatObject.doc._id, answer:answer} };
      }

    
        

    
      return { success: false, error: chatErrors.MONGO_ERR };
    

    } catch (err) {
      return { success: false, error: chatErrors.IN_OPENAI };
    }


    
}

  async continueConversation(message,userId,chatId) {
  


    try {


//no such conversation
      // const chat = await this.chatRepository.findById(chatId);

      const chat = await this.chatRepository.findChatWithTopMsgs(chatId);

      if (!chat.success) {
        return { success: false, error: chatErrors.CONVERSATION_NOT_FOUND };
      }
//the user not the owner of the conversation
      if (!userId.equals(chat.doc.owner)) {
        return { success: false, error: chatErrors.NOT_OWNER };

      }







      const messages = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: message }

      ];
    

      const response = await openai.createChatCompletion({
        model: "text-davinci-003",
        messages: messages
      });

	
      const answer = response.choices[0].message.content;

      //add to messge and to chat
      const firstMessage = await this.messageRepository.addMessage(messages[0].content, "system");
      const addedQuestion = await this.messageRepository.addMessage(message, "user");
      const addedAnswer = await this.messageRepository.addMessage(answer, "assisstant");
      if (firstMessage.success && addedQuestion.success && addedAnswer.success) {
        //create chat with first message
        const chatObject = await this.chatRepository.addChat(firstMessage.doc._id, userId);
        //append other messages to the chat 
        const appendQuestion = await this.chatRepository.appendToChat(addedQuestion.doc._id, chatObject.doc._id);
        const appendAnswer = await this.chatRepository.appendToChat(addedAnswer.doc._id, chatObject.doc._id);
      
        return { success: true, data:{chat_id:chatObject.doc._id, answer:answer} };
      }

    
        

    
      return { success: false, error: chatErrors.MONGO_ERR };
    

    } catch (err) {
      return { success: false, error: chatErrors.IN_OPENAI };
    }


    
  }
  
}

module.exports = ChatService;
