# Home Library Service. Part 1

## How to use this app

- clone this repository (`git clone https://github.com/eys-man/nodejs2024Q3-service`)
- change folder to `nodejs2024Q3-service` (`cd nodejs2024Q3-service`)
- go to branch `dev2` from `master` (`git switch dev`)
- install all dependencies (`npm i`)
- copy `.env.sample` as `.env` into the same folder
- run script `docker:start` (`npm run start docker:start`)
- run script `test` to test the application (`npm run test`)

If you want to run this application from images hosted on Docker Hub, you need to do some steps.
1) Open in any text editor docker-compose.yml file
2) remove comments before line started with image:
    `# image: eyesman/nodejs2024q3-service-app` to `image: eyesman/nodejs2024q3-service-app` 
    and
    `# image: eyesman/nodejs2024q3-service-db` to `image: eyesman/nodejs2024q3-service-db`
3) comment block `build`:
    ```
    build:
      dockerfile: Dockerfile.db
      context: .
    ```
    and
    ```
    build:
      context: .
      dockerfile: Dockerfile
    ```
4) run script `docker:start` (`npm run start docker:start`)
