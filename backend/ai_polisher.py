import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class AIPolisher:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None

    def polish_template(self, template, firstname, notice):
        if not self.model:
            # Fallback to raw template with variables replaced
            return template.replace("{firstname}", firstname).replace("{notice}", notice)

        prompt = f"""
        You are an elite sales copywriter. I have an email template for my thumbnail design agency.
        Please rewrite it to sound warm, casual, and highly human-like. 
        Keep it concise.
        
        CRITICAL: You MUST preserve these exact variables: {{firstname}} and {{notice}}.
        
        Template:
        {template}
        
        Variables:
        firstname: {firstname}
        notice: {notice}
        """

        try:
            response = self.model.generate_content(prompt)
            polished_text = response.text
            # Double check variables are still there
            if "{firstname}" not in polished_text:
                polished_text = polished_text.replace(firstname, "{firstname}")
            return polished_text
        except Exception as e:
            print(f"Gemini API error: {e}")
            return template.replace("{firstname}", firstname).replace("{notice}", notice)
