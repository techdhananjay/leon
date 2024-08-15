'use strict';

const { EventEmitter } = require('events');
const fs = require('fs');
const path = require('path');
const { NlpManager } = require('@nlpjs/nlp');

class StoryAnswering extends EventEmitter {
  constructor() {
    super();
    this.story = '';
    this.manager = new NlpManager({ languages: ['en'] }); // Create an NLP manager for English
    this.loadStory();
    this.trainNLP();
  }

  loadStory() {
    const storyPath = path.join(__dirname, 'data', 'story.txt');
    this.story = fs.readFileSync(storyPath, 'utf8');
  }

  async trainNLP() {
    // Train the NLP model with example questions and intents
    this.manager.addDocument('en', 'What is the story about?', 'story.summary');
    this.manager.addDocument('en', 'Who is the main character?', 'story.character');
    this.manager.addDocument('en', 'What happens at the end?', 'story.ending');
    this.manager.addDocument('en', 'What is the secret snow?', 'story.snow');

    // Train the model
    await this.manager.train();
    this.manager.save(); // Save the model for later use
  }

  async handle(intent, entities) {
    const question = intent.text || '';
    const response = await this.findAnswer(question);
    this.emit('done', response);
  }

  async findAnswer(question) {
    const nlpResponse = await this.manager.process('en', question);
    const intent = nlpResponse.intent;

    let answer = '';

    switch (intent) {
      case 'story.summary':
        answer = this.getStorySummary();
        break;
      case 'story.character':
        answer = 'The main character is Paul Hasleman, a 12-year-old boy.';
        break;
      case 'story.ending':
        answer = 'In the end, Paul succumbs to his hallucination of snow, shutting out reality.';
        break;
      case 'story.snow':
        answer = 'The secret snow represents Paul’s retreat into a comforting but isolating fantasy.';
        break;
      default:
        answer = 'I couldn’t find an answer related to your question in the story.';
        break;
    }

    return answer;
  }

  getStorySummary() {
    return (
      'The story is about Paul Hasleman, a young boy who increasingly retreats into a fantasy world ' +
      'where he imagines snow falling silently and secretly. This fantasy gradually takes over his life, ' +
      'isolating him from reality and worrying his parents.'
    );
  }
}

module.exports = StoryAnswering;
