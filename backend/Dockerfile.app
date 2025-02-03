# Use full Python for building dependencies
FROM python:3.11 AS build

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Use slim Python for final image
FROM python:3.11-slim
WORKDIR /app

COPY --from=build /install /usr/local
COPY . .

EXPOSE 6081
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:6081", "app:app"]
