FROM    node:4.2.6

COPY    . /src/
RUN     cd /src; npm install; node build

EXPOSE  8080

WORKDIR /src

CMD     ["node", "/src/server.js"]