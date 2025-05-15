import { Injectable, NotFoundException } from '@nestjs/common';
import { orthographyCheckUseCase, prosConsDiscusserStreamUseCase, prosConsDiscusserUseCase, audioToTextUseCase, imageGenerationUseCase } from './use-cases';
import { ImageGenerationDto, ImageVariationDto, OrthographyDto, ProsConsDiscusserDto, TranslateTextDto } from './dtos';
import OpenAI from 'openai';
import { translateTextUseCase } from './use-cases/translate-text.use-case';
import { textToAudioUseCase } from './use-cases/text-to-audio.use-case';
import { TextToAudioDto } from './dtos/text-to-audio.dto';
import * as path from 'path';
import * as fs from 'fs';
import { imageVariationUseCase } from './use-cases/image-variation.use-case';


 @Injectable()
export class GptService {


    private openai: OpenAI = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    //solo va a llamar casos de uso
    async orthographyCheck(orthographyDto: OrthographyDto) {
        return await orthographyCheckUseCase(this.openai, orthographyDto)
    }

    async prosConsDiscusser(prosConsDiscusserDto: ProsConsDiscusserDto) {
        return await prosConsDiscusserUseCase(this.openai, prosConsDiscusserDto)
    }

    async prosConsDiscusserStream(prosConsDiscusserDto: ProsConsDiscusserDto) {
        return await prosConsDiscusserStreamUseCase(this.openai, prosConsDiscusserDto)
    }

    async translateText(translateTextDto: TranslateTextDto) {
        return await translateTextUseCase(this.openai, translateTextDto)
    }

    async textToAudio(textToAudioDto: TextToAudioDto) {
        return await textToAudioUseCase(this.openai, textToAudioDto)
    }

    async getAudio(filename: string) {
        const filePath = path.resolve(__dirname, '../../../generated/audios', `${filename}.mp3`);

        if (!fs.existsSync(filePath)) {
            throw new NotFoundException('Audio file not found');
        }

        return filePath;   
    }

    async audioToText(file: Express.Multer.File, prompt?: string) {
        return await audioToTextUseCase(this.openai, { prompt, audioFile: file })
    }

    async imageGeneration(imageGenerationDto: ImageGenerationDto) {
        return await imageGenerationUseCase(this.openai, imageGenerationDto)
    }

    async getGeneratedImage(filename: string) {
        const filePath = path.resolve('./','./generated/images/', filename);
        const exists = fs.existsSync( filePath );
        
    
        if ( !exists ) {
          throw new NotFoundException('File not found');
        }
    
        return filePath;
    }

    async imageVariation(imageVariationDto: ImageVariationDto) {
        return await imageVariationUseCase(this.openai, imageVariationDto)
    }
}
