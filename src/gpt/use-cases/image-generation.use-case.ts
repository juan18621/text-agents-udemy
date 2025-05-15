import OpenAI, { toFile } from "openai"
import { downloadBase64ImageAsPng, downloadImageAsPng } from "src/helpers";
import * as fs from 'fs';
import * as path from "path";

interface Options {
    prompt: string;
    originalImage?: string;
    maskImage?: string;
}

export const imageGenerationUseCase = async (openai: OpenAI, options: Options) => {

    const { prompt, originalImage, maskImage } = options;


    if (!originalImage || !maskImage) {

        const response = await openai.images.generate({
            prompt,
            model: "dall-e-3",
            n: 1,
            size: "1024x1024",
            quality: "standard",
            response_format: "url"
        });

        if (!response.data || response.data.length === 0) {
            throw new Error("No image generated");
        }

        if (!response.data[0].url) {
            throw new Error("No image URL generated");
        }

        const filename = await downloadImageAsPng(response.data[0].url);
        const url = `${process.env.SERVER_URL}/gpt/image-generation/${filename}`

        return {
            url: url,
            openAIUrl: response.data[0].url,
            revisedPrompt: response.data[0].revised_prompt
        }

    }

    const pngImagePath = await downloadImageAsPng(originalImage, true);
    const maskPath = await downloadBase64ImageAsPng(maskImage, true);

    const response = await openai.images.edit({
        model: 'dall-e-2',
        prompt: prompt,
        image: await toFile(fs.createReadStream(pngImagePath), null, {
            type: 'image/png',
          }),
          mask: await toFile(fs.createReadStream(maskPath), null, {
            type: 'image/png',
          }),
        n: 1,
        size: '1024x1024',
        response_format: 'url',
    });
    if (!response.data || response.data.length === 0) {
        throw new Error("No image generated");
    }

    if (!response.data[0].url) {
        throw new Error("No image URL generated");
    }


    const localImagePath = await downloadImageAsPng(response.data[0].url);
    const filename = path.basename(localImagePath);


    const publicUrl = `${process.env.SERVER_URL}/gpt/image-generation/${filename}`

    return {
        url: publicUrl,
        openAIUrl: response.data[0].url,
        revisedPrompt: response.data[0].revised_prompt
    }
}