import OpenAI from "openai"
import * as path from "path";
import * as fs from "fs";
interface Options {
    prompt: string;
    voice?: string;
}

export const textToAudioUseCase = async (openai: OpenAI, options: Options) => {
    const voices = {
        'nova': 'nova',
        'alloy': 'alloy',
        'echo': 'echo',
        'fable': 'fable',
        'onyx': 'onyx',
        'shimmer': 'shimmer',
        'whisper': 'whisper'
    }
    

    const voice = voices[options.voice as string ] ?? 'nova';

    const folderPath = path.resolve(__dirname, '../../../generated/audios', `${voice}.mp3`);

    const speechFile = path.resolve(`${folderPath}/${new Date().getTime()}.mp3`);


    //recursive create folder
    fs.mkdirSync(folderPath, { recursive: true });
    

    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: voice,
        input: options.prompt
    });

    const response = await openai.audio.speech.create({
        model: "tts-1",
        voice: voice,
        input: options.prompt,
        response_format: "mp3"
    });

    const buffer = Buffer.from(await response.arrayBuffer());

    fs.writeFileSync(speechFile, buffer);

    return speechFile;
}