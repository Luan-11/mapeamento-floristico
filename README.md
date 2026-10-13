\# 🌿 Mapeamento Florístico — Aplicação Mobile Offline-First



\[!\[React Native](https://img.shields.io/badge/React\_Native-0.72+-61DAFB?logo=react\&logoColor=black)](https://reactnative.dev/)

\[!\[Expo](https://img.shields.io/badge/Expo-Go-000000?logo=expo\&logoColor=white)](https://expo.dev/)

\[!\[SQLite](https://img.shields.io/badge/SQLite-Local\_DB-003B57?logo=sqlite\&logoColor=white)](https://www.sqlite.org/)

\[!\[Spring Boot](https://img.shields.io/badge/Spring\_Boot-Backend\_API-6DB33F?logo=springboot\&logoColor=white)](https://spring.io/projects/spring-boot)

\[!\[PostgreSQL](https://img.shields.io/badge/PostgreSQL-PostGIS-4169E1?logo=postgresql\&logoColor=white)](https://www.postgresql.org/)



Aplicação móvel voltada para a coleta, registro e georreferenciamento de dados de espécies vegetais em áreas de campo e locais remotos. O projeto é desenvolvido como Trabalho de Conclusão de Curso I (TCC) no curso de \*\*Sistemas de Informação\*\* da \*\*Universidade Federal dos Vales do Jequitinhonha e Mucuri (UFVJM)\*\*.



\---



\## 📌 Principais Funcionalidades



\- \*\*Operação 100% Offline (\*Offline-First\*):\*\* Coleta e persistência local de dados sem dependência de conectividade celular ou Wi-Fi.

\- \*\*Geolocalização Nativa (GNSS/GPS):\*\* Obtenção automática de coordenadas geográficas (latitude/longitude) e registro contínuo da margem de erro de acurácia em metros.

\- \*\*Registro Fotográfico Otimizado:\*\* Captura de imagens de espécimes com compressão automática via `ImageManipulator` (\~150 KB por foto) para otimizar o armazenamento local.

\- \*\*CRUD Relacional Embarcado:\*\* Inserção, listagem reativa, edição e remoção de amostras utilizando \*\*SQLite\*\* local.

\- \*\*Sincronização Futura:\*\* Preparação de registros com campo de estado (`PENDENTE`) para sincronização em lote (\*batch upload\*) ao conectar-se a uma rede.



\---



\## 🏗️ Arquitetura do Sistema



```

\[ Dispositivo Móvel ]

&#x20;├── React Native / Expo

&#x20;├── Módulos Nativos (Câmera \& GPS)

&#x20;└── SQLite Local (floristica.db)  <-- (Testado em modo avião)

&#x20;        │

&#x20;        ▼ (Futura Sincronização em Lote)

&#x20;\[ Backend REST API ] ──► Java Spring Boot

&#x20;        │

&#x20;        ▼

&#x20;\[ Banco Central ] ────► PostgreSQL

```



\---



\## 🛠️ Tecnologias Utilizadas



\### \*\*Mobile\*\*

\- \*\*React Native\*\* \& \*\*Expo\*\*

\- \*\*SQLite\*\* (`expo-sqlite`) para persistência local

\- \*\*Expo Location\*\* (`expo-location`) para georreferenciamento

\- \*\*Expo Image Manipulator\*\* (`expo-image-manipulator`) para compressão de mídias



\### \*\*Backend \& Banco de Dados (Em Planejamento)\*\*

\- \*\*Java 17 / Spring Boot\*\*

\- \*\*PostgreSQL\*\*

\- \*\*Docker\*\*



\---



\## 📁 Estrutura do Repositório



```

mapeamento-floristico/

├── mobile/       # Código-fonte da aplicação React Native (Expo + SQLite)

├── backend/      # API REST em Java Spring Boot (Em desenvolvimento)

├── docs/         # Documentação teórica, modelos e diagramas do TCC

└── README.md     # Visão geral do projeto

```



\---



\## 🚀 Como Executar o App Mobile em Desenvolvimento



\### Pré-requisitos

\- Node.js instalado na máquina

\- Aplicativo \*\*Expo Go\*\* instalado no smartphone (iOS ou Android)



\### Passo a passo



1\. \*\*Acesse a pasta do projeto mobile:\*\*

&#x20;  ```bash

&#x20;  cd mobile

&#x20;  ```



2\. \*\*Instale as dependências:\*\*

&#x20;  ```bash

&#x20;  npm install

&#x20;  ```



3\. \*\*Inicie o servidor de desenvolvimento do Expo:\*\*

&#x20;  ```bash

&#x20;  npx expo start --lan -c

&#x20;  ```



4\. \*\*Executar no dispositivo:\*\*

&#x20;  - Abra a câmera do smartphone, escaneie o QR Code exibido no terminal e abra no \*\*Expo Go\*\*.



\---



\## 👨‍💻 Autor



\- \*\*Luan Filipe Oliveira de Carvalho\*\* — \*Graduando em Sistemas de Informação\* (UFVJM)

\- \*\*GitHub:\*\* \[Luan-11](https://github.com/Luan-11)

