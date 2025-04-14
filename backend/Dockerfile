
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

# Copy application code
COPY . /app/

# Create non-root user for security
RUN adduser --disabled-password --gecos "" appuser
USER appuser

# Set environment variables
ENV PYTHONPATH=/app
ENV PORT=8000

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
