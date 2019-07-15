// TODO rewrite in Typescript, now natively supported by @now/node I think

module.exports = function(graph, idrefligc, start, end) {
  const explored = new Set();
  var open = [[start, []]];
  while (open.length > 0) {
    for (var i = 0, l = open.length; i < l; i++) {
      let s = open.shift();
      let stop = s[0];
      let path = s[1];
      let next = graph[idrefligc][stop] || [];
      for (var j = 0; j < next.length; j++) {
        let { lines, nextStop } = next[j];
        if (!explored.has(nextStop)) {
          let nextPath = path.concat(lines);
          if (nextStop == end) return nextPath;
          open.push([nextStop, nextPath]);
        }
      }
      explored.add(stop);
    }
  }
};
