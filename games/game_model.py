from mongoengine import Document, StringField

class Games(Document):
    title = StringField()
    description = StringField()
    type = StringField()
    prix = StringField()