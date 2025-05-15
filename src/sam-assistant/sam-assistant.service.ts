import { Injectable } from '@nestjs/common';
import { createMessageUseCase, createThreadUseCase, createRunUseCase, checkCompleteStatusUseCase, getMessagesUseCase } from './use-cases';
import OpenAI from 'openai';
import { QuestionDto } from './dto/question.dto';

@Injectable()
export class SamAssistantService {

    private openai: OpenAI = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    async createThread() {
        return createThreadUseCase(this.openai);
    }

    async createMessage(questionDto: QuestionDto) {
        const { threadId, question }  = questionDto
        
        const message = await createMessageUseCase(this.openai, { threadId, question });

        const run = await createRunUseCase(this.openai, { threadId });

        await checkCompleteStatusUseCase(this.openai, { threadId, runId: run.id });

        const messages = await getMessagesUseCase(this.openai, { threadId });

        return messages;
    }
    
    
}
