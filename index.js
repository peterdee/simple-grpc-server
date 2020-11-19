const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { v4: uuidv4 } = require('uuid');

const PROTO_PATH = './proto/Posts.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const postsProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

const posts = [
  {
    id: 1,
    text: 'This is the text ONE',
    title: 'This is the title ONE',
  },
  {
    id: 2,
    text: 'This is the text TWO',
    title: 'This is the title TWO',
  },
];

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

const port = 6844;

server.bind(`127.0.0.1:${port}`, grpc.ServerCredentials.createInsecure());
console.log(`-- GRPC SERVER is running on port ${port}`);

server.start();
