const Hapi = require('@hapi/hapi');
const Joi = require('@hapi/joi');

const server = Hapi.server({
  port: 5000,
  host: 'localhost',
});

// Sample in-memory data
const users = [
  { id: 1, name: 'Akshay Patil' },
  { id: 2, name: 'Sunny Patil' },
];

// CRUD operations
server.route({
  method: 'GET',
  path: '/users',
  handler: (request, h) => {
    return h.response(users);
  },
});

server.route({
  method: 'GET',
  path: '/users/{id}',
  handler: (request, h) => {
    const userId = parseInt(request.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) {
      return h.response({ error: 'User not found' }).code(404);
    }

    return h.response(user);
  },
});

server.route({
  method: 'POST',
  path: '/users',
  handler: (request, h) => {
    const { name } = request.payload;

    // Simple validation
    const schema = Joi.object({
      name: Joi.string().required(),
    });

    const { error } = schema.validate({ name });

    if (error) {
      return h.response({ error: 'Invalid input' }).code(400);
    }

    const newUser = {
      id: users.length + 1,
      name,
    };

    users.push(newUser);

    return h.response(newUser).code(201);
  },
});

server.route({
  method: 'PUT',
  path: '/users/{id}',
  handler: (request, h) => {
    const userId = parseInt(request.params.id);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return h.response({ error: 'User not found' }).code(404);
    }

    const { name } = request.payload;

    // Simple validation
    const schema = Joi.object({
      name: Joi.string().required(),
    });

    const { error } = schema.validate({ name });

    if (error) {
      return h.response({ error: 'Invalid input' }).code(400);
    }

    users[userIndex].name = name;

    return h.response(users[userIndex]);
  },
});

server.route({
  method: 'DELETE',
  path: '/users/{id}',
  handler: (request, h) => {
    const userId = parseInt(request.params.id);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return h.response({ error: 'User not found' }).code(404);
    }

    const deletedUser = users.splice(userIndex, 1)[0];

    return h.response(deletedUser);
  },
});

// Start the server
const start = async () => {
  try {
    await server.start();
    console.log('Server running on %s', server.info.uri);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();