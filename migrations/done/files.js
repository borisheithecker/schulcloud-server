	Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key]);
			permissions = [...permissions, ...doc.permissions.map(perm => ({
			transformed = transformed.map(doc => ({ ...doc, parent }));
		const splitPath = docs.path.split('/').filter(chunk => !!chunk);
				const children = documents.filter(d => d.path.slice(0, -1) === document.key);