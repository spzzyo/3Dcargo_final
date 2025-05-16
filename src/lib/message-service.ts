import { getCouchDb } from './couchdb';
import { IMessage, IChatThread } from '@/types/c_message'; 
import { get } from 'http';
import { v4 as uuidv4 } from 'uuid';


export async function createChatThread() {
  const db = await getCouchDb();
  const uniqueName = `Chat-${Date.now()}`
  const cthread: IChatThread = {
     messages:[], name:uniqueName, createdAt: Date.now(), updatedAt: Date.now(),type: "ChatThread"
  };
 
  const response = await db.insert(cthread);
  return { ...cthread, _id: response.id, _rev: response.rev };
}



// Function to save a message to a thread
export async function saveMessage(threadId: string, role: string, content: string, msg_function: string) {
    const db = await getCouchDb();
    const doc = (await db.get(threadId)) as IChatThread;
    const newMessage: IMessage = {
        role,
        content,
        timestamp: Date.now(), 
        msg_function,
    };

    doc.messages.push(newMessage);
    doc.updatedAt = Date.now();

    await db.insert(doc);
  }

  export async function getChatThread(threadId: string): Promise<IChatThread | null> {
    const db = await getCouchDb();
    try {
      const doc = (await db.get(threadId)) as IChatThread;
      return doc ;
    } catch (error) {
      console.error('Error fetching chatThread:', error);
      return null;
    }
  }


  export async function getAllThreads() {
    const db = await getCouchDb();
    const result = await db.view("chatThread_views", "by_type", { include_docs: true });
    // return result.rows.map(row => ({  
    //   id: row.id.toString(),
    //   name: row.doc?.name?.toString()
    //   }));

    return result.rows.map(row => {
      const doc = row.doc as IChatThread;
      return {
        id: row.id.toString(),
        name: doc.name
      };
    });
  }




  export async function getAllMessages(threadId: string): Promise<{ role: string; content: string }[] | null> {
   try { const db = await getCouchDb();
    const thread = (await db.get(threadId)) as IChatThread;

    if (!thread) return null;
    const messages = thread.messages.map(({ role, content }: { role: string; content: string }) => ({ role, content }));

    return messages;}
    catch (error) {
        console.error("Error fetching messages for thread:", error);
        return null;
    }

  }

