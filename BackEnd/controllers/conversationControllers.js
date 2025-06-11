
const Conversation =  require('../models/conversationSchema');
const Message = require('../models/message')

module.exports.sendMessage = async (req,res)=>{
   try {
     const senderId = req.id;
    const recieverId = req.params.id;

    const message = req.body.text;

    let conversation = await Conversation.findOne({participants:{$all:[senderId, recieverId]}});

    if(!conversation){
        const createCoversation = await Conversation.create({
            participants:[senderId,recieverId]
        })
    }
    const createMessage = await Message.create({
        senderId,
        recieverId,
        text:message
    })

    await conversation.message.push(createMessage._id);
    await conversation.save();

    return res.status(200).json({
                message: "Message Has been sended",
                success: true
        });  
   } catch (error) {
    console.log(error)
   }

}

module.exports.getAllMessage = async(req,res)=>{
try {
    const senderId = req.id;
    const recieverId = req.params.id;

    let conversations = await Conversation.findOne({participants:{$all:[senderId, recieverId]}});

    const allConversation = await conversations.populate({path:'message'});
    return res.status(200).json({
                message: "Message Has been sended",
                allConversation,
                success: true
    }); 
} catch (error) {
    console.log(error);
}
}