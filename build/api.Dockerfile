# docker run --privileged --rm tonistiigi/binfmt --install all
# docker buildx build --push --platform linux/arm64/v8,linux/amd64 -f build/api.Dockerfile -t thedrhax/blackufa-api .

FROM python:3.9-slim

COPY bsu requirements.txt /app/

RUN useradd -m user \
 && chown -R user:user /app

USER user
WORKDIR /app

RUN ./bsu venv update \
 && ./bsu pip install gunicorn

COPY src /app/src
COPY config /app/config

EXPOSE 8000

ENTRYPOINT ["./bsu", "python", "-m", "gunicorn"]

CMD ["--bind", "0.0.0.0:8000", "-w", "4", "src.utils.apiserver:app"]
