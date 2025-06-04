const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

class BadRequestError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = statusCode;
  }
}

app.use(bodyParser.json());

const checkMessageLength = (req, res, next) => {
  const { content } = req.body;

  if (!content) {
    throw new BadRequestError(
      'Error: Request body must contain a "content" field.'
    );
  }

  if (typeof content !== 'string') {
    throw new BadRequestError('Error: "content" must be a string.');
  }

  if (content.length > 250) {
    throw new BadRequestError(
      'Error: Message length cannot exceed 250 characters.'
    );
  }

  next();
};

app.post('/messages', checkMessageLength, (req, res, next) => {
  const { content } = req.body;

  console.log('New message received:', content);

  res.status(200).json({
    message: 'Message received successfully!',
    receivedContent: content,
  });
});

app.get('/', (req, res) => {
  res.send(`Express server is running on port ${PORT}!`);
});

app.use((err, req, res, next) => {
  console.error('An error occurred:', err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error.';

  res.status(statusCode).json({
    error: message,
  });
});

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
