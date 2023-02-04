export const clone = (item: any) => {
	if (!item) {
	  return item;
	}
	const types = [ Number, String, Boolean ];
	let result;
	types.forEach(function (type) {
	  if (item instanceof type) {
			result = type(item);
	  }
	});
	if (typeof result == "undefined") {
	  if (Object.prototype.toString.call(item) === "[object Array]") {
			result = [];
			item.forEach(function (child: any, index: number) {
		  result[index] = clone(child);
			});
	  } else if (typeof item == "object") {
			result = {} as any;
			for (const i in item) {
		  result[i] = clone(item[i]);
			}
	  } else {
			result = item;
	  }
	}
	return result;
};