import os
import asyncio
import aiohttp
import json
import urllib.parse
from aiohttp_sse_client import client as sse_client
from itertools import islice

# Define folders
SOURCE_FOLDER = './scripts/new_files'
DEST_FOLDER = './scripts/questions'

# Define markdown extension and file encoding
MD_EXT = '.md'
ENCODING = 'utf-8'

# Define the API endpoint
API_ENDPOINT = 'http://127.0.0.1:8081/ask/stream'

# Define the API parameters
API_PARAMS = {
    'model': 'forefront',
    'gptmodel': 'gpt-4',
    'resignup': '1'
}

# Define max files to process simultaneously
MAX_CONCURRENT_FILES = 5
semaphore = asyncio.Semaphore(MAX_CONCURRENT_FILES)


async def process_file(session, filepath, filename, rel_dir):
    async with semaphore:
        with open(filepath, 'r', encoding=ENCODING) as f:
            file_content = f.read()

        if not file_content.strip():  # skip empty files
            return

        API_PARAMS[
            'prompt'] = f'Please create me 1 question and answers based on the data that I give you, in a JSON format. Only return the JSON inside brackets, and nothing else:{file_content}'

        API_URL = API_ENDPOINT + '?' + urllib.parse.urlencode(API_PARAMS)

        async with sse_client.EventSource(API_URL) as event_source:
            async for event in event_source:
                if event.type == 'done':
                    try:
                        json_str = event.data
                        json_data = json.loads(json_str)
                        print(f'Successful API response for file: {filepath}')

                        new_filename = os.path.join(
                            rel_dir, os.path.splitext(filename)[0]) + '.json'
                        new_filepath = os.path.join(DEST_FOLDER, new_filename)
                        os.makedirs(os.path.dirname(
                            new_filepath), exist_ok=True)

                        with open(new_filepath, 'w', encoding=ENCODING) as f:
                            json.dump(json_data, f)

                    except (json.JSONDecodeError, KeyError):
                        print(
                            f'Error: Invalid JSON response from API for file: {filepath}')


async def main():
    async with aiohttp.ClientSession() as session:
        for dirpath, dirnames, filenames in os.walk(SOURCE_FOLDER):
            tasks = (process_file(session, os.path.join(dirpath, filename), filename, os.path.relpath(
                dirpath, SOURCE_FOLDER)) for filename in filenames if filename.endswith(MD_EXT))
            while True:
                chunk = list(islice(tasks, MAX_CONCURRENT_FILES))
                if not chunk:
                    break
                await asyncio.gather(*chunk)

asyncio.run(main())
