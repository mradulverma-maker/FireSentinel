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

    def polish(self, template, firstname, notice):
        if not self.model:
            return template.replace("{firstname}", firstname).replace("{notice}", notice)

        prompt = f"""
        Role: Expert Outreach Strategist.
        Task: Rewrite this email to sound warm, human, and specific. 
        Context: My Thumbnail Design Agency.
        
        Variables to include:
        - Firstname: {firstname}
        - Personal Notice: {notice}
        
        Rules:
        1. Preserve the meaning. 
        2. Keep it under 60 words.
        3. SOUND LIKE A HUMAN, not a bot.
        
        Original Template:
        {template}
        """

        try:
            response = self.model.generate_content(prompt)
            return response.text
        except:
            return template.replace("{firstname}", firstname).replace("{notice}", notice)
