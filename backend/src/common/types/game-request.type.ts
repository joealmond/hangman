export interface GameRequest extends Request {
  gamePayload: any;
  params: {
    gameId?: string;
    id?: string;
  };
}

export interface GamePayload {
  gameId: string;
}
