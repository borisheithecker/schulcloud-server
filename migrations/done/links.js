	Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);
				.then((file) => file