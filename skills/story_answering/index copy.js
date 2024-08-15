'use strict';

const { EventEmitter } = require('events');
const fs = require('fs');
const path = require('path');

class StoryAnswering extends EventEmitter {
  constructor() {
    super();
    this.story = '';
    this.loadStory();
  }

  loadStory() {
    const storyPath = path.join(__dirname, 'data', 'story.txt');
    this.story = fs.readFileSync(storyPath, 'utf8');
  }

  handle(intent, entities) {
    const question = intent.text || '';
    const answer = this.findAnswer(question);
    this.emit('done', answer);
  }

  findAnswer(question) {
    // Example: Basic keyword matching for finding the answer
    const keywords = question.toLowerCase().split(' ');

    let matchedSentence = '';
    const sentences = this.story.split('.'); // Split the story into sentences

    // Find the first sentence that matches a keyword
    for (const sentence of sentences) {
      for (const keyword of keywords) {
        if (sentence.toLowerCase().includes(keyword)) {
          matchedSentence = sentence;
          break;
        }
      }
      if (matchedSentence) break;
    }

    return matchedSentence || 'I couldn’t find an answer related to your question in the story.';
  }
}

module.exports = StoryAnswering;
