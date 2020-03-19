Sanguosha Server (Node.js) [![Build Status](https://www.travis-ci.org/takashiro/sanguosha-server.svg?branch=dev)](https://www.travis-ci.org/takashiro/sanguosha-server)
==========

| Example Page |  http://sgs.takashiro.cn     |
|--------------|------------------------------|
| Author       |    Kazuichi Takashiro        |


Lisense
-------
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.

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
