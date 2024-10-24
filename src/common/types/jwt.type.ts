export type JwtPayload = {
  sub: string;
  username: string;
  role: 'WRITER' | 'READER';
  type: 'access' | 'refresh';
};

export type JwtRPayload = JwtPayload & { token: string };
