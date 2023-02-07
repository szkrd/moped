function parseKeyValueMessage(text: string) {
  return text.split('\n').reduce((result, part) => {
    if (!part.trim()) return result;
    const keyValue = part.match(/([^ ]+): (.*)/);
    if (keyValue === null || keyValue.length !== 2) {
      throw new Error(`Could not parse entry "${part}" as key value pair.`);
    }
    result[keyValue[1]] = keyValue[2];
    return result;
  }, {} as Record<string, string>);
}

function parseArrayMessage(text: string) {
  const results: Record<string, string>[] = [];
  let obj: Record<string, string> = {};

  text.split('\n').forEach((part) => {
    if (!part.trim()) return;
    const keyValue = part.match(/([^ ]+): (.*)/);
    if (keyValue === null || keyValue.length !== 2) {
      throw new Error(`Could not parse entry "${part}" as array message.`);
    }
    if (obj[keyValue[1]] !== undefined) {
      results.push(obj);
      obj = {};
      obj[keyValue[1]] = keyValue[2];
    } else {
      obj[keyValue[1]] = keyValue[2];
    }
  });
  results.push(obj);
  return results;
}

export const parseMpdMessage = {
  asKeyValue: parseKeyValueMessage,
  asArray: parseArrayMessage,
};
