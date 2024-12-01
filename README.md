# Home Library Service. Part 3
## Logging & Error Handling and Authentication and Authorization

### How to use this app

- clone this repository (`git clone https://github.com/eys-man/nodejs2024Q3-service`)
- change folder to `nodejs2024Q3-service` (`cd nodejs2024Q3-service`)
- go to branch `dev3` from `master` (`git switch dev`)
- install all dependencies (`npm i`)
- copy `.env.sample` as `.env` into the same folder
- run script `docker:start` (`npm run start docker:start`)
- run script `test:auth` to test the application (`npm run test:auth`)

All logs are stored in the Docker container's directory `./app/logs`.