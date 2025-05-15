import OpenAI from "openai"

interface Options {
    prompt: string;
    lang: string;
}

export const translateTextUseCase = async (openai: OpenAI, options: Options) => {

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        temperature: 0.8,
        max_tokens: 500,
        messages: [
            {
                role: "system",
                content: `
                    traduce el siguiente texto al idioma ${options.lang}:
                    ${options.prompt}
                `
            }
        ]
    });

    console.log(response.choices[0].message.content)


    return response.choices[0].message.content;
}