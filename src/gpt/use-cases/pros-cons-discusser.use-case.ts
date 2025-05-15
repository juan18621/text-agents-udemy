import OpenAI from "openai"
import { ProsConsDiscusserDto } from "../dtos"


export const prosConsDiscusserUseCase = async (openai: OpenAI, prosConsDiscusserDto: ProsConsDiscusserDto) => {

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        temperature: 0.8,
        max_tokens: 500,
        messages: [
            {
                role: "system",
                content: `
                 Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
                 la respuesta debe de ser en formato markdown,
                 los pros y contras deben de estar en una lista
                `
            },
            {
                role: "user",
                content: prosConsDiscusserDto.prompt
            }
        ]
    });


    return response.choices[0].message;
}