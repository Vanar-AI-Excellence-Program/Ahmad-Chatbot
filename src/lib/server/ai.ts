import { GoogleGenerativeAI } from '@google/generative-ai';
import { env as privateEnv } from '$env/dynamic/private';

// Initialize AI components only if API key is available
let genAI: GoogleGenerativeAI | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let model: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let fallbackModel: any = null;

// Check if we're in a build environment (CI) or if API key is available
const isBuildEnvironment = process.env.NODE_ENV === 'production' && !privateEnv.GEMINI_API_KEY;

if (!isBuildEnvironment && privateEnv.GEMINI_API_KEY) {
	// Validate API key format (should be a non-empty string)
	if (
		typeof privateEnv.GEMINI_API_KEY !== 'string' ||
		privateEnv.GEMINI_API_KEY.trim().length === 0
	) {
		console.warn('⚠️ GEMINI_API_KEY is invalid. Please check your environment variables.');
	} else {
		try {
			genAI = new GoogleGenerativeAI(privateEnv.GEMINI_API_KEY);
			// Try the newer model first, fallback to older if needed
			model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
			// Fallback model if the primary one fails
			fallbackModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
			console.log('🔑 Gemini API key loaded successfully');
		} catch (error) {
			console.warn('⚠️ Failed to initialize Gemini AI:', error);
		}
	}
} else if (isBuildEnvironment) {
	console.log('🔧 Build environment detected - AI features will be disabled');
}

export async function generateResponse(prompt: string) {
	// Check if AI is properly initialized
	if (!model || !fallbackModel) {
		throw new Error(
			'AI service not initialized. Please check your GEMINI_API_KEY environment variable.'
		);
	}

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

export async function* generateStreamingResponse(prompt: string) {
	// Check if AI is properly initialized
	if (!model || !fallbackModel) {
		throw new Error(
			'AI service not initialized. Please check your GEMINI_API_KEY environment variable.'
		);
	}

	try {
		console.log(
			'🤖 Generating streaming AI response for prompt:',
			prompt.substring(0, 100) + '...'
		);

		// Try primary model with streaming
		try {
			const result = await model.generateContentStream(prompt);
			let fullText = '';

			for await (const chunk of result.stream) {
				const chunkText = chunk.text();
				fullText += chunkText;
				yield { text: chunkText, isComplete: false, model: 'gemini-1.5-flash' };
			}

			console.log(
				'✅ Streaming AI response completed with gemini-1.5-flash, length:',
				fullText.length
			);
			yield { text: '', isComplete: true, model: 'gemini-1.5-flash', fullText };
			return;
		} catch (streamingError) {
			console.error('❌ Primary model streaming failed, trying non-streaming...', streamingError);

			// Fallback to non-streaming primary model
			const result = await model.generateContent(prompt);
			const response = await result.response;
			const text = response.text();

			// Simulate streaming by yielding character by character
			for (let i = 0; i < text.length; i++) {
				yield { text: text[i], isComplete: false, model: 'gemini-1.5-flash' };
				// Small delay to simulate streaming
				await new Promise((resolve) => setTimeout(resolve, 10));
			}

			console.log(
				'✅ AI response completed with gemini-1.5-flash (simulated streaming), length:',
				text.length
			);
			yield { text: '', isComplete: true, model: 'gemini-1.5-flash', fullText: text };
			return;
		}
	} catch (error: unknown) {
		console.error('❌ Primary model failed, trying fallback...', error);

		// Try fallback model
		try {
			console.log('🔄 Trying fallback model: gemini-pro');
			const fallbackResult = await fallbackModel.generateContent(prompt);
			const fallbackResponse = await fallbackResult.response;
			const fallbackText = fallbackResponse.text();

			// Simulate streaming by yielding character by character
			for (let i = 0; i < fallbackText.length; i++) {
				yield { text: fallbackText[i], isComplete: false, model: 'gemini-pro' };
				// Small delay to simulate streaming
				await new Promise((resolve) => setTimeout(resolve, 10));
			}

			console.log(
				'✅ AI response completed with fallback model (simulated streaming), length:',
				fallbackText.length
			);
			yield { text: '', isComplete: true, model: 'gemini-pro', fullText: fallbackText };
			return;
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
