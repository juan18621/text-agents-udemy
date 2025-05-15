import OpenAI from "openai";

interface Options {
    prompt: string;
    maxTokens?: number;
}

export const orthographyCheckUseCase = async (openai: OpenAI, options: Options) => {

    
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: `
                    Te serán proveidos textos con errores de ortografía, debes corregirlos y responder en español de Colombia.
                    Debes responder en formato json con el siguiente formato:
                    tu tarea corregirlos y retornar soluciones para cada error de ortografía.
                    tambien debes dar un porcentaje de acierto por el usuario
                    Las palabras deben existir en el diccionario de español de Colombia

                    si no hay errores de ortografía, debes responder que el texto está correcto.

                    Ejemplo de respuesta:
                    {
                        userScore: number,
                        errors: string[], // ['error -> solucion'],
                        message: string, // usa emojis y texto para felicitar al usuario por su ortografía
                    }
                `
            },
            {
                role: "user",
                content: options.prompt
            }
        ],
        temperature: 0.3,
        max_tokens: 150,
        response_format: { type: "json_object" }
    });

    console.log(response);

    const jsonResponse = JSON.parse(response.choices[0].message.content || '{}');
    return jsonResponse;
}