const Repository = require("./repository");
const { mongoErrors, decorateError } = require("../error_handling/errors");
const APIFeatures = require("./apiFeatures");
const ObjectId = require("mongodb").ObjectId;

class ChatRepository extends Repository {
  constructor({ Chat }) {
    super(Chat);
  }

 async addChat(messageId,userId) {
     try {
        
         const chatObj = {
             user : userId,
             messages: [messageId]
         };
         const doc = await this.model.create(chatObj);

      
      if (!doc) return { success: false, error: mongoErrors.UNKOWN };

      return { success: true, doc: doc };
      
    } catch (err) {
        return { success: false, ...decorateError(err) };
    }
  }

   async appendToChat(messageId,chatId) {
     try {
        
       await this.model.findByIdAndUpdate(chatId, {
         $push: { messages: messageId }
       });
       
      //    const chatObj = {
      //        user : userId,
      //        messages: [messageId]
      //    };
      //    const doc = await this.model.create(chatObj);

      
      // if (!doc) return { success: false, error: mongoErrors.UNKOWN };

      // return { success: true, doc: doc };
      
    } catch (err) {
        return { success: false, ...decorateError(err) };
    }
  }

   async findChatWithTopMsgs(chatId) {
     try {

       const doc = await Model.aggregate([
         {
           $match: {
             _id: chatId
           }
         },
         {
           $unwind: "$messages"
         },
         {
           $limit: 10
         },
         {
           $lookup: {
             from: 'Message',
             localField: 'messages',
             foreignField: '_id',
             as: 'messages'
           }
         }
       ]);
       console.log(doc);  
       if (doc) {
         return { success: true, doc: doc };
       }
       return { success: false, error: mongoErrors.UNKOWN };
    }   
   catch (err) {
        return { success: false, ...decorateError(err) };
    }
  }


}

module.exports = ChatRepository;
