
export function cap(word: string) {
	return word.charAt(0).toUpperCase() + word.substring(1);
}

export function parseJsonQueryJson(row: any ) {
	const parsed : Record<string, any >= {};
	for( const key in row) {
		try {
			parsed[key] = JSON.parse(row[key]);

		} catch (error) {
				  parsed[key] = typeof row[key] === "string" && row[key].startsWith('"') && row[key].endsWith('"')
        ? row[key].slice(1, -1)
        : row[key];
		}
	}
	return parsed;
}