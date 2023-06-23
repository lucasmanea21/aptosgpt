#!/bin/bash

set -e

# download the data
# wget -r -A.html "https://api.python.langchain.com/en/latest/"

# ingest the data
./ingest.py
