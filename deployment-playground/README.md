# Deployment playground

You can use this playground to test `gibbon-replay` under the same conditions as in production.

This [`docker-compose.yaml`](./docker-compose.yaml) contains only three services:

- *keydb* (redis fork), where sessions are stored
- *gibbon-replay-server*, which provides a session recording endpoint and replay interface
- *demosite*, a fictitious demonstration site that integrates gibbon-replay-js

Gettiing start:

```sh
$ docker compose build
$ docker compose up -d
```

Next, open two browser windows:

- http://localhost:5173 for *gibbon-replay-server*
- http://localhost:5174 for *demosite*

Explore the demo site and then go to *gibbon-replay-server* to view your session.

Login : `admin`  
Password: ` password`
