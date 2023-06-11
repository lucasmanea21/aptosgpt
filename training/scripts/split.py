import os
import re
import markdown


def split_file(save_path, filename, content):
    # Convert markdown to html
    html = markdown.markdown(content)

    # Split content into sections based on subheaders
    sections = re.split('<h2>(.*?)</h2>', html)

    # Make new directory for file sections
    filename_without_extension = filename.rsplit('.', 1)[0]
    new_dir = os.path.join(save_path, filename_without_extension)
    os.makedirs(new_dir, exist_ok=True)

    # Write sections to new text files
    for i in range(1, len(sections), 2):
        subheader = sections[i]
        sub_content = sections[i + 1]
        new_filename = os.path.join(new_dir, f'{subheader}.txt')
        with open(new_filename, 'w') as f:
            f.write(sub_content)


def traverse_and_split(base_path, save_path):
    for root, dirs, files in os.walk(base_path):
        for filename in files:
            if filename.endswith('.md'):
                file_path = os.path.join(root, filename)
                with open(file_path, 'r') as f:
                    content = f.read()
                split_file(save_path, filename, content)


# Use the function on your repository's local path and specify where to save split files
traverse_and_split('./docs', './scripts/files')
