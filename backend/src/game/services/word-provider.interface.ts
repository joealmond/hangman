export interface WordProvider {
  getRandomWord(length: number): Promise<string>;
}
