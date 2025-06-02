export function parseFormToObject(form) {
  const formData = new FormData(form);
  const obj = {};

  for (const [key, value] of formData.entries()) {
    assignNestedValue(obj, key, value);
  }

  return obj;
}

function assignNestedValue(target, path, value) {
    const keys = path.replace(/\]/g, '').split(/\[|\./);

    let current = target;

    keys.forEach((key, index) => {
        const isLast = index === keys.length - 1;

        if (isLast) {
            if (key in current) {
                if (Array.isArray(current[key])) {
                    current[key].push(value);
                } else {
                    current[key] = [current[key], value];
                }
            } else {
                current[key] = value;
            }
        } else {
            if (!(key in current)) {
                current[key] = {};
            }
            current = current[key];
        }
        
    });
}