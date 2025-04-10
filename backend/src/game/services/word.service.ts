import { Injectable } from '@nestjs/common';
import { WordProvider } from './word-provider.interface';
import { appConfig } from '../../config/app.config';

@Injectable()
export class WordService implements WordProvider {
  async getRandomWord(length: number): Promise<string> {
    const filteredWords = appConfig.words.filter(
      (word) => word.length === length,
    );
    if (filteredWords.length === 0) {
      throw new Error(`No words found with length ${length}`);
    }
    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    return Promise.resolve(filteredWords[randomIndex].toUpperCase());
  }
}
