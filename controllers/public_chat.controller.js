const Chats = require("../model/public-chat")

class Public_Chat{
    constructor(io){
        this.io = io
        this.chat = [{
            msg_id: 34479270,
            text: 'hil',
            type: 'normal',
            time: '2024-10-06T08:56:58.656Z',
            gif: '',
            profile: {
              _id: '6700d2d07a168604e56058b7',
              born: '',
              firstname: '',
              lastname: '',
              next_level_point: '1',
              user_id: '711538887915000',
              hide_profile: false,
              hidden_from_public: false,
              refuse_friends_request: false,
              refuse_tips: false,
              username: '9LhRiug7R',
              profile_image: 'https://res.cloudinary.com/dxwhz3r81/image/upload/v1720389880/avatar88_enyz9d.png',
              vip_level: 0,
              kyc_is_activated: false,
              total_wagered: 0,
              invited_code: '',
              google_auth_is_activated: false,
              is_suspend: false,
              vip_progress: 0,
              fa_is_activated: false,
              earn_me: 0,
              commission_reward: 0,
              usd_reward: 100,
              total_chat_messages: 0,
              __v: 0
            }
          }]
    }
    fetchPreviousChat(){
        this.io.emit("default-chat", this.chat)
    }
    async saveMessages(data){
        await Chats.create(data)
    }
     sendMessages(data){
        this.chat = [...this.chat, data]
        this.io.emit("chats", this.chat)
        this.saveMessages(data)
    }
    connection(){
        this.io.on("connection", (stream)=>{
            stream.on("public-chat", (data)=>{
                this.sendMessages(data)
            })
            stream.on("fetch-defult", ()=>{
                this.fetchPreviousChat()
            })
        })
        this.previousChat()
    }
   async previousChat(){
        const allChats = await Chats.find().limit(20)
        this.chat = allChats
    }
}


module.exports = {Public_Chat}