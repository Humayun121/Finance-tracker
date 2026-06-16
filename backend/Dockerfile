FROM python:3.13-alpine

WORKDIR /app

COPY requirements.txt . 
RUN pip install --no-cache-dir -r requirements.txt

COPY entrypoint-dev.sh /entrypoint-dev.sh
RUN chmod +x /entrypoint-dev.sh

EXPOSE 8000
ENTRYPOINT [ "/entrypoint-dev.sh" ]