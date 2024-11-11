# Home Library Service. Part 1

## How to use this app

- clone this repository (`git clone https://github.com/eys-man/nodejs2024Q3-service`)
- change folder to `nodejs2024Q3-service` (`cd nodejs2024Q3-service`)
- go to branch `dev` from `master` (`git switch dev`)
- install all dependencies (`npm install`)
- copy `.env.sample` as `.env` into the same folder
- run server (`npm run start`)

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
