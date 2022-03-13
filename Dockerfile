FROM node:16.3.0-alpine

ARG firebase_token
ARG ci_project_id
ARG dev_project_id

ENV FIREBASE_TOKEN=${firebase_token}
ENV GCLOUD_PROJECT=${ci_project_id}
ENV GOOGLE_APPLICATION_CREDENTIALS=/src/service-account-key.json

WORKDIR /app

COPY ["firebase.json","./"]

RUN yarn global add firebase-tools

RUN firebase use ${dev_project_id}

WORKDIR /src

COPY ["package.json","./"]

RUN yarn install

COPY functions/src .

CMD ["/bin/ash"]