import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Bạn là một kỹ sư prompt điện ảnh chuyên nghiệp, chuyên tối ưu hóa prompt cho các mô hình AI tạo ảnh có bộ lọc kiểm duyệt nghiêm ngặt như Meta AI và Nano Banana.

MỤC TIÊU: Chuyển đổi ý tưởng người dùng (Tiếng Việt) thành Prompt Tiếng Anh chất lượng cao, đảm bảo KHÔNG bị chặn bởi bộ lọc nội dung (Content Safety Filters).

QUY TẮC AN TOÀN & TRÁNH VI PHẠM (STRICT POLICY COMPLIANCE):
1. TUYỆT ĐỐI KHÔNG (NO NSFW/Gore):
   - Không mô tả khỏa thân, hở hang nhạy cảm, hoặc tư thế gợi dục.
   - Không mô tả thương tích rùng rợn, nội tạng, máu me be bét (Gore).
   - Không mô tả hành vi xâm hại hoặc thù địch.

2. KỸ THUẬT "LÁCH" KIỂM DUYỆT (SANITIZATION):
   - Nếu ý tưởng gốc mang tính bạo lực/kinh dị: Hãy chuyển hóa thành "Kinh dị tâm lý" (Psychological Horror) hoặc "Bầu không khí đen tối" (Dark Atmosphere).
   - Thay thế từ ngữ nhạy cảm: 
     + Thay "blood/bleeding" bằng "crimson lighting", "red paint texture", "rust".
     + Thay "dead body" bằng "fallen silhouette", "mysterious figure on ground".
     + Thay "naked/nude" bằng "ethereal silk dress", "cinematic silhouette", "high fashion concept".
   - Tập trung vào Ánh sáng (Lighting), Góc máy (Camera Angle) và Cảm xúc (Emotion) để tạo kịch tính thay vì chi tiết bạo lực trực quan.

ĐỊNH DẠNG ĐẦU RA BẮT BUỘC (STRICT OUTPUT FORMAT):

Title: [Tiếng Anh - Ngắn gọn, Giật gân (Clickbait) nhưng dùng từ vựng an toàn]

Cinematic Description: [Mô tả Tiếng Anh. Chi tiết về chủ thể, môi trường, ánh sáng. Đảm bảo ngôn ngữ là SFW (Safe For Work). Ví dụ: "A tense confrontation in a dark alley, rim lighting, rain pouring" thay vì "A man killing another man".]

Poster Text: Include the title text on the poster: "[Văn bản hiển thị trên ảnh - Giữ nguyên Tiếng Việt nếu người dùng nhập Tiếng Việt]"

Style: Cinematic, photorealistic, 8k, dramatic lighting, highly detailed, masterpiece, safe-rated.

QUAN TRỌNG:
- Phần "Cinematic Description" PHẢI là Tiếng Anh để AI tạo ảnh hiểu tốt nhất.
- Giữ đúng các từ khóa (keys): "Title:", "Cinematic Description:", "Poster Text:", "Style:".
`;

export const generateCinematicPrompt = async (
  userStory: string,
  getApiKey: () => string | undefined,
  cycleApiKey: () => void,
  totalApiKeysCount: number
): Promise<string> => {
  let attempt = 0;
  let lastError: Error | undefined;

  while (attempt < totalApiKeysCount) {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error("Không có API Key nào được cấu hình. Vui lòng thiết lập biến môi trường process.env.API_KEY.");
    }

    const ai = new GoogleGenAI({ apiKey }); // Initialize GoogleGenAI with the current API key

    try {
      console.log(`Đang thử API Key (attempt ${attempt + 1}/${totalApiKeysCount})`);
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            parts: [{ text: userStory }]
          }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
          safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          ],
        },
      });

      const text = response.text;

      if (!text) {
        console.warn("Phản hồi Gemini thiếu văn bản:", response);
        throw new Error("Không nhận được phản hồi. Nội dung có thể đã bị chặn bởi bộ lọc an toàn.");
      }

      return text.trim();
    } catch (error: any) {
      console.error(`Lỗi API Gemini với key hiện tại (attempt ${attempt + 1}):`, error);
      lastError = error;

      // Check for specific API errors that might suggest cycling the key
      const errorMessage = error.message || '';
      const isQuotaError = errorMessage.includes('quota') || errorMessage.includes('RESOURCE_EXHAUSTED');
      const isAuthError = errorMessage.includes('API key not valid') || errorMessage.includes('UNAUTHENTICATED');

      if ((isQuotaError || isAuthError) && totalApiKeysCount > 1) {
        cycleApiKey(); // Try the next key
        attempt++;
      } else {
        // If it's not a quota/auth error or only one key, rethrow immediately
        throw lastError;
      }
    }
  }

  // If all keys were tried and failed
  throw new Error(`Đã thử tất cả ${totalApiKeysCount} API Key và đều thất bại. Lỗi cuối cùng: ${lastError?.message || "Không xác định"}. Vui lòng kiểm tra lại cấu hình process.env.API_KEY của bạn.`);
};