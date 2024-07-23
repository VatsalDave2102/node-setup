declare namespace Express {
	interface Request {
		secret?: string;
	}
	interface Headers {
		authorization?: string;
	}
}
