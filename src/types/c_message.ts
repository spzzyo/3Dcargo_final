

type MessageRole = 'user' | 'assistant';


export interface IMessage {
    _id?: string;      
    _rev?: string;
    role: string;
    content: string;
    timestamp: number;
    msg_function: string;
  }

export interface IChatThread {
    _id?: string;      
    _rev?: string;
    // my_id: string;
    name: string,
    messages: IMessage[];
    createdAt: number;
    updatedAt: number;
    type: string;

}


