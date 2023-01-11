const production = {
	url: 'http://3.136.157.110/',
};
const development = {
	url: 'http://127.0.0.1:8000/',
};
export const config =
	process.env.NODE_ENV === 'development' ? development : production;
