import Axios from 'axios';
import { environment } from '../environment/environment';

const api = Axios.create({
	baseURL: environment.api.url,
	headers: {
		'Content-Type': 'application/json',
	},
});

export default api;
