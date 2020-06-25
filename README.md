Sanguosha Server (Node.js) ![Node.js CI](https://github.com/takashiro/sanguosha-server/workflows/Node.js%20CI/badge.svg) [![Build Status](https://www.travis-ci.org/takashiro/sanguosha-server.svg?branch=dev)](https://www.travis-ci.org/takashiro/sanguosha-server)
==========

| Example Page |  http://sgs.takashiro.cn     |
|--------------|------------------------------|
| Author       |    Kazuichi Takashiro        |


Introduction
------------

It's a server application of the famous board game [Legends of the Three Kingdoms](https://en.wikipedia.org/wiki/Legends_of_the_Three_Kingdoms) based on React.js.

It provides connections via WebSocket.


Running Environment
-------------------
1. Node.js v10 or later versions
1. [karuta-node-server](https://github.com/takashiro/karuta-node-server)
2. Client application [sanguosha-react](https://github.com/takashiro/sanguosha-react)

Build and Run
-------------
1. Execute `npm link` in this repository.
1. Clone `karuta-node-server` in the parent directory (the same folder as this repository).
1. Execute `npm i && npm run build` to build `karuta-node-server`.
1. Execute `npm link @karuta/sanguosha` in `karuta-node-server`.
1. Click "Launch Program" in Visual Studio Code.
