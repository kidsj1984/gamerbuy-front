import express from 'express'
import compression from 'compression'
import morgan from 'morgan'
import cors from 'cors'
import http from 'http'
import path from 'path'
import fs from 'fs'
import yaml from 'yamljs'
import * as api from './api'
import { accessTokenAuth } from './security'
import { connector, summarise } from 'swagger-routes-express'
// import mockapi from './mockapi'

const app = express()
const port = 8081

// Compression
app.use(compression())
// Logger
app.use(morgan('dev'))
// Enable CORS
app.use(cors())
// POST, PUT, DELETE body parser
app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({
  limit: '20mb',
  extended: false
}))
// No cache
app.use((req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
  res.header('Pragma', 'no-cache')
  res.header('Expires', '-1')
  next()
})

// Read and swagger config file
const apiDefinition = yaml.load(path.resolve(__dirname, 'swagger.yml'))
// Create mock functions based on swaggerConfig
const options = {
  security: {
    AccessTokenAuth: accessTokenAuth
  }
}
const connectSwagger = connector(api, apiDefinition, options)
connectSwagger(app)
// Print swagger router api summary
const apiSummary = summarise(apiDefinition)
console.log(apiSummary)

const dirList = fs.readdirSync(path.resolve(__dirname, './mockapi'));
dirList.forEach((dirItem) => {
  const fileList = fs.readdirSync(path.resolve(__dirname, `./mockapi/${dirItem}`));
  fileList?.forEach((fileItem) => {
    const mock = require(path.resolve(__dirname, `./mockapi/${dirItem}/${fileItem}`));
    const { response } = mock;
    const filePath = fileItem.replace('.ts', '');
    const url = `/mock-api2/v1/${dirItem}/${filePath}`;
    app.get(url, function(req: any, res: { send: (arg0: any) => void }) {
      res.send(response);
    });
    app.post(url, function(req: any, res: { send: (arg0: any) => void }) {
      res.send(response);
    });
    
  });
})
// app.get('/mock-api2/v1/steamorder/steamloginstatus', function(req: any, res: { send: (arg0: any) => void }) {
//   console.log(9000);
//   // res.send(response);
// });
// mockapi.forEach(item => {
//   app[item.method](`/mock-api2/v1${item.path}`, function(req, res) {
//     res.send(item.response);
//   });
// });

// Catch 404 error
app.use((req, res) => {
  const err = new Error('Not Found')
  res.status(404).json({
    message: err.message,
    error: err
  })
})

// Create HTTP server.
const server = http.createServer(app)

// Listen on provided port, on all network interfaces.
server.listen(port)
server.on('error', onError)
console.log('Mock server started on port ' + port + '!')

// Event listener for HTTP server "error" event.
function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error
  }
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error('Express ERROR (app) : %s requires elevated privileges', bind)
      process.exit(1)
    case 'EADDRINUSE':
      console.error('Express ERROR (app) : %s is already in use', bind)
      process.exit(1)
    default:
      throw error
  }
}
