import { Body, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GptService } from './gpt.service';
import { ImageGenerationDto, ImageVariationDto, OrthographyDto, ProsConsDiscusserDto, TranslateTextDto } from './dtos';
import { Response, text } from 'express';
import { TextToAudioDto } from './dtos/text-to-audio.dto';
import { AudioToTextDto } from './dtos/audio-to-text.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('gpt')
export class GptController {

  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  async orthographyCheck(@Body() orthographyDto: OrthographyDto) {
    return this.gptService.orthographyCheck(orthographyDto);
  }

  @Post('pros-cons-discusser')
  async prosConsDiscusser(@Body() prosConsDiscusserDto: ProsConsDiscusserDto) {
    return this.gptService.prosConsDiscusser(prosConsDiscusserDto);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDiscusserStream(@Body() prosConsDiscusserDto: ProsConsDiscusserDto, @Res() res: Response) {
    const stream = await this.gptService.prosConsDiscusserStream(prosConsDiscusserDto);
    
    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      const content = chunk.choices[0].delta.content || '';
      console.log(content);
      res.write(content);
    }

    res.end();
  }


  @Post('translate')
  async translateText(@Body() translateTextDto: TranslateTextDto) {
    return this.gptService.translateText(translateTextDto);
  }

  @Post('text-to-audio')
  async textToAudio(@Body() textToAudioDto: TextToAudioDto, @Res() res: Response) {
    const audioFile = await this.gptService.textToAudio(textToAudioDto);

    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);

    res.sendFile(audioFile);
  }

  @Get('audio/:filename')
  async getAudio(@Param('filename') filename: string, @Res() res: Response) {
    const audioFile = await this.gptService.getAudio(filename);

    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(audioFile);
  }


  @Post('audio-to-text')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './generated/uploads',
      filename: (_req, file, callback) => {
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${new Date().getTime()}.${fileExtension}`;
        return callback(null, fileName);
      }
    })
  }))
  async audioToText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 1024 * 5, message: 'File size must be less than 5MB' }),
          //new FileTypeValidator({ fileType: 'audio/*' })
        ]
      })
    ) file: Express.Multer.File,
    @Body() audioToTextDto: AudioToTextDto
  ) {
    return this.gptService.audioToText(file, audioToTextDto.prompt);
  }


  @Post('image-generation')
  async imageGeneration(@Body() imageGenerationDto: ImageGenerationDto) {
    console.log(imageGenerationDto);
    return this.gptService.imageGeneration(imageGenerationDto);
  }

  @Get('image-generation/:filename')
  async getGeneratedImage(@Param('filename') filename: string, @Res() res: Response) {
    const imageFile = await this.gptService.getGeneratedImage(filename);

    res.status(HttpStatus.OK);
    res.sendFile(imageFile);
  }

  @Post('image-variation')
  async imageVariation(@Body() imageVariationDto: ImageVariationDto) {
    return this.gptService.imageVariation(imageVariationDto);
  }


}
