# syntax=docker/dockerfile:1

ARG PYTHON_VERSION=3.11.4
FROM python:${PYTHON_VERSION}-slim AS base

# Prevents Python from writing pyc files.
ENV PYTHONDONTWRITEBYTECODE=1

# Keeps Python from buffering stdout and stderr.
ENV PYTHONUNBUFFERED=1

# Set the working directory inside the container to match the backend structure.
WORKDIR /app/backend

# Create a non-privileged user for running the app.
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    jobseekeruser

# Install dependencies.
RUN apt-get update && apt-get install -y supervisor && \
    rm -rf /var/lib/apt/lists/*

# Use a requirements file in the backend directory for caching purposes.
RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=backend/requirements.txt,target=requirements.txt \
    python -m pip install -r requirements.txt

# Copy the entire backend folder into the container.
COPY backend /app/backend
COPY supervisord.conf /etc/supervisord.conf

# Permissions to files and folders
RUN chown -R jobseekeruser:jobseekeruser /app/backend
RUN chmod -R 775 /app/backend
RUN chmod +x /app/backend/batch.py
RUN chmod +x /app/backend/app.py

# Switch to the non-privileged user.
USER jobseekeruser

# Expose the port your app will run on (adjust if necessary).
EXPOSE 5000

# Command to run the app.py script.
# CMD ["supervisord", "-c", "/etc/supervisord.conf", "-n"]
CMD ["python", "/app/backend/app.py"]