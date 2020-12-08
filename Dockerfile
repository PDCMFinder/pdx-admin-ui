FROM node:14.15.1-buster

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 4200

ENTRYPOINT ["npm"]
CMD ["start"]
