import OpenAI from "openai";
import * as fs from "fs"; 
interface Options {
    prompt?: string;
    audioFile: Express.Multer.File;
}

export const audioToTextUseCase = async (openai: OpenAI, options: Options) => {
    const { prompt, audioFile } = options;
    

    const response = await openai.audio.transcriptions.create({
        file: fs.createReadStream(audioFile.path),
        model: "whisper-1",
        prompt: prompt,
        language: "es",
        //response_format: "vtt",
        //response_format: "srt",
        response_format: "verbose_json",
    });

    return response;
}