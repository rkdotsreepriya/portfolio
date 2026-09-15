import http.server
import os
import sys

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
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print(f"Invalid port: {sys.argv[1]}. Using default 8000.")

    print(f"Starting clean URL local server on http://localhost:{port} ...")
    http.server.test(HandlerClass=CleanURLHandler, port=port)
