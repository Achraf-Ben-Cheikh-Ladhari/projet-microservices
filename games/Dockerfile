ARG VERSION

FROM python:3.9-slim

LABEL version=$VERSION

WORKDIR /games

COPY . .

RUN pip install grpcio-tools kafka-python pymongo mongoengine aiokafka asyncio 

EXPOSE 50052

CMD ["python3", "gamesMicroservice.py"]
