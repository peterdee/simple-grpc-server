const env = require('dotenv').config();

if (env && env.error) {
  throw env.error;
}

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { v4: uuidv4 } = require('uuid');

const log = require('./utilities/log');

const PROTO_PATH = './proto/Posts.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const postsProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

// mock data
const posts = [
  {
    id: uuidv4(),
    text: 'This is the text ONE',
    title: 'This is the title ONE',
  },
  {
    id: uuidv4(),
    text: 'This is the text TWO',
    title: 'This is the title TWO',
  },
];

// add service to the server
server.addService(postsProto.PostsService.service, {
  getPosts: (_, callback) => {
    return callback(null, { posts });
  },
  createPost: (call, callback) => {
    let post = call.request;
    
    post.id = uuidv4();
    posts.push(post);
    return callback(null, post);
  },
});

const port = Number(process.env.PORT) || 6844;

// launch the server
server.bindAsync(
  `127.0.0.1:${port}`,
  grpc.ServerCredentials.createInsecure(),
  (error) => {
    if (error) {
      throw error;
    }

    log(`-- SIMPLE GRPC SERVER is running on port ${port}`);
    return server.start();
  },
);
