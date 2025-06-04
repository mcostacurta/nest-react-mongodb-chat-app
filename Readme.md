# Real-time Chat - NestJS | React | MongoDB | GraphQL 🚀

A real-time chat app built with NestJS, React, MongoDB, and GraphQL offers instant messaging. 
The **backend** uses NestJS and GraphQL for clean, efficient APIs and real-time messaging via WebSocket subscriptions (graphql-subscriptions), while MongoDB handles data storage. 
The **frontend**, built with React and Material UI, provides a responsive user interface and manages state with Apollo Client. Key features include JWT authentication, server-side pagination, file uploads to Amazon S3, ensuring secure, seamless, and real-time communication for users


---
## 🛠️ Prerequisites

Before start the project, ensure you have the following installed:

* **MongoDB**: Use the docker-compose.yml file to start a local MongoDB instance using docker (you should have docker compose installed - https://docs.docker.com/compose/install/)
    ```bash
    docker compose -f docker-compose-ollama.yml up -d
    ```



* **Node.js & npm**: Required - You can use pnpm, is a npm with improvements, if you wanna try https://pnpm.io/pt/

---
## 🚀 Usage


* ### Backend
     ```bash
    cd chatter-backend
    pnpm run start:dev
    ```

* ### Frontend
    ```bash
    cd chatter-frontend
    pnpm start
    ```

---
