
# Itunes Search App

Search for artists, albums and/or songs.


## Run Locally

Clone the project

```bash
  git clone https://github.com/judebaptista18/itunes-search-app.git
```

Go to the project directory

```bash
  cd itunes-search-app
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

- **React (Vite)** → http://localhost:3000
- **Express API** → http://localhost:8080

### Run Production Build

```bash
npm run build          # TypeScript check + Vite build → /dist
npm start
```

Everything on http://localhost:8080.

## Running Tests

```bash
npm test               # Run all tests once
npm run test:watch     # Interactive watch mode
npm run test:coverage  # Run with V8 coverage report
```


## Tech Stack

**Client:** React 19, TypeScript 6, Redux Toolkit, Thunk, Styled Components 6 

**Bundler:**  Vite 8 

**Testing:**  Vitest 4 + @testing-library/react 16

**Server:** Node.js + Express 


## API Reference
https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/Searching.html#//appleref/doc/uid/TP40017632-CH5-SW1



## Authors

- [@judebaptista18](https://github.com/judebaptista18)