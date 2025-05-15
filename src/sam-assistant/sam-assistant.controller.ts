import { Body, Controller, Post } from '@nestjs/common';
import { SamAssistantService } from './sam-assistant.service';
import { QuestionDto } from './dto/question.dto';

@Controller('sam-assistant')
export class SamAssistantController {
  constructor(private readonly samAssistantService: SamAssistantService) {}

  @Post('create-thread')
  createThread() {
    return this.samAssistantService.createThread();
  }

  @Post('post-question')
  userQuestion(@Body() body: QuestionDto) {
    return this.samAssistantService.createMessage(body);
  }
}
