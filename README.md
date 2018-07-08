# Chatbot Maker

It is a demo repository which show how to build your own chatbot platform. You can define your own intent with training samples and the response corresonding to the intent. 

We using native base classifier to distinguish, to classify different intent. It is suggested to use another classifier and fine tune the requried parameters to achieve a more accurate model.

## Getting Started

```sh
$docker-compose build
$docker-compose up -d
```

1. Firstly, change the environment variable "DEFAULT_PASSWORD" on the webApp and created the default account by 

```
GET http://localhost:3100/api/user/setup
```

2. Secondly, create your own intents by

```
POST http://localhost:3100/api/intent
```

3. Finaly, train your bot via

```
POST http://localhost:3100/api/bot/train
```

## API Doc

You can generate the api doc via the below command
```sh
grunt apidoc
```

## TODO

- Better README
- Create the test case
- Save the context of conversation via session
- build connectors to Facebook Message as well as Telegram