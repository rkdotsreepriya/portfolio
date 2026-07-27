import http.server
import os

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        # Get the standard translated path from parent class
        translated = super().translate_path(path)
        
        # If the path is a directory, let the default handler look for index.html
        if os.path.isdir(translated):
            return translated
            
        # If the file doesn't exist, check if appending '.html' matches an existing file
        if not os.path.exists(translated) and not translated.endswith('.html'):
            html_path = translated + '.html'
            if os.path.exists(html_path):
                return html_path
                
        return translated

if __name__ == '__main__':
    print("Starting clean URL local server on http://localhost:8000 ...")
    http.server.test(HandlerClass=CleanURLHandler, port=8000)
