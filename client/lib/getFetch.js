const getFetch = async (url, params) => {
	try {
		const queryString = new URLSearchParams(params).toString();
		const fullUrl = `${url}${queryString ? `?${queryString}` : ''}`;

		const response = await fetch(fullUrl, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		const result = await response.json();
		return result;

	} catch (error) {
		console.error('Error in getFetch:', error);
		throw error;
	}
};

export default getFetch;
