import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';

export const downloadImageAsPng = async (url: string, fullPath: boolean = false) => {
    const response = await fetch(url);


    if (!response.ok) {
        throw new Error("Failed to download image");
    }

    const folderPath = path.resolve('./', './generated/images')

    fs.mkdirSync(folderPath, { recursive: true });
    
    const imageNamePng  = `${new Date().getTime()}.png`;
    const buffer = Buffer.from(await response.arrayBuffer());

    const completePath = path.join(folderPath, imageNamePng);

    await sharp(buffer).png().ensureAlpha().toFile(completePath);

    return fullPath ? completePath : imageNamePng;
}


export const downloadBase64ImageAsPng = async (base64Image: string, fullPath: boolean = false) => {

    // Remover encabezado
    base64Image = base64Image.split(';base64,').pop() || '';
    const imageBuffer = Buffer.from(base64Image, 'base64');
  
    const folderPath = path.resolve('./', './generated/images/');
    fs.mkdirSync(folderPath, { recursive: true });
  
    const imageNamePng = `${ new Date().getTime() }-64.png`;
    
  
    // Transformar a RGBA, png // Así lo espera OpenAI
    await sharp(imageBuffer)
      .png()
      .ensureAlpha()
      .toFile(path.join(folderPath, imageNamePng));
  
    return fullPath ? path.join(folderPath, imageNamePng) : imageNamePng;
  
  }