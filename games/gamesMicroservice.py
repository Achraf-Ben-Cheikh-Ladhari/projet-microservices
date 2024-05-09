import grpc
from concurrent import futures
import games_pb2
import games_pb2_grpc
from pymongo import MongoClient
from kafka import KafkaConsumer,KafkaProducer
import json
import logging
from bson import ObjectId
import threading

logging.basicConfig(level=logging.INFO)

class GameServiceServicer(games_pb2_grpc.GameServiceServicer):
    def __init__(self):
        self.client = MongoClient('mongodb://localhost:27017/')
        self.db = self.client['games']
        self.games_collection = self.db['games']
        logging.info('MongoDB connected')
        self.producer = KafkaProducer(bootstrap_servers='localhost:9092',
                                      value_serializer=lambda v: json.dumps(v).encode('utf-8'))
        logging.info('Kafka Producer init !')              

    def GetGame(self, request, context):
        game_id = request.game_id
        game = self.games_collection.find_one({'_id':ObjectId(game_id)})
        logging.info("Logging from gRPC!")
        if game:
            game_message = games_pb2.Game(id=str(game['_id']), title=game['title'], description=game['description'], type=game['type'], prix=game['prix'])
            self.send_message_to_kafka('getGame', {'gameId': game_id})
            return games_pb2.GetGameResponse(game=game_message)
        else:
            context.set_code(grpc.StatusCode.NOT_FOUND)
            self.send_message_to_kafka('getGame', {'gameId': 'null'})
            return games_pb2.GetGameResponse()

    def SearchGames(self, request, context):
        games = []
        logging.info("Logging from gRPC!")
        for game in self.games_collection.find():
            game_message = games_pb2.Game(id=str(game['_id']), title=game['title'], description=game['description'], type=game['type'], prix=game['prix'])
            games.append(game_message)
        return games_pb2.SearchGamesResponse(games=games)

    def AddGame(self, request, context):
        logging.info("Logging from gRPC!")
        new_game = {
            'title': request.title,
            'description': request.description,
            'type': request.type,
            'prix': request.prix
        }
        self.games_collection.insert_one(new_game)
        game_message = games_pb2.Game(id=str(new_game['_id']), title=new_game['title'], description=new_game['description'], type=new_game['type'], prix=new_game['prix'])
        return games_pb2.AddGameResponse(game=game_message)

    def send_message_to_kafka(self, action, data):
        message = {'action': action, **data}
        self.producer.send('games_orders_topic', value=message)
        logging.info(f"Message sent to Kafka: {message}")
    
    def start_kafka_consumer(self):
        consumer = KafkaConsumer(
            'game_topic',
            bootstrap_servers='localhost:9092',
            auto_offset_reset='earliest',
            group_id='game-group',
            client_id='projet',
            value_deserializer=lambda x: json.loads(x.decode('utf-8'))
        )

        for message in consumer:
            logging.info(message.value['action']) 
            logging.info('Logging from kafka!')
            if message.value['action'] == 'addGame':
                try:
                    game_data = message.value['gameData']
                    title = game_data.get('title')
                    description = game_data.get('description')
                    type_ = game_data.get('type')
                    prix = game_data.get('prix')
                    new_game = {
                        'title': title,
                        'description': description,
                        'type': type_,
                        'prix': prix
                    }            
                    saved_game = self.games_collection.insert_one(new_game)
                    logging.info('Added new game: %s', new_game)
                except Exception as e:
                    logging.error('Error occurred while adding game: %s', e)
            elif message.value['action'] == 'searchGames':
                try:
                    games = list(self.games_collection.find())
                    logging.info('Games: %s', games)
                except Exception as e:
                    logging.error('Error occurred while fetching games: %s', e)
            elif message.value['action'] == 'getGame':
                try:
                    game_id = message.value['gameId']
                    game = self.games_collection.find_one({'_id': ObjectId(game_id)})
                    self.send_message_to_kafka('getGame', {'gameId': game_id})
                    logging.info('Game: %s', game)
                except Exception as e:
                    logging.error('Error occurred while fetching game: %s', e)

def serve():
    logging.info('Starting gRPC server...')
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    games_pb2_grpc.add_GameServiceServicer_to_server(GameServiceServicer(), server)
    server.add_insecure_port('[::]:50052')
    server.start()
    logging.info('gRPC server started')
    server.wait_for_termination()

if __name__ == '__main__':
    game_service = GameServiceServicer()

    kafka_consumer_thread = threading.Thread(target=game_service.start_kafka_consumer)
    kafka_consumer_thread.start()

    serve()