Sanguosha Server (Node.js) [![Build Status](https://www.travis-ci.org/takashiro/sanguosha-server.svg?branch=dev)](https://www.travis-ci.org/takashiro/sanguosha-server)
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
1. Clone karuta-node-server in the same parent directory.
1. Create a symlink karuta-node-server/extension/sanguosha <----> sanguosha-server/dist
1. Click "Launch Program" in Visual Studio Code.
