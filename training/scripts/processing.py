import os
import re
from markdown import Markdown
import shutil

# Define markdown extension and file encoding
MD_EXT = '.md'
ENCODING = 'utf-8'

# Define folders
SOURCE_FOLDER = './docs'
DEST_FOLDER = './scripts/new_files'

# Define word limit for each file
WORD_LIMIT = 1000

# Define your function to call on each file content


def my_function(content):
    # Do something with the content
    pass


# Initialize markdown parser
md = Markdown()

# Walk through all directories and files in the source folder
for dirpath, dirnames, filenames in os.walk(SOURCE_FOLDER):
    for filename in filenames:
        if filename.endswith(MD_EXT):
            filepath = os.path.join(dirpath, filename)
            with open(filepath, 'r', encoding=ENCODING) as f:
                # Read file and parse markdown
                content = f.read()
                html = md.convert(content)
                text = re.sub('<[^<]+?>', '', html)  # Remove all HTML tags

                # Exclude code blocks
                text = re.sub(r'```.*?```', '', text, flags=re.DOTALL)

                # Split text into words
                words = text.split()

                # Create new files with max 1000 words each
                for i in range(0, len(words), WORD_LIMIT):
                    new_filename = f"{filename.rsplit('.', 1)[0]}_{i // WORD_LIMIT}{MD_EXT}"
                    new_dirpath = dirpath.replace(SOURCE_FOLDER, DEST_FOLDER)
                    # Ensure destination directory exists
                    os.makedirs(new_dirpath, exist_ok=True)
                    new_filepath = os.path.join(new_dirpath, new_filename)

                    with open(new_filepath, 'w', encoding=ENCODING) as new_file:
                        new_content = ' '.join(words[i: i+WORD_LIMIT])
                        new_file.write(new_content)

                        # Call function for each file's content
                        my_function(new_content)
