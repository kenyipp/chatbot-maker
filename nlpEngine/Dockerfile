FROM python:3.6

# Create app directory
RUN mkdir -p /nlpEngine
WORKDIR /nlpEngine

# Copy Python dependencies
COPY ./src/requirements.txt /nlpEngine

# Install Python dependencies
RUN pip3 install -r requirements.txt

# Copy source project
COPY ./src/ /nlpEngine

