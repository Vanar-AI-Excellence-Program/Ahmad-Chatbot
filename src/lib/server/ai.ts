import { GoogleGenerativeAI } from '@google/generative-ai';
import { env as privateEnv } from '$env/dynamic/private';

if (!privateEnv.GEMINI_API_KEY) {
	throw new Error(
		'GEMINI_API_KEY is not set in environment variables. Please add it to your .env file.'
	);
}

// Validate API key format (should be a non-empty string)
if (
	typeof privateEnv.GEMINI_API_KEY !== 'string' ||
	privateEnv.GEMINI_API_KEY.trim().length === 0
) {
	throw new Error('GEMINI_API_KEY is invalid. Please check your environment variables.');
}

console.log('🔑 Gemini API key loaded successfully');

export const genAI = new GoogleGenerativeAI(privateEnv.GEMINI_API_KEY);

// Try the newer model first, fallback to older if needed
export const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Fallback model if the primary one fails
export const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-pro' });

export async function generateResponse(prompt: string) {
	try {
		console.log('🤖 Generating AI response for prompt:', prompt.substring(0, 100) + '...');
		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();
		console.log(
			'✅ AI response generated successfully with gemini-1.5-flash, length:',
			text.length
		);
		return text;
	} catch (error: unknown) {
		console.error('❌ Primary model failed, trying fallback...', error);

		// Try fallback model
		try {
			console.log('🔄 Trying fallback model: gemini-pro');
			const fallbackResult = await fallbackModel.generateContent(prompt);
			const fallbackResponse = await fallbackResult.response;
			const fallbackText = fallbackResponse.text();
			console.log(
				'✅ AI response generated successfully with fallback model, length:',
				fallbackText.length
			);
			return fallbackText;
		} catch (fallbackError: unknown) {
			console.error('❌ Both models failed:', fallbackError);

			// Provide more specific error messages
			const errorMessage = error instanceof Error ? error.message : String(error);
			const fallbackErrorMessage =
				fallbackError instanceof Error ? fallbackError.message : String(fallbackError);

			if (errorMessage.includes('API key') || fallbackErrorMessage.includes('API key')) {
				throw new Error(
					'Invalid or missing Gemini API key. Please check your environment variables.'
				);
			} else if (errorMessage.includes('quota') || fallbackErrorMessage.includes('quota')) {
				throw new Error('API quota exceeded. Please check your Gemini API usage limits.');
			} else if (errorMessage.includes('model') || fallbackErrorMessage.includes('model')) {
				throw new Error('Model not found or not supported. Please check the model name.');
			} else {
				throw new Error(
					`Failed to generate AI response with both models. Primary: ${errorMessage}, Fallback: ${fallbackErrorMessage}`
				);
			}
		}
	}
}
